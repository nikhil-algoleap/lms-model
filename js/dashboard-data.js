// ============================================================
// ALGOLEAP LMS — Dashboard Real-Time Data Engine
// Calculates KPIs from live Supabase data
// ============================================================

const SUPABASE_CONFIGURED =
    typeof SUPABASE_URL !== 'undefined' &&
    SUPABASE_URL !== 'YOUR_SUPABASE_URL';

// Convert "$420K" to 420000, "$2.4M" to 2400000
function parseValue(str) {
    if (!str) return 0;
    const clean = str.replace(/[$,\s]/g, '').toUpperCase();
    if (clean.endsWith('M')) return parseFloat(clean) * 1_000_000;
    if (clean.endsWith('K')) return parseFloat(clean) * 1_000;
    return parseFloat(clean) || 0;
}

// Format number back to readable form: $4.2M or $186K
function formatValue(num) {
    if (num >= 1_000_000) return '$' + (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return '$' + Math.round(num / 1_000) + 'K';
    return '$' + num;
}

async function loadDashboardData() {
    const bannerMsg = document.getElementById('dashboard-banner-msg');
    const elTotal = document.getElementById('kpi-total-leads');
    const elPipeline = document.getElementById('kpi-pipeline');
    const elWinRate = document.getElementById('kpi-win-rate');
    const elAvgDeal = document.getElementById('kpi-avg-deal');

    // Fallback if Supabase not configured yet
    if (!SUPABASE_CONFIGURED) {
        console.warn('Supabase not configured - showing demo data.');
        if (bannerMsg) bannerMsg.textContent = 'You have 3 leads waiting for your action · Pipeline up 18% this quarter';
        if (elTotal) elTotal.textContent = '47';
        if (elPipeline) elPipeline.textContent = '$4.2M';
        if (elWinRate) elWinRate.textContent = '34%';
        if (elAvgDeal) elAvgDeal.textContent = '$186K';
        return;
    }

    try {
        // Fetch all leads from Supabase
        const { data: leads, error } = await db
            .from('leads')
            .select('value, stage');

        if (error) throw error;

        const totalLeads = leads.length;
        const wonLeads = leads.filter(l => l.stage === 'WON');
        const openLeads = leads.filter(l => l.stage !== 'WON');
        const newLeads = leads.filter(l => l.stage === 'NEW');

        // KPI Calculations
        const openPipeline = openLeads.reduce((sum, l) => sum + parseValue(l.value), 0);
        const winRate = totalLeads > 0 ? Math.round((wonLeads.length / totalLeads) * 100) : 0;
        const avgDealSize = totalLeads > 0 ? Math.round(
            leads.reduce((sum, l) => sum + parseValue(l.value), 0) / totalLeads
        ) : 0;

        // Update the DOM with real values
        if (bannerMsg) bannerMsg.textContent = `You have ${newLeads.length} leads waiting for your action · ${totalLeads} leads in pipeline`;
        if (elTotal) elTotal.textContent = totalLeads;
        if (elPipeline) elPipeline.textContent = formatValue(openPipeline);
        if (elWinRate) elWinRate.textContent = winRate + '%';
        if (elAvgDeal) elAvgDeal.textContent = formatValue(avgDealSize);

        console.log('Dashboard KPIs loaded:', {
            openPipeline: formatValue(openPipeline),
            winRate: winRate + '%',
            avgDealSize: formatValue(avgDealSize),
            totalLeads
        });

    } catch (err) {
        console.error('Supabase error:', err.message);
        if (bannerMsg) bannerMsg.textContent = 'You have 3 leads waiting for your action · Pipeline up 18% this quarter';
        if (elTotal) elTotal.textContent = '7';
        if (elPipeline) elPipeline.textContent = '$4.2M';
        if (elWinRate) elWinRate.textContent = '34%';
        if (elAvgDeal) elAvgDeal.textContent = '$186K';
    }
}

document.addEventListener('DOMContentLoaded', loadDashboardData);
