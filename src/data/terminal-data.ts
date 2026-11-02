import { PROJECTS } from './projects';
import { SKILLS } from './skills';

const ABOUT_TAGLINE = 'Software, AI engineering, and edge models';

// Real prose paragraphs. The About section renders these directly; the
// terminal `about` command wraps them in its box format below.
const ABOUT_PARAGRAPHS = [
  "I'm the Lead Developer & Technology Manager at the American Recovery Association, the recovery industry's largest professional association. I own the production compliance platform, repo.org, and the tools the association runs on: Google Workspace, Zoho CRM, and Zoho Projects. Claude assists the development and the internal work through skills and tools I write.",
  'ZichKoding is my consultancy, since 2021. I build traditional software, and I build AI that runs close to the machine. Gemma 4 E4B is the local model. Alam is the Android app. ZichKode is the Python harness beside the editor. Senku, GUPPI, and CRAM keep the plan, the skills, and the memory outside the prompt, so a 16k window can carry a long task.',
  'Before software: U.S. Marine Corps NCO and Combat Engineer, then plant operations at Cape Canaveral Space Force Station. UCF-certified full-stack developer, based in Florida.',
];

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
      role: 'Lead Developer & Technology Manager',
      period: 'Jul 2024 – Present',
      description:
        'I own the production compliance platform (PHP/Zend), repo.org, and the association\'s Google Workspace, Zoho CRM, and Zoho Projects. Login went from tens of minutes to a couple of seconds. A standardized deployment process made releases much faster. Client integrations made more of the work real-time. Vendor integrations took on operations that used to be manual. Reporting and auditing got stronger. Claude assists the development and the internal work through skills and tools I write.',
    },
    {
      company: 'Melken Solutions',
      role: 'Logistics Technician / Software Engineer',
      period: 'Dec 2023 – Jul 2024',
      description:
        'Logistics for concurrent electronics projects — disassembly/assembly, inventory control, technical documentation — plus maintenance and project management of custom-built software.',
    },
    {
      company: 'Frontline Insurance / OpenHouse',
      role: 'Full Stack Cloud Developer',
      period: 'May 2022 – Nov 2023',
      description:
        'Zoho CRM data analysis and integration, Talkdesk integration, ETL pipelines, and kicking off a WordPress-to-Next.js migration for sales and marketing.',
    },
    {
      company: 'University of Central Florida',
      role: 'Full-Stack Web Development Certificate',
      period: 'Aug 2021 – Feb 2022',
      description:
        'Formal full-stack training: JavaScript, React, Node, databases, and the foundations this site is built on.',
    },
    {
      company: 'Edpresso | Educative',
      role: 'Technical Writer',
      period: 'May 2021 – May 2022',
      description:
        "Interactive technical documentation for Python modules — recognized as a top contributor and featured on the platform's podcast.",
    },
    {
      company: 'ZichKoding',
      role: 'Founder / Software Engineer',
      period: 'Feb 2021 – Present',
      description:
        'My own consultancy: websites, progressive web apps, custom electronics and software for R&D projects, plus consulting and tutoring.',
    },
    {
      company: 'FreeCodeCamp',
      role: 'Scientific Computing with Python Certificate',
      period: 'Aug 2020 – Feb 2021',
      description: 'First formal programming credential.',
    },
    {
      company: 'NRT Methodologies — Cape Canaveral SFS',
      role: 'Lead Plant Operator',
      period: 'Oct 2019 – Apr 2022',
      description:
        'Ran chemical synthesis skids with SCADA systems at Cape Canaveral Space Force Station, including a stretch as temporary site manager.',
    },
    {
      company: 'United States Marine Corps',
      role: 'NCO / Squad Leader / Combat Engineer',
      period: 'Jan 2015 – Jan 2021',
      description:
        'Led and trained Marines in combat engineering — design, construction, maintenance, and demolition. Where the crawl-walk-run discipline that still governs how I ship production changes comes from.',
    },
  ],

  aboutTagline: ABOUT_TAGLINE,
  aboutParagraphs: ABOUT_PARAGRAPHS,

  about: `╔════════════════════════════════════════════════════════════════╗
║              CHRIS ZICHKO — DEVELOPER PROFILE                  ║
╚════════════════════════════════════════════════════════════════╝

${ABOUT_TAGLINE}

${ABOUT_PARAGRAPHS.join('\n\n')}

✦ Lead Developer & Technology Manager @ ARA
✦ U.S. Marine Corps veteran — NCO, Combat Engineer
✦ Freelance & consulting via ZichKoding since 2021
✦ UCF Certified Full-Stack Web Developer`,

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
          'Claude assists the work through skills and tools I write. Tests and review loops keep that work honest. The accountability stays with me.',
      },
    ],
    strengths: [
      'Range: production PHP, the web stack, and small open models on the device',
      'Process discipline that survives contact with production',
      'End-to-end ownership: design, build, test, ship, and operate',
    ],
    growthAreas: [
      'Evaluation rigor. My model and tooling judgments lean anecdotal, and I am building the habit of measuring instead',
      'Focus. I run more parallel projects than I should, and I am actively narrowing',
      'Outside review. I build a red-team pass into the plan, because the person who wrote the change is a poor witness to it',
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
