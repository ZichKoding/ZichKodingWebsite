-- Supabase Portfolio Database Seed Data
-- Sample data for development and testing
-- Version: 1.0
-- Created: 2026-02-18

-- ============================================================================
-- 1. SEED CATEGORIES
-- ============================================================================

INSERT INTO categories (id, name, slug, description, created_at)
VALUES
    (
        'a7d1c9e2-4f5a-4b2e-9c3d-1b5e8f2a9c7d',
        'Web Development',
        'web-development',
        'Articles about frontend and full-stack web development',
        now()
    ),
    (
        'b8e2d0f3-5g6b-5c3f-0d4e-2c6f9g3b0d8e',
        'DevOps & Infrastructure',
        'devops-infrastructure',
        'Guides on deployment, containerization, and cloud infrastructure',
        now()
    ),
    (
        'c9f3e1g4-6h7c-6d4g-1e5f-3d7g0h4c1e9f',
        'Career & Leadership',
        'career-leadership',
        'Insights on career growth, team leadership, and professional development',
        now()
    ),
    (
        'd0g4f2h5-7i8d-7e5h-2f6g-4e8h1i5d2f0g',
        'Tutorials',
        'tutorials',
        'Step-by-step tutorials and how-to guides',
        now()
    );


-- ============================================================================
-- 2. SEED SKILLS
-- ============================================================================

INSERT INTO skills (id, name, category, proficiency, icon, display_order, created_at)
VALUES
    -- Frontend Skills
    (
        'e1h5g3i6-8j9e-8f6i-3g7h-5f9i2j6e3g1h',
        'React',
        'frontend',
        95,
        'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
        1,
        now()
    ),
    (
        'f2i6h4j7-9k0f-9g7j-4h8i-6g0j3k7f4h2i',
        'TypeScript',
        'frontend',
        90,
        'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg',
        2,
        now()
    ),
    (
        'g3j7i5k8-0l1g-0h8k-5i9j-7h1k4l8g5i3j',
        'Tailwind CSS',
        'frontend',
        88,
        'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg',
        3,
        now()
    ),
    -- Backend Skills
    (
        'h4k8j6l9-1m2h-1i9l-6j0k-8i2l5m9h6j4k',
        'Node.js',
        'backend',
        92,
        'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg',
        1,
        now()
    ),
    (
        'i5l9k7m0-2n3i-2j0m-7k1l-9j3m6n0i7k5l',
        'PostgreSQL',
        'backend',
        85,
        'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg',
        2,
        now()
    ),
    -- DevOps Skills
    (
        'j6m0l8n1-3o4j-3k1n-8l2m-0k4n7o1j8l6m',
        'Docker',
        'devops',
        80,
        'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg',
        1,
        now()
    ),
    -- Tools
    (
        'k7n1m9o2-4p5k-4l2o-9m3n-1l5o8p2k9m7n',
        'Git',
        'tools',
        95,
        'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg',
        1,
        now()
    ),
    -- Leadership
    (
        'l8o2n0p3-5q6l-5m3p-0n4o-2m6p9q3l0n8o',
        'Team Leadership',
        'leadership',
        82,
        NULL,
        1,
        now()
    );


-- ============================================================================
-- 3. SEED PROJECTS
-- ============================================================================

INSERT INTO projects (
    id,
    title,
    slug,
    description,
    content,
    tech_stack,
    live_url,
    github_url,
    image_url,
    featured,
    display_order,
    created_at,
    updated_at
)
VALUES
    (
        'm9p3o1q4-6r7m-6n4q-1o5p-3n7q0r4m1o9p',
        'Portfolio Website',
        'portfolio-website',
        'A modern portfolio website built with Next.js, React, and TypeScript showcasing projects and blog posts.',
        '{"description": "Full-stack portfolio website", "features": ["Blog system", "Project showcase", "Contact form", "Dark mode support"], "duration": "2 weeks"}'::jsonb,
        ARRAY['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'PostgreSQL'],
        'https://example.com',
        'https://github.com/example/portfolio',
        'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=500&h=300&fit=crop',
        TRUE,
        1,
        now(),
        now()
    );


-- ============================================================================
-- 4. VERIFY DATA INSERTION
-- ============================================================================

-- Optional: Display confirmation of inserted data
-- SELECT 'Categories inserted: ' || COUNT(*) FROM categories;
-- SELECT 'Skills inserted: ' || COUNT(*) FROM skills;
-- SELECT 'Projects inserted: ' || COUNT(*) FROM projects;


-- ============================================================================
-- End of seed data
-- ============================================================================
