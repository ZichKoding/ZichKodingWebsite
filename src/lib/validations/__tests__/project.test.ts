import { describe, it, expect } from 'vitest';
import { createProjectSchema, updateProjectSchema } from '../project';

describe('Project Validation Schemas', () => {
  describe('createProjectSchema', () => {
    it('should validate a valid project creation input', () => {
      const input = {
        title: 'My Awesome Project',
        description: 'A project description',
        tech_stack: ['React', 'TypeScript', 'Node.js'],
        featured: true,
        display_order: 1,
      };

      const result = createProjectSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should require title and description', () => {
      const input = {
        tech_stack: ['React'],
      };

      const result = createProjectSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should require at least one technology', () => {
      const input = {
        title: 'Project',
        description: 'Description',
        tech_stack: [],
      };

      const result = createProjectSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should validate URLs for live_url and github_url', () => {
      const input = {
        title: 'Project',
        description: 'Description',
        tech_stack: ['React'],
        live_url: 'not-a-url',
      };

      const result = createProjectSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should accept valid URLs', () => {
      const input = {
        title: 'Project',
        description: 'Description',
        tech_stack: ['React'],
        live_url: 'https://example.com',
        github_url: 'https://github.com/user/project',
      };

      const result = createProjectSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should provide defaults for optional fields', () => {
      const input = {
        title: 'Project',
        description: 'Description',
        tech_stack: ['React'],
      };

      const result = createProjectSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.featured).toBe(false);
        expect(result.data.display_order).toBe(0);
      }
    });

    it('should enforce non-negative display_order', () => {
      const input = {
        title: 'Project',
        description: 'Description',
        tech_stack: ['React'],
        display_order: -1,
      };

      const result = createProjectSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe('updateProjectSchema', () => {
    it('should allow partial updates', () => {
      const input = {
        featured: true,
      };

      const result = updateProjectSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should allow updating multiple fields', () => {
      const input = {
        title: 'Updated Title',
        tech_stack: ['Vue'],
      };

      const result = updateProjectSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should allow empty object', () => {
      const input = {};

      const result = updateProjectSchema.safeParse(input);
      expect(result.success).toBe(true);
    });
  });
});
