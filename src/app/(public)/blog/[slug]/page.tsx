import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { TiptapRenderer } from '@/components/public/TiptapRenderer';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { notFound } from 'next/navigation';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from('posts')
    .select('title, excerpt, cover_image_url')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} - Chris | ZichKoding`,
    description: post.excerpt || 'Read this blog post',
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      images: post.cover_image_url ? [{ url: post.cover_image_url }] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch the post
  const { data: post, error } = await supabase
    .from('posts')
    .select(
      `
      id,
      title,
      slug,
      content,
      excerpt,
      cover_image_url,
      published_at,
      author_id,
      post_categories (
        category_id,
        categories (
          id,
          name,
          slug
        )
      ),
      profiles (
        full_name
      )
    `
    )
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (!post || error) {
    notFound();
  }

  const author = post.profiles?.full_name || 'Chris';
  const categories = (post.post_categories || [])
    .map((pc: any) => pc.categories)
    .filter(Boolean);

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Link */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mb-8 font-medium"
      >
        <ArrowLeft size={20} />
        Back to blog
      </Link>

      {/* Cover Image */}
      {post.cover_image_url && (
        <div className="relative mb-8 rounded-lg overflow-hidden h-96 bg-slate-800">
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>
      )}

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-col gap-4 text-gray-400">
          <div className="flex items-center gap-4 flex-wrap">
            {post.published_at && (
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <time dateTime={post.published_at}>
                  {formatDate(post.published_at)}
                </time>
              </div>
            )}

            {author && (
              <span>By {author}</span>
            )}
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Tag size={18} />
              {categories.map((category: any) => (
                <Link
                  key={category.id}
                  href={`/blog?category=${category.slug}`}
                  className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm hover:bg-blue-500/30 transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="prose prose-invert max-w-none mb-8">
        {post.content && <TiptapRenderer content={post.content} />}
      </div>

      {/* Back Link */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-medium mt-12 pt-8 border-t border-slate-800"
      >
        <ArrowLeft size={20} />
        Back to blog
      </Link>
    </article>
  );
}
