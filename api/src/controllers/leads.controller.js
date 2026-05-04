const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { uploadToSupabase } = require('../utils/upload');

// Get all leads
exports.getAllLeads = async (req, res) => {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { activities: true }
        },
        account: {
          select: { name: true }
        },
        contact: {
          select: { fullName: true }
        }
      }
    });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single lead with history and attachments
exports.getLeadById = async (req, res) => {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: req.params.id },
      include: {
        activities: {
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { fullName: true } } }
        },
        account: {
          select: { name: true }
        },
        contact: {
          select: { fullName: true, title: true, email: true, phone: true }
        }
      }
    });
    
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create lead with tracking
exports.createLead = async (req, res) => {
  try {
    const { 
      title, 
      accountId, 
      contactId,
      value, 
      probability, 
      dueDate, 
      deliveryFormat, 
      serviceLine,
      practiceArea,
      estimatedDuration,
      source,
      stage,
      practiceLeader,
      clientManager,
      description,
      accountName, // Catch legacy string
      primaryContact // Catch legacy string
    } = req.body;

    let finalAccountId = accountId || accountName;
    if (finalAccountId && !finalAccountId.includes('-')) {
      const acc = await prisma.account.findFirst({ where: { name: finalAccountId } });
      if (acc) finalAccountId = acc.id;
      else {
        const newAcc = await prisma.account.create({ data: { name: finalAccountId } });
        finalAccountId = newAcc.id;
      }
    }

    let finalContactId = contactId || primaryContact;
    if (finalContactId && !finalContactId.includes('-')) {
      const con = await prisma.contact.findFirst({ where: { fullName: finalContactId } });
      if (con) finalContactId = con.id;
      else {
        const newCon = await prisma.contact.create({ data: { fullName: finalContactId, accountId: finalAccountId } });
        finalContactId = newCon.id;
      }
    }

    const lead = await prisma.lead.create({
      data: {
        title,
        accountId: finalAccountId || null,
        contactId: finalContactId || null,
        value: value ? String(value) : null,
        probability: probability ? parseInt(probability) : 0,
        dueDate: dueDate ? new Date(dueDate) : null,
        deliveryFormat,
        serviceLine,
        practiceArea,
        estimatedDuration: estimatedDuration ? parseInt(estimatedDuration) : null,
        source: source || 'Existing Client',
        stage: stage || 'NEW',
        practiceLeader,
        clientManager,
        description,
        activities: {
          create: {
            type: 'CREATED',
            note: 'Lead created in the system',
            userId: req.user?.userId // From auth middleware
          }
        }
      }
    });
    
    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update lead with status tracking
exports.updateLead = async (req, res) => {
  try {
    const oldLead = await prisma.lead.findUnique({ where: { id: req.params.id } });
    if (!oldLead) return res.status(404).json({ message: 'Lead not found' });

    const lead = await prisma.lead.update({
      where: { id: req.params.id },
      data: req.body
    });

    // Track stage changes
    if (req.body.stage && req.body.stage !== oldLead.stage) {
      await prisma.leadActivity.create({
        data: {
          leadId: lead.id,
          type: 'STAGE_CHANGED',
          fromValue: oldLead.stage,
          toValue: req.body.stage,
          note: `Stage moved from ${oldLead.stage} to ${req.body.stage}`,
          userId: req.user?.userId
        }
      });
    }

    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Upload attachment to lead
exports.uploadAttachment = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const fileData = await uploadToSupabase(req.file, `leads/${req.params.id}`);

    const attachment = await prisma.leadAttachment.create({
      data: {
        leadId: req.params.id,
        fileName: fileData.fileName,
        fileSize: fileData.fileSize,
        mimeType: fileData.mimeType,
        storageUrl: fileData.url,
        uploadedById: req.user?.userId || 'system'
      }
    });

    // Log activity
    await prisma.leadActivity.create({
      data: {
        leadId: req.params.id,
        type: 'ATTACHMENT_ADDED',
        note: `Attached file: ${fileData.fileName}`,
        userId: req.user?.userId
      }
    });

    res.status(201).json(attachment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
