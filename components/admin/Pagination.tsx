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

  // Always show first page
  pages.push(1);

  if (currentPage > 3) pages.push('...');

  // Pages around current
  for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
    pages.push(i);
  }

  if (currentPage < totalPages - 2) pages.push('...');

  // Always show last page
  if (totalPages > 1) pages.push(totalPages);

  function href(page: number) {
    return page === 1 ? basePath : `${basePath}?page=${page}`;
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      {currentPage > 1 ? (
        <Link
          href={href(currentPage - 1)}
          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-navy hover:bg-gray-50 transition-colors duration-150"
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>
      ) : (
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-200">
          <ChevronLeft className="w-4 h-4" />
        </span>
      )}

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`dots-${i}`} className="inline-flex items-center justify-center w-8 h-8 text-xs text-gray-300">
            ...
          </span>
        ) : (
          <Link
            key={p}
            href={href(p)}
            className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-medium transition-colors duration-150 ${
              p === currentPage ? 'bg-navy text-white' : 'text-gray-500 hover:text-navy hover:bg-gray-50'
            }`}
          >
            {p}
          </Link>
        )
      )}

      {currentPage < totalPages ? (
        <Link
          href={href(currentPage + 1)}
          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-navy hover:bg-gray-50 transition-colors duration-150"
        >
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-200">
          <ChevronRight className="w-4 h-4" />
        </span>
      )}
    </div>
  );
}
