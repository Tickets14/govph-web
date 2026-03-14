"use client";

import { useState, useEffect } from "react";
import { getServices } from "@/lib/api";
import type { Service, SearchFilters } from "@/types";
import { useDebounce } from "./useDebounce";

export function useServices(initialFilters?: Partial<SearchFilters>) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Partial<SearchFilters>>(initialFilters ?? {});

  const debouncedQuery = useDebounce(filters.query ?? "", 400);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getServices({ ...filters, query: debouncedQuery })
      .then((data) => {
        if (!cancelled) {
          setServices(data);
          setError(null);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load services.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, filters.category, filters.agencyId]);

  return { services, loading, error, filters, setFilters };
}
