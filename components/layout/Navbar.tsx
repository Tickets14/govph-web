'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ClipboardCheck, Bookmark } from 'lucide-react';
import { NAV_LINKS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/common/ThemeToggle';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-950/80 glass border-b transition-all duration-300',
        scrolled
          ? 'border-gray-200/60 dark:border-white/10 shadow-[0_1px_3px_0_rgba(0,0,0,0.06)]'
          : 'border-transparent'
      )}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center transition-transform duration-200 group-hover:scale-105 shadow-sm shadow-navy/20">
              <ClipboardCheck className="w-4 h-4 text-gold" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-navy dark:text-white text-[17px] tracking-tight">
              Gov Requirements <span className="text-gold">Tracker</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5" role="navigation" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  pathname === link.href
                    ? 'text-navy dark:text-white bg-navy/[0.06] dark:bg-white/[0.08]'
                    : 'text-gray-500 dark:text-gray-400 hover:text-navy dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/[0.06]'
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-gold" />
                )}
              </Link>
            ))}

            {/* Saved link */}
            <Link
              href="/saved"
              className={cn(
                'relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5',
                pathname === '/saved'
                  ? 'text-navy dark:text-white bg-navy/[0.06] dark:bg-white/[0.08]'
                  : 'text-gray-500 dark:text-gray-400 hover:text-navy dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/[0.06]'
              )}
            >
              <Bookmark className="w-3.5 h-3.5" />
              Saved
              {pathname === '/saved' && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-gold" />
              )}
            </Link>

            <div className="ml-1 border-l border-gray-100 dark:border-white/10 pl-1">
              <ThemeToggle />
            </div>
          </nav>

          {/* Mobile right side */}
          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-navy dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/10 transition-all duration-200"
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {open ? (
                <X className="w-5 h-5 transition-transform duration-200 rotate-0" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu — smooth expand/collapse */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300 ease-out',
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="border-t border-gray-100 dark:border-white/10 bg-white/90 dark:bg-gray-950/90 glass px-4 py-3 space-y-0.5">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              style={{ animationDelay: `${i * 40}ms` }}
              className={cn(
                'flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 animate-fade-in-up',
                pathname === link.href
                  ? 'text-navy dark:text-white bg-navy/[0.06] dark:bg-white/10 font-semibold'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/10 hover:text-navy dark:hover:text-white'
              )}
            >
              {pathname === link.href && <span className="w-1 h-1 rounded-full bg-gold mr-2 shrink-0" />}
              {link.label}
            </Link>
          ))}
          <Link
            href="/saved"
            onClick={() => setOpen(false)}
            style={{ animationDelay: `${NAV_LINKS.length * 40}ms` }}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 animate-fade-in-up',
              pathname === '/saved'
                ? 'text-navy dark:text-white bg-navy/[0.06] dark:bg-white/10 font-semibold'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/10 hover:text-navy dark:hover:text-white'
            )}
          >
            {pathname === '/saved' && <span className="w-1 h-1 rounded-full bg-gold mr-2 shrink-0" />}
            <Bookmark className="w-3.5 h-3.5" />
            Saved
          </Link>
        </div>
      </div>
    </header>
  );
}
