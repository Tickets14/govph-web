import type { DbClient } from '@/src/db/client';
import type { AgencyRow } from '@/src/lib/db-types';
import type { CreateAgencyDto, UpdateAgencyDto } from '@/src/lib/dtos';
import { generateId } from '@/src/db/mock-db';
import type { IAgencyRepository } from './agency.repository.interface';

export class AgencyRepository implements IAgencyRepository {
  constructor(private readonly db: DbClient) {}

  findAll(): Promise<AgencyRow[]> {
    return this.db.agencies.findMany();
  }

  findById(id: string): Promise<AgencyRow | null> {
    return this.db.agencies.findOne((a) => a.id === id);
  }

  findBySlug(slug: string): Promise<AgencyRow | null> {
    return this.db.agencies.findOne((a) => a.slug === slug);
  }

  create(data: CreateAgencyDto): Promise<AgencyRow> {
    const now = new Date().toISOString();
    const row: AgencyRow = {
      id: generateId(),
      slug: data.slug,
      name: data.name,
      acronym: data.acronym,
      description: data.description,
      logo_url: data.logoUrl ?? null,
      website: data.website ?? null,
      is_active: true,
      created_at: now,
      updated_at: now,
    };
    return this.db.agencies.insert(row);
  }

  async update(id: string, data: UpdateAgencyDto): Promise<AgencyRow | null> {
    const patch: Partial<AgencyRow> = {};
    if (data.slug !== undefined) patch.slug = data.slug;
    if (data.name !== undefined) patch.name = data.name;
    if (data.acronym !== undefined) patch.acronym = data.acronym;
    if (data.description !== undefined) patch.description = data.description;
    if (data.logoUrl !== undefined) patch.logo_url = data.logoUrl;
    if (data.website !== undefined) patch.website = data.website;
    if (data.isActive !== undefined) patch.is_active = data.isActive;
    return this.db.agencies.update(id, patch);
  }

  delete(id: string): Promise<boolean> {
    return this.db.agencies.delete(id);
  }
}
