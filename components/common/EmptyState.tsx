import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({
  title = 'No results',
  description = 'Try different keywords.',
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in-up">
      <div className="bg-gradient-to-b from-gray-50/80 to-transparent dark:from-gray-800/30 rounded-3xl -mx-4 px-8 py-10 flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-white/10 flex items-center justify-center mb-5">
          {icon ?? <SearchX className="w-7 h-7 text-gray-300 dark:text-gray-600" />}
        </div>
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-1 text-base">{title}</h3>
        <p className="text-sm text-gray-400 dark:text-gray-500 max-w-xs leading-relaxed">{description}</p>
        {action && <div className="mt-5">{action}</div>}
      </div>
    </div>
  );
}
