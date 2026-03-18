export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Clock, PhilippinePeso, ExternalLink, Building2 } from 'lucide-react';
import { getServiceBySlug } from '@/lib/api';
import { SERVICE_CATEGORIES } from '@/lib/constants';
import { ServiceDetailClient } from './ServiceDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: 'Service Not Found' };
  return {
    title: service.title,
    description: service.description,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const category = SERVICE_CATEGORIES.find((c) => c.value === service.category);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <Link
        href="/services"
        className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-navy mb-8 transition-colors duration-200 animate-fade-in"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Bumalik sa Services
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-5 animate-fade-in-up">
            {category && (
              <span className="inline-block text-[11px] font-medium bg-navy/[0.06] text-navy/70 px-3 py-1 rounded-full mb-3">
                {category.label}
              </span>
            )}
            <h1 className="font-display font-bold text-2xl sm:text-[26px] text-navy mb-2 tracking-tight">
              {service.title}
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed mb-5">{service.description}</p>

            <div className="flex flex-wrap gap-4 text-xs text-gray-400 pt-4 border-t border-gray-50">
              {service.processingTime && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-navy/30" />
                  {service.processingTime}
                </span>
              )}
              {service.totalFee !== undefined && (
                <span className="flex items-center gap-1.5">
                  <PhilippinePeso className="w-3.5 h-3.5 text-navy/30" />
                  {service.totalFee === 0 ? 'Libre' : `₱${service.totalFee.toLocaleString()} total`}
                </span>
              )}
            </div>
          </div>

          <div className="animate-fade-in-up animation-delay-100">
            <ServiceDetailClient service={service} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 animate-fade-in-up animation-delay-200">
          {/* Agency info */}
          {service.agency && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-[10px] font-semibold text-gray-300 uppercase tracking-widest mb-3">Ahensya</p>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-navy/[0.05] flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4 text-navy/30" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{service.agency.acronym}</p>
                  <p className="text-xs text-gray-400 leading-snug mt-0.5">{service.agency.name}</p>
                  {service.agency.website && (
                    <a
                      href={service.agency.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-navy/50 hover:text-navy mt-2 transition-colors duration-200"
                    >
                      Pumunta sa website <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Requirements summary */}
          {service.requirements.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-[10px] font-semibold text-gray-300 uppercase tracking-widest mb-3">
                Mga Kailangan ({service.requirements.length})
              </p>
              <ul className="space-y-2">
                {service.requirements.map((req) => (
                  <li key={req.id} className="flex items-start gap-2 text-xs text-gray-600">
                    <span className="w-1 h-1 rounded-full bg-gold mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{req.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tip */}
          <div className="bg-amber-50/60 rounded-2xl border border-amber-100/80 p-5">
            <p className="text-[10px] font-semibold text-amber-500/80 uppercase tracking-widest mb-2">Tip</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              I-verify palagi ang mga requirements direkta sa opisyal na website ng ahensya bago pumunta. Maaaring
              magbago ang mga requirement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
