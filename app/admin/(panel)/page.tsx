export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText, Building2, ArrowRight, TrendingUp } from 'lucide-react';
import { getServices, getAgencies } from '@/lib/api';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function AdminDashboardPage() {
  const [services, agencies] = await Promise.all([getServices(), getAgencies()]);

  const stats = [
    {
      label: 'Total Services',
      value: services.length,
      icon: FileText,
      href: '/admin/services',
    },
    {
      label: 'Total Agencies',
      value: agencies.length,
      icon: Building2,
      href: '/admin/agencies',
    },
    {
      label: 'Featured Services',
      value: services.filter((s) => s.isFeatured).length,
      icon: TrendingUp,
      href: '/admin/services',
    },
  ];

  return (
    <div className="p-8 max-w-5xl animate-fade-in">
      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="font-display font-bold text-xl text-navy">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">Pangkalahatang overview ng GovPH Tracker</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, href }, i) => (
          <Link
            key={label}
            href={href}
            style={{ animationDelay: `${i * 60 + 80}ms` }}
            className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 hover:shadow-sm transition-all duration-200 group animate-fade-in-up"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-9 h-9 rounded-xl bg-navy/[0.05] flex items-center justify-center">
                <Icon className="w-4 h-4 text-navy/60" />
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-gray-200 group-hover:text-navy/40 transition-colors duration-200" />
            </div>
            <p className="text-3xl font-display font-bold text-navy">{value}</p>
            <p className="text-xs text-gray-400 mt-1">{label}</p>
          </Link>
        ))}
      </div>

      {/* Recent services */}
      <div className="bg-white rounded-2xl border border-gray-100 animate-fade-in-up animation-delay-300">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h2 className="font-semibold text-gray-900 text-sm">Recent Services</h2>
          <Link href="/admin/services" className="text-xs text-navy/50 hover:text-navy transition-colors duration-200">
            View all
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {services.slice(0, 5).map((service, i) => (
            <div
              key={service.id}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50/50 transition-colors duration-150 animate-fade-in-up"
              style={{ animationDelay: `${i * 40 + 400}ms` }}
            >
              <div>
                <p className="text-sm font-medium text-gray-800">{service.title}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {service.agency?.acronym} · {service.category}
                </p>
              </div>
              <Link
                href={`/admin/services/${service.id}/edit`}
                className="text-xs text-navy/50 hover:text-navy transition-colors duration-200 font-medium"
              >
                Edit
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
