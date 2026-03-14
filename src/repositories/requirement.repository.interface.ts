import type { RequirementRow } from '@/src/lib/db-types';
import type { CreateRequirementDto, UpdateRequirementDto } from '@/src/lib/dtos';

export interface IRequirementRepository {
  findByStep(stepId: string): Promise<RequirementRow[]>;
  findByService(serviceId: string): Promise<RequirementRow[]>;
  findById(id: string): Promise<RequirementRow | null>;
  create(data: CreateRequirementDto): Promise<RequirementRow>;
  update(id: string, data: UpdateRequirementDto): Promise<RequirementRow | null>;
  delete(id: string): Promise<boolean>;
}
