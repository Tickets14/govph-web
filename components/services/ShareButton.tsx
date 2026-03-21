'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';

interface ShareButtonProps {
  title: string;
  description: string;
}

export function ShareButton({ title, description }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, text: description, url });
        return;
      } catch {
        /* user cancelled or error — fall through to clipboard */
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard not available */
    }
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 dark:text-gray-500 hover:text-navy dark:hover:text-gold px-3 py-1.5 rounded-lg border border-gray-100 dark:border-white/10 hover:border-gray-200 dark:hover:border-white/20 transition-all duration-200"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-green-500" />
          Copied!
        </>
      ) : (
        <>
          <Share2 className="w-3.5 h-3.5" />
          Share
        </>
      )}
    </button>
  );
}
