import type { DbClient } from '@/src/db/client';
import type { UserProgressRow } from '@/src/lib/db-types';
import type { UpsertProgressDto } from '@/src/lib/dtos';
import { generateId } from '@/src/db/mock-db';
import type { IUserProgressRepository } from './user-progress.repository.interface';

export class UserProgressRepository implements IUserProgressRepository {
  constructor(private readonly db: DbClient) {}

  findByUserAndService(userId: string, serviceId: string): Promise<UserProgressRow[]> {
    return this.db.userProgress.findMany((p) => p.user_id === userId && p.service_id === serviceId);
  }

  async upsert(data: UpsertProgressDto): Promise<UserProgressRow> {
    const existing = await this.db.userProgress.findOne(
      (p) => p.user_id === data.userId && p.service_id === data.serviceId && p.step_id === data.stepId
    );

    const now = new Date().toISOString();

    if (existing) {
      const updated = await this.db.userProgress.update(existing.id, {
        is_completed: data.isCompleted,
        completed_at: data.isCompleted ? now : null,
        updated_at: now,
      });
      return updated!;
    }

    const row: UserProgressRow = {
      id: generateId(),
      user_id: data.userId,
      service_id: data.serviceId,
      step_id: data.stepId,
      is_completed: data.isCompleted,
      completed_at: data.isCompleted ? now : null,
      created_at: now,
      updated_at: now,
    };
    return this.db.userProgress.insert(row);
  }

  async resetProgress(userId: string, serviceId: string): Promise<number> {
    const rows = await this.findByUserAndService(userId, serviceId);
    let deleted = 0;
    for (const row of rows) {
      const ok = await this.db.userProgress.delete(row.id);
      if (ok) deleted++;
    }
    return deleted;
  }
}
