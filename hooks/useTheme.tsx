'use client';

import { createContext, useContext, useEffect, useSyncExternalStore, type ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({ theme: 'light', toggle: () => {} });

const STORAGE_KEY = 'theme';
const MEDIA_QUERY = '(prefers-color-scheme: dark)';

const listeners = new Set<() => void>();

const notifyListeners = () => {
  listeners.forEach((listener) => listener());
};

const readStoredTheme = (): Theme | null => {
  if (typeof window === 'undefined') return null;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'dark' || stored === 'light' ? stored : null;
  } catch {
    return null;
  }
};

const getPreferredTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia(MEDIA_QUERY).matches ? 'dark' : 'light';
};

const getSnapshot = (): Theme => readStoredTheme() ?? getPreferredTheme();

const getServerSnapshot = (): Theme => 'light';

const subscribe = (callback: () => void) => {
  listeners.add(callback);

  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    callback();
  };

  const media = window.matchMedia(MEDIA_QUERY);
  const onMediaChange = () => callback();

  window.addEventListener('storage', onStorage);
  if (media.addEventListener) {
    media.addEventListener('change', onMediaChange);
  } else {
    media.addListener(onMediaChange);
  }

  return () => {
    listeners.delete(callback);
    window.removeEventListener('storage', onStorage);
    if (media.removeEventListener) {
      media.removeEventListener('change', onMediaChange);
    } else {
      media.removeListener(onMediaChange);
    }
  };
};

const setStoredTheme = (next: Theme) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* ignore */
  }
  notifyListeners();
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const toggle = () => setStoredTheme(theme === 'light' ? 'dark' : 'light');

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
