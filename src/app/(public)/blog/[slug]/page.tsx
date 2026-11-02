import { Metadata } from 'next';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import { getAllSlugs, getPostBySlug } from '@/lib/content/blog';
import { slugForCategory } from '@/lib/content/categories';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { notFound } from 'next/navigation';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: `${post.title} - Chris Zichko | ZichKoding`,
    description: post.excerpt || 'Read this blog post',
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      images: post.coverImage ? [{ url: post.coverImage }] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Link */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-brand-copper hover:text-brand-copper-bright transition-colors mb-8 font-medium"
      >
        <ArrowLeft size={20} />
        Back to blog
      </Link>

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-col gap-4 text-gray-400">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <time dateTime={post.date}>
                {formatDate(`${post.date}T00:00:00`)}
              </time>
            </div>
            <span>By Chris Zichko</span>
          </div>

          {/* Category */}
          <div className="flex items-center gap-2 flex-wrap">
            <Tag size={18} />
            <Link
              href={`/blog?category=${slugForCategory(post.category)}`}
              className="px-3 py-1 bg-blue-500/20 text-brand-copper-bright rounded-full text-sm hover:bg-blue-500/30 transition-colors"
            >
              {post.category}
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="article-content mb-8">
        <MDXRemote
          source={post.content}
          options={{
            mdxOptions: {
              rehypePlugins: [
                [rehypePrettyCode, { theme: 'github-dark-dimmed' }],
              ],
            },
          }}
        />
      </div>

      {/* Back Link */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-brand-copper hover:text-brand-copper-bright transition-colors font-medium mt-12 pt-8 border-t border-slate-800"
      >
        <ArrowLeft size={20} />
        Back to blog
      </Link>
    </article>
  );
}
