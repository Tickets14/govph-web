import type { IServiceRepository } from "@/src/repositories/service.repository.interface";
import type { IAgencyRepository } from "@/src/repositories/agency.repository.interface";
import type { IStepRepository } from "@/src/repositories/step.repository.interface";
import type { IRequirementRepository } from "@/src/repositories/requirement.repository.interface";
import type { IUserProgressRepository } from "@/src/repositories/user-progress.repository.interface";
import type { ServiceRow, AgencyRow, StepRow, RequirementRow } from "@/src/lib/db-types";
import type {
  CreateServiceDto,
  UpdateServiceDto,
  ServiceFiltersDto,
  ServiceWithProgressDto,
  StepWithProgressDto,
  RequirementDto,
} from "@/src/lib/dtos";
import { AppError } from "@/src/lib/errors";
import type { ServiceCategory } from "@/types";

// ── Domain type (service + nested relations) ──────────────────────────────────

export interface FullService {
  service: ServiceRow;
  agency: AgencyRow | null;
  steps: Array<StepRow & { requirements: RequirementRow[] }>;
  requirements: RequirementRow[];
}

export class ServiceService {
  constructor(
    private readonly serviceRepo: IServiceRepository,
    private readonly agencyRepo: IAgencyRepository,
    private readonly stepRepo: IStepRepository,
    private readonly requirementRepo: IRequirementRepository,
    private readonly progressRepo: IUserProgressRepository
  ) {}

  // ── Queries ────────────────────────────────────────────────────────────────

  getAllServices(filters?: ServiceFiltersDto): Promise<ServiceRow[]> {
    return this.serviceRepo.findAll(filters);
  }

  async getServiceBySlug(slug: string): Promise<FullService> {
    const service = await this.serviceRepo.findBySlug(slug);
    if (!service) throw AppError.notFoundBySlug("Service", slug);
    return this.hydrate(service);
  }

  async getServiceById(id: string): Promise<FullService> {
    const service = await this.serviceRepo.findById(id);
    if (!service) throw AppError.notFound("Service", id);
    return this.hydrate(service);
  }

  /**
   * Returns the service with steps + requirements, each step annotated with
   * the calling user's completion status.
   */
  async getServiceWithProgress(slug: string, userId: string): Promise<ServiceWithProgressDto> {
    const { service, agency, steps, requirements } = await this.getServiceBySlug(slug);
    const progressRows = await this.progressRepo.findByUserAndService(userId, service.id);

    const progressMap = new Map(
      progressRows.map((p) => [p.step_id, p])
    );

    const completedCount = progressRows.filter((p) => p.is_completed).length;
    const totalSteps = steps.length;

    const stepsWithProgress: StepWithProgressDto[] = steps.map((step) => {
      const prog = progressMap.get(step.id);
      return {
        id: step.id,
        serviceId: step.service_id,
        order: step.order,
        title: step.title,
        description: step.description,
        duration: step.duration,
        fee: step.fee,
        location: step.location,
        isCompleted: prog?.is_completed ?? false,
        completedAt: prog?.completed_at ?? null,
        requirements: step.requirements.map(toRequirementDto),
      };
    });

    return {
      id: service.id,
      slug: service.slug,
      title: service.title,
      description: service.description,
      agencyId: service.agency_id,
      category: service.category as ServiceCategory,
      totalFee: service.total_fee,
      processingTime: service.processing_time,
      isFeatured: service.is_featured,
      tags: service.tags,
      steps: stepsWithProgress,
      requirements: requirements.map(toRequirementDto),
      completionPercentage:
        totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0,
    };
  }

  // ── Mutations ──────────────────────────────────────────────────────────────

  async createService(dto: CreateServiceDto): Promise<ServiceRow> {
    this.validateCreateDto(dto);

    const agency = await this.agencyRepo.findById(dto.agencyId);
    if (!agency) throw AppError.notFound("Agency", dto.agencyId);

    const existing = await this.serviceRepo.findBySlug(dto.slug);
    if (existing) throw AppError.alreadyExists("Service", "slug", dto.slug);

    return this.serviceRepo.create(dto);
  }

  async updateService(id: string, dto: UpdateServiceDto): Promise<ServiceRow> {
    const service = await this.serviceRepo.findById(id);
    if (!service) throw AppError.notFound("Service", id);

    if (dto.agencyId && dto.agencyId !== service.agency_id) {
      const agency = await this.agencyRepo.findById(dto.agencyId);
      if (!agency) throw AppError.notFound("Agency", dto.agencyId);
    }

    if (dto.slug && dto.slug !== service.slug) {
      const conflict = await this.serviceRepo.findBySlug(dto.slug);
      if (conflict) throw AppError.alreadyExists("Service", "slug", dto.slug);
    }

    const updated = await this.serviceRepo.update(id, dto);
    if (!updated) throw AppError.internal(`Failed to update service "${id}"`);
    return updated;
  }

  async deleteService(id: string): Promise<void> {
    const deleted = await this.serviceRepo.delete(id);
    if (!deleted) throw AppError.notFound("Service", id);
  }

  // ── Private helpers ────────────────────────────────────────────────────────

  private async hydrate(service: ServiceRow): Promise<FullService> {
    const [agency, steps, allReqs] = await Promise.all([
      this.agencyRepo.findById(service.agency_id),
      this.stepRepo.findByService(service.id),
      this.requirementRepo.findByService(service.id),
    ]);

    const reqsByStep = new Map<string, RequirementRow[]>();
    const serviceReqs: RequirementRow[] = [];

    for (const req of allReqs) {
      if (req.step_id) {
        const arr = reqsByStep.get(req.step_id) ?? [];
        arr.push(req);
        reqsByStep.set(req.step_id, arr);
      } else {
        serviceReqs.push(req);
      }
    }

    const stepsWithReqs = steps.map((s) => ({
      ...s,
      requirements: reqsByStep.get(s.id) ?? [],
    }));

    return { service, agency, steps: stepsWithReqs, requirements: serviceReqs };
  }

  private validateCreateDto(dto: CreateServiceDto): void {
    if (!dto.slug?.trim())        throw AppError.validation("Slug is required");
    if (!dto.title?.trim())       throw AppError.validation("Title is required");
    if (!dto.agencyId?.trim())    throw AppError.validation("Agency ID is required");
    if (!dto.category)            throw AppError.validation("Category is required");
    if (!/^[a-z0-9-]+$/.test(dto.slug)) {
      throw AppError.validation(
        "Slug may only contain lowercase letters, numbers, and hyphens",
        { slug: dto.slug }
      );
    }
  }
}

function toRequirementDto(r: RequirementRow): RequirementDto {
  return {
    id: r.id,
    serviceId: r.service_id,
    stepId: r.step_id,
    label: r.label,
    description: r.description,
    isOptional: r.is_optional,
    copies: r.copies,
  };
}
