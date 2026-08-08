// Real projects. Shape mirrors the ProjectCard props (formerly the Supabase
// `projects` table row) so the /projects page renders unchanged.

export interface StaticProject {
  title: string;
  description: string;
  tech_stack: string[];
  github_url?: string;
  live_url?: string;
  image_url?: string;
  featured: boolean;
  display_order: number;
}

export const PROJECTS: StaticProject[] = [
  {
    title: 'Senku',
    description:
      'Terminal AI agent harness written in Rust. Runs local models through Ollama alongside cloud models, with slash commands and session context management. Open source, with external contributors landing PRs.',
    tech_stack: ['Rust', 'Ollama', 'LLM tool-calling', 'CLI'],
    github_url: 'https://github.com/ZichKoding/senku',
    featured: true,
    display_order: 0,
  },
  {
    title: 'Shenron',
    description:
      'Offline-first Android AI companion running Gemma fully on-device via LiteRT-LM — no network required, private by construction. In active development.',
    tech_stack: ['Kotlin', 'Android', 'LiteRT-LM', 'Gemma'],
    featured: true,
    display_order: 1,
  },
  {
    title: 'ARA Compliance Platform',
    description:
      'Professional work: maintaining and modernizing a production compliance platform for a national trade association — vendor background-check API integrations, staged production data migrations, and a Dockerized PHPUnit harness that brought TDD to a legacy PHP codebase.',
    tech_stack: ['PHP', 'Zend Framework', 'MySQL', 'Docker'],
    featured: true,
    display_order: 2,
  },
  {
    title: 'claude-memory-engine',
    description:
      'Persistent long-term memory for AI coding agents: a Python CLI over SQLite full-text search with cross-machine merge, powering recall across sessions and projects.',
    tech_stack: ['Python', 'SQLite', 'FTS5'],
    github_url: 'https://github.com/ZichKoding/claude-memory-engine',
    featured: true,
    display_order: 3,
  },
  {
    title: 'Agent Tooling Suite',
    description:
      'The small tools that make an AI-augmented workflow real: an occlusion-proof Windows screenshot CLI, SSH relay tooling for reaching gated servers, and a local TTS pipeline that speaks agent replies aloud.',
    tech_stack: ['Python', 'PowerShell', 'Windows API'],
    featured: false,
    display_order: 4,
  },
  {
    title: 'ZichKoding.com',
    description:
      'This site — a fully static Next.js portfolio with an interactive space-terminal home, MDX blog, and serverless contact form.',
    tech_stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'MDX'],
    github_url: 'https://github.com/ZichKoding/ZichKodingWebsite',
    featured: false,
    display_order: 5,
  },
];
