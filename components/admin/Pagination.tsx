import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | '...')[] = [];

  pages.push(1);

  if (currentPage > 3) pages.push('...');

  for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
    pages.push(i);
  }

  if (currentPage < totalPages - 2) pages.push('...');

  if (totalPages > 1) pages.push(totalPages);

  function href(page: number) {
    return page === 1 ? basePath : `${basePath}?page=${page}`;
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-6">
      {currentPage > 1 ? (
        <Link
          href={href(currentPage - 1)}
          className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-gray-400 hover:text-navy hover:bg-navy/[0.06] dark:hover:text-gold dark:hover:bg-gold/[0.06] transition-colors duration-150"
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>
      ) : (
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-gray-200 dark:text-gray-700">
          <ChevronLeft className="w-4 h-4" />
        </span>
      )}

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`dots-${i}`} className="inline-flex items-center justify-center w-9 h-9 text-xs text-gray-300">
            ...
          </span>
        ) : (
          <Link
            key={p}
            href={href(p)}
            className={`inline-flex items-center justify-center w-9 h-9 rounded-lg text-xs font-medium transition-colors duration-150 ${
              p === currentPage
                ? 'bg-navy text-white shadow-sm ring-1 ring-navy/20 dark:bg-gold dark:text-navy-dark dark:ring-gold/20'
                : 'text-gray-500 hover:text-navy hover:bg-navy/[0.06] dark:text-gray-400 dark:hover:text-gold dark:hover:bg-gold/[0.06]'
            }`}
          >
            {p}
          </Link>
        )
      )}

      {currentPage < totalPages ? (
        <Link
          href={href(currentPage + 1)}
          className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-gray-400 hover:text-navy hover:bg-navy/[0.06] dark:hover:text-gold dark:hover:bg-gold/[0.06] transition-colors duration-150"
        >
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-gray-200 dark:text-gray-700">
          <ChevronRight className="w-4 h-4" />
        </span>
      )}
    </div>
  );
}
