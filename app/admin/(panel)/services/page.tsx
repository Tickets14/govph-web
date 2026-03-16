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
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-navy">Services</h1>
          <p className="text-sm text-gray-500 mt-0.5">{services.length} services total</p>
        </div>
        <Link
          href="/admin/services/new"
          className="inline-flex items-center gap-2 bg-navy text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-navy/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> New Service
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Service
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                Agency
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Est. Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {services.map((service) => {
              const agency = agencyById[service.agencyId];
              return (
                <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{service.title}</p>
                    <p className="text-xs text-gray-400">{service.slug}</p>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-gray-600">
                    {agency ? <span>{agency.acronym}</span> : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-gray-500 text-xs">
                    {service.processingTime ?? <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {service.isActive ? (
                      <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Inactive</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <ServiceActions id={service.id} slug={service.slug} name={service.title} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
