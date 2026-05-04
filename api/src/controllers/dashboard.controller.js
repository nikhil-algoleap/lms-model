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
