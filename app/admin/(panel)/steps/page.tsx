import type { Metadata } from 'next';
import { getServices, getAgencies } from '@/lib/api';
import { StepsClient } from './StepsClient';

export const metadata: Metadata = { title: 'Manage Steps' };

export default async function AdminStepsPage() {
  const [services, agencies] = await Promise.all([getServices(), getAgencies()]);

  return (
    <div className="p-8 animate-fade-in max-w-3xl">
      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="font-display font-bold text-xl text-navy">Steps</h1>
        <p className="text-xs text-gray-400 mt-1">Manage steps for each government service.</p>
      </div>

      {services.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
          <p className="text-sm text-gray-400">No services found. Create a service first.</p>
        </div>
      ) : (
        <StepsClient services={services} agencies={agencies} />
      )}
    </div>
  );
}
