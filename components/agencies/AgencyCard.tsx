'use client';

import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';
import type { Agency } from '@/types';

interface AgencyCardProps {
  agency: Agency;
  serviceCount?: number;
}

export function AgencyCard({ agency, serviceCount }: AgencyCardProps) {
  return (
    <div className="group bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 hover:shadow-sm transition-all duration-200 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="w-11 h-11 rounded-xl bg-navy/[0.05] flex items-center justify-center shrink-0">
          <span className="text-navy font-display font-extrabold text-[11px] text-center leading-tight">
            {agency.acronym}
          </span>
        </div>
        {agency.website && (
          <a
            href={agency.website}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-gray-200 hover:text-gray-400 transition-colors duration-200 mt-0.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1.5">{agency.name}</h3>
      <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 flex-1">{agency.description}</p>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
        {serviceCount !== undefined && (
          <span className="text-[11px] text-gray-300">
            {serviceCount} {serviceCount === 1 ? 'serbisyo' : 'mga serbisyo'}
          </span>
        )}
        <Link
          href={`/agencies/${agency.slug}`}
          className="flex items-center gap-1 text-xs font-medium text-navy/60 hover:text-navy transition-colors duration-200 ml-auto group/link"
        >
          Tingnan
          <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover/link:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
