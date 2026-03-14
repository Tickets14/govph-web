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
        'flex items-start gap-3 w-full text-left p-3 rounded-xl border transition-all duration-150',
        checked ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      )}
    >
      {checked ? (
        <CheckCircle2 className="w-4.5 h-4.5 text-green-500 mt-0.5 shrink-0" />
      ) : (
        <Circle className="w-4.5 h-4.5 text-gray-300 mt-0.5 shrink-0" />
      )}
      <div className="min-w-0">
        <p
          className={cn('text-sm font-medium leading-snug', checked ? 'text-green-700 line-through' : 'text-gray-800')}
        >
          {requirement.label}
          {requirement.isOptional && <span className="ml-1 text-xs font-normal text-gray-400">(optional)</span>}
        </p>
        {requirement.description && <p className="text-xs text-gray-500 mt-0.5">{requirement.description}</p>}
        {requirement.copies && requirement.copies > 1 && (
          <p className="text-xs text-gray-400 mt-0.5">{requirement.copies} copies needed</p>
        )}
      </div>
    </button>
  );
}
