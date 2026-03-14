/**
 * Raw database row shapes (snake_case) — mirrors the SQL schema.
 * Repositories return these; services map them to domain types.
 */

export interface AgencyRow {
  id: string;
  slug: string;
  name: string;
  acronym: string;
  description: string;
  logo_url: string | null;
  website: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceRow {
  id: string;
  slug: string;
  agency_id: string;
  title: string;
  description: string;
  category: string;
  total_fee: number | null;
  processing_time: string | null;
  is_featured: boolean;
  is_active: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface StepRow {
  id: string;
  service_id: string;
  order: number;
  title: string;
  description: string;
  duration: string | null;
  fee: number | null;
  location: string | null;
  created_at: string;
  updated_at: string;
}

export interface RequirementRow {
  id: string;
  service_id: string;
  /** null = service-level requirement (not tied to a step) */
  step_id: string | null;
  label: string;
  description: string | null;
  is_optional: boolean;
  copies: number;
  created_at: string;
  updated_at: string;
}

export interface UserProgressRow {
  id: string;
  user_id: string;
  service_id: string;
  step_id: string;
  is_completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}
