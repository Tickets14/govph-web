/**
 * Public API helpers — thin wrappers over the service layer.
 * Next.js Server Components and Route Handlers import from here.
 */

import { agencyService, serviceService, progressService } from "@/src/container";
import type { Agency, Service, Progress, SearchFilters, PaginatedResponse } from "@/types";
import type { ServiceFiltersDto } from "@/src/lib/dtos";
import type { ServiceCategory } from "@/types";

// ── Mappers ───────────────────────────────────────────────────────────────────

function rowToAgency(row: Awaited<ReturnType<typeof agencyService.getAgencyById>>): Agency {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    acronym: row.acronym,
    description: row.description,
    logoUrl: row.logo_url ?? undefined,
    website: row.website ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function fullServiceToService(
  full: Awaited<ReturnType<typeof serviceService.getServiceBySlug>>
): Service {
  const { service, agency, steps, requirements } = full;
  return {
    id: service.id,
    slug: service.slug,
    title: service.title,
    description: service.description,
    agencyId: service.agency_id,
    agency: agency
      ? {
          id: agency.id,
          slug: agency.slug,
          name: agency.name,
          acronym: agency.acronym,
          description: agency.description,
          logoUrl: agency.logo_url ?? undefined,
          website: agency.website ?? undefined,
        }
      : undefined,
    category: service.category as ServiceCategory,
    steps: steps.map((s) => ({
      id: s.id,
      order: s.order,
      title: s.title,
      description: s.description,
      duration: s.duration ?? undefined,
      fee: s.fee ?? undefined,
      location: s.location ?? undefined,
      requirements: s.requirements.map((r) => ({
        id: r.id,
        label: r.label,
        description: r.description ?? undefined,
        isOptional: r.is_optional,
        copies: r.copies,
      })),
    })),
    requirements: requirements.map((r) => ({
      id: r.id,
      label: r.label,
      description: r.description ?? undefined,
      isOptional: r.is_optional,
      copies: r.copies,
    })),
    totalFee: service.total_fee ?? undefined,
    processingTime: service.processing_time ?? undefined,
    isFeatured: service.is_featured,
    tags: service.tags,
    createdAt: service.created_at,
    updatedAt: service.updated_at,
  };
}

// ── Services ──────────────────────────────────────────────────────────────────

export async function getServices(filters?: Partial<SearchFilters>): Promise<Service[]> {
  const dto: ServiceFiltersDto = {
    search: filters?.query,
    category: filters?.category,
    agencyId: filters?.agencyId,
    isActive: true,
  };
  const rows = await serviceService.getAllServices(dto);
  const fulls = await Promise.all(rows.map((r) => serviceService.getServiceById(r.id)));
  return fulls.map(fullServiceToService);
}

export async function getFeaturedServices(): Promise<Service[]> {
  const rows = await serviceService.getAllServices({ isActive: true });
  const featured = rows.filter((r) => r.is_featured);
  const fulls = await Promise.all(featured.map((r) => serviceService.getServiceById(r.id)));
  return fulls.map(fullServiceToService);
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  try {
    const full = await serviceService.getServiceBySlug(slug);
    return fullServiceToService(full);
  } catch {
    return null;
  }
}

export async function getServiceById(id: string): Promise<Service | null> {
  try {
    const full = await serviceService.getServiceById(id);
    return fullServiceToService(full);
  } catch {
    return null;
  }
}

// ── Agencies ──────────────────────────────────────────────────────────────────

export async function getAgencies(): Promise<Agency[]> {
  const rows = await agencyService.getAllAgencies();
  return rows.map(rowToAgency);
}

export async function getAgencyBySlug(slug: string): Promise<Agency | null> {
  try {
    const agency = await agencyService.getAgencyBySlug(slug);
    const services = await serviceService.getAllServices({ agencyId: agency.id, isActive: true });
    const fulls = await Promise.all(services.map((s) => serviceService.getServiceById(s.id)));
    return { ...rowToAgency(agency), services: fulls.map(fullServiceToService) };
  } catch {
    return null;
  }
}

export async function getServicesByAgency(agencyId: string): Promise<Service[]> {
  const rows = await serviceService.getAllServices({ agencyId, isActive: true });
  const fulls = await Promise.all(rows.map((r) => serviceService.getServiceById(r.id)));
  return fulls.map(fullServiceToService);
}

// ── Paginated (admin) ─────────────────────────────────────────────────────────

export async function getPaginatedServices(
  page = 1,
  limit = 10
): Promise<PaginatedResponse<Service>> {
  const all = await getServices();
  const total = all.length;
  const data = all.slice((page - 1) * limit, page * limit);
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getPaginatedAgencies(
  page = 1,
  limit = 10
): Promise<PaginatedResponse<Agency>> {
  const all = await getAgencies();
  const total = all.length;
  const data = all.slice((page - 1) * limit, page * limit);
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}

// ── Progress (client-facing) ──────────────────────────────────────────────────

export async function getProgressSummary(
  userId: string,
  serviceId: string
): Promise<Progress> {
  const summary = await progressService.getProgress(userId, serviceId);
  return {
    serviceId: summary.serviceId,
    completedSteps: summary.completedStepIds,
    completedRequirements: [],          // requirements stored client-side via useProgress hook
    lastUpdated: summary.lastUpdated ?? new Date().toISOString(),
  };
}

export async function toggleStep(
  userId: string,
  serviceId: string,
  stepId: string
): Promise<{ isCompleted: boolean; completionPercentage: number }> {
  return progressService.toggleStep(userId, serviceId, stepId);
}
