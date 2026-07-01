const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
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
    { key: 'deals.export_csv', description: 'Export Pipeline to CSV', group: 'Deal Management' },

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
      getPermId('deals.export_csv'),
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

  // 4. Create Demo Users
  console.log('Creating demo users...');
  const passwordHash = await bcrypt.hash('password123', 10);

  const adminRole = await prisma.role.findUnique({ where: { name: 'Administrator' } });
  const execRole = await prisma.role.findUnique({ where: { name: 'Executive' } });

  const demoUsers = [
    { email: 'nikhil@algoleap.com', fullName: 'Nikhil', roleId: adminRole.id, avatarColor: '#4f46e5' },
    { email: 'prasad@algoleap.com', fullName: 'Prasad', roleId: execRole.id, avatarColor: '#7c3aed' },
  ];

  for (const u of demoUsers) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { passwordHash, roleId: u.roleId },
      create: { ...u, passwordHash }
    });
    console.log(`  ✅ User: ${u.email} (${u.email === 'nikhil@algoleap.com' ? 'Administrator' : 'Executive'})`);
  }

  console.log('Demo users created (password: password123)');

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
    update: { leadStatus: 'NEW' },
    create: {
      title: 'Cloud Migration Project',
      accountId: account.id,
      contactId: contact.id,
      leadStatus: 'NEW',
      value: '$50,000',
      probability: 10,
      description: 'Initial inquiry for cloud migration.',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@acme.com',
      company: 'Acme Corp',
      leadRating: 'COLD',
      leadScore: 10
    }
  });

  const lead2 = await prisma.lead.upsert({
    where: { title: 'AI Strategy Consulting' },
    update: { leadStatus: 'QUALIFIED' },
    create: {
      title: 'AI Strategy Consulting',
      accountId: account.id,
      contactId: contact.id,
      leadStatus: 'QUALIFIED',
      value: '$120,000',
      probability: 30,
      description: 'Highly interested in AI roadmap.',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@acme.com',
      company: 'Acme Corp',
      leadRating: 'HOT',
      leadScore: 85,
      hasBudget: true,
      hasAuthority: true,
      hasNeed: true,
      hasTimeline: true
    }
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

  // Seed Stakeholders for Deal
  const stakeholdersData = [
    {
      dealId: deal.id,
      contactId: contact.id,
      role: 'DECISION_MAKER',
      notes: 'Primary executive sponsor.'
    }
  ];
  for (const sh of stakeholdersData) {
    const existing = await prisma.dealStakeholder.findFirst({
      where: { dealId: sh.dealId, contactId: sh.contactId }
    });
    if (!existing) {
      await prisma.dealStakeholder.create({ data: sh });
    }
  }

  // Seed Competitors for Deal
  const competitorsData = [
    {
      dealId: deal.id,
      name: 'Microsoft Solutions',
      strength: 'Strong enterprise footprint & pricing bundle',
      weakness: 'Lacks specialized agile implementation capabilities',
      notes: 'Pushes Dynamics 365 heavily.'
    },
    {
      dealId: deal.id,
      name: 'Salesforce Cloud Partners',
      strength: 'Industry standard CRM integration & branding',
      weakness: 'High custom development costs & steep learning curve',
      notes: 'Competes on general CRM front.'
    }
  ];
  for (const comp of competitorsData) {
    const existing = await prisma.dealCompetitor.findFirst({
      where: { dealId: comp.dealId, name: comp.name }
    });
    if (!existing) {
      await prisma.dealCompetitor.create({ data: comp });
    }
  }

  // Seed Documents for Deal
  const documentsData = [
    {
      dealId: deal.id,
      title: 'NDA_Acme_Executed.pdf',
      fileName: 'NDA_Acme_Executed.pdf',
      fileSize: 154200,
      mimeType: 'application/pdf',
      storageUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      uploadedById: 'system'
    },
    {
      dealId: deal.id,
      title: 'Acme_Digital_Transformation_Proposal_v2.pdf',
      fileName: 'Acme_Digital_Transformation_Proposal_v2.pdf',
      fileSize: 2450000,
      mimeType: 'application/pdf',
      storageUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      uploadedById: 'system'
    },
    {
      dealId: deal.id,
      title: 'Master_Services_Agreement_Draft.docx',
      fileName: 'Master_Services_Agreement_Draft.docx',
      fileSize: 45000,
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      storageUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      uploadedById: 'system'
    }
  ];
  for (const doc of documentsData) {
    const existing = await prisma.dealDocument.findFirst({
      where: { dealId: doc.dealId, fileName: doc.fileName }
    });
    if (!existing) {
      await prisma.dealDocument.create({ data: doc });
    }
  }

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
