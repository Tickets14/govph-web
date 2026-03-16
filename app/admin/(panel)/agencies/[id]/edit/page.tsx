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
    <div className="p-6">
      <Link
        href="/admin/agencies"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Agencies
      </Link>
      <h1 className="font-display font-bold text-2xl text-navy mb-1">Edit Agency</h1>
      <p className="text-sm text-gray-500 mb-6">
        {agency.acronym} — {agency.name}
      </p>
      <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-xl">
        <AgencyEditForm agency={agency} />
      </div>
    </div>
  );
}
