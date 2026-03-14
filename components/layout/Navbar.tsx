'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Shield } from 'lucide-react';
import { NAV_LINKS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center shadow-sm group-hover:bg-[#243561] transition-colors">
              <Shield className="w-4.5 h-4.5 text-gold" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-navy text-lg tracking-tight">
              GovPH <span className="text-gold">Tracker</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                  pathname === link.href ? 'bg-navy text-white' : 'text-gray-600 hover:text-navy hover:bg-gray-100'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-gray-500 hover:text-navy hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                'block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                pathname === link.href ? 'bg-navy text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-navy'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
