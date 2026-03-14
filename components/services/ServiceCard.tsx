import Link from 'next/link';
import { Clock, PhilippinePeso, ArrowRight, CheckCircle } from 'lucide-react';
import type { Service } from '@/types';
import { SERVICE_CATEGORIES } from '@/lib/constants';

interface ServiceCardProps {
  service: Service;
  completedSteps?: number;
}

const categoryColors: Record<string, string> = {
  identity: 'bg-blue-50 text-blue-700',
  travel: 'bg-sky-50 text-sky-700',
  vehicle: 'bg-orange-50 text-orange-700',
  business: 'bg-violet-50 text-violet-700',
  'social-services': 'bg-pink-50 text-pink-700',
  healthcare: 'bg-green-50 text-green-700',
  education: 'bg-yellow-50 text-yellow-700',
  tax: 'bg-red-50 text-red-700',
  property: 'bg-teal-50 text-teal-700',
  other: 'bg-gray-50 text-gray-700',
};

export function ServiceCard({ service, completedSteps }: ServiceCardProps) {
  const category = SERVICE_CATEGORIES.find((c) => c.value === service.category);
  const total = service.steps.length;
  const progress = completedSteps !== undefined ? completedSteps : 0;
  const hasProgress = completedSteps !== undefined && completedSteps > 0;

  return (
    <Link
      href={`/services/${service.slug}`}
      className="group block bg-white rounded-2xl border border-gray-100 p-5 hover:border-navy/30 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          {category && (
            <span
              className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-2 ${categoryColors[service.category] ?? 'bg-gray-100 text-gray-600'}`}
            >
              {category.label}
            </span>
          )}
          <h3 className="font-semibold text-gray-900 text-sm leading-snug group-hover:text-navy transition-colors line-clamp-2">
            {service.title}
          </h3>
        </div>
        <div className="shrink-0 w-9 h-9 rounded-xl bg-[#F7F8FA] group-hover:bg-navy/5 flex items-center justify-center transition-colors">
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-navy transition-colors" />
        </div>
      </div>

      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">{service.description}</p>

      <div className="flex items-center gap-3 text-xs text-gray-500">
        {service.processingTime && (
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {service.processingTime}
          </span>
        )}
        {service.totalFee !== undefined && (
          <span className="flex items-center gap-1">
            <PhilippinePeso className="w-3.5 h-3.5" />
            {service.totalFee === 0 ? 'Libre' : `₱${service.totalFee.toLocaleString()}`}
          </span>
        )}
        {service.agency && <span className="ml-auto font-medium text-navy/70">{service.agency.acronym}</span>}
      </div>

      {hasProgress && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-500" />
              In Progress
            </span>
            <span className="text-xs font-medium text-navy">
              {progress}/{total}
            </span>
          </div>
          <div className="h-1 rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-gold transition-all"
              style={{ width: `${(progress / total) * 100}%` }}
            />
          </div>
        </div>
      )}
    </Link>
  );
}
