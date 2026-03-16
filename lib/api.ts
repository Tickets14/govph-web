/**
 * Public API helpers — fetch wrappers over the govph-api REST API.
 * Works in both server components (Node.js fetch) and client components (browser fetch).
 */

import type { Agency, Service, Progress, SearchFilters, PaginatedResponse, ServiceCategory } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';

// ── API response shapes (govph-api) ───────────────────────────────────────────

interface ApiAgency {
  id: string;
  name: string;
  acronym: string;
  description: string;
  logo_url?: string | null;
  website_url?: string | null;
}

interface ApiRequirement {
  id: string;
  name: string;
  description?: string | null;
  is_optional?: boolean;
  copies?: number;
}

interface ApiStep {
  id: string;
  order: number;
  title: string;
  description: string;
  duration?: string | null;
  fee?: number | null;
  location?: string | null;
  requirements?: ApiRequirement[];
}

interface ApiService {
  id: string;
  slug: string;
  name: string;
  description: string;
  agency_id: string;
  agency?: ApiAgency;
  category?: string;
  steps?: ApiStep[];
  requirements?: ApiRequirement[];
  estimated_time?: string | null;
  appointment_url?: string | null;
  total_fee?: number | null;
  is_active?: boolean;
  is_featured?: boolean;
  tags?: string[];
}

// ── Mappers ───────────────────────────────────────────────────────────────────

function mapAgency(a: ApiAgency): Agency {
  return {
    id: a.id,
    slug: a.acronym,
    name: a.name,
    acronym: a.acronym,
    description: a.description,
    logoUrl: a.logo_url ?? undefined,
    website: a.website_url ?? undefined,
  };
}

function mapRequirement(r: ApiRequirement) {
  return {
    id: r.id,
    label: r.name,
    description: r.description ?? undefined,
    isOptional: r.is_optional,
    copies: r.copies,
  };
}

function mapService(s: ApiService): Service {
  return {
    id: s.id,
    slug: s.slug,
    title: s.name,
    description: s.description,
    agencyId: s.agency_id,
    agency: s.agency ? mapAgency(s.agency) : undefined,
    category: (s.category as ServiceCategory) ?? 'other',
    steps: (s.steps ?? []).map((step) => ({
      id: step.id,
      order: step.order,
      title: step.title,
      description: step.description,
      duration: step.duration ?? undefined,
      fee: step.fee ?? undefined,
      location: step.location ?? undefined,
      requirements: step.requirements?.map(mapRequirement),
    })),
    requirements: (s.requirements ?? []).map(mapRequirement),
    processingTime: s.estimated_time ?? undefined,
    appointmentUrl: s.appointment_url ?? undefined,
    totalFee: s.total_fee ?? undefined,
    isActive: s.is_active ?? true,
    isFeatured: s.is_featured ?? false,
    tags: s.tags ?? [],
  };
}

// ── Services ──────────────────────────────────────────────────────────────────

export async function getServices(filters?: Partial<SearchFilters>): Promise<Service[]> {
  const params = new URLSearchParams();
  if (filters?.query) params.set('search', filters.query);
  if (filters?.category) params.set('category', filters.category);
  if (filters?.agencyId) params.set('agency_id', filters.agencyId);

  const res = await fetch(`${API_URL}/services?${params}`, { cache: 'no-store' });
  if (!res.ok) return [];
  const json = await res.json();
  const data: ApiService[] = json.data ?? json;
  return data.map(mapService);
}

export async function getFeaturedServices(): Promise<Service[]> {
  const services = await getServices();
  return services.filter((s) => s.isFeatured);
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const res = await fetch(`${API_URL}/services/${slug}`, { cache: 'no-store' });
  if (!res.ok) return null;
  const json = await res.json();
  return mapService(json.data ?? json);
}

export async function getServiceById(id: string): Promise<Service | null> {
  const res = await fetch(`${API_URL}/services/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  const json = await res.json();
  return mapService(json.data ?? json);
}

// ── Agencies ──────────────────────────────────────────────────────────────────

export async function getAgencies(): Promise<Agency[]> {
  const res = await fetch(`${API_URL}/agencies`, { cache: 'no-store' });
  if (!res.ok) return [];
  const json = await res.json();
  const data: ApiAgency[] = json.data ?? json;
  return data.map(mapAgency);
}

export async function getAgencyBySlug(slug: string): Promise<Agency | null> {
  const res = await fetch(`${API_URL}/agencies/${slug}`, { cache: 'no-store' });
  if (!res.ok) return null;
  const json = await res.json();
  const agency = mapAgency(json.data ?? json);
  const services = await getServices({ agencyId: agency.id });
  return { ...agency, services };
}

export async function getServicesByAgency(agencyId: string): Promise<Service[]> {
  return getServices({ agencyId });
}

// ── Paginated (admin) ─────────────────────────────────────────────────────────

export async function getPaginatedServices(page = 1, limit = 10): Promise<PaginatedResponse<Service>> {
  const all = await getServices();
  const total = all.length;
  const data = all.slice((page - 1) * limit, page * limit);
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getPaginatedAgencies(page = 1, limit = 10): Promise<PaginatedResponse<Agency>> {
  const all = await getAgencies();
  const total = all.length;
  const data = all.slice((page - 1) * limit, page * limit);
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}

// ── Progress ──────────────────────────────────────────────────────────────────

export async function getProgressSummary(userId: string, serviceId: string): Promise<Progress> {
  const res = await fetch(`${API_URL}/progress/${serviceId}`, {
    headers: { 'X-User-Id': userId },
    cache: 'no-store',
  });
  if (!res.ok) {
    return { serviceId, completedSteps: [], completedRequirements: [], lastUpdated: new Date().toISOString() };
  }
  const json = await res.json();
  const data = json.data ?? json;
  return {
    serviceId,
    completedSteps: (data.records ?? []).map((r: { step_id: string }) => r.step_id),
    completedRequirements: [],
    lastUpdated: new Date().toISOString(),
  };
}

export async function toggleStep(
  userId: string,
  serviceId: string,
  stepId: string
): Promise<{ isCompleted: boolean; completionPercentage: number }> {
  const res = await fetch(`${API_URL}/progress/${serviceId}/toggle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-User-Id': userId },
    body: JSON.stringify({ step_id: stepId }),
  });
  if (!res.ok) return { isCompleted: false, completionPercentage: 0 };
  return res.json();
}
