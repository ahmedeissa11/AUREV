import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { Filters, SortKey, Vehicle } from "../data/types";
import { EMPTY_FILTERS, PRICE_BUCKETS } from "../data/types";
import { fetchVehicles } from "../data/api";
import { VEHICLES } from "../data/vehicles";
import { activeFilterCount, queryVehicles } from "../lib/query";
import CarCard from "../components/cars/CarCard";
import QuickView from "../components/cars/QuickView";
import FilterPanel from "../components/filters/FilterPanel";
import { Drawer, CloseButton } from "../components/ui/Modal";
import { IconClose, IconSearch } from "../components/ui/icons";
import { CarGridSkeleton } from "../components/ui/Skeleton";
import { useSeo } from "../lib/seo";

/* ------------------------------------------------------------------ */
/*  Collection — a stock list, not a storefront. The cars dominate;     */
/*  the filter column is a quiet ledger of hairlines. State lives       */
/*  in the URL so any view of the showroom is shareable.                */
/* ------------------------------------------------------------------ */

const SORTS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price low → high" },
  { value: "price-desc", label: "Price high → low" },
  { value: "mileage-asc", label: "Lowest mileage" },
];

function parseParams(sp: URLSearchParams): { filters: Filters; sort: SortKey } {
  const list = (k: string) => (sp.get(k) ? sp.get(k)!.split(",").filter(Boolean) : []);
  const num = (k: string) => (sp.get(k) ? Number(sp.get(k)) || null : null);
  return {
    filters: {
      ...EMPTY_FILTERS,
      q: sp.get("q") ?? "",
      brands: list("brand"),
      bodyTypes: list("body"),
      fuels: list("fuel"),
      transmissions: list("trans"),
      priceBuckets: list("price"),
      yearMin: num("year"),
      mileageMax: num("km"),
      powerMin: num("hp"),
    },
    sort: (SORTS.find((s) => s.value === sp.get("sort"))?.value ?? "featured") as SortKey,
  };
}

function writeParams(filters: Filters, sort: SortKey): Record<string, string> {
  const out: Record<string, string> = {};
  if (filters.q) out.q = filters.q;
  if (filters.brands.length) out.brand = filters.brands.join(",");
  if (filters.bodyTypes.length) out.body = filters.bodyTypes.join(",");
  if (filters.fuels.length) out.fuel = filters.fuels.join(",");
  if (filters.transmissions.length) out.trans = filters.transmissions.join(",");
  if (filters.priceBuckets.length) out.price = filters.priceBuckets.join(",");
  if (filters.yearMin) out.year = String(filters.yearMin);
  if (filters.mileageMax) out.km = String(filters.mileageMax);
  if (filters.powerMin) out.hp = String(filters.powerMin);
  if (sort !== "featured") out.sort = sort;
  return out;
}

export default function Collection() {
  const [sp, setSp] = useSearchParams();
  const { filters, sort } = useMemo(() => parseParams(sp), [sp]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [quick, setQuick] = useState<Vehicle | null>(null);
  const [term, setTerm] = useState(filters.q);

  useEffect(() => {
    let done = false;
    fetchVehicles().then(() => !done && setLoading(false));
    return () => {
      done = true;
    };
  }, []);

  useEffect(() => setTerm(filters.q), [filters.q]);

  const patch = (p: Partial<Filters>) => {
    const next = { ...filters, ...p };
    setSp(writeParams(next, sort), { replace: true });
  };

  const results = useMemo(() => queryVehicles(VEHICLES, filters, sort), [filters, sort]);
  const count = activeFilterCount(filters);

  const activeChips = useMemo(() => {
    const chips: { label: string; clear: () => void }[] = [];
    if (filters.q) chips.push({ label: `“${filters.q}”`, clear: () => patch({ q: "" }) });
    filters.brands.forEach((b) => chips.push({ label: b, clear: () => patch({ brands: filters.brands.filter((x) => x !== b) }) }));
    filters.bodyTypes.forEach((b) => chips.push({ label: b, clear: () => patch({ bodyTypes: filters.bodyTypes.filter((x) => x !== b) }) }));
    filters.fuels.forEach((b) => chips.push({ label: b, clear: () => patch({ fuels: filters.fuels.filter((x) => x !== b) }) }));
    filters.transmissions.forEach((b) => chips.push({ label: b, clear: () => patch({ transmissions: filters.transmissions.filter((x) => x !== b) }) }));
    filters.priceBuckets.forEach((b) =>
      chips.push({ label: PRICE_BUCKETS[b]?.label ?? b, clear: () => patch({ priceBuckets: filters.priceBuckets.filter((x) => x !== b) }) })
    );
    if (filters.yearMin) chips.push({ label: `${filters.yearMin}+`, clear: () => patch({ yearMin: null }) });
    if (filters.mileageMax) chips.push({ label: `Under ${filters.mileageMax.toLocaleString()} km`, clear: () => patch({ mileageMax: null }) });
    if (filters.powerMin) chips.push({ label: `${filters.powerMin}+ hp`, clear: () => patch({ powerMin: null }) });
    return chips;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sort]);

  useSeo({
    title: `The Collection — ${VEHICLES.length} vehicles`,
    description:
      "Browse the AUREV collection: verified supercars, grand tourers, performance sedans and SUVs from the world's great marques.",
    path: "/collection",
  });

  return (
    <div className="mx-auto max-w-[1600px] container-px pb-24 pt-28 sm:pt-32">
      {/* head — a salesroom notice, not a poster */}
      <header className="grid gap-8 border-b border-line pb-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="eyebrow">Stock list — MMXXVI</p>
          <h1 className="mt-4 font-display text-[clamp(1.9rem,3.6vw,2.9rem)] font-black uppercase tracking-[-0.03em]">
            The Collection
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-ash">
            {VEHICLES.length} verified vehicles. Marque, body, output and price below — every
            setting persists in the address bar.
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <label className="sr-only" htmlFor="collection-q">
            Search the collection
          </label>
          <div className="flex w-full items-center gap-3 border-b border-line-strong bg-transparent py-2 transition-colors focus-within:border-crimson sm:w-72">
            <IconSearch size={14} className="shrink-0 text-dim" />
            <input
              id="collection-q"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && patch({ q: term })}
              placeholder="Brand, model…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-dim"
            />
            <button type="button" aria-label="Apply search" onClick={() => patch({ q: term })} className="shrink-0 font-mono text-[9px] uppercase tracking-[0.2em] text-dim transition-colors hover:text-mist">
              Go
            </button>
          </div>
          <label className="sr-only" htmlFor="collection-sort">
            Sort results
          </label>
          <select
            id="collection-sort"
            value={sort}
            onChange={(e) => setSp(writeParams(filters, e.target.value as SortKey), { replace: true })}
            className="field__input !w-48 !py-2.5 text-[12px]"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="mt-10 flex gap-14">
        {/* quiet sidebar */}
        <aside className="hidden w-60 shrink-0 lg:block" aria-label="Filters">
          <div className="sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto pb-6">
            <div className="flex items-baseline justify-between border-b border-line pb-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-mist">
                Filter {count > 0 && <span className="text-crimson-bright">· {count}</span>}
              </p>
              {count > 0 && (
                <button type="button" onClick={() => setSp({}, { replace: true })} className="font-mono text-[9px] uppercase tracking-[0.16em] text-dim transition-colors hover:text-crimson-bright">
                  Reset
                </button>
              )}
            </div>
            <FilterPanel filters={filters} patch={patch} />
          </div>
        </aside>

        {/* the cars */}
        <div className="min-w-0 flex-1">
          <p className="sr-only" role="status" aria-live="polite">
            {!loading && `${results.length} vehicles match your filters`}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 pb-6">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-dim">
              {loading ? (
                "Loading…"
              ) : (
                <>
                  <span className="text-mist">{String(results.length).padStart(2, "0")}</span> shown
                </>
              )}
            </p>
            <div className="flex items-center gap-3">
              <select
                value={sort}
                onChange={(e) => setSp(writeParams(filters, e.target.value as SortKey), { replace: true })}
                className="field__input !w-44 !py-2 text-[11px] md:hidden"
                aria-label="Sort results"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <button type="button" onClick={() => setDrawerOpen(true)} className="btn btn-ghost btn-sm lg:hidden">
                Filters{count > 0 ? ` · ${count}` : ""}
              </button>
            </div>
          </div>

          {activeChips.length > 0 && (
            <ul className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-2" aria-label="Active filters">
              {activeChips.map((chip, i) => (
                <li key={i}>
                  <button type="button" onClick={chip.clear} className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-mist transition-colors hover:text-crimson-bright" aria-label={`Remove filter ${chip.label}`}>
                    {chip.label}
                    <IconClose size={10} className="text-dim transition-colors group-hover:text-crimson" />
                  </button>
                </li>
              ))}
              <li>
                <button type="button" onClick={() => setSp({}, { replace: true })} className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim underline-offset-4 transition-colors hover:text-mist hover:underline">
                  Clear all
                </button>
              </li>
            </ul>
          )}

          {loading ? (
            <CarGridSkeleton count={6} />
          ) : results.length === 0 ? (
            <div className="max-w-lg py-16">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-crimson-bright">Nothing on the floor</p>
              <h2 className="mt-4 font-display text-2xl font-bold tracking-[-0.02em]">
                No vehicles match your search
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ash">
                The collection is deliberately small — loosen one or two criteria and something
                rare will very likely appear.
              </p>
              <button type="button" onClick={() => setSp({}, { replace: true })} className="btn btn-primary btn-sm mt-7">
                <span>Reset filters</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2">
              {results.map((v) => (
                <CarCard key={v.id} vehicle={v} onQuickView={setQuick} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* mobile drawer */}
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} labelledBy="filter-drawer-title">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <p id="filter-drawer-title" className="font-mono text-[11px] uppercase tracking-[0.24em] text-mist">
              Filter {count > 0 && <span className="text-crimson-bright">· {count}</span>}
            </p>
            <CloseButton onClick={() => setDrawerOpen(false)} />
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-5">
            <FilterPanel filters={filters} patch={patch} />
          </div>
          <div className="flex gap-3 border-t border-line p-4">
            <button type="button" onClick={() => setSp({}, { replace: true })} className="btn btn-ghost btn-sm flex-1">
              Reset
            </button>
            <button type="button" onClick={() => setDrawerOpen(false)} className="btn btn-primary btn-sm flex-1">
              <span>Show {results.length}</span>
            </button>
          </div>
        </div>
      </Drawer>

      <QuickView vehicle={quick} onClose={() => setQuick(null)} />
    </div>
  );
}
