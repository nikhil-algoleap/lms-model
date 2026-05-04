const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Create Default Roles
  const roles = [
    { name: 'Executive', description: 'Can view everything and create leads' },
    { name: 'Practice Leader', description: 'Can manage leads in their practice' },
    { name: 'Client Manager', description: 'Can manage assigned accounts and leads' },
    { name: 'Team Member', description: 'Can view assigned leads' },
    { name: 'Administrator', description: 'Full system access', isSystem: true },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: {
        name: role.name,
        description: role.description,
        isSystem: role.isSystem || false,
      },
    });
  }

  console.log('✅ Default roles created.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
