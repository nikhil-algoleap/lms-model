const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  console.log('🔍 Checking user in database...');
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'nikhil@algoleap.com' },
      include: { role: true }
    });
    
    if (user) {
      console.log('✅ User found!');
      console.log('   Email:', user.email);
      console.log('   Role:', user.role.name);
      console.log('   Pass Hash exists:', !!user.passwordHash);
    } else {
      console.log('❌ User NOT found in this database!');
    }
  } catch (err) {
    console.error('❌ Connection Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

check();
