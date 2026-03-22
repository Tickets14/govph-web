'use client';

import { useEffect } from 'react';
import { FileText } from 'lucide-react';
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
        <EmptyState title="No results found" description="Try a different keyword or remove the filter." />
      ) : (
        <div className="animate-fade-in">
          <div className="inline-flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 px-2.5 py-1 rounded-lg text-xs text-gray-500 dark:text-gray-400 mb-5">
            <FileText className="w-3 h-3" />
            {services.length} service{services.length !== 1 ? 's' : ''} found
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service, i) => (
              <div
                key={service.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${Math.min(i * 50, 500)}ms` }}
              >
                <ServiceCard service={service} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
