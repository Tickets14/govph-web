'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ClipboardCheck } from 'lucide-react';
import { NAV_LINKS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
              <ClipboardCheck className="w-4 h-4 text-gold" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-navy text-[17px] tracking-tight">
              Gov Requirements <span className="text-gold">Tracker</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  pathname === link.href ? 'text-navy' : 'text-gray-500 hover:text-navy hover:bg-gray-50'
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-gold" />
                )}
              </Link>
            ))}
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-gray-500 hover:text-navy hover:bg-gray-50 transition-all duration-200"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5 transition-transform duration-200 rotate-0" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-0.5 animate-slide-down">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              style={{ animationDelay: `${i * 40}ms` }}
              className={cn(
                'flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 animate-fade-in-up',
                pathname === link.href
                  ? 'text-navy bg-gray-50 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-navy'
              )}
            >
              {pathname === link.href && <span className="w-1 h-1 rounded-full bg-gold mr-2 shrink-0" />}
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
