const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const counts = {
      users: await prisma.user.count(),
      roles: await prisma.role.count(),
      leads: await prisma.lead.count(),
      accounts: await prisma.account.count(),
      contacts: await prisma.contact.count(),
      leadActivities: await prisma.leadActivity.count(),
    };
    console.log('--- DATABASE RECORD COUNTS ---');
    console.log(JSON.stringify(counts, null, 2));
  } catch (err) {
    console.error('Error fetching database counts:', err);
  } finally {
    await prisma.$disconnect();
  }
}

check();
