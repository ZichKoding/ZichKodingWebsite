import { describe, it, expect } from 'vitest';
import { PROJECTS } from '../projects';
import { SKILLS } from '../skills';
import { TERMINAL_DATA } from '../terminal-data';
import { createProjectSchema } from '@/lib/validations/project';

describe('static project data', () => {
  it('every project validates against the project schema', () => {
    for (const project of PROJECTS) {
      const result = createProjectSchema.safeParse(project);
      expect(result.success, JSON.stringify(result.success ? null : result.error.issues)).toBe(true);
    }
  });

  it('display_order values are unique', () => {
    const orders = PROJECTS.map((p) => p.display_order);
    expect(new Set(orders).size).toBe(orders.length);
  });

  it('the home terminal shows exactly three featured projects', () => {
    expect(TERMINAL_DATA.projects).toHaveLength(3);
  });
});

describe('static skill data', () => {
  it('has categories with at least one named item each', () => {
    expect(SKILLS.length).toBeGreaterThan(0);
    for (const cat of SKILLS) {
      expect(cat.category).toBeTruthy();
      expect(cat.items.length).toBeGreaterThan(0);
      for (const item of cat.items) {
        expect(item.name).toBeTruthy();
      }
    }
  });

  it('carries no invented proficiency numbers', () => {
    for (const cat of SKILLS) {
      for (const item of cat.items) {
        expect(item).not.toHaveProperty('proficiency');
      }
    }
  });
});

describe('career data', () => {
  it('entries are complete and use qualitative or real periods', () => {
    for (const entry of TERMINAL_DATA.career) {
      expect(entry.company).toBeTruthy();
      expect(entry.role).toBeTruthy();
      expect(entry.period).toBeTruthy();
      expect(entry.description).toBeTruthy();
    }
  });
});
