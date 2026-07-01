const prisma = require('../utils/prisma');
const { uploadToSupabase } = require('../utils/upload');

// Calculate lead score based on fields and activities
const calculateLeadScore = (lead, activityCount = 0) => {
  let score = 0;
  if (lead.email) score += 10;
  if (lead.phone) score += 10;
  if (lead.company) score += 10;
  if (lead.jobTitle) score += 10;

  if (lead.hasBudget) score += 15;
  if (lead.hasAuthority) score += 15;
  if (lead.hasNeed) score += 15;
  if (lead.hasTimeline) score += 15;

  score += activityCount * 5;

  return Math.min(score, 100);
};

// Get all leads
exports.getAllLeads = async (req, res) => {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      where: { leadStatus: { not: 'CONVERTED' } },
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
          select: { id: true, name: true }
        },
        contact: {
          select: { fullName: true, title: true, email: true, phone: true }
        },
        convertedDeal: {
          select: { id: true, title: true, stage: true, value: true }
        },
        owner: {
          select: { fullName: true, email: true }
        }
      }
    });

    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create lead (Salesforce-style: simple prospect fields)
exports.createLead = async (req, res) => {
  try {
    const {
      title,
      firstName,
      lastName,
      email,
      phone,
      company,
      jobTitle,
      industry,
      source,
      leadStatus,
      description,
      // BANT
      hasBudget,
      hasAuthority,
      hasNeed,
      hasTimeline,
      leadRating,
      // Legacy fields (still accepted for backward compat)
      accountId,
      accountName,
      contactId,
      primaryContact,
      value,
      probability,
      dueDate,
      deliveryFormat,
      serviceLine,
      practiceArea,
      estimatedDuration,
      practiceLeader,
      clientManager,
      ownerId
    } = req.body;

    // Check for duplicates
    if (email) {
      const existingLead = await prisma.lead.findFirst({ where: { email } });
      if (existingLead) {
        return res.status(400).json({ message: 'A lead with this email already exists' });
      }
    }

    // Generate title from name if not provided
    const leadTitle = title || `${firstName || ''} ${lastName || ''} - ${company || 'Lead'}`.trim();

    // Resolve account if provided
    let finalAccountId = accountId || null;
    const companyName = accountName || company;
    if (companyName && !finalAccountId) {
      const acc = await prisma.account.findFirst({ where: { name: companyName } });
      if (acc) {
        finalAccountId = acc.id;
      } else {
        const newAcc = await prisma.account.create({
          data: {
            name: companyName,
            status: 'Prospect'
          }
        });
        finalAccountId = newAcc.id;
      }
    }

    // Resolve contact if provided
    let finalContactId = contactId || null;
    if (primaryContact && !finalContactId) {
      const con = await prisma.contact.findFirst({ where: { fullName: primaryContact } });
      if (con) {
        finalContactId = con.id;
      } else {
        const newCon = await prisma.contact.create({
          data: {
            fullName: primaryContact,
            accountId: finalAccountId
          }
        });
        finalContactId = newCon.id;
      }
    }

    const leadScore = calculateLeadScore({
      email, phone, company: companyName, jobTitle,
      hasBudget: hasBudget === 'true' || hasBudget === true,
      hasAuthority: hasAuthority === 'true' || hasAuthority === true,
      hasNeed: hasNeed === 'true' || hasNeed === true,
      hasTimeline: hasTimeline === 'true' || hasTimeline === true
    }, 1);

    // Fetch creator/owner user details to compute ownerInitials
    let ownerInitials = null;
    const resolvedOwnerId = ownerId || req.user?.userId;
    if (resolvedOwnerId) {
      const userObj = await prisma.user.findUnique({ where: { id: resolvedOwnerId } });
      if (userObj && userObj.fullName) {
        ownerInitials = userObj.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
      }
    }

    const lead = await prisma.lead.create({
      data: {
        title: leadTitle,
        firstName,
        lastName,
        email,
        phone,
        company: companyName || null,
        jobTitle,
        industry,
        source: source || 'Existing Client',
        leadStatus: leadStatus || 'NEW',
        leadRating: leadRating || 'COLD',
        leadScore,
        description,
        accountId: finalAccountId,
        contactId: finalContactId,
        hasBudget: hasBudget === 'true' || hasBudget === true,
        hasAuthority: hasAuthority === 'true' || hasAuthority === true,
        hasNeed: hasNeed === 'true' || hasNeed === true,
        hasTimeline: hasTimeline === 'true' || hasTimeline === true,
        ownerId: ownerId || req.user?.userId || null,
        ownerInitials: ownerInitials || null,
        // Legacy fields
        value: value ? String(value) : null,
        probability: probability ? parseInt(probability) : 0,
        dueDate: dueDate ? new Date(dueDate) : null,
        deliveryFormat,
        serviceLine,
        practiceArea,
        estimatedDuration: estimatedDuration ? parseInt(estimatedDuration) : null,
        practiceLeader,
        clientManager,
        activities: {
          create: {
            type: 'CREATED',
            note: 'Lead created in the system',
            userId: req.user?.userId
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

    // Re-calculate lead score
    const updatedLeadScore = calculateLeadScore({ ...oldLead, ...req.body }, 0); // Need proper activity count, ignoring for simplicity

    const lead = await prisma.lead.update({
      where: { id: req.params.id },
      data: { ...req.body, leadScore: updatedLeadScore }
    });

    // Track leadStatus changes
    if (req.body.leadStatus && req.body.leadStatus !== oldLead.leadStatus) {
      await prisma.leadActivity.create({
        data: {
          leadId: lead.id,
          type: 'STATUS_CHANGED',
          fromValue: oldLead.leadStatus,
          toValue: req.body.leadStatus,
          note: `Lead status changed from ${oldLead.leadStatus} to ${req.body.leadStatus}`,
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

// Update lead status with validation
exports.addActivity = async (req, res) => {
  const { id } = req.params;
  const { type, note } = req.body;

  if (!type || !note) {
    return res.status(400).json({ message: 'Type and note are required' });
  }

  try {
    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    // Assuming we have a getSafeUserId helper or user in req, fallback to null
    const userId = req.user?.userId || null;

    const activity = await prisma.leadActivity.create({
      data: {
        leadId: id,
        userId,
        type,
        note
      },
      include: {
        user: { select: { fullName: true } }
      }
    });

    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateLeadStatus = async (req, res) => {
  const { id } = req.params;
  const { leadStatus, note } = req.body;

  const STATUS_ORDER = ['NEW', 'CONTACTED', 'WORKING', 'NURTURING', 'QUALIFIED'];

  try {
    const oldLead = await prisma.lead.findUnique({ where: { id } });
    if (!oldLead) return res.status(404).json({ message: 'Lead not found' });

    if (oldLead.leadStatus === 'CONVERTED') {
      return res.status(400).json({ message: 'Cannot change status of a converted lead' });
    }

    if (!STATUS_ORDER.includes(leadStatus) && leadStatus !== 'UNQUALIFIED') {
      return res.status(400).json({ message: 'Invalid lead status' });
    }

    const lead = await prisma.lead.update({
      where: { id },
      data: { leadStatus }
    });

    await prisma.leadActivity.create({
      data: {
        leadId: id,
        userId: req.user?.userId,
        type: 'STATUS_CHANGED',
        fromValue: oldLead.leadStatus,
        toValue: leadStatus,
        note: note || `Lead status changed from ${oldLead.leadStatus} to ${leadStatus}`
      }
    });

    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get converted leads
exports.getConvertedLeads = async (req, res) => {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { convertedDate: 'desc' },
      where: { leadStatus: 'CONVERTED' },
      include: {
        account: { select: { id: true, name: true } },
        contact: { select: { id: true, fullName: true } },
        convertedDeal: { select: { id: true, title: true, stage: true, value: true } }
      }
    });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
