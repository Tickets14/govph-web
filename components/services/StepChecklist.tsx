'use client';

import { CheckCircle2, Clock, PhilippinePeso, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Step } from '@/types';
import { RequirementBadge } from './RequirementBadge';

interface StepChecklistProps {
  steps: Step[];
  completedSteps: string[];
  completedRequirements: string[];
  onToggleStep: (id: string) => void;
  onToggleRequirement: (id: string) => void;
}

export function StepChecklist({
  steps,
  completedSteps,
  completedRequirements,
  onToggleStep,
  onToggleRequirement,
}: StepChecklistProps) {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const done = completedSteps.includes(step.id);
        return (
          <div
            key={step.id}
            className={cn(
              'relative rounded-2xl border p-5 transition-all duration-200',
              done ? 'bg-green-50/60 border-green-200' : 'bg-white border-gray-200'
            )}
          >
            {/* Step connector line */}
            {index < steps.length - 1 && <div className="absolute left-7 top-full w-0.5 h-4 bg-gray-200 z-10" />}

            {/* Header */}
            <button onClick={() => onToggleStep(step.id)} className="flex items-start gap-4 w-full text-left">
              <div
                className={cn(
                  'flex items-center justify-center w-9 h-9 rounded-xl text-sm font-bold shrink-0 transition-all',
                  done ? 'bg-green-500 text-white' : 'bg-navy/10 text-navy'
                )}
              >
                {done ? <CheckCircle2 className="w-5 h-5" /> : <span>{step.order}</span>}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className={cn('font-semibold text-sm leading-snug', done ? 'text-green-700' : 'text-gray-900')}>
                  {step.title}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{step.description}</p>

                <div className="flex flex-wrap gap-3 mt-2">
                  {step.duration && (
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" /> {step.duration}
                    </span>
                  )}
                  {step.fee !== undefined && step.fee > 0 && (
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <PhilippinePeso className="w-3 h-3" /> ₱{step.fee.toLocaleString()}
                    </span>
                  )}
                  {step.location && (
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <MapPin className="w-3 h-3" /> {step.location}
                    </span>
                  )}
                </div>
              </div>
            </button>

            {/* Requirements for this step */}
            {step.requirements && step.requirements.length > 0 && (
              <div className="mt-3 space-y-2 pl-13">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Kailangan:</p>
                {step.requirements.map((req) => (
                  <RequirementBadge
                    key={req.id}
                    requirement={req}
                    checked={completedRequirements.includes(req.id)}
                    onToggle={() => onToggleRequirement(req.id)}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
