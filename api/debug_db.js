const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    console.log('Testing DB schema update...');
    // Try to create a dummy account with new fields
    const account = await prisma.account.create({
      data: {
        name: 'Test Corp ' + Date.now(),
        address: '123 Tech Lane',
        industry: 'Testing',
        annualRevenue: '$500M',
        employeesCount: 100,
        ownership: 'Private',
        status: 'Active',
        region: 'Global'
      }
    });
    console.log('Successfully created account with new fields:', account.id);
    await prisma.account.delete({ where: { id: account.id } });
    console.log('Cleanup successful.');
  } catch (err) {
    console.error('Error during test:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
