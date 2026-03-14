"use client";

import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import type { Agency } from "@/types";

interface AgencyCardProps {
  agency: Agency;
  serviceCount?: number;
}

export function AgencyCard({ agency, serviceCount }: AgencyCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-navy/20 hover:shadow-md transition-all duration-200 flex flex-col">
      {/* Acronym badge */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-navy/5 flex items-center justify-center shrink-0">
          <span className="text-navy font-display font-extrabold text-xs text-center leading-tight">
            {agency.acronym}
          </span>
        </div>
        {agency.website && (
          <a
            href={agency.website}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-gray-300 hover:text-navy transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>

      <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1">{agency.name}</h3>
      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1">
        {agency.description}
      </p>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
        {serviceCount !== undefined && (
          <span className="text-xs text-gray-400">
            {serviceCount} {serviceCount === 1 ? "serbisyo" : "mga serbisyo"}
          </span>
        )}
        <Link
          href={`/agencies/${agency.slug}`}
          className="flex items-center gap-1 text-xs font-medium text-navy hover:text-navy/70 transition-colors ml-auto"
        >
          Tingnan <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
