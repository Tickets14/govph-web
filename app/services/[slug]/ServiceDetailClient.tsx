'use client';

import { useProgress } from '@/hooks/useProgress';
import { StepChecklist } from '@/components/services/StepChecklist';
import { ProgressBar } from '@/components/services/ProgressBar';
import { RequirementBadge } from '@/components/services/RequirementBadge';
import type { Service } from '@/types';
import { cn } from '@/lib/utils';

export function ServiceDetailClient({ service }: { service: Service }) {
  const { progress, toggleStep, toggleRequirement, resetProgress } = useProgress(service.id);

  const stepsTotal = service.steps.length;
  const stepsDone = progress.completedSteps.length;
  const pct = stepsTotal > 0 ? (stepsDone / stepsTotal) * 100 : 0;
  const isComplete = pct === 100;

  return (
    <div className="space-y-4">
      {/* Progress summary */}
      {stepsTotal > 0 && (
        <div
          className={cn(
            'bg-white dark:bg-gray-900 rounded-2xl border p-5 transition-colors duration-300',
            isComplete
              ? 'border-green-200 dark:border-green-800/40 bg-green-50/50 dark:bg-green-950/20'
              : 'border-gray-100 dark:border-white/10'
          )}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="block w-6 h-0.5 bg-gold rounded-full mb-2" />
              <h2 className="font-display font-semibold text-navy dark:text-white">Your Progress</h2>
            </div>
            {stepsDone > 0 && (
              <button
                onClick={resetProgress}
                className="text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 px-2 py-1 rounded-lg transition-all duration-200"
              >
                Reset
              </button>
            )}
          </div>
          <ProgressBar value={pct} />
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            {stepsDone} of {stepsTotal} steps completed
            {isComplete && " — You're all set!"}
          </p>
        </div>
      )}

      {/* Steps */}
      {service.steps.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-white/10 p-5">
          <span className="block w-6 h-0.5 bg-gold rounded-full mb-2" />
          <h2 className="font-display font-semibold text-navy dark:text-white mb-4">Steps ({service.steps.length})</h2>
          <StepChecklist
            steps={service.steps}
            completedSteps={progress.completedSteps}
            completedRequirements={progress.completedRequirements}
            onToggleStep={toggleStep}
            onToggleRequirement={toggleRequirement}
          />
        </div>
      )}

      {/* Requirements */}
      {service.requirements.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-white/10 p-5">
          <span className="block w-6 h-0.5 bg-gold rounded-full mb-2" />
          <h2 className="font-display font-semibold text-navy dark:text-white mb-4">
            Requirements ({service.requirements.length})
          </h2>
          <div className="space-y-2">
            {service.requirements.map((req) => (
              <RequirementBadge
                key={req.id}
                requirement={req}
                checked={progress.completedRequirements.includes(req.id)}
                onToggle={() => toggleRequirement(req.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
