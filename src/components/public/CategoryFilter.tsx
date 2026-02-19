'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CategoryFilterProps {
  categories: Category[];
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category');

  const handleCategoryClick = (categorySlug: string | null) => {
    const params = new URLSearchParams(searchParams);

    if (categorySlug) {
      params.set('category', categorySlug);
    } else {
      params.delete('category');
    }

    // Reset to page 1 when filtering
    params.set('page', '1');

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {/* All button */}
      <button
        onClick={() => handleCategoryClick(null)}
        className={cn(
          'px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0',
          !activeCategory
            ? 'bg-blue-500 text-white'
            : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
        )}
      >
        All
      </button>

      {/* Category pills */}
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleCategoryClick(category.slug)}
          className={cn(
            'px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0',
            activeCategory === category.slug
              ? 'bg-blue-500 text-white'
              : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
          )}
        >
          {category.name}
        </button>
      ))}

      {/* Clear filter button - appears only when a category is active */}
      {activeCategory && (
        <button
          onClick={() => handleCategoryClick(null)}
          className="ml-auto flex-shrink-0 text-gray-400 hover:text-white transition-colors"
          aria-label="Clear filter"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}
