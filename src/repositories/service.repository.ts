import type { DbClient } from "@/src/db/client";
import type { ServiceRow } from "@/src/lib/db-types";
import type { CreateServiceDto, UpdateServiceDto, ServiceFiltersDto } from "@/src/lib/dtos";
import { generateId } from "@/src/db/mock-db";
import type { IServiceRepository } from "./service.repository.interface";

export class ServiceRepository implements IServiceRepository {
  constructor(private readonly db: DbClient) {}

  async findAll(filters?: ServiceFiltersDto): Promise<ServiceRow[]> {
    return this.db.services.findMany((s) => {
      if (filters?.isActive !== undefined && s.is_active !== filters.isActive) return false;
      if (filters?.agencyId && s.agency_id !== filters.agencyId) return false;
      if (filters?.category && s.category !== filters.category) return false;
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        const match =
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    });
  }

  findById(id: string): Promise<ServiceRow | null> {
    return this.db.services.findOne((s) => s.id === id);
  }

  findBySlug(slug: string): Promise<ServiceRow | null> {
    return this.db.services.findOne((s) => s.slug === slug);
  }

  findByAgency(agencyId: string): Promise<ServiceRow[]> {
    return this.db.services.findMany((s) => s.agency_id === agencyId && s.is_active);
  }

  create(data: CreateServiceDto): Promise<ServiceRow> {
    const now = new Date().toISOString();
    const row: ServiceRow = {
      id: generateId(),
      slug: data.slug,
      agency_id: data.agencyId,
      title: data.title,
      description: data.description,
      category: data.category,
      total_fee: data.totalFee ?? null,
      processing_time: data.processingTime ?? null,
      is_featured: data.isFeatured ?? false,
      is_active: true,
      tags: data.tags ?? [],
      created_at: now,
      updated_at: now,
    };
    return this.db.services.insert(row);
  }

  async update(id: string, data: UpdateServiceDto): Promise<ServiceRow | null> {
    const patch: Partial<ServiceRow> = {};
    if (data.slug !== undefined)           patch.slug = data.slug;
    if (data.agencyId !== undefined)       patch.agency_id = data.agencyId;
    if (data.title !== undefined)          patch.title = data.title;
    if (data.description !== undefined)    patch.description = data.description;
    if (data.category !== undefined)       patch.category = data.category;
    if (data.totalFee !== undefined)       patch.total_fee = data.totalFee;
    if (data.processingTime !== undefined) patch.processing_time = data.processingTime;
    if (data.isFeatured !== undefined)     patch.is_featured = data.isFeatured;
    if (data.isActive !== undefined)       patch.is_active = data.isActive;
    if (data.tags !== undefined)           patch.tags = data.tags;
    return this.db.services.update(id, patch);
  }

  delete(id: string): Promise<boolean> {
    return this.db.services.delete(id);
  }
}
