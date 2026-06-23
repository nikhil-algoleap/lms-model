const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getStats = async (req, res) => {
  try {
    // Total active leads (not converted)
    const totalLeads = await prisma.lead.count({
      where: { leadStatus: { not: 'CONVERTED' } }
    });

    // Converted leads count
    const convertedLeadsCount = await prisma.lead.count({
      where: { leadStatus: 'CONVERTED' }
    });

    // Unassigned leads (no owner)
    let unassignedLeads = 0;
    try {
      unassignedLeads = await prisma.lead.count({
        where: {
          ownerId: null,
          leadStatus: { not: 'CONVERTED' }
        }
      });
    } catch (e) {
      // owner_id column may not exist yet
      unassignedLeads = 0;
    }

    // Pipeline value from all active leads
    const allLeads = await prisma.lead.findMany({
      where: { leadStatus: { not: 'CONVERTED' } },
      select: { value: true, createdAt: true }
    });

    const totalPipeline = allLeads.reduce((sum, lead) => {
      const val = parseFloat(lead.value?.replace(/[^0-9.]/g, '') || 0);
      return sum + val;
    }, 0);

    // Conversion rate
    const allLeadsCount = await prisma.lead.count();
    const conversionRate = allLeadsCount > 0
      ? Math.round((convertedLeadsCount / allLeadsCount) * 100)
      : 0;

    // Average time to convert (for converted leads)
    let convertedLeads = [];
    try {
      convertedLeads = await prisma.lead.findMany({
        where: {
          leadStatus: 'CONVERTED',
          createdAt: { not: null }
        },
        select: { createdAt: true, convertedDate: true }
      });
    } catch (e) {
      // convertedDate column may not exist yet
      convertedLeads = [];
    }

    let avgTimeToConvert = '0d';
    if (convertedLeads.length > 0) {
      const leadsWithDates = convertedLeads.filter(l => l.convertedDate);
      const totalDays = leadsWithDates.reduce((sum, lead) => {
        const created = new Date(lead.createdAt);
        const converted = new Date(lead.convertedDate);
        const diffDays = Math.floor((converted - created) / (1000 * 60 * 60 * 24));
        return sum + Math.max(diffDays, 0);
      }, 0);
      avgTimeToConvert = leadsWithDates.length > 0 ? `${Math.round(totalDays / leadsWithDates.length)}d` : 'N/A';
    } else {
      avgTimeToConvert = 'N/A';
    }

    // Format pipeline value
    let pipelineValue;
    if (totalPipeline >= 1000000) {
      pipelineValue = `$${(totalPipeline / 1000000).toFixed(1)}M`;
    } else if (totalPipeline >= 1000) {
      pipelineValue = `$${(totalPipeline / 1000).toFixed(0)}K`;
    } else {
      pipelineValue = `$${totalPipeline.toFixed(0)}`;
    }

    // Lead status breakdown for the chart
    const statusBreakdown = await prisma.lead.groupBy({
      by: ['leadStatus'],
      _count: { id: true },
      where: { leadStatus: { not: 'CONVERTED' } }
    });

    const statusCounts = {};
    statusBreakdown.forEach(item => {
      statusCounts[item.leadStatus] = item._count.id;
    });

    res.json({
      totalLeads,
      pipelineValue,
      leadConversionRate: `${conversionRate}%`,
      avgTimeToConvert,
      unassignedLeads,
      convertedLeadsCount,
      statusCounts
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getRecentActivity = async (req, res) => {
  try {
    // Get latest lead activities
    const leadActivities = await prisma.leadActivity.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { fullName: true } },
        lead: { select: { title: true, account: { select: { name: true } } } }
      }
    });

    // Get latest system activities (logins, role changes etc)
    const systemActivities = await prisma.systemActivity.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { fullName: true } }
      }
    });

    // Combine and sort
    const combined = [
      ...leadActivities.map(a => ({
        ...a,
        source: 'LEAD',
        displayTitle: a.lead?.account?.name ? `${a.lead.account.name} · ${a.lead.title}` : a.lead?.title
      })),
      ...systemActivities.map(a => ({
        ...a,
        source: 'SYSTEM',
        displayTitle: 'System Event'
      }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);

    res.json(combined);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
