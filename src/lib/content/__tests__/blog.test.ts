import { describe, it, expect } from 'vitest';
import path from 'path';
import { getAllPosts, getPostBySlug, getAllSlugs } from '../blog';

const FIXTURES = path.join(__dirname, 'fixtures', 'blog');
const BAD_FIXTURES = path.join(__dirname, 'fixtures', 'bad');
const MISSING_DIR = path.join(__dirname, 'fixtures', 'does-not-exist');

describe('getAllPosts', () => {
  it('returns published posts sorted newest-first', () => {
    const posts = getAllPosts(FIXTURES);
    expect(posts.map((p) => p.slug)).toEqual(['second-post', 'first-post']);
  });

  it('excludes drafts (published: false)', () => {
    const posts = getAllPosts(FIXTURES);
    expect(posts.find((p) => p.slug === 'draft-post')).toBeUndefined();
  });

  it('parses frontmatter fields', () => {
    const post = getAllPosts(FIXTURES).find((p) => p.slug === 'second-post');
    expect(post).toMatchObject({
      title: 'Second Post',
      date: '2026-03-10',
      excerpt: 'The newer fixture post.',
      category: 'ai',
      coverImage: '/images/second.png',
      published: true,
    });
  });

  it('returns an empty array for a missing content directory', () => {
    expect(getAllPosts(MISSING_DIR)).toEqual([]);
  });

  it('throws a descriptive error when required frontmatter is missing', () => {
    expect(() => getAllPosts(BAD_FIXTURES)).toThrow(/no-title\.mdx/);
  });
});

describe('getPostBySlug', () => {
  it('returns the full post including content', () => {
    const post = getPostBySlug('first-post', FIXTURES);
    expect(post?.title).toBe('First Post');
    expect(post?.content).toContain('Body of the first post.');
  });

  it('returns null for an unknown slug', () => {
    expect(getPostBySlug('nope', FIXTURES)).toBeNull();
  });

  it('returns null for a draft', () => {
    expect(getPostBySlug('draft-post', FIXTURES)).toBeNull();
  });
});

describe('getAllSlugs', () => {
  it('returns only published slugs', () => {
    expect(getAllSlugs(FIXTURES).sort()).toEqual(['first-post', 'second-post']);
  });

  it('returns an empty array for a missing content directory', () => {
    expect(getAllSlugs(MISSING_DIR)).toEqual([]);
  });
});
