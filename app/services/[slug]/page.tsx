import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clock, PhilippinePeso, ExternalLink, Building2 } from "lucide-react";
import { getServiceBySlug, getServices } from "@/lib/api";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import { ServiceDetailClient } from "./ServiceDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "Service Not Found" };
  return {
    title: service.title,
    description: service.description,
  };
}

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const category = SERVICE_CATEGORIES.find((c) => c.value === service.category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Back */}
      <Link
        href="/services"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Bumalik sa Services
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            {category && (
              <span className="inline-block text-xs font-medium bg-navy/8 text-navy px-3 py-1 rounded-full mb-3">
                {category.label}
              </span>
            )}
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-navy mb-2">
              {service.title}
            </h1>
            <p className="text-gray-600 leading-relaxed mb-4">{service.description}</p>

            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              {service.processingTime && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-navy/50" />
                  {service.processingTime}
                </span>
              )}
              {service.totalFee !== undefined && (
                <span className="flex items-center gap-1.5">
                  <PhilippinePeso className="w-4 h-4 text-navy/50" />
                  {service.totalFee === 0 ? "Libre" : `₱${service.totalFee.toLocaleString()} total`}
                </span>
              )}
            </div>
          </div>

          <ServiceDetailClient service={service} />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Agency info */}
          {service.agency && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Ahensya</p>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-navy/40" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{service.agency.acronym}</p>
                  <p className="text-xs text-gray-500 leading-snug">{service.agency.name}</p>
                  {service.agency.website && (
                    <a
                      href={service.agency.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-navy hover:text-navy/70 mt-1.5 transition-colors"
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
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Mga Kailangan ({service.requirements.length})
              </p>
              <ul className="space-y-2">
                {service.requirements.map((req) => (
                  <li key={req.id} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
                    <span>{req.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tips */}
          <div className="bg-gold/10 rounded-2xl border border-gold/20 p-5">
            <p className="text-xs font-semibold text-gold/80 uppercase tracking-wider mb-2">💡 Tip</p>
            <p className="text-xs text-gray-700 leading-relaxed">
              I-verify palagi ang mga requirements direkta sa opisyal na website ng ahensya bago pumunta.
              Maaaring magbago ang mga requirement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
