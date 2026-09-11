/**
 * AUREV domain model.
 *
 * These shapes are the contract between the UI and whatever data source
 * is connected later (currently `src/data/api.ts` — a mock; a Supabase /
 * REST client will implement the same interface without touching components).
 */

export type Fuel = "Petrol" | "Hybrid" | "Electric";
export type Transmission = "Automated Manual" | "Dual-Clutch" | "Automatic" | "Single-Speed";
export type Drivetrain = "RWD" | "AWD" | "RMR" | "FR";
export type BodyType =
  | "Coupe"
  | "Convertible"
  | "Sedan"
  | "Shooting Brake"
  | "SUV"
  | "GTV";
export type VehicleStatus = "available" | "reserved";

export interface Vehicle {
  id: string; // slug, used in /vehicle/:id
  brand: string;
  model: string;
  variant?: string;
  year: number;
  price: number; // USD
  mileage: number; // km
  engine: string;
  horsepower: number; // hp (DIN)
  torque: number; // Nm
  acceleration: number; // 0–100 km/h, seconds
  topSpeed: number; // km/h
  transmission: Transmission;
  drivetrain: Drivetrain;
  fuel: Fuel;
  bodyType: BodyType;
  exteriorColor: string;
  exteriorHex: string;
  interiorColor: string;
  location: string;
  status: VehicleStatus;
  featured?: boolean;
  badge?: string; // e.g. "ONE OF 40"
  images: VehicleImage[];
  features: string[];
  description: string;
  curatorNote: string;
}

export interface VehicleImage {
  src: string;
  alt: string;
  /** short caption shown in the gallery, e.g. "FRONT THREE-QUARTER" */
  label: string;
}

export interface Brand {
  name: string;
  country: string;
  founded: number;
  blurb: string;
  /** representative image used by the editorial index */
  image: string;
}

export type SortKey = "featured" | "newest" | "price-asc" | "price-desc" | "mileage-asc";

export interface Filters {
  q: string;
  brands: string[];
  bodyTypes: string[];
  fuels: string[];
  transmissions: string[];
  priceBuckets: string[];
  yearMin: number | null;
  mileageMax: number | null;
  powerMin: number | null;
}

export const EMPTY_FILTERS: Filters = {
  q: "",
  brands: [],
  bodyTypes: [],
  fuels: [],
  transmissions: [],
  priceBuckets: [],
  yearMin: null,
  mileageMax: null,
  powerMin: null,
};

export const PRICE_BUCKETS: Record<string, { label: string; min: number; max: number }> = {
  "u150": { label: "Under $150,000", min: 0, max: 149_999 },
  "150-250": { label: "$150k — $250k", min: 150_000, max: 250_000 },
  "250-350": { label: "$250k — $350k", min: 250_001, max: 350_000 },
  "350+": { label: "$350,000 and above", min: 350_001, max: Infinity },
};
