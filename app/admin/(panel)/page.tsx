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
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Total Agencies',
      value: agencies.length,
      icon: Building2,
      href: '/admin/agencies',
      color: 'bg-violet-50 text-violet-600',
    },
    {
      label: 'Featured Services',
      value: services.filter((s) => s.isFeatured).length,
      icon: TrendingUp,
      href: '/admin/services',
      color: 'bg-amber-50 text-amber-600',
    },
  ];

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl text-navy">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Pangkalahatang overview ng GovPH Tracker</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, href, color }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-navy transition-colors" />
            </div>
            <p className="text-3xl font-display font-bold text-navy">{value}</p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
          </Link>
        ))}
      </div>

      {/* Recent services */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Recent Services</h2>
          <Link href="/admin/services" className="text-xs text-navy hover:underline">
            View all
          </Link>
        </div>
        <div className="space-y-2">
          {services.slice(0, 5).map((service) => (
            <div
              key={service.id}
              className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0"
            >
              <div>
                <p className="text-sm font-medium text-gray-800">{service.title}</p>
                <p className="text-xs text-gray-400">
                  {service.agency?.acronym} · {service.category}
                </p>
              </div>
              <Link href={`/admin/services/${service.id}/edit`} className="text-xs text-navy hover:underline">
                Edit
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
