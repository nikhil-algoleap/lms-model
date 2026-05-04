const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding roles and permissions...');

  // 1. Create Permissions
  const permissionsData = [
    // Sales
    { key: 'lead:create', description: 'Create New Lead', group: 'Sales Lead Actions' },
    { key: 'lead:update', description: 'Update Lead Status', group: 'Sales Lead Actions' },
    { key: 'lead:delete', description: 'Delete Opportunity', group: 'Sales Lead Actions' },
    { key: 'lead:assign', description: 'Assign Owner', group: 'Sales Lead Actions' },
    
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
      update: {},
      create: p
    });
  }

  // 2. Create Roles
  const rolesData = [
    { name: 'Administrator', description: 'Full system access and user management.', isSystem: true },
    { name: 'Practice Leader', description: 'Executive oversight and financial approval rights.', isSystem: false },
    { name: 'Client Manager', description: 'Relationship management and lead qualification.', isSystem: false },
    { name: 'Team Member', description: 'General access for daily operations.', isSystem: false }
  ];

  for (const r of rolesData) {
    await prisma.role.upsert({
      where: { name: r.name },
      update: {},
      create: r
    });
  }

  // 3. Link Admin to all permissions
  const adminRole = await prisma.role.findUnique({ where: { name: 'Administrator' } });
  const allPermissions = await prisma.permission.findMany();

  for (const p of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: p.id
        }
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: p.id
      }
    });
  }

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
