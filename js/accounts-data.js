// ============================================================
// ALGOLEAP LMS — Accounts Real-Time Data Engine
// Fetches accounts from Supabase and renders the table
// ============================================================

const AVATAR_CLASSES_ACC = {
    'PM': 'avatar-pm', 'AK': 'avatar-ak',
    'RD': 'avatar-rd', 'VI': 'avatar-vi',
    'NY': 'avatar-green'
};

async function loadAccountsTable() {
    const tbody = document.getElementById('accounts-table-body');
    const countEl = document.getElementById('accounts-count');
    if (!tbody) return;

    // Fallback if not configured
    if (typeof SUPABASE_URL === 'undefined' || SUPABASE_URL === 'YOUR_SUPABASE_URL') {
        console.warn('Supabase not configured - accounts using demo data');
        return;
    }

    try {
        const { data: accounts, error } = await db
            .from('accounts')
            .select('*')
            .order('name');

        if (error) throw error;

        if (countEl) countEl.textContent = accounts.length + ' active accounts';

        tbody.innerHTML = '';
        accounts.forEach(acc => {
            const avatarClass = AVATAR_CLASSES_ACC[acc.owner_initials] || 'avatar-green';
            const row = document.createElement('tr');
            row.style.cursor = 'pointer';
            row.innerHTML = `
                <td class="fw-semibold">${acc.name}</td>
                <td><span class="badge-industry">${acc.industry || '—'}</span></td>
                <td>${acc.region || '—'}</td>
                <td>${acc.contacts_count || 0}</td>
                <td>${acc.open_leads || 0}</td>
                <td class="value-cell">${acc.ltv || '—'}</td>
                <td><div class="avatar-sm ${avatarClass}">${acc.owner_initials || '?'}</div></td>
            `;
            tbody.appendChild(row);
        });

        console.log('✅ Accounts loaded from Supabase:', accounts.length);
    } catch (err) {
        console.error('❌ Accounts error:', err.message);
    }
}

document.addEventListener('DOMContentLoaded', loadAccountsTable);
