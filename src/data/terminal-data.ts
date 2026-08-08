import { PROJECTS } from './projects';
import { SKILLS } from './skills';

// Single source of truth for the home terminal + home sections.
// Content policy: every claim here is real. No invented employers, dates,
// percentages, or metrics — where a fact is unknown the copy avoids needing it.

export const TERMINAL_DATA = {
  asciiLogo: `
  ███████╗██╗ ██████╗██╗  ██╗██╗  ██╗ ██████╗ ██████╗ ██████╗ ██╗███╗   ██╗ ██████╗
  ██╔════╝██║██╔════╝██║  ██║██║ ██╔╝██╔════╝██╔═══██╗██╔══██╗██║████╗  ██║██╔════╝
  ███████╗██║██║     ███████║█████╔╝ ██║     ██║   ██║██║  ██║██║██╔██╗ ██║██║  ███╗
  ╚════██║██║██║     ██╔══██║██╔═██╗ ██║     ██║   ██║██║  ██║██║██║╚██╗██║██║   ██║
  ███████║██║╚██████╗██║  ██║██║  ██╗╚██████╗╚██████╔╝██████╔╝██║██║ ╚████║╚██████╔╝
  ╚══════╝╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═════╝ ╚═╝╚═╝  ╚═══╝ ╚═════╝
  `,

  skills: SKILLS,

  // Home terminal + projects section show the first three featured projects;
  // the full list lives on /projects.
  projects: PROJECTS.filter((p) => p.featured)
    .sort((a, b) => a.display_order - b.display_order)
    .slice(0, 3)
    .map((p) => ({
      name: p.title,
      description: p.description,
      tech: p.tech_stack,
      link: p.github_url ?? '/projects',
    })),

  career: [
    {
      company: 'American Recovery Association',
      role: 'IT Lead',
      period: 'Present',
      description:
        'Sole IT owner for a national trade association: maintaining and modernizing a production compliance platform (PHP/Zend), integrating vendor APIs, running staged production data migrations, and coordinating outside contractors.',
    },
    {
      company: 'Independent / Open Source',
      role: 'AI Systems Builder',
      period: 'Ongoing',
      description:
        'Building local-first AI systems — the Senku terminal agent (Rust), the Shenron Android companion (Kotlin), and persistent-memory tooling — while working toward independent software work.',
    },
    {
      company: 'University of Central Florida',
      role: 'Full-Stack Web Development Certificate',
      period: 'Milestone',
      description:
        'Formal full-stack training: JavaScript, React, Node, databases, and the foundations this portfolio is built on.',
    },
    {
      company: 'United States Marine Corps',
      role: 'Service',
      period: 'Earlier',
      description:
        'Where the crawl-walk-run discipline comes from: prove it safe, run it small, then widen. It still governs how I ship production changes today.',
    },
  ],

  about: `╔════════════════════════════════════════════════════════════════╗
║              CHRIS ZICHKO — DEVELOPER PROFILE                  ║
╚════════════════════════════════════════════════════════════════╝

IT Lead & AI-Augmented Software Engineer

I run IT for the American Recovery Association, a national trade
association — maintaining and modernizing a production compliance
platform, integrating vendor APIs, and running staged data migrations
on systems businesses depend on daily.

Outside the day job I build AI systems that run close to the metal:
a Rust terminal agent (Senku), an offline Android AI companion
(Shenron), and the persistent-memory tooling my own AI-assisted
workflow runs on.

U.S. Marine Corps background. UCF-certified full-stack developer.
Space and quantum-physics enthusiast, based in Florida.

✦ UCF Certified Full-Stack Web Developer
✦ U.S. Marine Corps veteran — crawl, walk, run
✦ Production systems owner: PHP/Zend, MySQL, Docker
✦ Local-first AI: Ollama, LiteRT-LM, agent harnesses`,

  contactInfo: `╔════════════════════════════════════════════════════════════════╗
║                    CONTACT INFORMATION                         ║
╚════════════════════════════════════════════════════════════════╝

Email: chriszichkocoding@gmail.com
GitHub: github.com/ZichKoding
LinkedIn: linkedin.com/in/chris-zichko-264b25217/
Location: Florida, USA

📧 Send me a message: visit /contact page
💼 View my LinkedIn profile
🔗 Check out my GitHub repositories`,

  howIWork: {
    principles: [
      {
        title: 'Crawl, walk, run',
        detail:
          'Prove it safe read-only, run it small with the numbers asserted up front, then widen. Marine Corps discipline applied to production changes — additive over destructive, every time.',
      },
      {
        title: 'Test-driven, red-teamed',
        detail:
          'Tests come before implementation, and non-trivial plans get adversarially reviewed before any code gets written.',
      },
      {
        title: 'Verification first',
        detail:
          "Evidence before assertions: check the system's own durable record, not the story about it. A vendor's 200 OK is not proof; a verified state change is.",
      },
      {
        title: 'Small, reviewable changes',
        detail:
          'Single-purpose branches and PRs. If a change is hard to review, it is too big.',
      },
      {
        title: 'AI-augmented, human-accountable',
        detail:
          'AI agents do real work here — backed by persistent memory, tests, and review loops that keep them honest. The accountability stays with me.',
      },
    ],
    strengths: [
      'Range: legacy PHP production systems to Rust, Kotlin, and on-device AI',
      'Process discipline that survives contact with production',
      'End-to-end ownership: design, build, test, ship, operate — solo when needed',
    ],
    growthAreas: [
      'Evaluation rigor — my model and tooling judgments lean anecdotal; I am building the habit of measuring instead',
      'Focus — I run more parallel projects than I should, and I am actively narrowing',
      'Solo blind spots — no team review by default, so I counter with red-team review loops and open-source contributors',
    ],
  },

  // No public resume PDF is published yet. Flip to true once public/resume.pdf
  // exists and the terminal 'resume' command offers the download again.
  resumeAvailable: false,
};

export const COMMANDS = [
  { name: 'help', description: 'Display this help message' },
  { name: 'about', description: 'Learn about Chris' },
  { name: 'how-i-work', description: 'Principles, strengths, and growth areas' },
  { name: 'skills', description: 'View technical skills' },
  { name: 'projects', description: 'Browse featured projects' },
  { name: 'career', description: 'View career timeline' },
  { name: 'contact', description: 'Get contact information' },
  { name: 'resume', description: 'Resume info' },
  { name: 'blog', description: 'View recent blog posts' },
  { name: 'clear', description: 'Clear terminal screen' },
  { name: 'ls', description: 'List available directories' },
  { name: 'cd', description: 'Navigate to a directory' },
];
