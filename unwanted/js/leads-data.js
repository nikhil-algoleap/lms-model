// ============================================================
// ALGOLEAP LMS — Leads Real-Time Data Engine
// Fetches leads from Supabase and renders Kanban + Table view
// ============================================================

const STAGE_COLORS = {
    'NEW': '#1665d8',
    'QUALIFIED': '#d97706',
    'PROPOSAL': '#a855f7',
    'NEGOTIATION': '#ef4444',
    'WON': '#2d8b3f'
};

const AVATAR_CLASSES = {
    'G': 'avatar-green', // Gopi (Owner/Client Manager)
    'P': 'avatar-ak',    // Prashanth (Practice Leader)
    'R': 'avatar-rd',    // Rajesh (Executive)
    'V': 'avatar-vi',    // Vikram
    'D': 'avatar-pm',    // Dhanush (Team Member)
    'H': 'avatar-blue'   // Hari (Administrator)
};

// Render the Kanban board from live data
async function loadKanbanBoard() {
    const stages = ['NEW', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON'];
    const board = document.getElementById('kanban-board');
    if (!board) return;

    try {
        const response = await fetch('http://localhost:4000/api/leads');
        if (!response.ok) throw new Error('API unreachable');
        const leads = await response.json();

        board.innerHTML = '';

        stages.forEach(stage => {
            const stageLeads = leads.filter(l => l.stage === stage);
            const color = STAGE_COLORS[stage];

            const col = document.createElement('div');
            col.className = 'kanban-column';
            col.innerHTML = `
                <div class="kanban-column-header">
                    <div class="kanban-column-title"><span class="dot" style="background:${color};"></span>${stage}</div>
                    <span class="kanban-column-count">${stageLeads.length}</span>
                </div>
            `;

            stageLeads.forEach(lead => {
                const avatarClass = AVATAR_CLASSES[lead.ownerInitials] || 'avatar-green';
                const card = document.createElement('div');
                card.className = `kanban-card${lead.isFeatured ? ' featured' : ''}`;
                card.onclick = () => { 
                    const query = `?title=${encodeURIComponent(lead.title)}&account=${encodeURIComponent(lead.accountName)}`;
                    location.href = `lead-details.html${query}`; 
                };
                card.innerHTML = `
                    <div class="card-header">${lead.accountName} · ${lead.title}</div>
                    <div class="card-subtext">${lead.serviceLine || ''} · ${lead.deliveryFormat || ''}</div>
                    <div class="card-footer">
                        <div class="card-value">${lead.value || ''}</div>
                        <div class="avatar-sm ${avatarClass}">${lead.ownerInitials}</div>
                    </div>
                `;
                col.appendChild(card);
            });

            board.appendChild(col);
        });

        console.log(`✅ Kanban loaded: ${leads.length} leads from Backend`);

    } catch (err) {
        console.warn('Backend API error for Kanban, using demo data:', err.message);
    }
}

// Render the Table view from live data
async function loadLeadsTable() {
    const tbody = document.getElementById('leads-table-body');
    if (!tbody) return;

    try {
        const response = await fetch('http://localhost:4000/api/leads');
        if (!response.ok) throw new Error('API unreachable');
        const leads = await response.json();

        tbody.innerHTML = '';
        leads.forEach(lead => {
            const avatarClass = AVATAR_CLASSES[lead.ownerInitials] || 'avatar-green';
            const stageLower = (lead.stage || '').toLowerCase();
            const row = document.createElement('tr');
            row.onclick = () => { 
                const query = `?title=${encodeURIComponent(lead.title)}&account=${encodeURIComponent(lead.accountName)}`;
                location.href = `lead-details.html${query}`; 
            };
            row.style.cursor = 'pointer';
            row.innerHTML = `
                <td>
                    <div class="lead-name-cell">
                        <span class="main-title">${lead.title}</span>
                        <span class="sub-info">${lead.serviceLine || ''} · ${lead.deliveryFormat || ''}</span>
                    </div>
                </td>
                <td>${lead.accountName}</td>
                <td><span class="badge ${stageLower}">&bull; ${lead.stage}</span></td>
                <td class="value-cell">${lead.value || '-'}</td>
                <td>${lead.probability || 0}%</td>
                <td>${lead.dueDate ? new Date(lead.dueDate).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }) : '-'}</td>
                <td><div class="avatar-sm ${avatarClass}">${lead.ownerInitials}</div></td>
            `;
            tbody.appendChild(row);
        });

        console.log(`✅ Leads table loaded from Backend`);

    } catch (err) {
        console.warn('Backend API error for Leads List Table:', err.message);
    }
}

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
    loadKanbanBoard();
    loadLeadsTable();
});
