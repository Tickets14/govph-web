import type { IUserProgressRepository } from '@/src/repositories/user-progress.repository.interface';
import type { IStepRepository } from '@/src/repositories/step.repository.interface';
import type { IServiceRepository } from '@/src/repositories/service.repository.interface';
import type { ProgressSummaryDto } from '@/src/lib/dtos';
import { AppError } from '@/src/lib/errors';

export class ProgressService {
  constructor(
    private readonly progressRepo: IUserProgressRepository,
    private readonly stepRepo: IStepRepository,
    private readonly serviceRepo: IServiceRepository
  ) {}

  // ── Queries ────────────────────────────────────────────────────────────────

  async getProgress(userId: string, serviceId: string): Promise<ProgressSummaryDto> {
    await this.assertServiceExists(serviceId);

    const [progressRows, steps] = await Promise.all([
      this.progressRepo.findByUserAndService(userId, serviceId),
      this.stepRepo.findByService(serviceId),
    ]);

    const completedRows = progressRows.filter((p) => p.is_completed);
    const completedStepIds = completedRows.map((p) => p.step_id);

    const lastUpdated =
      progressRows.length > 0
        ? progressRows.reduce((latest, p) => (p.updated_at > latest ? p.updated_at : latest), '')
        : null;

    return {
      userId,
      serviceId,
      completedStepIds,
      totalSteps: steps.length,
      completedSteps: completedStepIds.length,
      completionPercentage: this.calcPercentage(completedStepIds.length, steps.length),
      lastUpdated,
    };
  }

  async getCompletionPercentage(userId: string, serviceId: string): Promise<number> {
    const summary = await this.getProgress(userId, serviceId);
    return summary.completionPercentage;
  }

  // ── Mutations ──────────────────────────────────────────────────────────────

  /**
   * Toggle a step's completion status.
   * Returns the new completion percentage after the toggle.
   */
  async toggleStep(
    userId: string,
    serviceId: string,
    stepId: string
  ): Promise<{ isCompleted: boolean; completionPercentage: number }> {
    await this.assertServiceExists(serviceId);
    await this.assertStepBelongsToService(stepId, serviceId);

    // Determine current state
    const rows = await this.progressRepo.findByUserAndService(userId, serviceId);
    const existing = rows.find((p) => p.step_id === stepId);
    const newState = !(existing?.is_completed ?? false);

    await this.progressRepo.upsert({
      userId,
      serviceId,
      stepId,
      isCompleted: newState,
    });

    const percentage = await this.getCompletionPercentage(userId, serviceId);
    return { isCompleted: newState, completionPercentage: percentage };
  }

  async resetProgress(userId: string, serviceId: string): Promise<{ deletedCount: number }> {
    await this.assertServiceExists(serviceId);
    const deletedCount = await this.progressRepo.resetProgress(userId, serviceId);
    return { deletedCount };
  }

  // ── Private helpers ────────────────────────────────────────────────────────

  private async assertServiceExists(serviceId: string): Promise<void> {
    const service = await this.serviceRepo.findById(serviceId);
    if (!service) throw AppError.notFound('Service', serviceId);
  }

  private async assertStepBelongsToService(stepId: string, serviceId: string): Promise<void> {
    const step = await this.stepRepo.findById(stepId);
    if (!step) throw AppError.notFound('Step', stepId);
    if (step.service_id !== serviceId) {
      throw AppError.validation(`Step "${stepId}" does not belong to service "${serviceId}"`, { stepId, serviceId });
    }
  }

  private calcPercentage(completed: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  }
}
