import type { Vehicle } from "./types";
import { VEHICLES, findVehicle } from "./vehicles";

/**
 * AUREV mock API.
 *
 * Every screen talks to these functions — never to the raw arrays.
 * When the backend phase lands, each function becomes a `fetch()` and
 * nothing else has to change.
 */

const MOCK_LATENCY_MS = 380;

const wait = (ms = MOCK_LATENCY_MS) => new Promise<void>((r) => setTimeout(r, ms));

export async function fetchVehicles(): Promise<Vehicle[]> {
  await wait();
  return VEHICLES;
}

export async function fetchVehicle(id: string): Promise<Vehicle | null> {
  await wait(240);
  return findVehicle(id) ?? null;
}

export async function fetchFeatured(limit = 5): Promise<Vehicle[]> {
  await wait();
  const featured = VEHICLES.filter((v) => v.featured);
  const rest = VEHICLES.filter((v) => !v.featured);
  return [...featured, ...rest].slice(0, limit);
}

export async function fetchSimilar(id: string, limit = 3): Promise<Vehicle[]> {
  await wait(260);
  const self = findVehicle(id);
  if (!self) return [];
  const scored = VEHICLES.filter((v) => v.id !== id)
    .map((v) => {
      let score = 0;
      if (v.brand === self.brand) score += 3;
      if (v.bodyType === self.bodyType) score += 2;
      if (Math.abs(v.price - self.price) < 60_000) score += 2;
      if (Math.abs(v.year - self.year) <= 1) score += 1;
      return { v, score };
    })
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.v);
}
