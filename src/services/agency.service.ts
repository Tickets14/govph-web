import type { IAgencyRepository } from "@/src/repositories/agency.repository.interface";
import type { AgencyRow } from "@/src/lib/db-types";
import type { CreateAgencyDto, UpdateAgencyDto } from "@/src/lib/dtos";
import { AppError } from "@/src/lib/errors";

export class AgencyService {
  constructor(private readonly agencyRepo: IAgencyRepository) {}

  // ── Queries ────────────────────────────────────────────────────────────────

  getAllAgencies(): Promise<AgencyRow[]> {
    return this.agencyRepo.findAll();
  }

  async getAgencyBySlug(slug: string): Promise<AgencyRow> {
    const agency = await this.agencyRepo.findBySlug(slug);
    if (!agency) throw AppError.notFoundBySlug("Agency", slug);
    return agency;
  }

  async getAgencyById(id: string): Promise<AgencyRow> {
    const agency = await this.agencyRepo.findById(id);
    if (!agency) throw AppError.notFound("Agency", id);
    return agency;
  }

  // ── Mutations ──────────────────────────────────────────────────────────────

  async createAgency(dto: CreateAgencyDto): Promise<AgencyRow> {
    this.validateCreateDto(dto);

    const existing = await this.agencyRepo.findBySlug(dto.slug);
    if (existing) throw AppError.alreadyExists("Agency", "slug", dto.slug);

    return this.agencyRepo.create(dto);
  }

  async updateAgency(id: string, dto: UpdateAgencyDto): Promise<AgencyRow> {
    // Ensure agency exists
    await this.getAgencyById(id);

    // Check slug uniqueness if slug is being changed
    if (dto.slug) {
      const conflict = await this.agencyRepo.findBySlug(dto.slug);
      if (conflict && conflict.id !== id) {
        throw AppError.alreadyExists("Agency", "slug", dto.slug);
      }
    }

    const updated = await this.agencyRepo.update(id, dto);
    if (!updated) throw AppError.internal(`Failed to update agency "${id}"`);
    return updated;
  }

  async deleteAgency(id: string): Promise<void> {
    const deleted = await this.agencyRepo.delete(id);
    if (!deleted) throw AppError.notFound("Agency", id);
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  private validateCreateDto(dto: CreateAgencyDto): void {
    if (!dto.slug?.trim())    throw AppError.validation("Slug is required");
    if (!dto.name?.trim())    throw AppError.validation("Name is required");
    if (!dto.acronym?.trim()) throw AppError.validation("Acronym is required");
    if (!/^[a-z0-9-]+$/.test(dto.slug)) {
      throw AppError.validation(
        'Slug may only contain lowercase letters, numbers, and hyphens',
        { slug: dto.slug }
      );
    }
  }
}
