import type { ServiceRow } from '@/src/lib/db-types';
import type { CreateServiceDto, UpdateServiceDto, ServiceFiltersDto } from '@/src/lib/dtos';

export interface IServiceRepository {
  findAll(filters?: ServiceFiltersDto): Promise<ServiceRow[]>;
  findById(id: string): Promise<ServiceRow | null>;
  findBySlug(slug: string): Promise<ServiceRow | null>;
  findByAgency(agencyId: string): Promise<ServiceRow[]>;
  create(data: CreateServiceDto): Promise<ServiceRow>;
  update(id: string, data: UpdateServiceDto): Promise<ServiceRow | null>;
  delete(id: string): Promise<boolean>;
}
