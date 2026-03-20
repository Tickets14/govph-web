'use client';

import { useState, useEffect } from 'react';
import { getServices } from '@/lib/api';
import type { Service, SearchFilters } from '@/types';
import { useDebounce } from './useDebounce';

export function useServices(initialFilters?: Partial<SearchFilters>) {
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Partial<SearchFilters>>(initialFilters ?? {});

  const debouncedQuery = useDebounce(filters.query ?? '', 400);
  const category = filters.category;
  const agencyId = filters.agencyId;
  const requestKey = `${debouncedQuery}|${category ?? ''}|${agencyId ?? ''}`;
  const [resolvedKey, setResolvedKey] = useState<string | null>(null);
  const loading = resolvedKey !== requestKey;

  useEffect(() => {
    let cancelled = false;
    getServices({ query: debouncedQuery, agencyId })
      .then((data) => {
        if (!cancelled) {
          setServices(category ? data.filter((s) => s.category === category) : data);
          setError(null);
          setResolvedKey(requestKey);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Failed to load services.');
          setResolvedKey(requestKey);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, category, agencyId, requestKey]);

  return { services, loading, error, filters, setFilters };
}
