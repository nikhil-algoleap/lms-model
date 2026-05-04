const { z } = require('zod');

// Shared partials
const uuidOptional = z.string().optional();
const uuidRequired = z.string().min(1);

const createAccountSchema = z.object({
  name: z.string().min(2, "Account name is required"),
  address: z.string().optional(),
  industry: z.string().optional(),
  annualRevenue: z.string().optional(),
  employeesCount: z.coerce.number().optional(),
  ownership: z.string().optional(),
  status: z.string().optional(),
  region: z.string().optional(),
  ltv: z.string().optional(),
  ownerInitials: z.string().optional()
});

const createContactSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  title: z.string().optional(),
  email: z.string().email("Invalid email format").optional().or(z.literal('')),
  phone: z.string().optional(),
  accountId: uuidOptional,
  role: z.string().optional(),
  location: z.string().optional(),
  department: z.string().optional(),
  reportsTo: z.string().optional(),
  ownerInitials: z.string().optional()
});

const createLeadSchema = z.object({
  title: z.string().min(5, "Lead title must be at least 5 characters"),
  accountId: uuidOptional,
  contactId: uuidOptional,
  serviceLine: z.string().optional(),
  deliveryFormat: z.string().optional(),
  value: z.string().optional(),
  probability: z.coerce.number().min(0).max(100).optional(),
  dueDate: z.string().optional(),
  ownerInitials: z.string().optional(),
  stage: z.string().optional(),
  isFeatured: z.boolean().optional(),
  description: z.string().optional(),
  practiceArea: z.string().optional(),
  estimatedDuration: z.coerce.number().optional(),
  source: z.string().optional(),
  practiceLeader: z.string().optional(),
  clientManager: z.string().optional()
});

module.exports = {
  createAccountSchema,
  createContactSchema,
  createLeadSchema
};
