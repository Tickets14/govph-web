'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Building2,
  ListChecks,
  ClipboardList,
  BookOpen,
  ArrowLeft,
  LogOut,
  Menu,
  X,
  Shield,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/agencies', label: 'Agencies', icon: Building2 },
  { href: '/admin/services', label: 'Services', icon: FileText },
  { href: '/admin/steps', label: 'Steps', icon: ListChecks },
  { href: '/admin/requirements', label: 'Requirements', icon: ClipboardList },
  { href: '/admin/dictionary', label: 'Dictionary', icon: BookOpen },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return <AdminSidebarInner key={pathname} pathname={pathname} />;
}

type AdminSidebarInnerProps = {
  pathname: string;
};

function AdminSidebarInner({ pathname }: AdminSidebarInnerProps) {
  const [open, setOpen] = useState(false);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gold/15 flex items-center justify-center shrink-0">
            <Shield className="w-4 h-4 text-gold" />
          </div>
          <div>
            <p className="font-display font-bold text-sm leading-none text-white">Gov Requirements Tracker</p>
            <p className="text-[11px] text-white/30 mt-0.5">Admin Panel</p>
          </div>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/6 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-white/20 px-3 mb-3">Menu</p>
        {links.map(({ href, label, icon: Icon }) => {
          const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200',
                active ? 'bg-white/10 text-white font-medium' : 'text-white/50 hover:bg-white/6 hover:text-white/80'
              )}
            >
              {active && <span className="absolute left-3 w-0.5 h-4 rounded-full bg-gold" />}
              <Icon className={cn('w-4 h-4 shrink-0 transition-colors', active ? 'text-gold' : 'text-white/40')} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/6 space-y-0.5">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-white/70 hover:bg-white/6 transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-white/70 hover:bg-white/6 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-navy-dark text-white/70 hover:text-white shadow-lg transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
      )}

      {/* Mobile sidebar (slide-in) */}
      <aside
        className={cn(
          'lg:hidden fixed inset-y-0 left-0 z-50 w-60 bg-navy-dark text-white flex flex-col border-r border-white/6 transition-transform duration-300 ease-in-out',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar (always visible) */}
      <aside className="hidden lg:flex w-60 min-h-screen bg-navy-dark text-white flex-col border-r border-white/6">
        {sidebarContent}
      </aside>
    </>
  );
}
