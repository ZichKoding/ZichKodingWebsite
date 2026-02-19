export const TERMINAL_DATA = {
  asciiLogo: `
  ███████╗██╗ ██████╗██╗  ██╗██╗  ██╗ ██████╗ ██████╗ ██████╗ ██╗███╗   ██╗ ██████╗
  ██╔════╝██║██╔════╝██║  ██║██║ ██╔╝██╔════╝██╔═══██╗██╔══██╗██║████╗  ██║██╔════╝
  ███████╗██║██║     ███████║█████╔╝ ██║     ██║   ██║██║  ██║██║██╔██╗ ██║██║  ███╗
  ╚════██║██║██║     ██╔══██║██╔═██╗ ██║     ██║   ██║██║  ██║██║██║╚██╗██║██║   ██║
  ███████║██║╚██████╗██║  ██║██║  ██╗╚██████╗╚██████╔╝██████╔╝██║██║ ╚████║╚██████╔╝
  ╚══════╝╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═════╝ ╚═╝╚═╝  ╚═══╝ ╚═════╝
  `,

  skills: {
    Frontend: [
      { name: 'React', proficiency: 95 },
      { name: 'Next.js', proficiency: 95 },
      { name: 'TypeScript', proficiency: 90 },
      { name: 'Tailwind CSS', proficiency: 92 },
      { name: 'JavaScript ES6+', proficiency: 94 },
    ],
    Backend: [
      { name: 'Node.js', proficiency: 93 },
      { name: 'Express', proficiency: 90 },
      { name: 'PostgreSQL', proficiency: 88 },
      { name: 'MongoDB', proficiency: 85 },
      { name: 'RESTful APIs', proficiency: 92 },
    ],
    DevOps: [
      { name: 'Docker', proficiency: 85 },
      { name: 'AWS', proficiency: 80 },
      { name: 'Git & GitHub', proficiency: 95 },
      { name: 'CI/CD', proficiency: 82 },
      { name: 'Linux', proficiency: 88 },
    ],
    Tools: [
      { name: 'Figma', proficiency: 75 },
      { name: 'Webpack', proficiency: 80 },
      { name: 'NPM & Yarn', proficiency: 90 },
      { name: 'VS Code', proficiency: 95 },
      { name: 'Postman', proficiency: 85 },
    ],
    Leadership: [
      { name: 'Team Management', proficiency: 88 },
      { name: 'Mentoring', proficiency: 85 },
      { name: 'Project Planning', proficiency: 87 },
      { name: 'Technical Strategy', proficiency: 86 },
      { name: 'Communication', proficiency: 90 },
    ],
  },

  projects: [
    {
      name: 'ZichKoding Dashboard',
      description: 'Full-stack analytics platform with real-time data visualization',
      tech: ['React', 'Node.js', 'PostgreSQL', 'WebSockets'],
      link: '/projects/zichkoding-dashboard',
    },
    {
      name: 'Quantum State Explorer',
      description: 'Interactive physics simulation showcasing quantum mechanics concepts',
      tech: ['Next.js', 'Three.js', 'TypeScript'],
      link: '/projects/quantum-explorer',
    },
    {
      name: 'Portfolio Platform',
      description: 'Dynamic portfolio builder for developers with terminal interface',
      tech: ['Next.js', 'Tailwind CSS', 'TypeScript'],
      link: '/projects/portfolio-builder',
    },
  ],

  career: [
    {
      company: 'TechCorp Solutions',
      role: 'Lead Developer & Technology Manager',
      period: '2022 - Present',
      description: 'Leading full-stack development team of 5+ developers',
    },
    {
      company: 'Digital Innovations Inc',
      role: 'Senior Full-Stack Developer',
      period: '2020 - 2022',
      description: 'Architected and built scalable web applications',
    },
    {
      company: 'StartUp Labs',
      role: 'Full-Stack Developer',
      period: '2018 - 2020',
      description: 'Developed core platform features from prototype to production',
    },
    {
      company: 'Freelance',
      role: 'Full-Stack Web Developer',
      period: '2017 - 2018',
      description: 'Built custom web solutions for various clients',
    },
  ],

  about: `╔════════════════════════════════════════════════════════════════╗
║                  CHRIS - DEVELOPER PROFILE                    ║
╚════════════════════════════════════════════════════════════════╝

Lead Developer & Technology Manager | UCF Certified Full-Stack Web Developer

Passionate about building scalable, elegant software solutions. Enthusiast of
space exploration, physics, and quantum mechanics. With 6+ years of experience
in full-stack development and technical leadership, I create digital experiences
that are both powerful and beautiful.

When not coding, I'm reading about quantum physics or stargazing.

✦ Certified in full-stack web development from University of Central Florida
✦ 6+ years of professional development experience
✦ Leadership experience managing development teams
✦ Passionate about clean code, performance optimization, and UX design`,

  contactInfo: `╔════════════════════════════════════════════════════════════════╗
║                    CONTACT INFORMATION                         ║
╚════════════════════════════════════════════════════════════════╝

Email: chris.zichko@zichkoding.com
GitHub: github.com/ZichKoding
LinkedIn: linkedin.com/in/chris-zichko-264b25217/
Location: Florida, USA

📧 Send me a message: visit /contact page
💼 View my LinkedIn profile
🔗 Check out my GitHub repositories`,

  blogPosts: [
    { title: 'Building Scalable Web Applications with Next.js', date: 'Jan 15, 2024', slug: 'nextjs-scalability' },
    { title: 'Understanding Quantum Computing Basics', date: 'Jan 8, 2024', slug: 'quantum-basics' },
    { title: 'Terminal UIs with React - A Modern Approach', date: 'Dec 30, 2023', slug: 'terminal-ui-react' },
  ],
};

export const COMMANDS = [
  { name: 'help', description: 'Display this help message' },
  { name: 'about', description: 'Learn about Chris' },
  { name: 'skills', description: 'View technical skills with proficiency levels' },
  { name: 'projects', description: 'Browse featured projects' },
  { name: 'career', description: 'View career timeline' },
  { name: 'contact', description: 'Get contact information' },
  { name: 'resume', description: 'Download resume' },
  { name: 'blog', description: 'View recent blog posts' },
  { name: 'clear', description: 'Clear terminal screen' },
  { name: 'ls', description: 'List available directories' },
  { name: 'cd', description: 'Navigate to a directory' },
];
