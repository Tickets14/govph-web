'use client';

import Image from 'next/image';
import { MapPin, ExternalLink, Building2 } from 'lucide-react';
import type { Agency } from '@/types';

interface Props {
  agencies: Agency[];
}

function mapsSearchUrl(agencyName: string) {
  const query = encodeURIComponent(agencyName);
  return `https://www.google.com/maps/search/${query}`;
}

export function NearbyClient({ agencies }: Props) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="animate-fade-in-up">
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-8">
          Tap an agency below to find its nearest office on Google Maps.
        </p>

        {/* Agency grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {agencies.map((agency, i) => (
            <a
              key={agency.id}
              href={mapsSearchUrl(agency.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-white/10 p-5 hover:border-gold/40 dark:hover:border-gold/30 hover:shadow-sm transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-navy/[0.06] dark:bg-white/[0.06] flex items-center justify-center shrink-0">
                  {agency.logoUrl ? (
                    <Image
                      src={agency.logoUrl}
                      alt={agency.acronym}
                      width={24}
                      height={24}
                      sizes="24px"
                      className="w-6 h-6 object-contain"
                      unoptimized
                    />
                  ) : (
                    <Building2 className="w-4.5 h-4.5 text-navy/50 dark:text-gray-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <span className="inline-block text-[10px] font-bold text-gold uppercase tracking-widest mb-0.5">
                    {agency.acronym}
                  </span>
                  <h3 className="font-display font-semibold text-sm text-navy dark:text-white leading-snug">
                    {agency.name}
                  </h3>
                </div>
              </div>

              <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed line-clamp-2 mb-4">
                {agency.description}
              </p>

              <div className="flex items-center gap-1.5 text-xs font-medium text-gold group-hover:text-gold/80 transition-colors">
                <MapPin className="w-3.5 h-3.5" />
                Find nearest office
                <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </a>
          ))}
        </div>

        {agencies.length === 0 && (
          <div className="text-center py-16">
            <p className="text-sm text-gray-400">No agencies found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
