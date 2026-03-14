import type { UserProgressRow } from "@/src/lib/db-types";
import type { UpsertProgressDto } from "@/src/lib/dtos";

export interface IUserProgressRepository {
  findByUserAndService(userId: string, serviceId: string): Promise<UserProgressRow[]>;
  upsert(data: UpsertProgressDto): Promise<UserProgressRow>;
  resetProgress(userId: string, serviceId: string): Promise<number>;
}
