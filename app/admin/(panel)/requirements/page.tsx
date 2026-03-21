import type { Metadata } from 'next';
import { getServices, getAgencies } from '@/lib/api';
import { RequirementsClient } from './RequirementsClient';

export const metadata: Metadata = { title: 'Manage Requirements' };

export default async function AdminRequirementsPage() {
  const [services, agencies] = await Promise.all([getServices(), getAgencies()]);

  return (
    <div className="p-8 animate-fade-in max-w-3xl">
      <div className="mb-8 animate-fade-in-up">
        <h1 className="font-display font-bold text-xl text-navy">Requirements</h1>
        <p className="text-xs text-gray-400 mt-1">Manage requirements for each step in a government service.</p>
      </div>

      {services.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
          <p className="text-sm text-gray-400">No services found. Create a service first.</p>
        </div>
      ) : (
        <RequirementsClient services={services} agencies={agencies} />
      )}
    </div>
  );
}
