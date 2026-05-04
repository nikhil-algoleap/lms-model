const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function testLogin() {
  const email = 'nikhil@algoleap.com';
  const plainPass = 'password123';
  
  console.log(`🧪 Testing login for ${email}...`);
  
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
     console.error('❌ User not found');
     return;
  }
  
  const isMatch = await bcrypt.compare(plainPass, user.passwordHash);
  console.log(`   Result: ${isMatch ? '✅ MATCH SUCCESSFUL' : '❌ MATCH FAILED'}`);
  
  await prisma.$disconnect();
}

testLogin();
