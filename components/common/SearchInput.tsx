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
  placeholder = 'Maghanap ng serbisyo...',
  className,
  size = 'md',
}: SearchInputProps) {
  return (
    <div className={cn('relative', className)}>
      <Search
        className={cn(
          'absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none',
          size === 'lg' ? 'w-5 h-5 left-4' : 'w-4 h-4'
        )}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all',
          size === 'sm' && 'pl-9 pr-3 py-2 text-sm',
          size === 'md' && 'pl-10 pr-10 py-2.5 text-sm',
          size === 'lg' && 'pl-12 pr-12 py-4 text-base'
        )}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className={cn(
            'absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors',
            size === 'lg' ? 'right-4' : 'right-3'
          )}
        >
          <X className={cn(size === 'lg' ? 'w-5 h-5' : 'w-4 h-4')} />
        </button>
      )}
    </div>
  );
}
