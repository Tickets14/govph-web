import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, children, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        'border-b border-gray-100 dark:border-white/10 bg-white dark:bg-gray-950 relative overflow-hidden',
        className
      )}
    >
      {/* Dot pattern overlay */}
      <div className="absolute inset-0 bg-dot-pattern text-navy/[0.03] dark:text-white/[0.02] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in-up">
          <div>
            <span className="block w-8 h-0.5 bg-gold rounded-full mb-3" />
            <h1 className="font-display text-[26px] sm:text-[32px] font-bold text-navy dark:text-white tracking-tight leading-tight">
              {title}
            </h1>
            {description && <p className="mt-2 text-gray-400 dark:text-gray-500 text-sm">{description}</p>}
          </div>
          {children && <div className="shrink-0">{children}</div>}
        </div>
      </div>
    </div>
  );
}
