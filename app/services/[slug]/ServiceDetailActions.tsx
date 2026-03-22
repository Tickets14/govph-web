'use client';

import { ShareButton } from '@/components/services/ShareButton';
import { BookmarkButton } from '@/components/services/BookmarkButton';
import type { Service } from '@/types';

export function ServiceDetailActions({ service }: { service: Service }) {
  return (
    <div className="inline-flex items-center gap-2 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl px-3 py-2 mb-5">
      <ShareButton title={service.title} description={service.description} />
      <div className="w-px h-4 bg-gray-200 dark:bg-gray-700" />
      <BookmarkButton serviceId={service.id} size="md" />
    </div>
  );
}
