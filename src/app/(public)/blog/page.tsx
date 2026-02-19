import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { BlogCard } from '@/components/public/BlogCard';
import { SearchBar } from '@/components/public/SearchBar';
import { CategoryFilter } from '@/components/public/CategoryFilter';
import { Pagination } from '@/components/public/Pagination';
import { Post, Category, PostCategory } from '@/lib/supabase/types';
import { sanitizePostgrestInput } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Blog - Chris | ZichKoding',
  description: 'Read my latest blog posts about web development, design, and coding',
};

const POSTS_PER_PAGE = 6;

interface BlogPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const searchQuery = params.q || '';
  const categoryFilter = params.category || '';
  const sortOrder = params.sort || 'newest';
  const page = parseInt(params.page || '1', 10);

  const supabase = await createClient();

  // Fetch all categories for the filter
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  // Build query for posts (with count for pagination)
  let query = supabase
    .from('posts')
    .select(
      `
      id,
      title,
      slug,
      excerpt,
      cover_image_url,
      published_at,
      post_categories (
        category_id,
        categories (
          id,
          name,
          slug
        )
      )
    `,
      { count: 'exact' }
    )
    .eq('published', true);

  // Apply search filter
  if (searchQuery.trim()) {
    const sanitized = sanitizePostgrestInput(searchQuery);
    query = query.or(`title.ilike.%${sanitized}%,excerpt.ilike.%${sanitized}%`);
  }

  // Apply category filter
  if (categoryFilter) {
    // First get the category ID by slug
    const { data: categoryData } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categoryFilter)
      .single();

    if (categoryData) {
      // Get all post IDs for the selected category
      const { data: categoryPosts } = await supabase
        .from('post_categories')
        .select('post_id')
        .eq('category_id', categoryData.id);

      if (categoryPosts && categoryPosts.length > 0) {
        const postIds = categoryPosts.map((cp: any) => cp.post_id);
        query = query.in('id', postIds);
      } else {
        // No posts in this category — fall through with empty results
        query = query.in('id', []);
      }
    } else {
      // Category slug not found — fall through with empty results
      query = query.in('id', []);
    }
  }

  // Apply sorting
  if (sortOrder === 'oldest') {
    query = query.order('published_at', { ascending: true });
  } else {
    query = query.order('published_at', { ascending: false });
  }

  // Apply pagination
  const offset = (page - 1) * POSTS_PER_PAGE;
  query = query.range(offset, offset + POSTS_PER_PAGE - 1);

  // Execute query (count comes from the same filtered query)
  const { data: posts, error, count: totalCount } = await query;

  if (error) {
    console.error('Error fetching posts:', error);
  }

  // Transform posts to include category details
  const transformedPosts = (posts || []).map((post: any) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    cover_image_url: post.cover_image_url,
    published_at: post.published_at,
    categories: (post.post_categories || [])
      .map((pc: any) => pc.categories)
      .filter(Boolean),
  }));

  const totalPages = totalCount ? Math.ceil(totalCount / POSTS_PER_PAGE) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Blog</h1>
          <p className="text-gray-400">
            Thoughts on web development, design, and coding
          </p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-6">
          <SearchBar />
          {categories && <CategoryFilter categories={categories} />}
        </div>

        {/* Posts Grid */}
        {transformedPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {transformedPosts.map((post) => (
              <BlogCard
                key={post.id}
                title={post.title}
                slug={post.slug}
                excerpt={post.excerpt}
                cover_image_url={post.cover_image_url}
                published_at={post.published_at}
                categories={post.categories}
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
              <a
                href="/blog"
                className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Clear search
              </a>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && transformedPosts.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath="/blog"
          />
        )}
      </div>
    </div>
  );
}
