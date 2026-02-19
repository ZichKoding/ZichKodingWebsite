import { z } from 'zod';

export const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  description: z.string().min(1, 'Description is required').max(2000, 'Description must be 2000 characters or less'),
  content: z.record(z.string(), z.any()).optional(),
  tech_stack: z.array(z.string()).min(1, 'At least one technology is required'),
  live_url: z.string().url('Invalid URL').optional(),
  github_url: z.string().url('Invalid URL').optional(),
  image_url: z.string().url('Invalid URL').optional(),
  featured: z.boolean().default(false),
  display_order: z.number().int().nonnegative().default(0),
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
