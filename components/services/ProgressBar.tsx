import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number; // 0-100
  label?: string;
  className?: string;
}

export function ProgressBar({ value, label, className }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const isComplete = clamped === 100;

  return (
    <div
      className={cn('w-full', className)}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
          <span
            className={cn(
              'text-xs font-semibold',
              isComplete ? 'text-green-600' : clamped >= 50 ? 'text-gold' : 'text-navy dark:text-white'
            )}
          >
            {Math.round(clamped)}%
          </span>
        </div>
      )}
      <div className="h-2.5 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full animate-progress-fill transition-all duration-500',
            isComplete
              ? 'bg-gradient-to-r from-green-400 to-green-600 animate-celebrate'
              : 'bg-gradient-to-r from-navy to-navy-light'
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
