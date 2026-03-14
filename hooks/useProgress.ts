'use client';

import { useState, useCallback } from 'react';
import type { Progress } from '@/types';

const STORAGE_KEY = 'govph_progress';

function loadProgress(): Record<string, Progress> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(data: Record<string, Progress>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useProgress(serviceId: string) {
  const [allProgress, setAllProgress] = useState<Record<string, Progress>>(() => loadProgress());

  const progress: Progress = allProgress[serviceId] ?? {
    serviceId,
    completedSteps: [],
    completedRequirements: [],
    lastUpdated: new Date().toISOString(),
  };

  const toggleStep = useCallback(
    (stepId: string) => {
      setAllProgress((prev) => {
        const current = prev[serviceId] ?? {
          serviceId,
          completedSteps: [],
          completedRequirements: [],
          lastUpdated: new Date().toISOString(),
        };

        const completedSteps = current.completedSteps.includes(stepId)
          ? current.completedSteps.filter((id) => id !== stepId)
          : [...current.completedSteps, stepId];

        const updated = {
          ...prev,
          [serviceId]: { ...current, completedSteps, lastUpdated: new Date().toISOString() },
        };
        saveProgress(updated);
        return updated;
      });
    },
    [serviceId]
  );

  const toggleRequirement = useCallback(
    (reqId: string) => {
      setAllProgress((prev) => {
        const current = prev[serviceId] ?? {
          serviceId,
          completedSteps: [],
          completedRequirements: [],
          lastUpdated: new Date().toISOString(),
        };

        const completedRequirements = current.completedRequirements.includes(reqId)
          ? current.completedRequirements.filter((id) => id !== reqId)
          : [...current.completedRequirements, reqId];

        const updated = {
          ...prev,
          [serviceId]: { ...current, completedRequirements, lastUpdated: new Date().toISOString() },
        };
        saveProgress(updated);
        return updated;
      });
    },
    [serviceId]
  );

  const resetProgress = useCallback(() => {
    setAllProgress((prev) => {
      const updated = { ...prev };
      delete updated[serviceId];
      saveProgress(updated);
      return updated;
    });
  }, [serviceId]);

  return { progress, toggleStep, toggleRequirement, resetProgress };
}
