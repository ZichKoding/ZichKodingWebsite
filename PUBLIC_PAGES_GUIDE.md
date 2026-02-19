# Public Pages Build Guide

## Overview
This document outlines all the public-facing pages and components built for the Next.js portfolio. The build follows a mobile-first, dark-themed design with Tailwind CSS, featuring a starfield-inspired background and glassmorphic elements.

## File Structure

### Pages (Server Components)

#### 1. `src/app/(public)/page.tsx` (113 lines)
- **Home Page**: Hero section with introduction, CTAs, and featured sections
- Links to blog and projects
- Social media links
- Clean, welcoming design showcasing portfolio highlights

#### 2. `src/app/(public)/layout.tsx` (32 lines)
- **Public Layout Wrapper**: Provides consistent layout for all public pages
- Includes Navbar and Footer components
- Starfield background effect
- Dark theme (slate-950 background)
- Metadata for SEO

#### 3. `src/app/(public)/blog/page.tsx` (212 lines)
- **Blog Listing Page**: Server-rendered blog posts with filtering
- Features:
  - Search bar with URL param support (?q=)
  - Category filter pills with URL params (?category=)
  - Sort toggle (newest/oldest via ?sort=)
  - Grid layout (2 columns desktop, 1 mobile)
  - Pagination support (6 posts per page)
  - Empty states with helpful messages
- Fetches from Supabase with proper filtering logic
- Categories loaded for filter pills

#### 4. `src/app/(public)/blog/[slug]/page.tsx` (166 lines)
- **Individual Blog Post**: Server-rendered post detail page
- Features:
  - Fetch post by slug from Supabase
  - Check published status
  - Display title, author, date, categories
  - Render Tiptap JSON content
  - Show cover image
  - Category links back to filtered list
  - Back navigation
- Includes metadata generation for SEO

#### 5. `src/app/(public)/projects/page.tsx` (91 lines)
- **Projects Showcase**: Displays all projects from Supabase
- Features:
  - Featured projects section (larger cards)
  - Regular projects grid below
  - Order by display_order field
  - Empty state handling
  - Each project shows: image, title, description, tech stack, links

#### 6. `src/app/(public)/contact/page.tsx` (89 lines)
- **Contact Page**: Clean contact form with info section
- Features:
  - Contact form (left side)
  - Contact information sidebar (right side)
  - Email, GitHub, LinkedIn links
  - Response time expectation message
  - Responsive two-column layout

### Components

#### Client Components (use client)

##### 1. `src/components/public/Navbar.tsx` (93 lines)
- **Responsive Navigation Bar**
- Features:
  - Logo: "Chris | ZichKoding" with gradient
  - Navigation links: Home, Blog, Projects, Contact
  - Active link indicator (underline)
  - Mobile hamburger menu
  - Glassmorphic style (backdrop-blur, semi-transparent)
  - Sticky positioning

##### 2. `src/components/public/SearchBar.tsx` (48 lines)
- **Search Input with Debounce**
- Features:
  - Debounced search (500ms)
  - Updates URL search params (?q=)
  - Search icon (Lucide)
  - Resets pagination to page 1
  - Client-side state management

##### 3. `src/components/public/CategoryFilter.tsx` (80 lines)
- **Category Filter Pills**
- Features:
  - Horizontal scrollable category chips
  - "All" button to clear filter
  - Active state highlighting
  - URL param support (?category=)
  - Clear button appears when active
  - Resets to page 1 on filter change

##### 4. `src/components/public/Pagination.tsx` (112 lines)
- **Pagination Controls**
- Features:
  - Previous/Next buttons
  - Page number buttons
  - Ellipsis for gaps
  - Current page highlighted
  - URL params for bookmarkable links
  - Disabled state for edge pages

##### 5. `src/components/public/ContactForm.tsx` (209 lines)
- **Contact Form Component**
- Features:
  - Client-side form state
  - Real-time validation using Zod schema
  - Field-level error messages
  - Success/error notifications
  - Loading state on submit
  - Submits to POST /api/contact
  - Form resets on success
  - Auto-hide success message after 5 seconds

#### Server Components (default)

##### 1. `src/components/public/Footer.tsx` (47 lines)
- **Footer Section**
- Features:
  - Social links (GitHub, LinkedIn, Email)
  - Copyright notice with current year
  - Dark theme styling

##### 2. `src/components/public/BlogCard.tsx` (98 lines)
- **Blog Post Card**
- Props: title, slug, excerpt, cover_image_url, published_at, categories
- Features:
  - Cover image or gradient placeholder
  - Title, excerpt (truncated)
  - Date with Calendar icon
  - Category badges
  - Hover effects
  - Link to full post

##### 3. `src/components/public/ProjectCard.tsx` (103 lines)
- **Project Card Component**
- Props: title, description, tech_stack, image_url, live_url, github_url, featured
- Features:
  - Image or gradient placeholder
  - Title and description
  - Tech stack badges (colored)
  - External links (Live, Code)
  - Featured card styling option
  - Hover animations

##### 4. `src/components/public/TiptapRenderer.tsx` (73 lines)
- **Tiptap Content Renderer**
- Features:
  - Uses Tiptap React editor in read-only mode
  - Supports: StarterKit, Image, Link, YouTube extensions
  - Responsive YouTube embeds
  - Custom prose styling for dark theme
  - Error handling
  - Syntax highlighting ready

### Utilities

#### `src/lib/utils.ts` (61 lines)
- **Utility Functions**
- Exports:
  - `cn(...classes)`: Merge CSS classes
  - `formatDate(dateString)`: Format dates (e.g., "Jan 15, 2026")
  - `truncate(text, length)`: Truncate text with ellipsis
  - `generateGradient(seed)`: Deterministic gradient from string for placeholders

## Design System

### Color Scheme (Dark Theme)
- **Primary Background**: slate-950
- **Secondary Background**: slate-800/50 (with transparency)
- **Text**: gray-100, gray-200, gray-300, gray-400
- **Accent Colors**: blue-400, blue-500, purple-400, purple-500
- **Borders**: slate-700/50

### Typography
- **Headings**: Bold, various sizes (h1: 4xl-7xl, h2: 2xl, h3: xl)
- **Body**: 16px with line-height 1.5-1.75
- **Small Text**: 14px (meta information)

### Components Style
- Rounded corners: lg (rounded-lg)
- Borders: 1px solid with slate-700/50
- Transitions: 200-300ms for smooth effects
- Hover States: Border color to blue-500/50, text to blue-400

### Responsive Breakpoints
- Mobile-first approach
- Tailwind defaults: sm (640px), md (768px), lg (1024px)
- Blog: 1 col mobile, 2 col tablet+
- Projects: 1 col mobile, 2 col tablet, 3 col desktop
- Contact: 1 col mobile, 2 col desktop

## Database Queries

### Blog Page
- Fetches all published posts
- Joins with categories via post_categories table
- Filters by search query (title/excerpt)
- Filters by category slug
- Orders by published_at (newest/oldest)
- Pagination: 6 posts per page

### Blog Post Page
- Fetches single post by slug (published only)
- Joins with author profile
- Joins with categories
- Returns Tiptap JSON content

### Projects Page
- Fetches all projects
- Orders by display_order
- Separates featured vs regular projects

### Categories (for Blog filters)
- Fetches all categories
- Orders by name

## Features Implemented

✓ Responsive design (mobile-first)
✓ Dark theme with starfield background
✓ Glassmorphic navigation
✓ Search with URL params and debounce
✓ Category filtering with chips
✓ Pagination with bookmarkable URLs
✓ Blog post rendering with Tiptap
✓ Contact form with validation
✓ Success/error states
✓ Accessibility (aria labels, semantic HTML)
✓ Smooth transitions and hover effects
✓ Gradient placeholders for missing images
✓ Date formatting
✓ Server-side rendering where possible
✓ TypeScript throughout
✓ Tailwind CSS only (no CSS modules)

## Usage Notes

### Adding Blog Posts
1. Create post in Supabase admin
2. Set `published = true`
3. Add categories via post_categories table
4. Automatically appears on blog page

### Adding Projects
1. Create project in Supabase admin
2. Set `display_order` for sorting
3. Set `featured = true` for featured section
4. Automatically appears on projects page

### Customizing Links
- Update Navbar.tsx for navigation links
- Update Footer.tsx for social links
- Update Contact.tsx for email/social links
- Email links use placeholder (hello@example.com)
- GitHub/LinkedIn use placeholder URLs

### Customizing Theme
- Colors defined in Tailwind classes throughout
- Main colors: blue-500, purple-500
- Background: slate-950
- Easy to find and replace with search

## Building & Deployment

### Development
```bash
npm run dev
```
Runs on http://localhost:3000

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
- Requires Supabase credentials (from .env.local)
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

## Notes

- All pages use Server Components by default
- Only interactive elements use 'use client'
- Search/filter state kept in URL params (bookmarkable)
- Metadata automatically generated for SEO
- Empty states provide helpful guidance
- Form validation matches Zod schemas
- Contact form submits to existing /api/contact endpoint
