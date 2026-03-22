'use client';

import { useState } from 'react';
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
  const [popping, setPopping] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!active) {
      setPopping(true);
      setTimeout(() => setPopping(false), 300);
    }
    toggle(serviceId);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'rounded-lg transition-all duration-200 shrink-0 active:scale-90 hover:bg-gold/10',
        size === 'sm' ? 'p-1.5' : 'p-2',
        active ? 'text-gold hover:text-gold-dark' : 'text-gray-300 dark:text-gray-500 hover:text-gold'
      )}
      aria-label={active ? 'Remove from saved' : 'Save service'}
    >
      <Bookmark
        className={cn(
          size === 'sm' ? 'w-3.5 h-3.5' : 'w-4.5 h-4.5',
          active && 'fill-gold',
          popping && 'animate-bookmark-pop'
        )}
      />
    </button>
  );
}
