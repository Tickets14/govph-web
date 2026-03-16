export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus, ExternalLink } from 'lucide-react';
import { getAgencies } from '@/lib/api';

export const metadata: Metadata = { title: 'Manage Agencies' };

export default async function AdminAgenciesPage() {
  const agencies = await getAgencies();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-navy">Agencies</h1>
          <p className="text-sm text-gray-500 mt-0.5">{agencies.length} agencies total</p>
        </div>
        <Link
          href="/admin/agencies/new"
          className="inline-flex items-center gap-2 bg-navy text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-navy/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> New Agency
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Agency
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Description
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Website
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {agencies.map((agency) => (
              <tr key={agency.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-semibold text-gray-900">{agency.acronym}</p>
                  <p className="text-xs text-gray-500">{agency.name}</p>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-gray-600 text-xs max-w-xs">
                  <p className="line-clamp-1">{agency.description}</p>
                </td>
                <td className="px-4 py-3 text-right">
                  {agency.website && (
                    <a
                      href={agency.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-navy hover:text-navy/70 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
