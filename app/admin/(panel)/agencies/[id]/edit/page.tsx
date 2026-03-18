export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import { getAgencies } from '@/lib/api';
import { AgencyEditForm } from '@/components/admin/AgencyEditForm';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const agencies = await getAgencies();
  const agency = agencies.find((a) => a.id === id);
  return { title: agency ? `Edit: ${agency.acronym}` : 'Edit Agency' };
}

export default async function EditAgencyPage({ params }: Props) {
  const { id } = await params;
  const agencies = await getAgencies();
  const agency = agencies.find((a) => a.id === id);
  if (!agency) notFound();

  return (
    <div className="p-8 animate-fade-in">
      <Link
        href="/admin/agencies"
        className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-navy mb-8 transition-colors duration-200"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Agencies
      </Link>
      <h1 className="font-display font-bold text-xl text-navy mb-1">Edit Agency</h1>
      <p className="text-sm text-gray-400 mb-8">
        {agency.acronym} — {agency.name}
      </p>
      <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-lg animate-fade-in-up animation-delay-100">
        <AgencyEditForm agency={agency} />
      </div>
    </div>
  );
}
