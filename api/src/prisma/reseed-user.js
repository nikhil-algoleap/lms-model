const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Re-seeding user with fresh hash...');

  const role = await prisma.role.findUnique({ where: { name: 'Administrator' } });
  if (!role) {
    console.error('❌ Administrator role missing. Please run seed.js first.');
    return;
  }

  const freshHash = await bcrypt.hash('password123', 10);
  console.log('   New Hash generated:', freshHash);

  const user = await prisma.user.upsert({
    where: { email: 'nikhil@algoleap.com' },
    update: {
      passwordHash: freshHash
    },
    create: {
      email: 'nikhil@algoleap.com',
      passwordHash: freshHash,
      fullName: 'Nikhil Yedugani',
      roleId: role.id,
      isActive: true
    },
  });

  console.log('✅ User updated/created: nikhil@algoleap.com / password123');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
