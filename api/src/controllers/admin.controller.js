const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

// ==========================================
// USER MANAGEMENT
// ==========================================

exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        role: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { roleId, isActive } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id },
      data: { 
        ...(roleId && { roleId }),
        ...(isActive !== undefined && { isActive })
      },
      include: { role: true }
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};

exports.createUser = async (req, res) => {
  const { email, password, fullName, roleId } = req.body;
  try {
    if (!email || !password || !fullName || !roleId) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: 'A user with this email already exists.' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, passwordHash, fullName, roleId },
      include: { role: true }
    });
    res.status(201).json(user);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// ==========================================
// ROLE & PERMISSION MANAGEMENT
// ==========================================

exports.getRoles = async (req, res) => {
  try {
    const roles = await prisma.role.findMany({
      include: {
        _count: { select: { users: true } },
        permissions: {
          include: { permission: true }
        }
      }
    });
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
};

exports.createRole = async (req, res) => {
  const { name, description } = req.body;
  try {
    if (!name) return res.status(400).json({ message: 'Role name is required.' });
    const existing = await prisma.role.findUnique({ where: { name } });
    if (existing) return res.status(400).json({ message: 'A role with this name already exists.' });
    const role = await prisma.role.create({
      data: { name, description: description || null, isSystem: false },
      include: { _count: { select: { users: true } } }
    });
    res.status(201).json(role);
  } catch (err) {
    console.error('Error creating role:', err);
    res.status(500).json({ error: 'Failed to create role' });
  }
};


exports.getPermissions = async (req, res) => {
  try {
    const permissions = await prisma.permission.findMany({
      orderBy: [
        { group: 'asc' },
        { key: 'asc' }
      ]
    });
    res.json(permissions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch permissions' });
  }
};

exports.updateRolePermissions = async (req, res) => {
  const { id: roleId } = req.params;
  const { permissionIds } = req.body; // Array of permission IDs to be active

  try {
    // Transaction to ensure atomicity
    await prisma.$transaction([
      // 1. Remove all existing permissions for this role
      prisma.rolePermission.deleteMany({
        where: { roleId }
      }),
      // 2. Add new permissions
      prisma.rolePermission.createMany({
        data: permissionIds.map(permissionId => ({
          roleId,
          permissionId
        }))
      })
    ]);

    const updatedRole = await prisma.role.findUnique({
      where: { id: roleId },
      include: {
        permissions: {
          include: { permission: true }
        }
      }
    });

    res.json(updatedRole);
  } catch (err) {
    console.error('Error updating role permissions:', err);
    res.status(500).json({ error: 'Failed to update role permissions' });
  }
};
