'use client';

import { SearchInput } from '@/components/common/SearchInput';
import { SERVICE_CATEGORIES } from '@/lib/constants';
import type { ServiceCategory } from '@/types';
import { cn } from '@/lib/utils';

interface ServiceSearchProps {
  query: string;
  category?: ServiceCategory;
  onQueryChange: (q: string) => void;
  onCategoryChange: (c: ServiceCategory | undefined) => void;
}

export function ServiceSearch({ query, category, onQueryChange, onCategoryChange }: ServiceSearchProps) {
  return (
    <div className="space-y-3">
      <SearchInput value={query} onChange={onQueryChange} size="md" />
      <div className="flex gap-1.5 flex-wrap">
        <button
          onClick={() => onCategoryChange(undefined)}
          className={cn(
            'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border',
            !category
              ? 'bg-navy text-white border-navy'
              : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700'
          )}
        >
          Lahat
        </button>
        {SERVICE_CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => onCategoryChange(category === c.value ? undefined : (c.value as ServiceCategory))}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border',
              category === c.value
                ? 'bg-navy text-white border-navy'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700'
            )}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}
