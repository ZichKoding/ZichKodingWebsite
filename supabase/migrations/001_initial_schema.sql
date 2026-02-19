-- Supabase Portfolio Database Schema
-- Initial migration file for portfolio website database
-- Version: 1.0
-- Created: 2026-02-18

-- ============================================================================
-- 1. ENABLE EXTENSIONS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ============================================================================
-- 2. PROFILES TABLE
-- ============================================================================
-- Stores user profile information linked to auth.users
-- Each auth.users record can have exactly one profile

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    bio TEXT,
    avatar_url TEXT,
    title TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE profiles IS 'User profile information linked to Supabase auth users';
COMMENT ON COLUMN profiles.title IS 'Job title (e.g., Lead Developer, Full Stack Engineer)';


-- ============================================================================
-- 3. CATEGORIES TABLE
-- ============================================================================
-- Taxonomies for organizing blog posts (e.g., Web Development, DevOps, Tutorials)

CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE categories IS 'Blog post categories for organizing content';


-- ============================================================================
-- 4. POSTS TABLE
-- ============================================================================
-- Blog posts with rich content stored as JSONB (Tiptap editor format)

CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content JSONB,
    excerpt TEXT,
    cover_image_url TEXT,
    published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMPTZ,
    author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE posts IS 'Blog posts with rich JSONB content support';
COMMENT ON COLUMN posts.content IS 'Tiptap editor content in JSON format';


-- ============================================================================
-- 5. POST_CATEGORIES JUNCTION TABLE
-- ============================================================================
-- Many-to-many relationship between posts and categories

CREATE TABLE IF NOT EXISTS post_categories (
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, category_id)
);

COMMENT ON TABLE post_categories IS 'Junction table for many-to-many post-category relationships';


-- ============================================================================
-- 6. PROJECTS TABLE
-- ============================================================================
-- Portfolio projects with tech stack, live links, and GitHub URLs

CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    content JSONB,
    tech_stack TEXT[] DEFAULT '{}',
    live_url TEXT,
    github_url TEXT,
    image_url TEXT,
    featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE projects IS 'Portfolio projects with rich metadata and tech stack';
COMMENT ON COLUMN projects.content IS 'Project details in JSON format';
COMMENT ON COLUMN projects.tech_stack IS 'Array of technologies used in the project';


-- ============================================================================
-- 7. CONTACT_MESSAGES TABLE
-- ============================================================================
-- Contact form submissions with status tracking for admin

CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
    admin_notes TEXT,
    replied_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE contact_messages IS 'Contact form submissions with admin status tracking';
COMMENT ON COLUMN contact_messages.status IS 'Workflow status: new, read, replied, archived';


-- ============================================================================
-- 8. SKILLS TABLE
-- ============================================================================
-- Skills and expertise with categorization and proficiency levels

CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    proficiency INTEGER DEFAULT 50 CHECK (proficiency BETWEEN 1 AND 100),
    icon TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE skills IS 'Skills and expertise with proficiency levels';
COMMENT ON COLUMN skills.category IS 'Skill category (frontend, backend, devops, tools, leadership)';
COMMENT ON COLUMN skills.proficiency IS 'Proficiency level 1-100';
COMMENT ON COLUMN skills.icon IS 'Icon URL or icon library reference';


-- ============================================================================
-- 9. INDEXES FOR PERFORMANCE
-- ============================================================================

-- Posts indexes
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published, published_at DESC)
    WHERE published = TRUE;
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);

-- Categories indexes
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Projects indexes
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_featured_order ON projects(featured, display_order)
    WHERE featured = TRUE;

-- Contact messages indexes
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages(email);

-- Skills indexes
CREATE INDEX IF NOT EXISTS idx_skills_category_order ON skills(category, display_order);


-- ============================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
-- Anyone can view profiles
CREATE POLICY "Profiles are publicly readable"
    ON profiles FOR SELECT
    USING (TRUE);

-- Users can only update their own profile
CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- CATEGORIES policies
-- Anyone can read categories
CREATE POLICY "Categories are publicly readable"
    ON categories FOR SELECT
    USING (TRUE);

-- Authenticated users can create categories
CREATE POLICY "Authenticated users can create categories"
    ON categories FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can update categories
CREATE POLICY "Authenticated users can update categories"
    ON categories FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Authenticated users can delete categories
CREATE POLICY "Authenticated users can delete categories"
    ON categories FOR DELETE
    USING (auth.role() = 'authenticated');

-- POSTS policies
-- Anyone can view published posts
CREATE POLICY "Published posts are publicly readable"
    ON posts FOR SELECT
    USING (published = TRUE OR auth.role() = 'authenticated');

-- Authenticated users can create posts
CREATE POLICY "Authenticated users can create posts"
    ON posts FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can update posts
CREATE POLICY "Authenticated users can update posts"
    ON posts FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Authenticated users can delete posts
CREATE POLICY "Authenticated users can delete posts"
    ON posts FOR DELETE
    USING (auth.role() = 'authenticated');

-- POST_CATEGORIES policies
-- Anyone can view post categories
CREATE POLICY "Post categories are publicly readable"
    ON post_categories FOR SELECT
    USING (TRUE);

-- Authenticated users can manage post categories
CREATE POLICY "Authenticated users can insert post categories"
    ON post_categories FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete post categories"
    ON post_categories FOR DELETE
    USING (auth.role() = 'authenticated');

-- PROJECTS policies
-- Anyone can view projects
CREATE POLICY "Projects are publicly readable"
    ON projects FOR SELECT
    USING (TRUE);

-- Authenticated users can create projects
CREATE POLICY "Authenticated users can create projects"
    ON projects FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can update projects
CREATE POLICY "Authenticated users can update projects"
    ON projects FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Authenticated users can delete projects
CREATE POLICY "Authenticated users can delete projects"
    ON projects FOR DELETE
    USING (auth.role() = 'authenticated');

-- CONTACT_MESSAGES policies
-- Anyone can submit contact messages
CREATE POLICY "Anyone can create contact messages"
    ON contact_messages FOR INSERT
    WITH CHECK (TRUE);

-- Only authenticated users can view contact messages
CREATE POLICY "Authenticated users can view contact messages"
    ON contact_messages FOR SELECT
    USING (auth.role() = 'authenticated');

-- Authenticated users can update contact messages
CREATE POLICY "Authenticated users can update contact messages"
    ON contact_messages FOR UPDATE
    USING (auth.role() = 'authenticated');

-- SKILLS policies
-- Anyone can view skills
CREATE POLICY "Skills are publicly readable"
    ON skills FOR SELECT
    USING (TRUE);

-- Authenticated users can create skills
CREATE POLICY "Authenticated users can create skills"
    ON skills FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can update skills
CREATE POLICY "Authenticated users can update skills"
    ON skills FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Authenticated users can delete skills
CREATE POLICY "Authenticated users can delete skills"
    ON skills FOR DELETE
    USING (auth.role() = 'authenticated');


-- ============================================================================
-- 11. TRIGGER FUNCTIONS FOR AUTOMATIC TIMESTAMPS
-- ============================================================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles updated_at
CREATE TRIGGER profiles_updated_at_trigger
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for posts updated_at
CREATE TRIGGER posts_updated_at_trigger
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for projects updated_at
CREATE TRIGGER projects_updated_at_trigger
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for contact_messages updated_at
CREATE TRIGGER contact_messages_updated_at_trigger
    BEFORE UPDATE ON contact_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


-- ============================================================================
-- 12. TRIGGER FUNCTION FOR NEW USER SIGNUP
-- ============================================================================

-- Function to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, full_name, created_at, updated_at)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', now(), now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();


-- ============================================================================
-- 13. GRANTS FOR ANONYMOUS AND AUTHENTICATED USERS
-- ============================================================================

-- Grant select on all public tables to anonymous users
GRANT SELECT ON profiles TO anon;
GRANT SELECT ON categories TO anon;
GRANT SELECT ON posts TO anon;
GRANT SELECT ON post_categories TO anon;
GRANT SELECT ON projects TO anon;
GRANT SELECT ON skills TO anon;

-- Grant all on contact_messages to anon (for form submission)
GRANT INSERT ON contact_messages TO anon;

-- Grant all permissions to authenticated users
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;


-- ============================================================================
-- End of initial schema migration
-- ============================================================================
