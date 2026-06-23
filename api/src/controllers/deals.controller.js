const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { uploadToSupabase } = require('../utils/upload');

// Unified Pipeline: Get all Leads and Deals
exports.getUnifiedPipeline = async (req, res) => {
  try {
    const leads = await prisma.lead.findMany({
      where: { NOT: { leadStatus: 'CONVERTED' } },
      include: { account: { select: { name: true } } }
    });

    const deals = await prisma.deal.findMany({
      include: { account: { select: { name: true } } }
    });

    const unified = [
      ...leads.map(l => ({
        id: l.id,
        title: l.title,
        accountId: l.accountId,
        accountName: l.account?.name,
        stage: l.leadStatus,
        value: l.value,
        type: 'LEAD',
        createdAt: l.createdAt
      })),
      ...deals.map(d => ({
        id: d.id,
        title: d.title,
        accountId: d.accountId,
        accountName: d.account?.name,
        stage: d.stage === 'CLOSED_WON' || d.stage === 'CLOSED_LOST' ? 'CLOSED' : d.stage,
        realStage: d.stage,
        value: d.value,
        probability: d.probability,
        type: 'DEAL',
        sourceLeadId: d.sourceLeadId,
        createdAt: d.createdAt
      }))
    ];

    console.log(`Pipeline Fetch: ${leads.length} leads, ${deals.length} deals`);
    res.json(unified);
  } catch (error) {
    console.error('Pipeline Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Lead Conversion: Promote Lead to Deal
exports.convertLead = async (req, res) => {
  const { id } = req.params;
  const { 
    accountMode, accountId, accountName,
    contactFirstName, contactLastName, contactEmail, contactPhone,
    title, value, probability, expectedCloseDate, ownerId,
    createDeal = true
  } = req.body || {};

  try {
    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    
    if (lead.leadStatus !== 'QUALIFIED') {
      return res.status(400).json({ message: 'Only QUALIFIED leads can be converted' });
    }
    
    if (lead.isConverted) {
      return res.status(400).json({ message: 'Lead is already converted' });
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create or Link Account
      let finalAccountId = lead.accountId || accountId;
      if (!finalAccountId && accountMode === 'new' && (accountName || lead.company)) {
        const targetName = accountName || lead.company || `${lead.lastName || 'Unknown'} Account`;
        const existingAccount = await tx.account.findFirst({
          where: { name: targetName }
        });
        if (existingAccount) {
          finalAccountId = existingAccount.id;
        } else {
          const newAccount = await tx.account.create({
            data: {
              name: targetName,
              ownerInitials: lead.ownerInitials,
            }
          });
          finalAccountId = newAccount.id;
        }
      }

      // 2. Create or Link Contact
      let finalContactId = lead.contactId;
      if (!finalContactId) {
        const emailToUse = contactEmail || lead.email;
        let existingContact = null;
        if (emailToUse) {
          existingContact = await tx.contact.findUnique({
            where: { email: emailToUse }
          });
        }
        if (existingContact) {
          finalContactId = existingContact.id;
        } else {
          const newContact = await tx.contact.create({
            data: {
              fullName: `${contactFirstName || lead.firstName || ''} ${contactLastName || lead.lastName || ''}`.trim() || 'Unknown Contact',
              email: emailToUse || null,
              phone: contactPhone || lead.phone,
              title: lead.jobTitle,
              accountId: finalAccountId,
              ownerInitials: lead.ownerInitials,
            }
          });
          finalContactId = newContact.id;
        }
      }

      // 3. Create Deal (Optional but default true)
      let deal = null;
      if (createDeal) {
        // Safe value parsing to avoid NaN errors
        let parsedValue = 0;
        if (value !== undefined && value !== null) {
          parsedValue = parseFloat(value);
        } else if (lead.value) {
          const cleanVal = lead.value.replace(/[^0-9.]/g, '');
          parsedValue = cleanVal ? parseFloat(cleanVal) : 0;
        }
        if (isNaN(parsedValue)) parsedValue = 0;

        // Check if a deal already exists with this sourceLeadId
        const existingDeal = await tx.deal.findFirst({
          where: { sourceLeadId: lead.id }
        });

        if (existingDeal) {
          deal = existingDeal;
        } else {
          // Generate a unique title to avoid unique constraint violation on deal title
          const baseTitle = title || `${lead.company || lead.lastName || 'New'} Deal`;
          let dealTitle = baseTitle;
          let titleUnique = false;
          let suffixCount = 0;
          while (!titleUnique) {
            const duplicateTitleDeal = await tx.deal.findFirst({
              where: { title: dealTitle }
            });
            if (!duplicateTitleDeal) {
              titleUnique = true;
            } else {
              suffixCount++;
              dealTitle = `${baseTitle} (${suffixCount})`;
            }
          }

          deal = await tx.deal.create({
            data: {
              title: dealTitle,
              accountId: finalAccountId,
              sourceLeadId: lead.id,
              stage: 'DISCOVERY',
              value: parsedValue,
              probability: probability || 10,
              ownerId: ownerId || req.user?.userId,
              expectedCloseDate: expectedCloseDate ? new Date(expectedCloseDate) : null,
              description: lead.description
            }
          });

          // Link contact as stakeholder
          if (finalContactId) {
            await tx.dealStakeholder.create({
              data: {
                dealId: deal.id,
                contactId: finalContactId,
                role: 'DECISION_MAKER'
              }
            });
          }

          await tx.dealActivity.create({
            data: {
              dealId: deal.id,
              userId: req.user?.userId,
              type: 'CONVERSION',
              note: `Created from converted lead: ${lead.title}`
            }
          });
        }
      }

      // 4. Update Lead to CONVERTED
      await tx.lead.update({
        where: { id: lead.id },
        data: { 
          leadStatus: 'CONVERTED',
          isConverted: true,
          convertedDate: new Date(),
          convertedById: req.user?.userId || null,
          convertedAccountId: finalAccountId,
          convertedContactId: finalContactId,
          convertedDealId: deal ? deal.id : null,
          accountId: finalAccountId,
          contactId: finalContactId
        }
      });

      // 5. Log Activity on Lead
      await tx.leadActivity.create({
        data: {
          leadId: lead.id,
          userId: req.user?.userId,
          type: 'CONVERTED',
          note: `Lead converted to Account, Contact${deal ? ', and Deal' : ''}`
        }
      });

      return { deal, accountId: finalAccountId, contactId: finalContactId };
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Conversion Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Stage Transition: State Machine Enforcement
exports.updateStage = async (req, res) => {
  const { id } = req.params;
  const { stage, note } = req.body;

  const STAGE_ORDER = ['DISCOVERY', 'PROPOSAL', 'NEGOTIATION', 'CONTRACT'];

  try {
    const deal = await prisma.deal.findUnique({ where: { id } });
    if (!deal) return res.status(404).json({ message: 'Deal not found' });

    const updatedDeal = await prisma.deal.update({
      where: { id },
      data: {
        stage,
        // Auto-update probability based on stage if not provided
        probability: stage === 'CLOSED_WON' ? 100 : (stage === 'CLOSED_LOST' ? 0 : undefined)
      }
    });

    await prisma.dealActivity.create({
      data: {
        dealId: id,
        userId: req.user?.userId,
        type: 'STAGE_CHANGE',
        note: note || `Stage moved from ${deal.stage} to ${stage}`
      }
    });

    // Milestone Email Notifications
    if (stage === 'CLOSED_WON' || stage === 'CLOSED_LOST') {
      try {
        const { Resend } = require('resend');
        const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');

        const subject = stage === 'CLOSED_WON'
          ? `🎉 Deal Won: ${updatedDeal.title}`
          : `⚠️ Deal Lost: ${updatedDeal.title}`;

        const content = stage === 'CLOSED_WON'
          ? `Great news! The deal for ${updatedDeal.title} has been marked as CLOSED WON. Total value: $${updatedDeal.value}.`
          : `The deal for ${updatedDeal.title} has been marked as CLOSED LOST.`;

        const executiveEmail = process.env.EXECUTIVE_EMAIL || 'executives@algoleap.com';
        const frontendUrl = process.env.APP_FRONTEND_URL || 'http://localhost:5173';

        await resend.emails.send({
          from: 'Algoleap DMS <onboarding@resend.dev>',
          to: [executiveEmail],
          subject: subject,
          html: `<p>${content}</p><p>View details in the <a href="${frontendUrl}/deals/${id}">Deal Room</a>.</p>`
        });
        console.log(`[Email Alert Sent] ${subject} to ${executiveEmail}`);
      } catch (emailErr) {
        console.error('Failed to send milestone email:', emailErr.message);
        // Do not block the stage update if email fails
      }
    }

    res.json(updatedDeal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Forecast: Weighted Revenue Calculation
exports.getForecast = async (req, res) => {
  try {
    const deals = await prisma.deal.findMany({
      where: { NOT: { stage: { in: ['CLOSED_WON', 'CLOSED_LOST'] } } }
    });

    const forecast = deals.reduce((acc, deal) => {
      const val = parseFloat(deal.value || 0);
      const weighted = val * (deal.probability / 100);

      acc.totalValue += val;
      acc.weightedValue += weighted;
      return acc;
    }, { totalValue: 0, weightedValue: 0 });

    res.json(forecast);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Deal CRUD (Basics)
exports.getDealById = async (req, res) => {
  try {
    const deal = await prisma.deal.findUnique({
      where: { id: req.params.id },
      include: {
        account: {
          include: {
            contacts: true
          }
        },
        activities: { include: { user: { select: { fullName: true } } }, orderBy: { createdAt: 'desc' } },
        documents: true,
        stakeholders: { include: { contact: true } },
        competitors: true
      }
    });
    if (!deal) return res.status(404).json({ message: 'Deal not found' });
    res.json(deal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Deal details
exports.updateDeal = async (req, res) => {
  const { id } = req.params;
  const { value, probability, expectedCloseDate, description } = req.body;

  try {
    const deal = await prisma.deal.findUnique({ where: { id } });
    if (!deal) return res.status(404).json({ message: 'Deal not found' });

    const updatedDeal = await prisma.deal.update({
      where: { id },
      data: {
        value: value !== undefined ? value : deal.value,
        probability: probability !== undefined ? parseInt(probability, 10) : deal.probability,
        expectedCloseDate: expectedCloseDate !== undefined ? (expectedCloseDate ? new Date(expectedCloseDate) : null) : deal.expectedCloseDate,
        description: description !== undefined ? description : deal.description,
      }
    });

    await prisma.dealActivity.create({
      data: {
        dealId: id,
        userId: req.user?.userId,
        type: 'DEAL_UPDATED',
        note: `Deal details updated.`
      }
    });

    res.json(updatedDeal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Upload Document
exports.uploadDocument = async (req, res) => {
  const { id } = req.params;

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const deal = await prisma.deal.findUnique({ where: { id } });
    if (!deal) return res.status(404).json({ message: 'Deal not found' });

    // Upload to Supabase
    const uploadResult = await uploadToSupabase(req.file, 'deals');

    // Save to Database
    const document = await prisma.dealDocument.create({
      data: {
        dealId: id,
        title: req.file.originalname,
        fileName: uploadResult.fileName,
        fileSize: uploadResult.fileSize,
        mimeType: uploadResult.mimeType,
        storageUrl: uploadResult.url,
        uploadedById: req.user?.userId || 'system'
      }
    });

    await prisma.dealActivity.create({
      data: {
        dealId: id,
        userId: req.user?.userId,
        type: 'DOCUMENT_UPLOADED',
        note: `Document uploaded: ${req.file.originalname}`
      }
    });

    res.status(201).json(document);
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Add Stakeholder to Deal
exports.addStakeholder = async (req, res) => {
  const { id } = req.params;
  const { contactId, role, notes } = req.body;

  try {
    const stakeholder = await prisma.dealStakeholder.create({
      data: {
        dealId: id,
        contactId,
        role,
        notes
      },
      include: { contact: true }
    });

    await prisma.dealActivity.create({
      data: {
        dealId: id,
        userId: req.user?.userId,
        type: 'STAKEHOLDER_ADDED',
        note: `Added stakeholder: ${stakeholder.contact.fullName} as ${role}`
      }
    });

    res.status(201).json(stakeholder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add Competitor to Deal
exports.addCompetitor = async (req, res) => {
  const { id } = req.params;
  const { name, strength, weakness, notes } = req.body;

  try {
    const competitor = await prisma.dealCompetitor.create({
      data: {
        dealId: id,
        name,
        strength,
        weakness,
        notes
      }
    });

    await prisma.dealActivity.create({
      data: {
        dealId: id,
        userId: req.user?.userId,
        type: 'COMPETITOR_ADDED',
        note: `Added competitor: ${name}`
      }
    });

    res.status(201).json(competitor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createDeal = async (req, res) => {
  const { title, accountId, accountName, stage, value, probability, expectedCloseDate, description, nextStep, leadSource } = req.body;
  try {
    let finalAccountId = accountId;
    if (accountName && !finalAccountId) {
      const acc = await prisma.account.findFirst({ where: { name: accountName } });
      if (acc) {
        finalAccountId = acc.id;
      } else {
        const newAcc = await prisma.account.create({
          data: {
            name: accountName,
            status: 'Prospect'
          }
        });
        finalAccountId = newAcc.id;
      }
    }

    const deal = await prisma.deal.create({
      data: {
        title,
        accountId: finalAccountId,
        stage: stage || 'DISCOVERY',
        value: value ? parseFloat(value) : 0,
        probability: probability ? parseInt(probability, 10) : 10,
        expectedCloseDate: expectedCloseDate ? new Date(expectedCloseDate) : null,
        description,
        nextStep,
        leadSource,
        ownerId: req.user?.userId
      }
    });

    await prisma.dealActivity.create({
      data: {
        dealId: deal.id,
        userId: req.user?.userId,
        type: 'DEAL_CREATED',
        note: `Deal created directly for account.`
      }
    });

    res.status(201).json(deal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
