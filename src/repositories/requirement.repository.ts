import type { DbClient } from '@/src/db/client';
import type { RequirementRow } from '@/src/lib/db-types';
import type { CreateRequirementDto, UpdateRequirementDto } from '@/src/lib/dtos';
import { generateId } from '@/src/db/mock-db';
import type { IRequirementRepository } from './requirement.repository.interface';

export class RequirementRepository implements IRequirementRepository {
  constructor(private readonly db: DbClient) {}

  findByStep(stepId: string): Promise<RequirementRow[]> {
    return this.db.requirements.findMany((r) => r.step_id === stepId);
  }

  findByService(serviceId: string): Promise<RequirementRow[]> {
    return this.db.requirements.findMany((r) => r.service_id === serviceId);
  }

  findById(id: string): Promise<RequirementRow | null> {
    return this.db.requirements.findOne((r) => r.id === id);
  }

  create(data: CreateRequirementDto): Promise<RequirementRow> {
    const now = new Date().toISOString();
    const row: RequirementRow = {
      id: generateId(),
      service_id: data.serviceId,
      step_id: data.stepId ?? null,
      label: data.label,
      description: data.description ?? null,
      is_optional: data.isOptional ?? false,
      copies: data.copies ?? 1,
      created_at: now,
      updated_at: now,
    };
    return this.db.requirements.insert(row);
  }

  async update(id: string, data: UpdateRequirementDto): Promise<RequirementRow | null> {
    const patch: Partial<RequirementRow> = {};
    if (data.label !== undefined) patch.label = data.label;
    if (data.description !== undefined) patch.description = data.description;
    if (data.isOptional !== undefined) patch.is_optional = data.isOptional;
    if (data.copies !== undefined) patch.copies = data.copies;
    return this.db.requirements.update(id, patch);
  }

  delete(id: string): Promise<boolean> {
    return this.db.requirements.delete(id);
  }
}
