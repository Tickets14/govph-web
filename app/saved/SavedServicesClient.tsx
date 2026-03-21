'use client';

import { useEffect, useState } from 'react';
import { useBookmarks } from '@/hooks/useBookmarks';
import { ServiceCard } from '@/components/services/ServiceCard';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingGrid } from '@/components/common/LoadingState';
import type { Service } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';

export function SavedServicesClient() {
  const { bookmarks } = useBookmarks();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookmarks.length === 0) {
      setServices([]);
      setLoading(false);
      return;
    }

    async function fetchSaved() {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/services`);
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        const all = json.data ?? json;
        const filtered = all
          .filter((s: { id: string }) => bookmarks.includes(s.id))
          .map(
            (s: {
              id: string;
              slug: string;
              name: string;
              description: string;
              agency_id: string;
              agency?: {
                id: string;
                name: string;
                acronym: string;
                description: string;
                logo_url?: string;
                website_url?: string;
              };
              category?: string;
              steps?: { id: string; order: number; title: string; description: string }[];
              requirements?: { id: string; name: string }[];
              estimated_time?: string;
              total_fee?: number;
              is_featured?: boolean;
            }) => ({
              id: s.id,
              slug: s.slug,
              title: s.name,
              description: s.description,
              agencyId: s.agency_id,
              agency: s.agency
                ? {
                    id: s.agency.id,
                    slug: s.agency.acronym,
                    name: s.agency.name,
                    acronym: s.agency.acronym,
                    description: s.agency.description,
                  }
                : undefined,
              category: s.category ?? 'other',
              steps: s.steps ?? [],
              requirements: (s.requirements ?? []).map((r: { id: string; name: string }) => ({
                id: r.id,
                label: r.name,
              })),
              processingTime: s.estimated_time,
              totalFee: s.total_fee,
              isFeatured: s.is_featured,
            })
          );
        setServices(filtered);
      } catch {
        setServices([]);
      } finally {
        setLoading(false);
      }
    }

    fetchSaved();
  }, [bookmarks]);

  if (loading) return <LoadingGrid />;

  if (services.length === 0) {
    return (
      <EmptyState title="No saved services yet" description="Tap the bookmark icon on any service to save it here." />
    );
  }

  return (
    <div className="animate-fade-in">
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">
        {services.length} saved service{services.length !== 1 ? 's' : ''}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service, i) => (
          <div key={service.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 40}ms` }}>
            <ServiceCard service={service} />
          </div>
        ))}
      </div>
    </div>
  );
}
