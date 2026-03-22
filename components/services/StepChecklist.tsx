'use client';

import { CheckCircle2, Clock, PhilippinePeso, MapPin, PartyPopper } from 'lucide-react';
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
  const allDone = steps.length > 0 && completedSteps.length >= steps.length;

  return (
    <div className="space-y-4">
      {/* Celebration banner */}
      {allDone && (
        <div className="bg-gradient-to-r from-gold/10 to-amber-50 dark:from-gold/10 dark:to-amber-950/20 border border-gold/20 dark:border-gold/30 rounded-2xl p-4 flex items-center gap-3 animate-scale-in">
          <PartyPopper className="w-5 h-5 text-gold shrink-0" />
          <div>
            <p className="text-sm font-semibold text-navy dark:text-white">All steps completed!</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              You&apos;re all set. Good luck with your transaction!
            </p>
          </div>
        </div>
      )}

      {/* Steps with timeline */}
      <div className="relative">
        {/* Continuous timeline line */}
        {steps.length > 1 && (
          <div className="absolute left-[19px] top-5 bottom-5 w-px bg-gray-200 dark:bg-white/10 pointer-events-none" />
        )}

        <div className="space-y-4">
          {steps.map((step) => {
            const done = completedSteps.includes(step.id);
            return (
              <div
                key={step.id}
                className={cn(
                  'relative rounded-2xl border p-5 transition-all duration-200',
                  done
                    ? 'bg-green-50/40 dark:bg-green-950/20 border-green-200 dark:border-green-800/40 border-l-2 border-l-green-400'
                    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-white/10'
                )}
              >
                {/* Header */}
                <button onClick={() => onToggleStep(step.id)} className="flex items-start gap-4 w-full text-left">
                  <div
                    className={cn(
                      'relative z-10 flex items-center justify-center w-10 h-10 rounded-xl text-sm font-bold shrink-0 transition-all duration-200',
                      done
                        ? 'bg-gradient-to-br from-green-400 to-green-600 text-white shadow-sm shadow-green-500/20 animate-scale-in'
                        : 'bg-navy/10 dark:bg-white/10 text-navy dark:text-gray-300'
                    )}
                  >
                    {done ? <CheckCircle2 className="w-5 h-5" /> : <span>{step.order}</span>}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4
                      className={cn(
                        'font-semibold text-sm leading-snug',
                        done ? 'text-green-700 dark:text-green-400' : 'text-gray-900 dark:text-gray-100'
                      )}
                    >
                      {step.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                      {step.description}
                    </p>

                    <div className="flex flex-wrap gap-3 mt-2">
                      {step.duration && (
                        <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                          <Clock className="w-3 h-3" /> {step.duration}
                        </span>
                      )}
                      {step.fee !== undefined && step.fee > 0 && (
                        <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                          <PhilippinePeso className="w-3 h-3" /> ₱{step.fee.toLocaleString()}
                        </span>
                      )}
                      {step.location && (
                        <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                          <MapPin className="w-3 h-3" /> {step.location}
                        </span>
                      )}
                    </div>
                  </div>
                </button>

                {/* Requirements for this step */}
                {step.requirements && step.requirements.length > 0 && (
                  <div className="mt-3 space-y-2 pl-14">
                    <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">
                      Required:
                    </p>
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
      </div>
    </div>
  );
}
