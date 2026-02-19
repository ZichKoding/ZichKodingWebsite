import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Tag } from 'lucide-react';
import { formatDate, truncate, generateGradient } from '@/lib/utils';

interface BlogCardProps {
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  categories: Array<{ id: string; name: string; slug: string }>;
}

export function BlogCard({
  title,
  slug,
  excerpt,
  cover_image_url,
  published_at,
  categories,
}: BlogCardProps) {
  const gradientClasses = generateGradient(slug);

  return (
    <Link href={`/blog/${slug}`}>
      <article className="group h-full flex flex-col rounded-lg overflow-hidden bg-slate-800/50 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer">
        {/* Cover Image */}
        <div className={`relative h-48 overflow-hidden bg-gradient-to-br ${gradientClasses} group-hover:scale-105 transition-transform duration-300`}>
          {cover_image_url ? (
            <Image
              src={cover_image_url}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-white/20 text-center px-4">
                {title}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-4">
          {/* Title */}
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
            {title}
          </h3>

          {/* Excerpt */}
          {excerpt && (
            <p className="text-gray-300 text-sm mb-3 line-clamp-2 flex-1">
              {truncate(excerpt, 100)}
            </p>
          )}

          {/* Meta */}
          <div className="space-y-3 pt-3 border-t border-slate-700/50">
            {/* Date */}
            {published_at && (
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Calendar size={16} />
                <time dateTime={published_at}>
                  {formatDate(published_at)}
                </time>
              </div>
            )}

            {/* Categories */}
            {categories.length > 0 && (
              <div className="flex items-start gap-2">
                <Tag size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex flex-wrap gap-1">
                  {categories.map((category) => (
                    <span
                      key={category.id}
                      className="inline-block px-2 py-1 text-xs bg-blue-500/20 text-blue-300 rounded-full"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Read More Link */}
        <div className="px-4 pb-4 pt-2">
          <span className="inline-block text-blue-400 text-sm font-medium group-hover:gap-2 transition-all">
            Read more →
          </span>
        </div>
      </article>
    </Link>
  );
}
