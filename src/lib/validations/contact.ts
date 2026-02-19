import { z } from 'zod';

export const createContactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required').max(200, 'Subject must be 200 characters or less'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000, 'Message must be 5000 characters or less'),
});

export const updateContactStatusSchema = z.object({
  status: z.enum(['new', 'read', 'replied', 'archived']),
  admin_notes: z.string().max(5000, 'Admin notes must be 5000 characters or less').optional(),
});

export type CreateContactInput = z.infer<typeof createContactSchema>;
export type UpdateContactStatusInput = z.infer<typeof updateContactStatusSchema>;
