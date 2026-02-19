import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  content: z.record(z.string(), z.any()).default({}),
  excerpt: z.string().max(500, 'Excerpt must be 500 characters or less').optional(),
  cover_image_url: z.string().url('Invalid URL').optional(),
  published: z.boolean().default(false),
  category_ids: z.array(z.string().uuid()).default([]),
});

export const updatePostSchema = createPostSchema.partial();

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
