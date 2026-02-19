'use client';

import React from 'react';
import { TERMINAL_DATA } from '@/data/terminal-data';
import { ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';

interface BlogSectionProps {
  isActive: boolean;
}

export function BlogSection({ isActive }: BlogSectionProps) {
  return (
    <div className="h-full flex flex-col px-4 sm:px-6 py-8 overflow-y-auto">
      <div className="max-w-3xl w-full mx-auto my-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
          <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
            Recent Blog Posts
          </span>
        </h2>

        <div className="space-y-4 mb-8">
          {TERMINAL_DATA.blogPosts.map((post, idx) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block bg-slate-800/30 border border-slate-700/40 rounded-xl p-5 backdrop-blur-sm hover:border-amber-500/30 transition-colors group"
              style={{
                opacity: isActive ? 1 : 0,
                transform: isActive ? 'translateY(0)' : 'translateY(16px)',
                transition: `opacity 0.5s ease ${0.1 * idx}s, transform 0.5s ease ${0.1 * idx}s`,
              }}
            >
              <div className="flex items-start gap-4">
                <div className="mt-0.5 p-2 rounded-lg bg-amber-500/10 shrink-0">
                  <BookOpen className="w-5 h-5 text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-100 group-hover:text-amber-300 transition-colors mb-1 truncate">
                    {post.title}
                  </h3>
                  <p className="text-xs text-gray-500">{post.date}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-amber-400 transition-colors mt-1 shrink-0" />
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400/50 transition-all text-sm font-medium"
          >
            View All Posts <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
