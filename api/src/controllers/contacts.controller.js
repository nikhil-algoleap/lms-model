const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        account: {
          select: { name: true }
        }
      }
    });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getContactById = async (req, res) => {
  try {
    const contact = await prisma.contact.findUnique({
      where: { id: req.params.id },
      include: {
        account: {
          select: { name: true }
        }
      }
    });
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createContact = async (req, res) => {
  try {
    let finalAccountId = req.body.accountId || req.body.accountName;
    if (finalAccountId && !finalAccountId.includes('-')) {
      const acc = await prisma.account.findFirst({ where: { name: finalAccountId } });
      if (acc) {
        finalAccountId = acc.id;
      } else {
        const newAcc = await prisma.account.create({ data: { name: finalAccountId } });
        finalAccountId = newAcc.id;
      }
    }

    // Remove legacy accountName if present
    const dataToSave = { ...req.body };
    delete dataToSave.accountName;
    if (finalAccountId) dataToSave.accountId = finalAccountId;

    const contact = await prisma.contact.create({
      data: dataToSave
    });
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateContact = async (req, res) => {
  try {
    const contact = await prisma.contact.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    await prisma.contact.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
