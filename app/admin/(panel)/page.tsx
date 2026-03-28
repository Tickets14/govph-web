import type { Metadata } from 'next';
import Link from 'next/link';
import {
  FileText,
  Building2,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Plus,
  ListChecks,
  ClipboardList,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';
import { getServices, getAgencies, getFeedbacks } from '@/lib/api';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function AdminDashboardPage() {
  const [services, agencies, feedbacks] = await Promise.all([getServices(), getAgencies(), getFeedbacks()]);

  const activeServices = services.filter((s) => s.isActive);
  const featuredServices = services.filter((s) => s.isFeatured);

  const stats = [
    {
      label: 'Total Services',
      value: services.length,
      icon: FileText,
      href: '/admin/services',
      accent: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400',
      bar: 'bg-blue-500',
    },
    {
      label: 'Total Agencies',
      value: agencies.length,
      icon: Building2,
      href: '/admin/agencies',
      accent: 'bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400',
      bar: 'bg-violet-500',
    },
    {
      label: 'Active Services',
      value: activeServices.length,
      icon: CheckCircle2,
      href: '/admin/services',
      accent: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
      bar: 'bg-emerald-500',
    },
    {
      label: 'Featured Services',
      value: featuredServices.length,
      icon: TrendingUp,
      href: '/admin/services',
      accent: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400',
      bar: 'bg-amber-500',
    },
    {
      label: 'Feedback',
      value: feedbacks.length,
      icon: MessageSquare,
      href: '/admin/feedbacks',
      accent: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400',
      bar: 'bg-rose-500',
    },
  ];

  const quickActions = [
    { label: 'New Agency', description: 'Register a government agency', href: '/admin/agencies/new', icon: Building2 },
    { label: 'New Service', description: 'Add a government service', href: '/admin/services/new', icon: FileText },
    { label: 'Manage Steps', description: 'Add or edit service steps', href: '/admin/steps', icon: ListChecks },
    {
      label: 'Manage Requirements',
      description: 'Edit step requirements',
      href: '/admin/requirements',
      icon: ClipboardList,
    },
  ];

  return (
    <div>
      {/* ── Header banner ─────────────────────────────────── */}
      <div className="relative overflow-hidden">
        <div className="bg-navy-dark px-8 py-6">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 40px)',
            }}
          />
          {/* Radial gold glow */}
          <div className="absolute top-0 right-0 w-[300px] h-[200px] bg-gold/[0.04] rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex items-end justify-between">
            <div>
              <p className="text-white/40 text-xs font-medium uppercase tracking-widest mb-1">
                Gov Requirements Tracker
              </p>
              <h1 className="font-display font-bold text-2xl text-white leading-tight">Admin Dashboard</h1>
              <p className="text-white/40 text-sm mt-1">
                {services.length} services across {agencies.length} agencies
              </p>
            </div>
            <Link
              href="/admin/services/new"
              className="flex items-center gap-2 bg-gold text-navy-dark text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-gold-light transition-all duration-200 active:scale-95 shrink-0 shadow-lg shadow-gold/20"
            >
              <Plus className="w-4 h-4" />
              New Service
            </Link>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* ── KPI cards ──────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {stats.map(({ label, value, icon: Icon, href, accent, bar }) => (
            <Link
              key={label}
              href={href}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-white/[0.07] p-5 hover:border-gray-200 dark:hover:border-white/10 hover:shadow-md dark:hover:shadow-black/20 hover:-translate-y-0.5 transition-all duration-200 flex flex-col gap-3 overflow-hidden"
            >
              {/* Left accent bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${bar} rounded-r-full`} />

              <div className="flex items-start justify-between">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-200 dark:text-gray-700 group-hover:text-gray-400 group-hover:translate-x-0.5 transition-all duration-200" />
              </div>
              <div>
                <p className="text-3xl font-display font-bold text-navy dark:text-white leading-none">{value}</p>
                <p className="text-xs text-gray-400 mt-1">{label}</p>
              </div>
              <div className="h-[2px] w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${bar}`} style={{ width: value > 0 ? '100%' : '0%' }} />
              </div>
            </Link>
          ))}
        </div>

        {/* ── Bottom grid ────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent Services — 2/3 width */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-white/[0.07] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50 dark:border-white/5">
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Recent Services</h2>
                <p className="text-[11px] text-gray-400 mt-0.5">Last {Math.min(services.length, 6)} added</p>
              </div>
              <Link
                href="/admin/services"
                className="inline-flex items-center gap-1 text-xs text-navy/50 hover:text-navy dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200 font-medium"
              >
                View all
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {services.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm text-gray-400">No services yet.</p>
                <Link
                  href="/admin/services/new"
                  className="text-xs text-navy dark:text-gold hover:underline mt-1 inline-block"
                >
                  Create the first service
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-50 dark:divide-white/5">
                {services.slice(0, 6).map((service, i) => (
                  <div
                    key={service.id}
                    className={`flex items-center gap-4 px-5 py-3.5 hover:bg-navy/[0.02] dark:hover:bg-white/[0.03] transition-colors duration-150 group ${i % 2 === 1 ? 'bg-gray-50/40 dark:bg-white/[0.02]' : ''}`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-navy/5 dark:bg-white/5 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-navy/50 dark:text-gray-400">
                        {service.agency?.acronym?.slice(0, 3) ?? '—'}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{service.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-gray-400">{service.agency?.name ?? 'Unknown agency'}</span>
                        {service.isActive ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                            <span className="w-1 h-1 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500">
                            <span className="w-1 h-1 rounded-full bg-gray-400" />
                            Inactive
                          </span>
                        )}
                      </div>
                    </div>

                    <Link
                      href={`/admin/services/${service.slug}/edit`}
                      className="text-xs text-gray-300 hover:text-navy dark:text-gray-600 dark:hover:text-gold font-medium transition-colors duration-200 opacity-0 group-hover:opacity-100 shrink-0"
                    >
                      Edit
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions — 1/3 width */}
          <div className="flex flex-col gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-white/[0.07] overflow-hidden flex-1">
              <div className="px-5 py-4 border-b border-gray-50 dark:border-white/5">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Quick Actions</h2>
                <p className="text-[11px] text-gray-400 mt-0.5">Common tasks</p>
              </div>
              <div className="p-3 space-y-1">
                {quickActions.map(({ label, description, href, icon: Icon }) => (
                  <Link
                    key={label}
                    href={href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 hover:border-gray-200 dark:hover:border-white/10 transition-all duration-150 group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-navy/5 dark:bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-navy/10 dark:group-hover:bg-white/10 transition-colors duration-150">
                      <Icon className="w-3.5 h-3.5 text-navy/50 group-hover:text-navy/70 dark:text-gray-400 dark:group-hover:text-gray-300 transition-colors duration-150" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{label}</p>
                      <p className="text-[11px] text-gray-400 truncate">{description}</p>
                    </div>
                    <ChevronRight className="w-3 h-3 text-gray-200 dark:text-gray-700 group-hover:text-gold group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Agencies mini-list */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-white/[0.07] overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50 dark:border-white/5">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Agencies</h2>
                <Link
                  href="/admin/agencies"
                  className="inline-flex items-center gap-1 text-xs text-navy/50 hover:text-navy dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200 font-medium"
                >
                  All <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              {agencies.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-xs text-gray-400">No agencies yet.</p>
                </div>
              ) : (
                <div className="p-3 space-y-1">
                  {agencies.slice(0, 4).map((agency) => (
                    <Link
                      key={agency.id}
                      href="/admin/agencies"
                      className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-150 group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-gold-dark">{agency.acronym.slice(0, 2)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                          {agency.acronym}
                        </p>
                        <p className="text-[11px] text-gray-400 truncate">{agency.name}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
