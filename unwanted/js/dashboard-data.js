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

    try {
        // Fetch stats from our new Node.js API
        const response = await fetch('http://localhost:4000/api/dashboard/stats');
        if (!response.ok) throw new Error('API unreachable');
        
        const stats = await response.json();

        // Update the DOM with real values from our backend
        if (bannerMsg) bannerMsg.textContent = `Live data from Supabase · ${stats.totalLeads} leads in pipeline`;
        if (elTotal) elTotal.textContent = stats.totalLeads;
        if (elPipeline) elPipeline.textContent = stats.totalPipeline;
        if (elWinRate) elWinRate.textContent = stats.winRate;
        if (elAvgDeal) elAvgDeal.textContent = stats.avgDealSize;

        console.log('Dashboard stats synchronized with backend:', stats);

    } catch (err) {
        console.warn('Backend API error, falling back to static data:', err.message);
        // Fallback demo data
        if (elTotal) elTotal.textContent = '7';
        if (elPipeline) elPipeline.textContent = '$3.0M';
        if (elWinRate) elWinRate.textContent = '0%';
        if (elAvgDeal) elAvgDeal.textContent = '$428K';
    }
}

document.addEventListener('DOMContentLoaded', loadDashboardData);
