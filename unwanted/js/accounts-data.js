// Authentication helper
function getAuthHeader() {
    const token = localStorage.getItem('lms_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
}

async function loadAccountsTable() {
    const tbody = document.getElementById('accounts-table-body');
    const countEl = document.getElementById('accounts-count');
    if (!tbody) return;

    try {
        const response = await fetch('http://localhost:4000/api/accounts', {
            headers: getAuthHeader()
        });

        if (!response.ok) throw new Error('API unreachable or unauthorized');
        const accounts = await response.json();

        if (countEl) countEl.textContent = accounts.length + ' active accounts';

        tbody.innerHTML = '';
        accounts.forEach(acc => {
            const avatarClass = AVATAR_CLASSES_ACC[acc.ownerInitials] || 'avatar-green';
            const row = document.createElement('tr');
            row.style.cursor = 'pointer';
            row.innerHTML = `
                <td class="fw-semibold">${acc.name}</td>
                <td><span class="badge-industry">${acc.industry || '—'}</span></td>
                <td>${acc.region || '—'}</td>
                <td>${acc.contactsCount || 0}</td>
                <td>${acc.openLeads || 0}</td>
                <td class="value-cell">${acc.ltv || '—'}</td>
                <td><div class="avatar-sm ${avatarClass}">${acc.ownerInitials || '?'}</div></td>
            `;
            tbody.appendChild(row);
        });

        console.log('✅ Accounts loaded from Backend:', accounts.length);
    } catch (err) {
        console.warn('Backend API error for Accounts Table:', err.message);
    }
}

document.addEventListener('DOMContentLoaded', loadAccountsTable);
