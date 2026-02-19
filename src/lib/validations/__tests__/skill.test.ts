import { describe, it, expect } from 'vitest';
import { createSkillSchema, updateSkillSchema } from '../skill';

describe('Skill Validation Schemas', () => {
  describe('createSkillSchema', () => {
    it('should validate a valid skill', () => {
      const input = {
        name: 'React',
        category: 'frontend',
        proficiency: 95,
        icon: 'react-icon',
        display_order: 1,
      };

      const result = createSkillSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should require name, category, and proficiency', () => {
      const input = {
        name: 'React',
      };

      const result = createSkillSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should validate valid categories', () => {
      const categories = ['frontend', 'backend', 'devops', 'tools', 'leadership'];

      categories.forEach(category => {
        const input = {
          name: 'Skill',
          category,
          proficiency: 50,
        };

        const result = createSkillSchema.safeParse(input);
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid category', () => {
      const input = {
        name: 'Skill',
        category: 'invalid',
        proficiency: 50,
      };

      const result = createSkillSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should enforce proficiency range 1-100', () => {
      const invalidProficiencies = [0, 101, -1, 150];

      invalidProficiencies.forEach(proficiency => {
        const input = {
          name: 'Skill',
          category: 'frontend',
          proficiency,
        };

        const result = createSkillSchema.safeParse(input);
        expect(result.success).toBe(false);
      });
    });

    it('should accept valid proficiency values', () => {
      const validProficiencies = [1, 50, 100];

      validProficiencies.forEach(proficiency => {
        const input = {
          name: 'Skill',
          category: 'frontend',
          proficiency,
        };

        const result = createSkillSchema.safeParse(input);
        expect(result.success).toBe(true);
      });
    });

    it('should provide defaults for optional fields', () => {
      const input = {
        name: 'Skill',
        category: 'frontend',
        proficiency: 75,
      };

      const result = createSkillSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.display_order).toBe(0);
      }
    });

    it('should enforce non-negative display_order', () => {
      const input = {
        name: 'Skill',
        category: 'frontend',
        proficiency: 75,
        display_order: -1,
      };

      const result = createSkillSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe('updateSkillSchema', () => {
    it('should allow partial updates', () => {
      const input = {
        proficiency: 85,
      };

      const result = updateSkillSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should allow empty object', () => {
      const input = {};

      const result = updateSkillSchema.safeParse(input);
      expect(result.success).toBe(true);
    });
  });
});
