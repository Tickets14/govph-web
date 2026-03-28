'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWARegister() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setVisible(false);
    }
    setInstallPrompt(null);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="flex items-center gap-3 rounded-2xl bg-navy dark:bg-white/10 backdrop-blur-lg border border-white/10 dark:border-white/[0.06] p-4 shadow-xl shadow-navy/20">
        <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gold">
            <path
              d="M12 5v14M5 12l7 7 7-7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white">Install GovPH</p>
          <p className="text-xs text-white/60 truncate">Quick access from your home screen</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setVisible(false)}
            className="text-xs text-white/40 hover:text-white/70 px-2 py-1.5 transition-colors"
          >
            Later
          </button>
          <button
            onClick={handleInstall}
            className="text-xs font-semibold bg-gold text-navy px-4 py-1.5 rounded-lg hover:bg-gold/90 transition-colors"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
}
