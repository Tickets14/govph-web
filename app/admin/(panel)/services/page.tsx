export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getServices, getAgencies } from '@/lib/api';
import { ServiceActions } from '@/components/admin/ServiceActions';

export const metadata: Metadata = { title: 'Manage Services' };

export default async function AdminServicesPage() {
  const [services, agencies] = await Promise.all([getServices(), getAgencies()]);

  const agencyById = Object.fromEntries(agencies.map((a) => [a.id, a]));

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-7 animate-fade-in-up">
        <div>
          <h1 className="font-display font-bold text-xl text-navy">Services</h1>
          <p className="text-xs text-gray-400 mt-1">{services.length} services total</p>
        </div>
        <Link
          href="/admin/services/new"
          className="inline-flex items-center gap-1.5 bg-navy text-white text-xs font-medium px-4 py-2 rounded-xl hover:bg-navy/90 active:scale-95 transition-all duration-200"
        >
          <Plus className="w-3.5 h-3.5" /> New Service
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-fade-in-up animation-delay-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Service
              </th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                Agency
              </th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">
                Est. Time
              </th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                Status
              </th>
              <th className="px-5 py-3 text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {services.map((service, i) => {
              const agency = agencyById[service.agencyId];
              return (
                <tr
                  key={service.id}
                  className="hover:bg-gray-50/70 transition-colors duration-150 animate-fade-in-up"
                  style={{ animationDelay: `${i * 30 + 150}ms` }}
                >
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-900 text-sm">{service.title}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{service.slug}</p>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell text-xs text-gray-500">
                    {agency ? <span>{agency.acronym}</span> : <span className="text-gray-200">—</span>}
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell text-xs text-gray-400">
                    {service.processingTime ?? <span className="text-gray-200">—</span>}
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell">
                    {service.isActive ? (
                      <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                        Active
                      </span>
                    ) : (
                      <span className="text-[11px] text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">Inactive</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <ServiceActions id={service.id} slug={service.slug} name={service.title} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {services.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-sm text-gray-400">No services yet.</p>
            <Link href="/admin/services/new" className="text-xs text-navy mt-1 inline-block hover:underline">
              Add your first service
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
