'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ExternalLink } from 'lucide-react';
import type { Agency } from '@/types';

interface AgencyCardProps {
  agency: Agency;
  serviceCount?: number;
}

export function AgencyCard({ agency, serviceCount }: AgencyCardProps) {
  return (
    <div className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-white/[0.07] p-5 hover:border-gray-200 dark:hover:border-gold/30 hover:shadow-md hover:shadow-navy/[0.03] dark:hover:shadow-black/20 hover:-translate-y-0.5 transition-all duration-300 flex flex-col">
      {/* Gold left accent bar on hover */}
      <div className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full bg-gold scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center" />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="w-11 h-11 rounded-xl bg-navy/5 dark:bg-white/5 flex items-center justify-center shrink-0 overflow-hidden group-hover:bg-navy/10 dark:group-hover:bg-gold/10 transition-colors duration-300">
          {agency.logoUrl ? (
            <Image
              src={agency.logoUrl}
              alt={agency.acronym}
              width={28}
              height={28}
              className="w-7 h-7 object-contain"
            />
          ) : (
            <span className="text-navy dark:text-gray-400 font-display font-extrabold text-[11px] text-center leading-tight">
              {agency.acronym}
            </span>
          )}
        </div>
        {agency.website && (
          <a
            href={agency.website}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-gray-200 dark:text-gray-600 hover:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200 mt-0.5"
            aria-label={`Visit ${agency.name} website`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-snug mb-1.5">{agency.name}</h3>
      <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed line-clamp-2 flex-1">
        {agency.description}
      </p>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50 dark:border-white/5">
        {serviceCount !== undefined && (
          <span className="text-[11px] text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded-md">
            {serviceCount} {serviceCount === 1 ? 'service' : 'services'}
          </span>
        )}
        <Link
          href={`/agencies/${agency.slug}`}
          className="flex items-center gap-1 text-xs font-medium text-navy/60 dark:text-gray-400 hover:text-navy dark:hover:text-gold transition-colors duration-200 ml-auto group/link"
        >
          View
          <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover/link:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
