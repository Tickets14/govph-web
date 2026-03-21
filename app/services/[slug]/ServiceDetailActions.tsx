'use client';

import { ShareButton } from '@/components/services/ShareButton';
import { BookmarkButton } from '@/components/services/BookmarkButton';
import type { Service } from '@/types';

export function ServiceDetailActions({ service }: { service: Service }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <ShareButton title={service.title} description={service.description} />
      <BookmarkButton serviceId={service.id} size="md" />
    </div>
  );
}
