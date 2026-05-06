const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding roles and permissions...');

  // 1. Create Permissions
  const permissionsData = [
    // Sales Lead Actions
    { key: 'lead:create', description: 'Create New Lead', group: 'Sales Lead Actions' },
    { key: 'lead:update', description: 'Update Lead Status', group: 'Sales Lead Actions' },
    { key: 'lead:delete', description: 'Delete Opportunity', group: 'Sales Lead Actions' },
    { key: 'lead:assign', description: 'Assign Owner', group: 'Sales Lead Actions' },
    
    // DMS (Deals)
    { key: 'deals.view_all', description: 'View All Deals', group: 'Deal Management' },
    { key: 'deals.create', description: 'Create New Deal', group: 'Deal Management' },
    { key: 'deals.edit_any', description: 'Edit Any Deal', group: 'Deal Management' },
    { key: 'deals.move_stage', description: 'Move Deal Stage', group: 'Deal Management' },
    { key: 'deals.close_won', description: 'Mark Deal as Won', group: 'Deal Management' },
    { key: 'deals.delete', description: 'Delete Deal', group: 'Deal Management' },
    
    // Financials
    { key: 'financial:view_value', description: 'View Deal Value', group: 'Financial Transparency' },
    { key: 'financial:export', description: 'Export LTV Reports', group: 'Financial Transparency' },
    { key: 'financial:edit_prob', description: 'Edit Probability', group: 'Financial Transparency' },
    
    // Relationships
    { key: 'crm:account_create', description: 'Add Account', group: 'Client Relationships' },
    { key: 'crm:contact_edit', description: 'Edit Stakeholder', group: 'Client Relationships' },
    { key: 'crm:region_view', description: 'View Global Regions', group: 'Client Relationships' }
  ];

  for (const p of permissionsData) {
    await prisma.permission.upsert({
      where: { key: p.key },
      update: { description: p.description, group: p.group },
      create: p
    });
  }

  // 2. Create Roles
  const rolesData = [
    { name: 'Administrator', description: 'Full system access and user management.', isSystem: true },
    { name: 'Executive', description: 'Can view everything but cannot edit.', isSystem: false },
    { name: 'Practice Leader', description: 'Full control over sales and delivery.', isSystem: false },
    { name: 'Client Manager', description: 'Manages accounts and their own deals.', isSystem: false },
    { name: 'Team Member', description: 'General read-only access.', isSystem: false }
  ];

  for (const r of rolesData) {
    await prisma.role.upsert({
      where: { name: r.name },
      update: { description: r.description },
      create: r
    });
  }

  // 3. Link Permissions to Roles
  const allPerms = await prisma.permission.findMany();
  const getPermId = (key) => allPerms.find(p => p.key === key).id;

  const roleMappings = {
    'Administrator': allPerms.map(p => p.id),
    'Executive': [
      getPermId('deals.view_all'),
      getPermId('financial:view_value'),
      getPermId('crm:region_view')
    ],
    'Practice Leader': allPerms.map(p => p.id),
    'Client Manager': [
      getPermId('lead:create'),
      getPermId('lead:update'),
      getPermId('deals.view_all'),
      getPermId('deals.create'),
      getPermId('deals.move_stage'),
      getPermId('crm:account_create'),
      getPermId('crm:contact_edit')
    ],
    'Team Member': [
      getPermId('deals.view_all'),
      getPermId('crm:region_view')
    ]
  };

  for (const [roleName, permIds] of Object.entries(roleMappings)) {
    const role = await prisma.role.findUnique({ where: { name: roleName } });
    for (const pId of permIds) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: pId } },
        update: {},
        create: { roleId: role.id, permissionId: pId }
      });
    }
  }

  console.log('Seed completed successfully.');

  // 4. Create Sample Data for DMS Demo
  console.log('Creating sample leads and deals...');
  const account = await prisma.account.upsert({
    where: { name: 'Acme Corp' },
    update: {},
    create: { name: 'Acme Corp', industry: 'Technology', status: 'Active' }
  });

  const contact = await prisma.contact.upsert({
    where: { email: 'john@acme.com' },
    update: {},
    create: { fullName: 'John Doe', email: 'john@acme.com', accountId: account.id }
  });

  // Sample Leads
  const lead1 = await prisma.lead.upsert({
    where: { title: 'Cloud Migration Project' },
    update: { stage: 'NEW' },
    create: { title: 'Cloud Migration Project', accountId: account.id, contactId: contact.id, stage: 'NEW', value: '$50,000', probability: 10, description: 'Initial inquiry for cloud migration.' }
  });

  const lead2 = await prisma.lead.upsert({
    where: { title: 'AI Strategy Consulting' },
    update: { stage: 'QUALIFIED' },
    create: { title: 'AI Strategy Consulting', accountId: account.id, contactId: contact.id, stage: 'QUALIFIED', value: '$120,000', probability: 30, description: 'Highly interested in AI roadmap.' }
  });

  // Sample Deal
  const deal = await prisma.deal.upsert({
    where: { title: 'Digital Transformation Phase 1' },
    update: { stage: 'PROPOSAL' },
    create: {
      title: 'Digital Transformation Phase 1',
      accountId: account.id,
      stage: 'PROPOSAL',
      value: 250000.00,
      probability: 60,
      description: 'Major digital overhaul for Acme Corp.',
      expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
  });

  await prisma.dealActivity.create({
    data: {
      dealId: deal.id,
      type: 'STAGE_CHANGE',
      note: 'Seed: Initial proposal generated.'
    }
  });

  console.log('Sample data created.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
