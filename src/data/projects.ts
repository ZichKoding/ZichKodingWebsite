// Real projects. Shape mirrors the ProjectCard props (formerly the Supabase
// `projects` table row) so the /projects page renders unchanged.
//
// Claim rules (2026-11-02):
// - Gemma 4 E4B is the local model.
// - Alam is the public name of the Android app. The repo name stays off this page.
// - ZichKode sequential agents, and knowledge-base images and audio, are untested.
// - A 16k window is the constraint. The harness around it is the result.
// - No headcount claim about ARA.

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
    title: 'ARA Compliance Platform',
    description:
      'Production compliance platform for the recovery industry\'s largest professional association. I own the platform, repo.org, and the Google Workspace, Zoho CRM, and Zoho Projects tools around it. Login went from tens of minutes to a couple of seconds. A standardized deployment process made releases much faster. Client integrations made more of the work real-time. Vendor integrations took on operations that used to be manual. Reporting and auditing got stronger.',
    tech_stack: ['PHP', 'Zend Framework', 'MySQL', 'Zoho', 'Docker'],
    featured: true,
    display_order: 0,
  },
  {
    title: 'ZichKode',
    description:
      'Python harness and GUI, written as a text thread beside the editor. It researches a codebase, helps with the coding, and creates custom skills and tools. A local decision model sits next to Gemma 4 E4B. Sequential agents, and images and audio in the knowledge base, are in progress.',
    tech_stack: ['Python', 'Ollama', 'Gemma 4 E4B', 'pywebview'],
    featured: true,
    display_order: 1,
  },
  {
    title: 'Alam',
    description:
      'Personal agentic Android app I actually use. A text thread on the phone, driven by Gemma 4 E4B.',
    tech_stack: ['Kotlin', 'Android', 'Gemma 4 E4B', 'LiteRT-LM'],
    featured: true,
    display_order: 2,
  },
  {
    title: 'Senku',
    description:
      'Rust harness for local work on Gemma 4 E4B through Ollama. The plan, the skills, and the retrieved context sit outside the prompt, so a 16k window can carry a long task. In active development.',
    tech_stack: ['Rust', 'Ollama', 'Gemma 4 E4B', 'CLI'],
    github_url: 'https://github.com/ZichKoding/senku',
    featured: true,
    display_order: 3,
  },
  {
    title: 'GUPPI',
    description:
      'Desktop harness aimed at long tasks on a 16k Gemma 4 E4B window. Skills and state stay outside the prompt. A smaller decision model picks the next step so those catalogs never enter the window.',
    tech_stack: ['Python', 'Ollama', 'Gemma 4 E4B'],
    featured: true,
    display_order: 4,
  },
  {
    title: 'CRAM',
    description:
      'Retrieval memory for assistants. SQLite full-text search pulls the note that matters, so a small model does not have to hold the whole history in its window.',
    tech_stack: ['Python', 'SQLite', 'FTS5'],
    featured: true,
    display_order: 5,
  },
  {
    title: 'claude-memory-engine',
    description:
      'Persistent long-term memory for AI coding agents: a Python CLI over SQLite full-text search with cross-machine merge, powering recall across sessions and projects.',
    tech_stack: ['Python', 'SQLite', 'FTS5'],
    github_url: 'https://github.com/ZichKoding/claude-memory-engine',
    featured: true,
    display_order: 6,
  },
  {
    title: 'Uno Q Droid',
    description:
      'Localized droid AI on an Arduino Uno Q. A small model stays on the board and drives the hardware.',
    tech_stack: ['Arduino Uno Q', 'Python', 'Ollama'],
    featured: true,
    display_order: 7,
  },
  {
    title: 'Agent Tooling Suite',
    description:
      'The small tools that make an AI-augmented workflow real: an occlusion-proof Windows screenshot CLI, SSH relay tooling for reaching gated servers, and a local TTS pipeline that speaks agent replies aloud.',
    tech_stack: ['Python', 'PowerShell', 'Windows API'],
    featured: false,
    display_order: 8,
  },
  {
    title: 'Emotiv prototype',
    description:
      'A telekinesis experiment from years ago, using an Emotiv EEG headset gifted by Ignite Labs while I was at Frontline. Set down. Not an active build.',
    tech_stack: ['Emotiv EEG'],
    featured: false,
    display_order: 9,
  },
  {
    title: 'ZichKoding.com',
    description:
      'This site. A static Next.js portfolio with the ZichKoding mark, an MDX blog, and a serverless contact form.',
    tech_stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'MDX'],
    github_url: 'https://github.com/ZichKoding/ZichKodingWebsite',
    featured: false,
    display_order: 10,
  },
];
