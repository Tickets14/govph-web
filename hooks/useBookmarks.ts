'use client';

import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'govph-bookmarks';

export function useBookmarks() {
  const readStorage = () => {
    if (typeof window === 'undefined') {
      return [] as string[];
    }

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];

      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? (parsed as string[]) : [];
    } catch {
      return [];
    }
  };

  const [bookmarks, setBookmarks] = useState<string[]>(readStorage);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      if (event.newValue == null) {
        setBookmarks([]);
        return;
      }

      try {
        const parsed = JSON.parse(event.newValue);
        setBookmarks(Array.isArray(parsed) ? (parsed as string[]) : []);
      } catch {
        setBookmarks([]);
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggle = useCallback((serviceId: string) => {
    setBookmarks((prev) => {
      const next = prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId];
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const isBookmarked = useCallback((serviceId: string) => bookmarks.includes(serviceId), [bookmarks]);

  return { bookmarks, toggle, isBookmarked };
}
