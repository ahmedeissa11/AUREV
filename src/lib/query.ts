import type { Filters, SortKey, Vehicle } from "../data/types";
import { PRICE_BUCKETS } from "../data/types";
import { VEHICLES } from "../data/vehicles";

/* ------------------------------------------------------------------ */
/*  Pure, synchronous query logic — the same function can run        */
/*  server-side later without touching the UI.                        */
/* ------------------------------------------------------------------ */

export function matchesFilters(v: Vehicle, f: Filters): boolean {
  const q = f.q.trim().toLowerCase();
  if (q) {
    const haystack = `${v.brand} ${v.model} ${v.variant ?? ""} ${v.year} ${v.engine} ${v.bodyType}`.toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  if (f.brands.length && !f.brands.includes(v.brand)) return false;
  if (f.bodyTypes.length && !f.bodyTypes.includes(v.bodyType)) return false;
  if (f.fuels.length && !f.fuels.includes(v.fuel)) return false;
  if (f.transmissions.length && !f.transmissions.includes(v.transmission)) return false;
  if (f.priceBuckets.length) {
    const hit = f.priceBuckets.some((key) => {
      const bucket = PRICE_BUCKETS[key];
      return bucket && v.price >= bucket.min && v.price <= bucket.max;
    });
    if (!hit) return false;
  }
  if (f.yearMin != null && v.year < f.yearMin) return false;
  if (f.mileageMax != null && v.mileage > f.mileageMax) return false;
  if (f.powerMin != null && v.horsepower < f.powerMin) return false;
  return true;
}

export function sortVehicles(list: Vehicle[], sort: SortKey): Vehicle[] {
  const out = [...list];
  switch (sort) {
    case "newest":
      out.sort((a, b) => b.year - a.year || a.mileage - b.mileage);
      break;
    case "price-asc":
      out.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      out.sort((a, b) => b.price - a.price);
      break;
    case "mileage-asc":
      out.sort((a, b) => a.mileage - b.mileage);
      break;
    case "featured":
    default:
      out.sort(
        (a, b) =>
          Number(b.featured ?? false) - Number(a.featured ?? false) || b.year - a.year
      );
  }
  return out;
}

export function queryVehicles(all: Vehicle[], f: Filters, sort: SortKey): Vehicle[] {
  return sortVehicles(
    all.filter((v) => matchesFilters(v, f)),
    sort
  );
}

export function activeFilterCount(f: Filters): number {
  return (
    f.brands.length +
    f.bodyTypes.length +
    f.fuels.length +
    f.transmissions.length +
    f.priceBuckets.length +
    (f.yearMin != null ? 1 : 0) +
    (f.mileageMax != null ? 1 : 0) +
    (f.powerMin != null ? 1 : 0) +
    (f.q.trim() ? 1 : 0)
  );
}

/** lightweight search used by the global search overlay */
export function quickSearch(term: string, limit = 5): Vehicle[] {
  const q = term.trim().toLowerCase();
  if (!q) return [];
  return VEHICLES.filter((v) =>
    `${v.brand} ${v.model} ${v.variant ?? ""}`.toLowerCase().includes(q)
  ).slice(0, limit);
}

export function allBodyTypes(): string[] {
  return [...new Set(VEHICLES.map((v) => v.bodyType))].sort();
}
export function allFuels(): string[] {
  return [...new Set(VEHICLES.map((v) => v.fuel))].sort();
}
export function allTransmissions(): string[] {
  return [...new Set(VEHICLES.map((v) => v.transmission))].sort();
}
