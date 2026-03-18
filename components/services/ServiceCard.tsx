import Link from 'next/link';
import { Clock, PhilippinePeso, ArrowRight, CheckCircle } from 'lucide-react';
import type { Service } from '@/types';
import { SERVICE_CATEGORIES } from '@/lib/constants';

interface ServiceCardProps {
  service: Service;
  completedSteps?: number;
}

const categoryColors: Record<string, string> = {
  identity: 'bg-blue-50 text-blue-600',
  travel: 'bg-sky-50 text-sky-600',
  vehicle: 'bg-orange-50 text-orange-600',
  business: 'bg-violet-50 text-violet-600',
  'social-services': 'bg-pink-50 text-pink-600',
  healthcare: 'bg-green-50 text-green-600',
  education: 'bg-yellow-50 text-yellow-600',
  tax: 'bg-red-50 text-red-600',
  property: 'bg-teal-50 text-teal-600',
  other: 'bg-gray-50 text-gray-600',
};

export function ServiceCard({ service, completedSteps }: ServiceCardProps) {
  const category = SERVICE_CATEGORIES.find((c) => c.value === service.category);
  const total = service.steps.length;
  const progress = completedSteps !== undefined ? completedSteps : 0;
  const hasProgress = completedSteps !== undefined && completedSteps > 0;

  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex flex-col bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 hover:shadow-sm transition-all duration-200 h-full"
    >
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex-1 min-w-0">
          {category && (
            <span
              className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-full mb-2 ${categoryColors[service.category] ?? 'bg-gray-100 text-gray-600'}`}
            >
              {category.label}
            </span>
          )}
          <h3 className="font-semibold text-gray-900 text-sm leading-snug group-hover:text-navy transition-colors duration-200 line-clamp-2">
            {service.title}
          </h3>
        </div>
        <div className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:bg-navy group-hover:-translate-x-0.5">
          <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-white transition-colors duration-200" />
        </div>
      </div>

      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-4 flex-1">{service.description}</p>

      <div className="flex items-center gap-3 text-[11px] text-gray-400">
        {service.processingTime && (
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {service.processingTime}
          </span>
        )}
        {service.totalFee !== undefined && (
          <span className="flex items-center gap-1">
            <PhilippinePeso className="w-3 h-3" />
            {service.totalFee === 0 ? 'Libre' : `₱${service.totalFee.toLocaleString()}`}
          </span>
        )}
        {service.agency && <span className="ml-auto font-semibold text-navy/50">{service.agency.acronym}</span>}
      </div>

      {hasProgress && (
        <div className="mt-3 pt-3 border-t border-gray-50">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] text-gray-400 flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-500" />
              In Progress
            </span>
            <span className="text-[11px] font-semibold text-navy">
              {progress}/{total}
            </span>
          </div>
          <div className="h-1 rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-gold transition-all duration-300"
              style={{ width: `${(progress / total) * 100}%` }}
            />
          </div>
        </div>
      )}
    </Link>
  );
}
