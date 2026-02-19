'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export function Pagination({
  currentPage,
  totalPages,
  basePath,
}: PaginationProps) {
  const searchParams = useSearchParams();

  const getPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    return `${basePath}?${params.toString()}`;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Show first, last, and pages around current page
  let visiblePages = [1];
  if (currentPage > 2) visiblePages.push(currentPage - 1);
  if (currentPage !== 1 && currentPage !== totalPages) visiblePages.push(currentPage);
  if (currentPage < totalPages - 1) visiblePages.push(currentPage + 1);
  if (totalPages > 1) visiblePages.push(totalPages);

  visiblePages = [...new Set(visiblePages)].sort((a, b) => a - b);

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-gray-300 hover:text-white hover:border-blue-500/50 transition-all"
          aria-label="Previous page"
        >
          <ChevronLeft size={20} />
        </Link>
      ) : (
        <button
          disabled
          className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-gray-600 cursor-not-allowed opacity-50"
          aria-label="Previous page"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {visiblePages.map((page, index) => {
          const showGap = index > 0 && page - visiblePages[index - 1] > 1;

          return (
            <div key={page} className="flex items-center gap-1">
              {showGap && (
                <span className="px-2 text-gray-500">…</span>
              )}
              {page === currentPage ? (
                <button
                  disabled
                  className="px-3 py-2 rounded-lg bg-blue-500 text-white font-medium"
                  aria-label={`Page ${page}`}
                  aria-current="page"
                >
                  {page}
                </button>
              ) : (
                <Link
                  href={getPageUrl(page)}
                  className="px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-gray-300 hover:text-white hover:border-blue-500/50 transition-all"
                  aria-label={`Go to page ${page}`}
                >
                  {page}
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-gray-300 hover:text-white hover:border-blue-500/50 transition-all"
          aria-label="Next page"
        >
          <ChevronRight size={20} />
        </Link>
      ) : (
        <button
          disabled
          className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-gray-600 cursor-not-allowed opacity-50"
          aria-label="Next page"
        >
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  );
}
