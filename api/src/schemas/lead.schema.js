const { z } = require('zod');

const leadSchema = z.object({
  title: z.string().optional(),
  accountName: z.string({ required_error: "Account is required" }).min(1, "Account is required"),
  company: z.string({ required_error: "Company is required" }).min(1, "Company is required"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string({ required_error: "Email is required" }).min(1, "Email is required").email("Invalid email format"),
  phone: z.string({ required_error: "Phone number is required" }).min(1, "Phone number is required"),
  serviceLine: z.string().optional().nullable(),
  deliveryFormat: z.string().optional().nullable(),
  value: z.union([z.string(), z.number()]).optional().nullable(),
  probability: z.union([z.string(), z.number()]).optional(),
  leadStatus: z.string().optional().default("NEW"),
  ownerInitials: z.string().max(2).optional().nullable(),
  dueDate: z.string().optional().nullable()
}).passthrough();

module.exports = { leadSchema };
