import Link from 'next/link';
import { Clock, PhilippinePeso, ArrowRight, CheckCircle } from 'lucide-react';
import type { Service } from '@/types';
import { SERVICE_CATEGORIES } from '@/lib/constants';
import { BookmarkButton } from './BookmarkButton';

interface ServiceCardProps {
  service: Service;
  completedSteps?: number;
}

const categoryColors: Record<string, string> = {
  civil_registry: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400',
  foreign_affairs: 'bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400',
  housing: 'bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400',
  business: 'bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400',
  clearance: 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400',
  government: 'bg-slate-50 text-slate-600 dark:bg-slate-950/50 dark:text-slate-400',
  professional: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400',
  health: 'bg-green-50 text-green-600 dark:bg-green-950/50 dark:text-green-400',
  social_security: 'bg-pink-50 text-pink-600 dark:bg-pink-950/50 dark:text-pink-400',
  transport: 'bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400',
  identification: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-400',
  overseas: 'bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400',
  tax: 'bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400',
  social_services: 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400',
  other: 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

export function ServiceCard({ service, completedSteps }: ServiceCardProps) {
  const category = SERVICE_CATEGORIES.find((c) => c.value === service.category);
  const total = service.steps.length;
  const progress = completedSteps !== undefined ? completedSteps : 0;
  const hasProgress = completedSteps !== undefined && completedSteps > 0;

  return (
    <div className="group relative flex flex-col bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-white/10 p-5 hover:border-gray-200 dark:hover:border-white/20 hover:shadow-sm transition-all duration-200 h-full">
      {/* Bookmark button */}
      <div className="absolute top-3 right-3 z-10">
        <BookmarkButton serviceId={service.id} />
      </div>

      <Link href={`/services/${service.slug}`} className="flex flex-col h-full">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex-1 min-w-0">
            {category && (
              <span
                className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-full mb-2 ${categoryColors[service.category] ?? 'bg-gray-100 text-gray-600'}`}
              >
                {category.label}
              </span>
            )}
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-snug group-hover:text-navy dark:group-hover:text-gold transition-colors duration-200 line-clamp-2 pr-6">
              {service.title}
            </h3>
          </div>
          <div className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:bg-navy group-hover:-translate-x-0.5">
            <ArrowRight className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 group-hover:text-white transition-colors duration-200" />
          </div>
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-2 leading-relaxed mb-4 flex-1">
          {service.description}
        </p>

        <div className="flex items-center gap-3 text-[11px] text-gray-400 dark:text-gray-500">
          {service.processingTime && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {service.processingTime}
            </span>
          )}
          {service.totalFee !== undefined && (
            <span className="flex items-center gap-1">
              <PhilippinePeso className="w-3 h-3" />
              {service.totalFee === 0 ? 'Free' : `₱${service.totalFee.toLocaleString()}`}
            </span>
          )}
          {service.agency && (
            <span className="ml-auto font-semibold text-navy/50 dark:text-white/30">{service.agency.acronym}</span>
          )}
        </div>

        {hasProgress && (
          <div className="mt-3 pt-3 border-t border-gray-50 dark:border-white/5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-gray-400 flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                In Progress
              </span>
              <span className="text-[11px] font-semibold text-navy dark:text-white">
                {progress}/{total}
              </span>
            </div>
            <div className="h-1 rounded-full bg-gray-100 dark:bg-gray-800">
              <div
                className="h-full rounded-full bg-gold transition-all duration-300"
                style={{ width: `${(progress / total) * 100}%` }}
              />
            </div>
          </div>
        )}
      </Link>
    </div>
  );
}
