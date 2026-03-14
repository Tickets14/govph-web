import type { ServiceCategory } from '@/types';

// ── Agency DTOs ───────────────────────────────────────────────────────────────

export interface CreateAgencyDto {
  slug: string;
  name: string;
  acronym: string;
  description: string;
  logoUrl?: string;
  website?: string;
}

export interface UpdateAgencyDto {
  slug?: string;
  name?: string;
  acronym?: string;
  description?: string;
  logoUrl?: string;
  website?: string;
  isActive?: boolean;
}

// ── Service DTOs ──────────────────────────────────────────────────────────────

export interface CreateServiceDto {
  slug: string;
  agencyId: string;
  title: string;
  description: string;
  category: ServiceCategory;
  totalFee?: number;
  processingTime?: string;
  isFeatured?: boolean;
  tags?: string[];
}

export interface UpdateServiceDto {
  slug?: string;
  agencyId?: string;
  title?: string;
  description?: string;
  category?: ServiceCategory;
  totalFee?: number;
  processingTime?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  tags?: string[];
}

export interface ServiceFiltersDto {
  agencyId?: string;
  isActive?: boolean;
  search?: string;
  category?: ServiceCategory;
}

// ── Step DTOs ─────────────────────────────────────────────────────────────────

export interface CreateStepDto {
  serviceId: string;
  order: number;
  title: string;
  description: string;
  duration?: string;
  fee?: number;
  location?: string;
}

export interface UpdateStepDto {
  order?: number;
  title?: string;
  description?: string;
  duration?: string;
  fee?: number;
  location?: string;
}

// ── Requirement DTOs ──────────────────────────────────────────────────────────

export interface CreateRequirementDto {
  serviceId: string;
  stepId?: string;
  label: string;
  description?: string;
  isOptional?: boolean;
  copies?: number;
}

export interface UpdateRequirementDto {
  label?: string;
  description?: string;
  isOptional?: boolean;
  copies?: number;
}

// ── Progress DTOs ─────────────────────────────────────────────────────────────

export interface UpsertProgressDto {
  userId: string;
  serviceId: string;
  stepId: string;
  isCompleted: boolean;
}

// ── Response types ────────────────────────────────────────────────────────────

export interface ServiceWithProgressDto {
  id: string;
  slug: string;
  title: string;
  description: string;
  agencyId: string;
  category: ServiceCategory;
  totalFee: number | null;
  processingTime: string | null;
  isFeatured: boolean;
  tags: string[];
  steps: StepWithProgressDto[];
  requirements: RequirementDto[];
  completionPercentage: number;
}

export interface StepWithProgressDto {
  id: string;
  serviceId: string;
  order: number;
  title: string;
  description: string;
  duration: string | null;
  fee: number | null;
  location: string | null;
  isCompleted: boolean;
  completedAt: string | null;
  requirements: RequirementDto[];
}

export interface RequirementDto {
  id: string;
  serviceId: string;
  stepId: string | null;
  label: string;
  description: string | null;
  isOptional: boolean;
  copies: number;
}

export interface ProgressSummaryDto {
  userId: string;
  serviceId: string;
  completedStepIds: string[];
  totalSteps: number;
  completedSteps: number;
  completionPercentage: number;
  lastUpdated: string | null;
}
