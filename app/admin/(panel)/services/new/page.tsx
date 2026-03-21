import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getAgencies } from '@/lib/api';
import { ServiceForm } from '@/components/admin/ServiceForm';

export const metadata: Metadata = { title: 'New Service' };

export default async function NewServicePage() {
  const agencies = await getAgencies();

  return (
    <div className="p-8 animate-fade-in">
      <Link
        href="/admin/services"
        className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-navy mb-8 transition-colors duration-200"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Services
      </Link>
      <h1 className="font-display font-bold text-xl text-navy mb-1">Create New Service</h1>
      <p className="text-sm text-gray-400 mb-8">Add a new government service with steps and requirements.</p>
      <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-fade-in-up animation-delay-100">
        <ServiceForm agencies={agencies} />
      </div>
    </div>
  );
}
