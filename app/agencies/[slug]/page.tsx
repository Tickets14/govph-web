export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Globe } from 'lucide-react';
import { getAgencyBySlug } from '@/lib/api';
import { ServiceCard } from '@/components/services/ServiceCard';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const agency = await getAgencyBySlug(slug);
  if (!agency) return { title: 'Agency Not Found' };
  return {
    title: agency.acronym,
    description: agency.description,
  };
}

export default async function AgencyDetailPage({ params }: Props) {
  const { slug } = await params;
  const agency = await getAgencyBySlug(slug);
  if (!agency) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Link
        href="/agencies"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Bumalik sa Agencies
      </Link>

      {/* Agency header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-navy/5 flex items-center justify-center shrink-0">
            <span className="font-display font-extrabold text-navy text-sm text-center leading-tight">
              {agency.acronym}
            </span>
          </div>
          <div className="flex-1">
            <h1 className="font-display font-bold text-2xl text-navy">{agency.name}</h1>
            <p className="text-sm text-gold font-medium mt-0.5">{agency.acronym}</p>
            <p className="text-gray-600 mt-2 leading-relaxed">{agency.description}</p>
            {agency.website && (
              <a
                href={agency.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-navy hover:text-navy/70 transition-colors"
              >
                <Globe className="w-4 h-4" />
                Official Website
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Services */}
      <div>
        <h2 className="font-display font-bold text-xl text-navy mb-4">Mga Serbisyo ({agency.services?.length ?? 0})</h2>
        {agency.services && agency.services.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {agency.services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
            <p className="text-gray-400">Wala pang serbisyo para sa ahensyang ito.</p>
          </div>
        )}
      </div>
    </div>
  );
}
