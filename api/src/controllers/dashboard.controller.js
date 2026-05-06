const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getStats = async (req, res) => {
  try {
    const totalLeads = await prisma.lead.count();
    const wonLeadsCount = await prisma.lead.count({ where: { stage: 'WON' } });
    
    // Total Pipeline (Value needs to be parsed as it's a string in the DB)
    const allLeads = await prisma.lead.findMany({ select: { value: true, stage: true } });
    
    const totalPipeline = allLeads.reduce((sum, lead) => {
      // Remove symbols and parse
      const val = parseFloat(lead.value?.replace(/[^0-9.]/g, '') || 0);
      return sum + val;
    }, 0);

    const winRate = totalLeads > 0 ? Math.round((wonLeadsCount / totalLeads) * 100) : 0;

    res.json({
      totalLeads,
      wonLeadsCount,
      totalPipeline: `$${(totalPipeline / 1000000).toFixed(1)}M`,
      winRate: `${winRate}%`,
      avgDealSize: totalLeads > 0 ? `$${Math.round(totalPipeline / totalLeads).toLocaleString()}K` : '$0'
    });
  } catch (error) {
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
