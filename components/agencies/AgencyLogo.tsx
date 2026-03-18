import Link from 'next/link';
import type { Agency } from '@/types';
import { cn } from '@/lib/utils';

interface AgencyLogoProps {
  agency: Agency;
  size?: 'sm' | 'md' | 'lg';
}

export function AgencyLogo({ agency, size = 'md' }: AgencyLogoProps) {
  return (
    <Link
      href={`/agencies/${agency.slug}`}
      className={cn(
        'flex flex-col items-center gap-1.5 p-2.5 rounded-xl border border-transparent hover:border-gray-100 hover:bg-white transition-all duration-200 group',
        size === 'sm' && 'p-2',
        size === 'lg' && 'p-3.5'
      )}
    >
      <div
        className={cn(
          'rounded-xl bg-gray-50 group-hover:bg-navy/[0.05] flex items-center justify-center transition-colors duration-200',
          size === 'sm' && 'w-10 h-10',
          size === 'md' && 'w-12 h-12',
          size === 'lg' && 'w-14 h-14'
        )}
      >
        <span
          className={cn(
            'font-display font-extrabold text-navy/60 group-hover:text-navy text-center leading-none transition-colors duration-200',
            size === 'sm' && 'text-[9px]',
            size === 'md' && 'text-[10px]',
            size === 'lg' && 'text-xs'
          )}
        >
          {agency.acronym}
        </span>
      </div>
      {size !== 'sm' && (
        <span className="text-[10px] text-gray-400 group-hover:text-gray-600 text-center leading-tight max-w-[64px] line-clamp-1 transition-colors duration-200">
          {agency.acronym}
        </span>
      )}
    </Link>
  );
}
