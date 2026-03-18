import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = 'Walang resulta',
  description = 'Subukan ang ibang keywords.',
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in-up">
      <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
        {icon ?? <SearchX className="w-6 h-6 text-gray-300" />}
      </div>
      <h3 className="font-semibold text-gray-700 mb-1 text-sm">{title}</h3>
      <p className="text-xs text-gray-400 max-w-xs leading-relaxed">{description}</p>
    </div>
  );
}
