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

    const { data: leads, error } = await db.from('leads').select('*').order('created_at', { ascending: false });

    if (error) {
        console.error('❌ Error loading leads:', error.message);
        return;
    }

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
            const avatarClass = AVATAR_CLASSES[lead.owner_initials] || 'avatar-green';
            const card = document.createElement('div');
            card.className = `kanban-card${lead.is_featured ? ' featured' : ''}`;
            card.onclick = () => { 
                const query = `?title=${encodeURIComponent(lead.title)}&account=${encodeURIComponent(lead.account_name)}`;
                location.href = `lead-details.html${query}`; 
            };
            card.innerHTML = `
                <div class="card-header">${lead.account_name} · ${lead.title}</div>
                <div class="card-subtext">${lead.service_line || ''} · ${lead.delivery_format || ''}</div>
                <div class="card-footer">
                    <div class="card-value">${lead.value || ''}</div>
                    <div class="avatar-sm ${avatarClass}">${lead.owner_initials}</div>
                </div>
            `;
            col.appendChild(card);
        });

        board.appendChild(col);
    });

    console.log(`✅ Kanban loaded: ${leads.length} leads from Supabase`);
}

// Render the Table view from live data
async function loadLeadsTable() {
    const tbody = document.getElementById('leads-table-body');
    if (!tbody) return;

    const { data: leads, error } = await db.from('leads').select('*').order('created_at', { ascending: false });

    if (error) {
        console.error('❌ Error loading leads table:', error.message);
        return;
    }

    tbody.innerHTML = '';
    leads.forEach(lead => {
        const avatarClass = AVATAR_CLASSES[lead.owner_initials] || 'avatar-green';
        const stageLower = (lead.stage || '').toLowerCase();
        const row = document.createElement('tr');
        row.onclick = () => { 
            const query = `?title=${encodeURIComponent(lead.title)}&account=${encodeURIComponent(lead.account_name)}`;
            location.href = `lead-details.html${query}`; 
        };
        row.style.cursor = 'pointer';
        row.innerHTML = `
            <td>
                <div class="lead-name-cell">
                    <span class="main-title">${lead.title}</span>
                    <span class="sub-info">${lead.service_line || ''} · ${lead.delivery_format || ''}</span>
                </div>
            </td>
            <td>${lead.account_name}</td>
            <td><span class="badge ${stageLower}">&bull; ${lead.stage}</span></td>
            <td class="value-cell">${lead.value || '-'}</td>
            <td>${lead.probability || 0}%</td>
            <td>${lead.due_date ? new Date(lead.due_date).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }) : '-'}</td>
            <td><div class="avatar-sm ${avatarClass}">${lead.owner_initials}</div></td>
        `;
        tbody.appendChild(row);
    });
}

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
    loadKanbanBoard();
    loadLeadsTable();
});
