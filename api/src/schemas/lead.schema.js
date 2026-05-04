const { z } = require('zod');

const leadSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  accountName: z.string().min(2, "Account name is required"),
  serviceLine: z.string().optional().nullable(),
  deliveryFormat: z.string().optional().nullable(),
  value: z.string().optional().nullable(),
  probability: z.number().min(0).max(100).optional().default(0),
  stage: z.string().optional().default("NEW"),
  ownerInitials: z.string().max(2).optional().nullable(),
  dueDate: z.string().optional().nullable()
});

module.exports = { leadSchema };
