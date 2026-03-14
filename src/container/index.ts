/**
 * Dependency Injection container — singleton per process.
 *
 * Construction order:
 *   1. DB client
 *   2. Repositories (depend on DB client)
 *   3. Services (depend on repositories)
 *
 * Usage:
 *   import { container } from "@/src/container";
 *   const agency = await container.agencyService.getAgencyBySlug("dfa");
 */

import { dbClient } from '@/src/db/client';

// Repositories
import { AgencyRepository } from '@/src/repositories/agency.repository';
import { ServiceRepository } from '@/src/repositories/service.repository';
import { StepRepository } from '@/src/repositories/step.repository';
import { RequirementRepository } from '@/src/repositories/requirement.repository';
import { UserProgressRepository } from '@/src/repositories/user-progress.repository';

// Services
import { AgencyService } from '@/src/services/agency.service';
import { ServiceService } from '@/src/services/service.service';
import { ProgressService } from '@/src/services/progress.service';

// Re-export types for convenience
export type { IAgencyRepository } from '@/src/repositories/agency.repository.interface';
export type { IServiceRepository } from '@/src/repositories/service.repository.interface';
export type { IStepRepository } from '@/src/repositories/step.repository.interface';
export type { IRequirementRepository } from '@/src/repositories/requirement.repository.interface';
export type { IUserProgressRepository } from '@/src/repositories/user-progress.repository.interface';

// ── Container class ───────────────────────────────────────────────────────────

class Container {
  private static _instance: Container;

  // ── Repositories ─────────────────────────────────────────────────────────
  public readonly agencyRepository: AgencyRepository;
  public readonly serviceRepository: ServiceRepository;
  public readonly stepRepository: StepRepository;
  public readonly requirementRepository: RequirementRepository;
  public readonly userProgressRepository: UserProgressRepository;

  // ── Services ──────────────────────────────────────────────────────────────
  public readonly agencyService: AgencyService;
  public readonly serviceService: ServiceService;
  public readonly progressService: ProgressService;

  private constructor() {
    // Repositories
    this.agencyRepository = new AgencyRepository(dbClient);
    this.serviceRepository = new ServiceRepository(dbClient);
    this.stepRepository = new StepRepository(dbClient);
    this.requirementRepository = new RequirementRepository(dbClient);
    this.userProgressRepository = new UserProgressRepository(dbClient);

    // Services
    this.agencyService = new AgencyService(this.agencyRepository);

    this.serviceService = new ServiceService(
      this.serviceRepository,
      this.agencyRepository,
      this.stepRepository,
      this.requirementRepository,
      this.userProgressRepository
    );

    this.progressService = new ProgressService(
      this.userProgressRepository,
      this.stepRepository,
      this.serviceRepository
    );
  }

  static getInstance(): Container {
    if (!Container._instance) {
      Container._instance = new Container();
    }
    return Container._instance;
  }
}

export const container = Container.getInstance();

// ── Convenience named exports ─────────────────────────────────────────────────

export const { agencyService, serviceService, progressService } = container;
