import type { Filters } from "../../data/types";
import { PRICE_BUCKETS } from "../../data/types";
import { BRANDS, VEHICLES } from "../../data/vehicles";
import { allBodyTypes, allFuels, allTransmissions } from "../../lib/query";
import { CheckOption } from "../ui/Field";
import { formatNumber } from "../../lib/format";

/* ------------------------------------------------------------------ */
/*  FilterPanel — pure controlled component; Collection owns state.   */
/* ------------------------------------------------------------------ */

type Patch = (p: Partial<Filters>) => void;

function toggle<T extends string>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-line py-6 first:pt-0">
      <p className="label-mono mb-4 !text-[10px]">{title}</p>
      {children}
    </div>
  );
}

export default function FilterPanel({ filters, patch }: { filters: Filters; patch: Patch }) {
  const f = filters;

  return (
    <div className="text-sm">
      <Section title="Brand">
        <div className="space-y-3">
          {BRANDS.map((b) => {
            const count = VEHICLES.filter((v) => v.brand === b.name).length;
            if (!count) return null;
            return (
              <CheckOption
                key={b.name}
                label={b.name}
                count={count}
                checked={f.brands.includes(b.name)}
                onChange={() => patch({ brands: toggle(f.brands, b.name) })}
              />
            );
          })}
        </div>
      </Section>

      <Section title="Body type">
        <div className="flex flex-wrap gap-2">
          {allBodyTypes().map((bt) => (
            <button
              key={bt}
              type="button"
              className="chip"
              aria-pressed={f.bodyTypes.includes(bt)}
              onClick={() => patch({ bodyTypes: toggle(f.bodyTypes, bt) })}
            >
              {bt}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Price">
        <div className="space-y-3">
          {Object.entries(PRICE_BUCKETS).map(([key, { label }]) => (
            <CheckOption
              key={key}
              label={label}
              checked={f.priceBuckets.includes(key)}
              onChange={() => patch({ priceBuckets: toggle(f.priceBuckets, key) })}
            />
          ))}
        </div>
      </Section>

      <Section title="Powertrain">
        <div className="mb-4 flex flex-wrap gap-2">
          {allFuels().map((fl) => (
            <button
              key={fl}
              type="button"
              className="chip"
              aria-pressed={f.fuels.includes(fl)}
              onClick={() => patch({ fuels: toggle(f.fuels, fl) })}
            >
              {fl}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {allTransmissions().map((tr) => (
            <button
              key={tr}
              type="button"
              className="chip"
              aria-pressed={f.transmissions.includes(tr)}
              onClick={() => patch({ transmissions: toggle(f.transmissions, tr) })}
            >
              {tr}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Output — minimum horsepower">
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={450}
            max={1000}
            step={10}
            value={f.powerMin ?? 450}
            onChange={(e) => {
              const v = Number(e.target.value);
              patch({ powerMin: v <= 450 ? null : v });
            }}
            className="lux-range w-full"
            aria-label="Minimum horsepower"
          />
          <span className="w-20 shrink-0 text-right font-mono text-[11px] tracking-wide text-mist">
            {f.powerMin ? `${formatNumber(f.powerMin)} hp` : "Any"}
          </span>
        </div>
      </Section>

      <Section title="Year & mileage">
        <div className="grid grid-cols-2 gap-3">
          <select
            value={f.yearMin ?? ""}
            onChange={(e) => patch({ yearMin: e.target.value ? Number(e.target.value) : null })}
            className="field__input !py-2.5 text-[13px]"
            aria-label="Minimum year"
          >
            <option value="">Any year</option>
            {[2019, 2020, 2021, 2022, 2023, 2024].map((y) => (
              <option key={y} value={y}>
                {y}+
              </option>
            ))}
          </select>
          <select
            value={f.mileageMax ?? ""}
            onChange={(e) => patch({ mileageMax: e.target.value ? Number(e.target.value) : null })}
            className="field__input !py-2.5 text-[13px]"
            aria-label="Maximum mileage"
          >
            <option value="">Any mileage</option>
            {[5_000, 10_000, 15_000, 20_000].map((m) => (
              <option key={m} value={m}>
                Under {formatNumber(m)} km
              </option>
            ))}
          </select>
        </div>
      </Section>
    </div>
  );
}
