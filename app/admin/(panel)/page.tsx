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
} from 'lucide-react';
import { getServices, getAgencies } from '@/lib/api';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function AdminDashboardPage() {
  const [services, agencies] = await Promise.all([getServices(), getAgencies()]);

  const activeServices = services.filter((s) => s.isActive);
  const featuredServices = services.filter((s) => s.isFeatured);

  const stats = [
    {
      label: 'Total Services',
      value: services.length,
      icon: FileText,
      href: '/admin/services',
      accent: 'bg-blue-50 text-blue-600',
      bar: 'bg-blue-500',
    },
    {
      label: 'Total Agencies',
      value: agencies.length,
      icon: Building2,
      href: '/admin/agencies',
      accent: 'bg-violet-50 text-violet-600',
      bar: 'bg-violet-500',
    },
    {
      label: 'Active Services',
      value: activeServices.length,
      icon: CheckCircle2,
      href: '/admin/services',
      accent: 'bg-emerald-50 text-emerald-600',
      bar: 'bg-emerald-500',
    },
    {
      label: 'Featured Services',
      value: featuredServices.length,
      icon: TrendingUp,
      href: '/admin/services',
      accent: 'bg-amber-50 text-amber-600',
      bar: 'bg-amber-500',
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
    <div className="p-8 animate-fade-in">
      {/* ── Header banner ──────────────────────────────────── */}
      <div className="relative mb-8 rounded-2xl overflow-hidden animate-fade-in-up">
        <div className="bg-[#111b30] px-7 py-6">
          {/* subtle grid texture */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 40px)',
            }}
          />
          <div className="relative flex items-end justify-between">
            <div>
              <p className="text-white/40 text-xs font-medium uppercase tracking-widest mb-1">GovPH Tracker</p>
              <h1 className="font-display font-bold text-2xl text-white leading-tight">Admin Dashboard</h1>
              <p className="text-white/40 text-sm mt-1">
                {services.length} services across {agencies.length} agencies
              </p>
            </div>
            <Link
              href="/admin/services/new"
              className="flex items-center gap-2 bg-gold text-[#111b30] text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-gold-light transition-all duration-200 active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4" />
              New Service
            </Link>
          </div>
        </div>
      </div>

      {/* ── KPI cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, href, accent, bar }, i) => (
          <Link
            key={label}
            href={href}
            style={{ animationDelay: `${i * 60 + 80}ms` }}
            className="group bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 hover:shadow-md transition-all duration-200 animate-fade-in-up flex flex-col gap-3"
          >
            <div className="flex items-start justify-between">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent}`}>
                <Icon className="w-4 h-4" />
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-gray-200 group-hover:text-gray-400 group-hover:translate-x-0.5 transition-all duration-200" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-navy leading-none">{value}</p>
              <p className="text-xs text-gray-400 mt-1">{label}</p>
            </div>
            {/* progress bar accent */}
            <div className="h-0.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${bar}`} style={{ width: value > 0 ? '100%' : '0%' }} />
            </div>
          </Link>
        ))}
      </div>

      {/* ── Bottom grid ────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Services — takes 2/3 width */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 animate-fade-in-up animation-delay-300 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div>
              <h2 className="font-semibold text-gray-900 text-sm">Recent Services</h2>
              <p className="text-[11px] text-gray-400 mt-0.5">Last {Math.min(services.length, 6)} added</p>
            </div>
            <Link
              href="/admin/services"
              className="inline-flex items-center gap-1 text-xs text-navy/50 hover:text-navy transition-colors duration-200 font-medium"
            >
              View all
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {services.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-400">No services yet.</p>
              <Link href="/admin/services/new" className="text-xs text-navy hover:underline mt-1 inline-block">
                Create the first service
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {services.slice(0, 6).map((service, i) => (
                <div
                  key={service.id}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/60 transition-colors duration-150 animate-fade-in-up group"
                  style={{ animationDelay: `${i * 35 + 380}ms` }}
                >
                  {/* Agency badge */}
                  <div className="w-8 h-8 rounded-lg bg-navy/[0.05] flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-navy/50">
                      {service.agency?.acronym?.slice(0, 3) ?? '—'}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{service.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-gray-400">{service.agency?.name ?? 'Unknown agency'}</span>
                      {service.isActive ? (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-600">
                          Active
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-400">
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>

                  <Link
                    href={`/admin/services/${service.slug}/edit`}
                    className="text-xs text-gray-300 hover:text-navy font-medium transition-colors duration-200 opacity-0 group-hover:opacity-100 shrink-0"
                  >
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions — takes 1/3 width */}
        <div className="flex flex-col gap-4 animate-fade-in-up animation-delay-400">
          {/* Quick actions card */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex-1">
            <div className="px-5 py-4 border-b border-gray-50">
              <h2 className="font-semibold text-gray-900 text-sm">Quick Actions</h2>
              <p className="text-[11px] text-gray-400 mt-0.5">Common tasks</p>
            </div>
            <div className="p-3 space-y-1">
              {quickActions.map(({ label, description, href, icon: Icon }, i) => (
                <Link
                  key={label}
                  href={href}
                  style={{ animationDelay: `${i * 40 + 450}ms` }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-all duration-150 group animate-fade-in-up"
                >
                  <div className="w-7 h-7 rounded-lg bg-navy/[0.05] flex items-center justify-center shrink-0 group-hover:bg-navy/10 transition-colors duration-150">
                    <Icon className="w-3.5 h-3.5 text-navy/50 group-hover:text-navy/70 transition-colors duration-150" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700">{label}</p>
                    <p className="text-[11px] text-gray-400 truncate">{description}</p>
                  </div>
                  <ChevronRight className="w-3 h-3 text-gray-200 group-hover:text-gray-400 group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* Agencies mini-list */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
              <h2 className="font-semibold text-gray-900 text-sm">Agencies</h2>
              <Link
                href="/admin/agencies"
                className="inline-flex items-center gap-1 text-xs text-navy/50 hover:text-navy transition-colors duration-200 font-medium"
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
                {agencies.slice(0, 4).map((agency, i) => (
                  <Link
                    key={agency.id}
                    href="/admin/agencies"
                    style={{ animationDelay: `${i * 30 + 500}ms` }}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors duration-150 group animate-fade-in-up"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-gold-dark">{agency.acronym.slice(0, 2)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-700 truncate">{agency.acronym}</p>
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
  );
}
