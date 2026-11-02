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

describe('public claim fence', () => {
  const publicCopy = [
    ...TERMINAL_DATA.aboutParagraphs,
    TERMINAL_DATA.aboutTagline,
    TERMINAL_DATA.about,
    ...TERMINAL_DATA.career.map((entry) => `${entry.role} ${entry.description}`),
    ...TERMINAL_DATA.howIWork.strengths,
    ...TERMINAL_DATA.howIWork.growthAreas,
    ...PROJECTS.map((project) => `${project.title} ${project.description}`),
    ...SKILLS.flatMap((category) => category.items.map((item) => `${item.name} ${item.note ?? ''}`)),
  ].join('\n');

  it('does not publish the ARA headcount or the retired release line', () => {
    const banned = ['sole', 'bi-weekly', 'Shenron', 'limited resources', 'solo when'];
    for (const phrase of banned) {
      expect(publicCopy.toLowerCase()).not.toContain(phrase);
    }
  });

  it('names the local model and the public app names', () => {
    expect(publicCopy).toContain('Gemma 4 E4B');
    expect(publicCopy).toContain('Alam');
    expect(publicCopy).toContain('ZichKode');
    expect(publicCopy).toContain('Lead Developer & Technology Manager');
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
