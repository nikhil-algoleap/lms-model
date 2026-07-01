const xlsx = require('xlsx');
const prisma = require('../utils/prisma');

exports.bulkImportLeads = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Parse the uploaded file buffer
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    // Convert to JSON, skipping the first row (title row)
    const data = xlsx.utils.sheet_to_json(sheet, { range: 1 });

    if (!data || data.length === 0) {
      return res.status(400).json({ message: 'Excel file is empty or formatted incorrectly' });
    }

    let successCount = 0;
    let errors = [];

    // Process rows sequentially to avoid race conditions with creating relations
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      // Ultra-aggressive normalization: remove EVERYTHING except letters and numbers
      const normalizedRow = {};
      Object.keys(row).forEach(key => {
        const cleanKey = key.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        normalizedRow[cleanKey] = row[key];
      });

      try {
        const title = normalizedRow['leadtitle'] || normalizedRow['title'];
        const accountName = normalizedRow['selectaccount'] || normalizedRow['accountname'] || normalizedRow['account'];
        const contactName = normalizedRow['primarycontact'] || normalizedRow['contactname'] || normalizedRow['contact'];
        const value = normalizedRow['estimatedrevenueusd'] || normalizedRow['estimatedrevenue'] || normalizedRow['value'];
        let stage = (normalizedRow['stage'] || 'NEW').toUpperCase();
        
        // Map common Excel stage names to frontend stages
        if (stage === 'QUALIFICATION') stage = 'QUALIFIED';
        
        const serviceLine = normalizedRow['serviceline'] || normalizedRow['service'];
        const deliveryFormat = normalizedRow['deliveryformat'];
        const ownerInitials = normalizedRow['owner'] ? normalizedRow['owner'].substring(0, 2).toUpperCase() : null;

        if (!title || !accountName) {
          errors.push(`Row ${i + 3}: Missing Lead Title or Account (Found: ${Object.keys(normalizedRow).join(', ')})`);
          continue;
        }

        // 1. Resolve or Create Account
        let accountId;
        const acc = await prisma.account.findFirst({ where: { name: accountName } });
        if (acc) {
          accountId = acc.id;
        } else {
          const newAcc = await prisma.account.create({ data: { name: accountName } });
          accountId = newAcc.id;
        }

        // 2. Resolve or Create Contact
        let contactId = null;
        if (contactName) {
          const con = await prisma.contact.findFirst({ where: { fullName: contactName } });
          if (con) {
            contactId = con.id;
          } else {
            const newCon = await prisma.contact.create({ 
              data: { fullName: contactName, accountId: accountId } 
            });
            contactId = newCon.id;
          }
        }

        // 3. Create Lead
        await prisma.lead.create({
          data: {
            title,
            accountId,
            contactId,
            value: value ? String(value) : null,
            stage: stage.toUpperCase(),
            serviceLine,
            deliveryFormat,
            ownerInitials,
            source: 'Bulk Import',
            activities: {
              create: {
                type: 'CREATED',
                note: 'Lead created via Bulk Excel Import',
                userId: req.user?.userId
              }
            }
          }
        });

        successCount++;
      } catch (rowErr) {
        console.error(`Error processing row ${i + 2}:`, rowErr);
        errors.push(`Row ${i + 2}: ${rowErr.message}`);
      }
    }

    res.status(200).json({
      message: 'Import completed',
      successCount,
      errorCount: errors.length,
      errors
    });
  } catch (error) {
    console.error('Bulk import error:', error);
    res.status(500).json({ error: error.message });
  }
};
