'use client';

import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search for a service...',
  className,
  size = 'md',
}: SearchInputProps) {
  return (
    <div className={cn('relative', className)}>
      <Search
        className={cn(
          'absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none',
          size === 'lg' ? 'w-4 h-4 left-4' : 'w-4 h-4'
        )}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-300 dark:placeholder:text-gray-600',
          'focus:outline-none focus:ring-2 focus:ring-navy/10 dark:focus:ring-gold/20 focus:border-navy/30 dark:focus:border-gold/30 transition-all duration-200',
          size === 'sm' && 'pl-9 pr-3 py-2 text-sm',
          size === 'md' && 'pl-10 pr-10 py-2.5 text-sm',
          size === 'lg' && 'pl-11 pr-11 py-3.5 text-sm'
        )}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className={cn(
            'absolute top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors duration-200',
            size === 'lg' ? 'right-4' : 'right-3'
          )}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
