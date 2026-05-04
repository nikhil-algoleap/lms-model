const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding default user...');

  const role = await prisma.role.findUnique({ where: { name: 'Administrator' } });
  if (!role) throw new Error('Administrator role not found. Run seed.js first.');

  const passwordHash = await bcrypt.hash('password123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'nikhil@algoleap.com' },
    update: {},
    create: {
      email: 'nikhil@algoleap.com',
      passwordHash,
      fullName: 'Nikhil Yedugani',
      roleId: role.id,
      avatarColor: '#4f46e5',
      isActive: true
    },
  });

  console.log('✅ Default user created: nikhil@algoleap.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
