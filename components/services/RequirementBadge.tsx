'use client';

import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Requirement } from '@/types';

interface RequirementBadgeProps {
  requirement: Requirement;
  checked?: boolean;
  onToggle?: () => void;
}

export function RequirementBadge({ requirement, checked, onToggle }: RequirementBadgeProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'flex items-start gap-3 w-full text-left p-3 rounded-xl border transition-all duration-150 hover:-translate-y-px hover:shadow-sm',
        checked
          ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800/40'
          : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-gray-800/50'
      )}
    >
      {checked ? (
        <CheckCircle2 className="w-4.5 h-4.5 text-green-500 mt-0.5 shrink-0 transition-transform duration-200 scale-100" />
      ) : (
        <Circle className="w-4.5 h-4.5 text-gray-300 dark:text-gray-600 mt-0.5 shrink-0" />
      )}
      <div className="min-w-0">
        <p
          className={cn(
            'text-sm font-medium leading-snug',
            checked ? 'text-green-700 dark:text-green-400 line-through' : 'text-gray-800 dark:text-gray-200'
          )}
        >
          {requirement.label}
          {requirement.isOptional && (
            <span className="ml-1.5 text-[11px] font-normal text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-md">
              optional
            </span>
          )}
        </p>
        {requirement.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{requirement.description}</p>
        )}
        {requirement.copies && requirement.copies > 1 && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{requirement.copies} copies needed</p>
        )}
      </div>
    </button>
  );
}
