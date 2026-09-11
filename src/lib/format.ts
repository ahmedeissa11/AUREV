/* Formatting primitives — metric first, price in USD (international market). */

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatPrice(value: number): string {
  return usd.format(value);
}

export function formatMileage(km: number): string {
  return `${new Intl.NumberFormat("en-US").format(km)} km`;
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

export function formatHp(hp: number): string {
  return `${formatNumber(hp)} hp`;
}

export function formatTorque(nm: number): string {
  return `${formatNumber(nm)} Nm`;
}

export function formatAccel(s: number): string {
  return `${s.toFixed(1).replace(/\.0$/, ".0")}s`;
}

export function formatSpeed(kmh: number): string {
  return `${kmh} km/h`;
}

export function vehicleTitle(v: { brand: string; model: string; variant?: string }): string {
  return [v.brand, v.model, v.variant].filter(Boolean).join(" ");
}

export function shortRef(seed: string): string {
  /* deterministic pseudo-reference id for mock form confirmations */
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return `AV-${(h % 9000 + 1000).toString()}`;
}
