import type { AgencyRow } from "@/src/lib/db-types";
import type { CreateAgencyDto, UpdateAgencyDto } from "@/src/lib/dtos";

export interface IAgencyRepository {
  findAll(): Promise<AgencyRow[]>;
  findById(id: string): Promise<AgencyRow | null>;
  findBySlug(slug: string): Promise<AgencyRow | null>;
  create(data: CreateAgencyDto): Promise<AgencyRow>;
  update(id: string, data: UpdateAgencyDto): Promise<AgencyRow | null>;
  delete(id: string): Promise<boolean>;
}
