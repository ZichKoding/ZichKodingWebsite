// Real skill inventory, cross-checked against Chris's resumes (2026-08).
// Deliberately no proficiency percentages — a named project or production
// context says more than a made-up bar chart ever could.

export interface SkillItem {
  name: string;
  note?: string;
}

export interface SkillCategory {
  category: string;
  items: SkillItem[];
}

export const SKILLS: SkillCategory[] = [
  {
    category: 'Languages & Frameworks',
    items: [
      { name: 'PHP / Zend Framework', note: 'legacy production, daily' },
      { name: 'TypeScript / React / Next.js', note: 'this site + client work' },
      { name: 'Python', note: 'Django, Flask, Pandas' },
      { name: 'Rust', note: 'Senku agent harness' },
      { name: 'Kotlin / Android', note: 'Alam, on the phone' },
      { name: 'SQL (MySQL / Postgres)', note: 'production migrations' },
    ],
  },
  {
    category: 'AI Engineering',
    items: [
      { name: 'Gemma 4 E4B', note: 'the local model I drive' },
      { name: 'Edge models', note: 'phone, desktop, Arduino Uno Q' },
      { name: 'Agent harnesses, skills, and tools' },
      { name: 'Claude', note: 'assists through skills and tools I write' },
      { name: 'CRAM and persistent memory', note: 'SQLite + FTS' },
      { name: 'Local TTS pipelines' },
    ],
  },
  {
    category: 'Cloud & Integrations',
    items: [
      { name: 'AWS', note: 'Lambda, S3, API Gateway, SQS' },
      { name: 'Zoho ecosystem', note: 'CRM, Projects, integrations' },
      { name: 'ETL pipelines' },
      { name: 'WordPress', note: 'builds & CRM integrations' },
      { name: 'Vercel / static deploys' },
    ],
  },
  {
    category: 'Practices & Ops',
    items: [
      { name: 'Test-driven development', note: 'PHPUnit, Vitest' },
      { name: 'Red-team plan review' },
      { name: 'Crawl-walk-run rollouts', note: 'staged, reversible' },
      { name: 'Docker', note: 'test harnesses & envs' },
      { name: 'Linux servers & Windows automation' },
      { name: 'Small single-purpose PRs' },
    ],
  },
];
