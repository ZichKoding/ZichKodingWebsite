import { z } from 'zod';

export const createSkillSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  category: z.enum(['frontend', 'backend', 'devops', 'tools', 'leadership']),
  proficiency: z.number().int().min(1, 'Proficiency must be between 1-100').max(100, 'Proficiency must be between 1-100'),
  icon: z.string().max(100, 'Icon must be 100 characters or less').optional(),
  display_order: z.number().int().nonnegative().default(0),
});

export const updateSkillSchema = createSkillSchema.partial();

export type CreateSkillInput = z.infer<typeof createSkillSchema>;
export type UpdateSkillInput = z.infer<typeof updateSkillSchema>;
