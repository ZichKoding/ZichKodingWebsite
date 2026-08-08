// Real skill inventory. Deliberately no proficiency percentages — the previous
// numbers were invented, and a named project or production context says more
// than a made-up bar chart ever could.

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
      { name: 'TypeScript / React / Next.js', note: 'this site + app work' },
      { name: 'Rust', note: 'Senku agent harness' },
      { name: 'Kotlin / Android', note: 'Shenron companion app' },
      { name: 'Python', note: 'CLI tooling' },
      { name: 'SQL (MySQL / Postgres)', note: 'production migrations' },
    ],
  },
  {
    category: 'AI Engineering',
    items: [
      { name: 'Local LLMs', note: 'Ollama, Gemma, LiteRT-LM' },
      { name: 'Agent harnesses & tool-calling' },
      { name: 'Claude Code & agentic workflows' },
      { name: 'Persistent memory systems', note: 'SQLite + FTS' },
      { name: 'Local TTS pipelines' },
    ],
  },
  {
    category: 'Platform & Ops',
    items: [
      { name: 'Docker', note: 'test harnesses & envs' },
      { name: 'Linux servers & SSH tooling' },
      { name: 'Windows automation', note: 'pywin32, PowerShell' },
      { name: 'Git — GitHub & Bitbucket' },
      { name: 'Vercel / static deploys' },
    ],
  },
  {
    category: 'Practices',
    items: [
      { name: 'Test-driven development', note: 'PHPUnit, Vitest' },
      { name: 'Red-team plan review' },
      { name: 'Crawl-walk-run rollouts', note: 'staged, reversible' },
      { name: 'Verification-first debugging' },
      { name: 'Small single-purpose PRs' },
    ],
  },
];
