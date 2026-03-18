'use client';

import { useEffect } from 'react';
import { useServices } from '@/hooks/useServices';
import { ServiceCard } from '@/components/services/ServiceCard';
import { ServiceSearch } from '@/components/services/ServiceSearch';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingGrid } from '@/components/common/LoadingState';

interface ServicesClientProps {
  initialQuery?: string;
}

export function ServicesClient({ initialQuery = '' }: ServicesClientProps) {
  const { services, loading, filters, setFilters } = useServices({
    query: initialQuery,
  });

  useEffect(() => {
    if (initialQuery) {
      setFilters((prev) => ({ ...prev, query: initialQuery }));
    }
  }, [initialQuery, setFilters]);

  return (
    <div className="space-y-6">
      <ServiceSearch
        query={filters.query ?? ''}
        category={filters.category}
        onQueryChange={(q) => setFilters((prev) => ({ ...prev, query: q }))}
        onCategoryChange={(c) => setFilters((prev) => ({ ...prev, category: c }))}
      />

      {loading ? (
        <LoadingGrid />
      ) : services.length === 0 ? (
        <EmptyState title="Walang nahanap" description="Subukan ang ibang keyword o alisin ang filter." />
      ) : (
        <div className="animate-fade-in">
          <p className="text-xs text-gray-400 mb-5">{services.length} serbisyo ang nahanap</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service, i) => (
              <div key={service.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 40}ms` }}>
                <ServiceCard service={service} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
