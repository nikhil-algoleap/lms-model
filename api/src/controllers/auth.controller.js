const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'algoleap-lms-super-secret-key-2026';

exports.register = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Get default role (Team Member)
    const defaultRole = await prisma.role.findUnique({ where: { name: 'Team Member' } });

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        roleId: defaultRole.id,
        avatarColor: '#4f46e5' // default indigo
      }
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ 
      where: { email },
      include: { role: true }
    });

    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role.name,
        avatarColor: user.avatarColor
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
