import Link from 'next/link';
import {
  Clock,
  PhilippinePeso,
  CheckCircle,
  MapPin,
  FileText,
  Globe,
  Home,
  Briefcase,
  ShieldCheck,
  Landmark,
  Award,
  Stethoscope,
  Heart,
  Car,
  IdCard,
  Plane,
  Receipt,
  Users,
  MoreHorizontal,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Service } from '@/types';
import { SERVICE_CATEGORIES } from '@/lib/constants';
import { BookmarkButton } from './BookmarkButton';

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  FileText,
  Globe,
  Home,
  Briefcase,
  ShieldCheck,
  Landmark,
  Award,
  Stethoscope,
  Heart,
  Car,
  IdCard,
  Plane,
  Receipt,
  Users,
  MoreHorizontal,
};

interface ServiceCardProps {
  service: Service;
  completedSteps?: number;
}

const categoryColors: Record<string, { badge: string; dot: string }> = {
  civil_registry: { badge: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400', dot: 'bg-blue-500' },
  foreign_affairs: { badge: 'bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400', dot: 'bg-sky-500' },
  housing: { badge: 'bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400', dot: 'bg-teal-500' },
  business: { badge: 'bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400', dot: 'bg-violet-500' },
  clearance: { badge: 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400', dot: 'bg-amber-500' },
  government: { badge: 'bg-slate-50 text-slate-600 dark:bg-slate-950/50 dark:text-slate-400', dot: 'bg-slate-500' },
  professional: {
    badge: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400',
    dot: 'bg-indigo-500',
  },
  health: { badge: 'bg-green-50 text-green-600 dark:bg-green-950/50 dark:text-green-400', dot: 'bg-green-500' },
  social_security: { badge: 'bg-pink-50 text-pink-600 dark:bg-pink-950/50 dark:text-pink-400', dot: 'bg-pink-500' },
  transport: { badge: 'bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400', dot: 'bg-orange-500' },
  identification: { badge: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-400', dot: 'bg-cyan-500' },
  overseas: { badge: 'bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400', dot: 'bg-purple-500' },
  tax: { badge: 'bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400', dot: 'bg-red-500' },
  social_services: { badge: 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400', dot: 'bg-rose-500' },
  other: { badge: 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400', dot: 'bg-gray-500' },
};

export { categoryColors };

export function ServiceCard({ service, completedSteps }: ServiceCardProps) {
  const category = SERVICE_CATEGORIES.find((c) => c.value === service.category);
  const colors = categoryColors[service.category] ?? { badge: 'bg-gray-100 text-gray-600', dot: 'bg-gray-500' };
  const total = service.steps.length;
  const progress = completedSteps !== undefined ? completedSteps : 0;
  const hasProgress = completedSteps !== undefined && completedSteps > 0;
  const isComplete = hasProgress && progress === total;

  return (
    <div className="group relative flex flex-col bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-white/[0.07] p-5 hover:border-gray-200 dark:hover:border-gold/30 hover:shadow-md hover:shadow-navy/4 dark:hover:shadow-black/20 hover:-translate-y-0.5 transition-all duration-300 h-full">
      {/* Gold left accent bar on hover */}
      <div className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full bg-gold scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center" />

      {/* Bookmark button */}
      <div className="absolute top-3 right-3 z-10">
        <BookmarkButton serviceId={service.id} />
      </div>

      <Link href={`/services/${service.slug}`} className="flex flex-col h-full">
        <div className="mb-2.5 pr-8">
          {category && (
            <span
              className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full mb-2 ${colors.badge}`}
            >
              {(() => {
                const Icon = CATEGORY_ICONS[category.icon];
                return Icon ? (
                  <Icon className="w-3 h-3" />
                ) : (
                  <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                );
              })()}
              {category.label}
            </span>
          )}
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-snug group-hover:text-navy dark:group-hover:text-gold transition-colors duration-200 line-clamp-2">
            {service.title}
          </h3>
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
            <span className="ml-auto flex items-center gap-2">
              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(service.agency.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-gray-300 dark:text-gray-600 hover:text-gold transition-colors duration-200"
                aria-label={`Find nearest ${service.agency.acronym} office`}
                title="Find nearest office"
              >
                <MapPin className="w-3 h-3" />
              </a>
              <span className="font-semibold text-navy/50 dark:text-white/30">{service.agency.acronym}</span>
            </span>
          )}
        </div>

        {hasProgress && (
          <div className="mt-3 pt-3 border-t border-gray-50 dark:border-white/5">
            <div className="flex items-center justify-between mb-1.5">
              <span
                className={`text-[11px] flex items-center gap-1 ${isComplete ? 'text-green-600 font-medium' : 'text-gray-400'}`}
              >
                <CheckCircle className={`w-3 h-3 ${isComplete ? 'text-green-500' : 'text-green-500'}`} />
                {isComplete ? 'Complete!' : 'In Progress'}
              </span>
              <span
                className={`text-[11px] font-semibold ${isComplete ? 'text-green-600' : 'text-navy dark:text-white'}`}
              >
                {progress}/{total}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${isComplete ? 'bg-linear-to-r from-green-400 to-green-600 animate-celebrate' : 'bg-gold'}`}
                style={{ width: `${(progress / total) * 100}%` }}
              />
            </div>
          </div>
        )}
      </Link>
    </div>
  );
}
