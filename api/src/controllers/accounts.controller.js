const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all accounts
exports.getAllAccounts = async (req, res) => {
  try {
    const { industry, region } = req.query;
    
    const accounts = await prisma.account.findMany({
      where: {
        ...(industry && { industry }),
        ...(region && { region }),
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single account with contacts
exports.getAccountById = async (req, res) => {
  try {
    const account = await prisma.account.findUnique({
      where: { id: req.params.id },
      include: {
        contacts: {
          orderBy: { createdAt: 'asc' }
        },
        leads: {
          select: { id: true, title: true, stage: true, value: true },
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });
    
    if (!account) return res.status(404).json({ message: 'Account not found' });
    res.json(account);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create account
exports.createAccount = async (req, res) => {
  try {
    const { 
      name, 
      address, 
      industry, 
      annualRevenue, 
      employeesCount, 
      ownership, 
      status,
      region, 
      ltv, 
      ownerInitials,
      // CRM profile fields
      website,
      description,
      foundedYear,
      specialties,
      linkedin,
      twitter,
      instagram,
      contactEmail,
      contactPhone,
      contactPerson,
      location,
      size
    } = req.body;
    
    const account = await prisma.account.create({
      data: {
        name,
        address,
        industry,
        annualRevenue,
        employeesCount: parseInt(employeesCount) || 0,
        ownership,
        status: status || 'Active',
        region,
        ltv,
        ownerInitials,
        website,
        description,
        foundedYear,
        specialties,
        linkedin,
        twitter,
        instagram,
        contactEmail,
        contactPhone,
        contactPerson,
        location,
        size
      }
    });
    
    res.status(201).json(account);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update account
exports.updateAccount = async (req, res) => {
  try {
    // Strip any relational fields that can't be directly set
    const { contacts, leads, deals, ...data } = req.body;
    const account = await prisma.account.update({
      where: { id: req.params.id },
      data
    });
    res.json(account);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete account
exports.deleteAccount = async (req, res) => {
  try {
    await prisma.account.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
