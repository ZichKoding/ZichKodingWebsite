import { Metadata } from 'next';
import { Suspense } from 'react';
import { getAllPosts } from '@/lib/content/blog';
import { BlogListClient } from '@/components/public/BlogListClient';

export const metadata: Metadata = {
  title: 'Blog - Chris Zichko | ZichKoding',
  description:
    'Writing on AI-augmented engineering: local models, agent harnesses, memory systems, and the process discipline that keeps AI-assisted work honest.',
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Blog</h1>
          <p className="text-gray-400">
            AI-augmented engineering, local-first AI, and process discipline
          </p>
        </div>

        <Suspense>
          <BlogListClient posts={posts} />
        </Suspense>
      </div>
    </div>
  );
}
