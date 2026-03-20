export interface Agency {
  id: string;
  slug: string;
  name: string;
  acronym: string;
  description: string;
  logoUrl?: string;
  website?: string;
  services?: Service[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Requirement {
  id: string;
  label: string;
  description?: string;
  isOptional?: boolean;
  copies?: number;
}

export interface Step {
  id: string;
  order: number;
  title: string;
  description: string;
  duration?: string;
  fee?: number;
  requirements?: Requirement[];
  location?: string;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  agencyId: string;
  agency?: Agency;
  category: ServiceCategory;
  steps: Step[];
  requirements: Requirement[];
  totalFee?: number;
  processingTime?: string;
  appointmentUrl?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export type ServiceCategory =
  | 'civil_registry'
  | 'foreign_affairs'
  | 'housing'
  | 'business'
  | 'clearance'
  | 'government'
  | 'professional'
  | 'health'
  | 'social_security'
  | 'transport'
  | 'identification'
  | 'overseas'
  | 'tax'
  | 'social_services'
  | 'other';

export interface Progress {
  serviceId: string;
  completedSteps: string[];
  completedRequirements: string[];
  lastUpdated: string;
}

export interface SearchFilters {
  query: string;
  category?: ServiceCategory;
  agencyId?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
