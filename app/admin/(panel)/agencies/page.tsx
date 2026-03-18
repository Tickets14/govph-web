export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus, ExternalLink } from 'lucide-react';
import { getAgencies } from '@/lib/api';
import { AgencyActions } from '@/components/admin/AgencyActions';

export const metadata: Metadata = { title: 'Manage Agencies' };

export default async function AdminAgenciesPage() {
  const agencies = await getAgencies();

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-7 animate-fade-in-up">
        <div>
          <h1 className="font-display font-bold text-xl text-navy">Agencies</h1>
          <p className="text-xs text-gray-400 mt-1">{agencies.length} agencies total</p>
        </div>
        <Link
          href="/admin/agencies/new"
          className="inline-flex items-center gap-1.5 bg-navy text-white text-xs font-medium px-4 py-2 rounded-xl hover:bg-navy/90 active:scale-95 transition-all duration-200"
        >
          <Plus className="w-3.5 h-3.5" /> New Agency
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-fade-in-up animation-delay-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Agency
              </th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">
                Description
              </th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                Website
              </th>
              <th className="px-5 py-3 text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {agencies.map((agency, i) => (
              <tr
                key={agency.id}
                className="hover:bg-gray-50/70 transition-colors duration-150 animate-fade-in-up"
                style={{ animationDelay: `${i * 30 + 150}ms` }}
              >
                <td className="px-5 py-3.5">
                  <p className="font-semibold text-gray-900 text-sm">{agency.acronym}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{agency.name}</p>
                </td>
                <td className="px-5 py-3.5 hidden md:table-cell text-gray-500 text-xs max-w-xs">
                  <p className="line-clamp-1">{agency.description}</p>
                </td>
                <td className="px-5 py-3.5 hidden lg:table-cell">
                  {agency.website ? (
                    <a
                      href={agency.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-navy transition-colors duration-200"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-gray-200 text-xs">—</span>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  <AgencyActions id={agency.id} acronym={agency.acronym} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {agencies.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-sm text-gray-400">No agencies yet.</p>
            <Link href="/admin/agencies/new" className="text-xs text-navy mt-1 inline-block hover:underline">
              Add your first agency
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
