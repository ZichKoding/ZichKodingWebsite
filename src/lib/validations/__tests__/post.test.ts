import { describe, it, expect } from 'vitest';
import { createPostSchema, updatePostSchema } from '../post';

describe('Post Validation Schemas', () => {
  describe('createPostSchema', () => {
    it('should validate a valid post creation input', () => {
      const input = {
        title: 'Test Post',
        content: { blocks: [] },
        excerpt: 'A test excerpt',
        cover_image_url: 'https://example.com/image.jpg',
        published: true,
        category_ids: ['550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001'],
      };

      const result = createPostSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe('Test Post');
        expect(result.data.published).toBe(true);
      }
    });

    it('should require a title', () => {
      const input = {
        content: { blocks: [] },
      };

      const result = createPostSchema.safeParse(input);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => issue.path.includes('title'))).toBe(true);
      }
    });

    it('should provide defaults for optional fields', () => {
      const input = {
        title: 'Test Post',
      };

      const result = createPostSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.published).toBe(false);
        expect(result.data.category_ids).toEqual([]);
        expect(result.data.content).toEqual({});
      }
    });

    it('should reject invalid cover image URL', () => {
      const input = {
        title: 'Test Post',
        cover_image_url: 'not-a-url',
      };

      const result = createPostSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject invalid category UUIDs', () => {
      const input = {
        title: 'Test Post',
        category_ids: ['not-a-uuid'],
      };

      const result = createPostSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should accept empty title string and fail', () => {
      const input = {
        title: '',
      };

      const result = createPostSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe('updatePostSchema', () => {
    it('should validate a partial update', () => {
      const input = {
        published: true,
      };

      const result = updatePostSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.published).toBe(true);
      }
    });

    it('should allow all fields to be optional', () => {
      const input = {};

      const result = updatePostSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should validate mixed partial updates', () => {
      const input = {
        title: 'Updated Title',
        cover_image_url: 'https://example.com/new-image.jpg',
      };

      const result = updatePostSchema.safeParse(input);
      expect(result.success).toBe(true);
    });
  });
});
