/**
 * Minimal database client interface.
 * The mock implementation uses in-memory arrays.
 * Replace with a Prisma/Drizzle/pg adapter without touching repositories.
 */

import type { AgencyRow, ServiceRow, StepRow, RequirementRow, UserProgressRow } from '@/src/lib/db-types';
import * as db from './mock-db';

export interface DbClient {
  agencies: DbTable<AgencyRow>;
  services: DbTable<ServiceRow>;
  steps: DbTable<StepRow>;
  requirements: DbTable<RequirementRow>;
  userProgress: DbTable<UserProgressRow>;
}

export interface DbTable<T extends { id: string }> {
  findMany(predicate?: (row: T) => boolean): Promise<T[]>;
  findOne(predicate: (row: T) => boolean): Promise<T | null>;
  insert(row: T): Promise<T>;
  update(id: string, patch: Partial<Omit<T, 'id' | 'created_at'>>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

// ── In-memory implementation ──────────────────────────────────────────────────

function makeTable<T extends { id: string }>(store: T[]): DbTable<T> {
  return {
    async findMany(predicate) {
      return predicate ? store.filter(predicate) : [...store];
    },

    async findOne(predicate) {
      return store.find(predicate) ?? null;
    },

    async insert(row) {
      store.push(row);
      return row;
    },

    async update(id, patch) {
      const idx = store.findIndex((r) => r.id === id);
      if (idx === -1) return null;
      store[idx] = {
        ...store[idx],
        ...patch,
        updated_at: new Date().toISOString(),
      } as T;
      return store[idx];
    },

    async delete(id) {
      const idx = store.findIndex((r) => r.id === id);
      if (idx === -1) return false;
      store.splice(idx, 1);
      return true;
    },
  };
}

// ── Singleton client export ───────────────────────────────────────────────────

export const dbClient: DbClient = {
  agencies: makeTable(db.agencies),
  services: makeTable(db.services),
  steps: makeTable(db.steps),
  requirements: makeTable(db.requirements),
  userProgress: makeTable(db.userProgress),
};
