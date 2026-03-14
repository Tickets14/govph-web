"use client";

import { useProgress } from "@/hooks/useProgress";
import { StepChecklist } from "@/components/services/StepChecklist";
import { ProgressBar } from "@/components/services/ProgressBar";
import { RequirementBadge } from "@/components/services/RequirementBadge";
import type { Service } from "@/types";

export function ServiceDetailClient({ service }: { service: Service }) {
  const { progress, toggleStep, toggleRequirement, resetProgress } = useProgress(service.id);

  const stepsTotal = service.steps.length;
  const stepsDone = progress.completedSteps.length;
  const pct = stepsTotal > 0 ? (stepsDone / stepsTotal) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Progress summary */}
      {stepsTotal > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-semibold text-navy">Iyong Progress</h2>
            {stepsDone > 0 && (
              <button
                onClick={resetProgress}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                I-reset
              </button>
            )}
          </div>
          <ProgressBar value={pct} />
          <p className="text-xs text-gray-400 mt-2">
            {stepsDone} sa {stepsTotal} hakbang ang tapos na
            {pct === 100 && " 🎉 Congrats!"}
          </p>
        </div>
      )}

      {/* Steps */}
      {service.steps.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-display font-semibold text-navy mb-4">
            Mga Hakbang ({service.steps.length})
          </h2>
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
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-display font-semibold text-navy mb-4">
            Mga Requirements ({service.requirements.length})
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
