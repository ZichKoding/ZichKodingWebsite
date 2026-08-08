'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { BlogCard } from '@/components/public/BlogCard';
import { SearchBar } from '@/components/public/SearchBar';
import { CategoryFilter } from '@/components/public/CategoryFilter';
import { Pagination } from '@/components/public/Pagination';
import type { PostMeta } from '@/lib/content/blog';
import { slugForCategory } from '@/lib/content/categories';

const POSTS_PER_PAGE = 6;

export function BlogListClient({ posts }: { posts: PostMeta[] }) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const categoryFilter = searchParams.get('category') || '';
  const sortOrder = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const categories = Array.from(new Set(posts.map((p) => p.category))).map(
    (name) => ({ id: slugForCategory(name), name, slug: slugForCategory(name) })
  );

  let filtered = posts;

  if (searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q)
    );
  }

  if (categoryFilter) {
    filtered = filtered.filter(
      (p) => slugForCategory(p.category) === categoryFilter
    );
  }

  filtered = [...filtered].sort((a, b) =>
    sortOrder === 'oldest'
      ? a.date.localeCompare(b.date)
      : b.date.localeCompare(a.date)
  );

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const currentPage = Math.max(1, Math.min(page || 1, totalPages || 1));
  const pagePosts = filtered.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <div className="space-y-6">
        <SearchBar />
        {categories.length > 0 && <CategoryFilter categories={categories} />}
      </div>

      {/* Posts Grid */}
      {pagePosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pagePosts.map((post) => (
            <BlogCard
              key={post.slug}
              title={post.title}
              slug={post.slug}
              excerpt={post.excerpt}
              cover_image_url={post.coverImage ?? null}
              published_at={`${post.date}T00:00:00`}
              categories={[
                {
                  id: slugForCategory(post.category),
                  name: post.category,
                  slug: slugForCategory(post.category),
                },
              ]}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">
            {searchQuery
              ? `No posts found matching "${searchQuery}"`
              : 'No posts available yet'}
          </p>
          {searchQuery && (
            <Link
              href="/blog"
              className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Clear search
            </Link>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && pagePosts.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/blog"
        />
      )}
    </div>
  );
}
