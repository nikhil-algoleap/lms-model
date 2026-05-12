const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Unified Pipeline: Get all Leads and Deals
exports.getUnifiedPipeline = async (req, res) => {
  try {
    const leads = await prisma.lead.findMany({
      where: { NOT: { stage: 'CONVERTED' } },
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
        stage: l.stage,
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
  const { title, value, probability, expectedCloseDate, ownerId } = req.body || {};

  try {
    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the Deal
      const deal = await tx.deal.create({
        data: {
          title: title || lead.title,
          accountId: lead.accountId,
          sourceLeadId: lead.id,
          stage: 'DISCOVERY',
          value: value || (lead.value ? parseFloat(lead.value.replace(/[^0-9.]/g, '')) : 0),
          probability: probability || 10,
          ownerId: ownerId || req.user?.userId,
          expectedCloseDate: expectedCloseDate ? new Date(expectedCloseDate) : null,
          description: lead.description
        }
      });

      // 2. Mark Lead as Converted
      await tx.lead.update({
        where: { id: lead.id },
        data: { stage: 'CONVERTED' }
      });

      // 3. Log Activity
      await tx.dealActivity.create({
        data: {
          dealId: deal.id,
          userId: req.user?.userId,
          type: 'CONVERSION',
          note: `Converted from lead: ${lead.title}`
        }
      });

      return deal;
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

    // Strict State Machine Validation
    if (stage === 'CLOSED_WON' && deal.stage !== 'CONTRACT') {
      return res.status(400).json({ message: 'Invalid transition: Deals must reach the CONTRACT stage before they can be marked CLOSED_WON.' });
    }

    const isSpecialState = ['CLOSED_WON', 'CLOSED_LOST', 'ON_HOLD'].includes(stage);
    if (!isSpecialState) {
      const currentIndex = STAGE_ORDER.indexOf(deal.stage);
      const newIndex = STAGE_ORDER.indexOf(stage);
      
      if (currentIndex !== -1 && newIndex > currentIndex + 1) {
        return res.status(400).json({ 
          message: `Invalid transition: Cannot skip stages. You must progress to ${STAGE_ORDER[currentIndex + 1]} first.` 
        });
      }
    }
    
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

        await resend.emails.send({
          from: 'Algoleap DMS <onboarding@resend.dev>',
          to: ['executives@algoleap.com'], // In production, route to deal owner and executives
          subject: subject,
          html: `<p>${content}</p><p>View details in the <a href="http://localhost:5174/deals/${id}">Deal Room</a>.</p>`
        });
        console.log(`[Email Alert Sent] ${subject}`);
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
        account: true,
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
