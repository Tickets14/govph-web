import type { StepRow } from '@/src/lib/db-types';
import type { CreateStepDto, UpdateStepDto } from '@/src/lib/dtos';

export interface IStepRepository {
  findByService(serviceId: string): Promise<StepRow[]>;
  findById(id: string): Promise<StepRow | null>;
  create(data: CreateStepDto): Promise<StepRow>;
  update(id: string, data: UpdateStepDto): Promise<StepRow | null>;
  /** Reassign `order` values for all steps of a service based on the supplied ID sequence. */
  reorder(serviceId: string, stepIds: string[]): Promise<StepRow[]>;
  delete(id: string): Promise<boolean>;
}
