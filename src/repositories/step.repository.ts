import type { DbClient } from '@/src/db/client';
import type { StepRow } from '@/src/lib/db-types';
import type { CreateStepDto, UpdateStepDto } from '@/src/lib/dtos';
import { AppError } from '@/src/lib/errors';
import { generateId } from '@/src/db/mock-db';
import type { IStepRepository } from './step.repository.interface';

export class StepRepository implements IStepRepository {
  constructor(private readonly db: DbClient) {}

  async findByService(serviceId: string): Promise<StepRow[]> {
    const rows = await this.db.steps.findMany((s) => s.service_id === serviceId);
    return rows.sort((a, b) => a.order - b.order);
  }

  findById(id: string): Promise<StepRow | null> {
    return this.db.steps.findOne((s) => s.id === id);
  }

  create(data: CreateStepDto): Promise<StepRow> {
    const now = new Date().toISOString();
    const row: StepRow = {
      id: generateId(),
      service_id: data.serviceId,
      order: data.order,
      title: data.title,
      description: data.description,
      duration: data.duration ?? null,
      fee: data.fee ?? null,
      location: data.location ?? null,
      created_at: now,
      updated_at: now,
    };
    return this.db.steps.insert(row);
  }

  async update(id: string, data: UpdateStepDto): Promise<StepRow | null> {
    const patch: Partial<StepRow> = {};
    if (data.order !== undefined) patch.order = data.order;
    if (data.title !== undefined) patch.title = data.title;
    if (data.description !== undefined) patch.description = data.description;
    if (data.duration !== undefined) patch.duration = data.duration;
    if (data.fee !== undefined) patch.fee = data.fee;
    if (data.location !== undefined) patch.location = data.location;
    return this.db.steps.update(id, patch);
  }

  async reorder(serviceId: string, stepIds: string[]): Promise<StepRow[]> {
    const existing = await this.findByService(serviceId);
    const existingIds = new Set(existing.map((s) => s.id));

    // Validate that all supplied IDs belong to this service
    for (const id of stepIds) {
      if (!existingIds.has(id)) {
        throw AppError.validation(`Step "${id}" does not belong to service "${serviceId}"`, { stepId: id, serviceId });
      }
    }

    const updated: StepRow[] = [];
    for (let i = 0; i < stepIds.length; i++) {
      const row = await this.db.steps.update(stepIds[i], { order: i + 1 });
      if (row) updated.push(row);
    }
    return updated.sort((a, b) => a.order - b.order);
  }

  delete(id: string): Promise<boolean> {
    return this.db.steps.delete(id);
  }
}
