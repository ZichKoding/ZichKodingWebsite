import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface PostMeta {
  slug: string;
  title: string;
  date: string; // ISO YYYY-MM-DD
  excerpt: string;
  category: string;
  published: boolean;
  coverImage?: string;
}

export interface Post extends PostMeta {
  content: string;
}

// Absolute path: dev and build run with different cwds relative to route files,
// but process.cwd() is the project root in both.
const DEFAULT_DIR = path.join(process.cwd(), 'src', 'content', 'blog');

function normalizeDate(value: unknown, file: string): string {
  // gray-matter parses unquoted YAML dates into Date objects.
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === 'string' && value.trim()) return value.trim();
  throw new Error(`Invalid blog frontmatter in ${file}: "date" is required`);
}

function parseFile(dir: string, file: string): Post {
  const raw = fs.readFileSync(path.join(dir, file), 'utf8');
  const { data, content } = matter(raw);

  if (!data.title || typeof data.title !== 'string') {
    throw new Error(`Invalid blog frontmatter in ${file}: "title" is required`);
  }

  return {
    slug: file.replace(/\.mdx$/, ''),
    title: data.title,
    date: normalizeDate(data.date, file),
    excerpt: typeof data.excerpt === 'string' ? data.excerpt : '',
    category: typeof data.category === 'string' ? data.category : 'General',
    published: data.published !== false,
    coverImage: typeof data.coverImage === 'string' ? data.coverImage : undefined,
    content,
  };
}

function readAll(dir: string): Post[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => parseFile(dir, f));
}

export function getAllPosts(dir: string = DEFAULT_DIR): PostMeta[] {
  return readAll(dir)
    .filter((p) => p.published)
    .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug))
    .map(({ content: _content, ...meta }) => meta);
}

export function getPostBySlug(slug: string, dir: string = DEFAULT_DIR): Post | null {
  const file = path.join(dir, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const post = parseFile(dir, `${slug}.mdx`);
  return post.published ? post : null;
}

export function getAllSlugs(dir: string = DEFAULT_DIR): string[] {
  return getAllPosts(dir).map((p) => p.slug);
}
