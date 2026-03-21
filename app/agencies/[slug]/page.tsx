import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/agencies"
        className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-navy mb-8 transition-colors duration-200 animate-fade-in"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Agencies
      </Link>

      {/* Agency header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8 animate-fade-in-up">
        <div className="flex items-start gap-5">
          <div className="w-15 h-15 rounded-2xl bg-navy/5 flex items-center justify-center shrink-0 overflow-hidden">
            {agency.logoUrl ? (
              <Image
                src={agency.logoUrl}
                alt={agency.acronym}
                width={40}
                height={40}
                className="w-10 h-10 object-contain"
              />
            ) : (
              <span className="font-display font-extrabold text-navy text-xs text-center leading-tight">
                {agency.acronym}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-display font-bold text-2xl text-navy tracking-tight">{agency.name}</h1>
            <p className="text-sm text-gold font-medium mt-0.5">{agency.acronym}</p>
            <p className="text-sm text-gray-500 mt-3 leading-relaxed">{agency.description}</p>
            {agency.website && (
              <a
                href={agency.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-4 text-xs font-medium text-navy/60 hover:text-navy transition-colors duration-200 border border-gray-100 rounded-lg px-3 py-1.5"
              >
                <Globe className="w-3.5 h-3.5" />
                Official Website
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="animate-fade-in-up animation-delay-100">
        <h2 className="font-display font-semibold text-lg text-navy mb-5">
          Services
          <span className="text-gray-300 font-normal ml-1.5">({agency.services?.length ?? 0})</span>
        </h2>
        {agency.services && agency.services.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {agency.services.map((service, i) => (
              <div key={service.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 50 + 150}ms` }}>
                <ServiceCard service={service} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 py-14 text-center">
            <p className="text-sm text-gray-400">No services available for this agency yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
