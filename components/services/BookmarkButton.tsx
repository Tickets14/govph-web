'use client';

import { Bookmark } from 'lucide-react';
import { useBookmarks } from '@/hooks/useBookmarks';
import { cn } from '@/lib/utils';

interface BookmarkButtonProps {
  serviceId: string;
  size?: 'sm' | 'md';
}

export function BookmarkButton({ serviceId, size = 'sm' }: BookmarkButtonProps) {
  const { toggle, isBookmarked } = useBookmarks();
  const active = isBookmarked(serviceId);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(serviceId);
      }}
      className={cn(
        'rounded-lg transition-all duration-200 shrink-0',
        size === 'sm' ? 'p-1.5' : 'p-2',
        active ? 'text-gold hover:text-gold-dark' : 'text-gray-300 dark:text-gray-500 hover:text-gold'
      )}
      aria-label={active ? 'Remove from saved' : 'Save service'}
    >
      <Bookmark className={cn(size === 'sm' ? 'w-3.5 h-3.5' : 'w-4.5 h-4.5', active && 'fill-gold')} />
    </button>
  );
}
