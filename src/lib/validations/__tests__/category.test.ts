import { describe, it, expect } from 'vitest';
import { createCategorySchema, updateCategorySchema } from '../category';

describe('Category Validation Schemas', () => {
  describe('createCategorySchema', () => {
    it('should validate a valid category', () => {
      const input = {
        name: 'Technology',
        description: 'Posts about technology topics',
      };

      const result = createCategorySchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should require a name', () => {
      const input = {
        description: 'A description',
      };

      const result = createCategorySchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should allow name without description', () => {
      const input = {
        name: 'Technology',
      };

      const result = createCategorySchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should enforce name length constraint', () => {
      const input = {
        name: 'a'.repeat(51),
      };

      const result = createCategorySchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject empty name', () => {
      const input = {
        name: '',
      };

      const result = createCategorySchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe('updateCategorySchema', () => {
    it('should allow updating name', () => {
      const input = {
        name: 'Updated Name',
      };

      const result = updateCategorySchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should allow updating description', () => {
      const input = {
        description: 'Updated description',
      };

      const result = updateCategorySchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should allow empty object', () => {
      const input = {};

      const result = updateCategorySchema.safeParse(input);
      expect(result.success).toBe(true);
    });
  });
});
