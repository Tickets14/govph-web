import Link from 'next/link';
import Image from 'next/image';
import type { Agency } from '@/types';
import { cn } from '@/lib/utils';

interface AgencyLogoProps {
  agency: Agency;
  size?: 'sm' | 'md' | 'lg';
}

export function AgencyLogo({ agency, size = 'md' }: AgencyLogoProps) {
  const logoSrc = agency.logoUrl || null;
  const imageSize = size === 'sm' ? 28 : size === 'md' ? 36 : 44;

  return (
    <Link
      href={`/agencies/${agency.slug}`}
      title={agency.name}
      className={cn(
        'flex flex-col items-center gap-1.5 p-2.5 rounded-xl border border-transparent hover:border-gray-100 dark:hover:border-white/10 hover:bg-white dark:hover:bg-white/5 transition-all duration-200 group',
        size === 'sm' && 'p-2',
        size === 'lg' && 'p-3.5'
      )}
    >
      <div
        className={cn(
          'rounded-xl bg-gray-50 dark:bg-gray-800 group-hover:bg-navy/5 dark:group-hover:bg-gold/10 flex items-center justify-center overflow-hidden transition-all duration-200 group-hover:scale-105 group-hover:ring-2 group-hover:ring-navy/10 dark:group-hover:ring-gold/10',
          size === 'sm' && 'w-10 h-10',
          size === 'md' && 'w-12 h-12',
          size === 'lg' && 'w-14 h-14'
        )}
      >
        {logoSrc ? (
          <Image
            src={logoSrc}
            alt={agency.acronym}
            width={imageSize}
            height={imageSize}
            className={cn(
              'object-contain',
              size === 'sm' && 'w-7 h-7',
              size === 'md' && 'w-9 h-9',
              size === 'lg' && 'w-11 h-11'
            )}
          />
        ) : (
          <span
            className={cn(
              'font-display font-extrabold text-navy/60 dark:text-gray-500 group-hover:text-navy dark:group-hover:text-gray-300 text-center leading-none transition-colors duration-200',
              size === 'sm' && 'text-[9px]',
              size === 'md' && 'text-[10px]',
              size === 'lg' && 'text-xs'
            )}
          >
            {agency.acronym}
          </span>
        )}
      </div>
      {size !== 'sm' && (
        <span className="text-[10px] text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 text-center leading-tight max-w-16 line-clamp-1 transition-colors duration-200">
          {agency.acronym}
        </span>
      )}
    </Link>
  );
}
