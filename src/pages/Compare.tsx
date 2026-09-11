import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { Vehicle } from "../data/types";
import { VEHICLES } from "../data/vehicles";
import { MAX_COMPARE, useLibrary } from "../state/LibraryContext";
import { formatHp, formatMileage, formatPrice, formatTorque, formatAccel, formatSpeed } from "../lib/format";
import { useSeo } from "../lib/seo";
import { Reveal } from "../lib/motion";
import { ButtonLink } from "../components/ui/Button";
import { IconClose } from "../components/ui/icons";

/* ------------------------------------------------------------------ */
/*  Compare — up to three vehicles, attribute by attribute.            */
/*  Winner cells marked in crimson. Horizontal scroll on mobile with    */
/*  the attribute column held.                                          */
/* ------------------------------------------------------------------ */

interface Row {
  label: string;
  value: (v: Vehicle) => string;
  best?: "max" | "min";
  raw?: (v: Vehicle) => number;
}

const ROWS: Row[] = [
  { label: "Price", value: (v) => formatPrice(v.price), best: "min", raw: (v) => v.price },
  { label: "Year", value: (v) => String(v.year), best: "max", raw: (v) => v.year },
  { label: "Mileage", value: (v) => formatMileage(v.mileage), best: "min", raw: (v) => v.mileage },
  { label: "Engine", value: (v) => v.engine },
  { label: "Power", value: (v) => formatHp(v.horsepower), best: "max", raw: (v) => v.horsepower },
  { label: "Torque", value: (v) => formatTorque(v.torque), best: "max", raw: (v) => v.torque },
  { label: "0–100 km/h", value: (v) => formatAccel(v.acceleration), best: "min", raw: (v) => v.acceleration },
  { label: "Top speed", value: (v) => formatSpeed(v.topSpeed), best: "max", raw: (v) => v.topSpeed },
  { label: "Transmission", value: (v) => v.transmission },
  { label: "Drivetrain", value: (v) => v.drivetrain },
  { label: "Fuel", value: (v) => v.fuel },
  { label: "Body", value: (v) => v.bodyType },
  { label: "Exterior", value: (v) => v.exteriorColor },
  { label: "Interior", value: (v) => v.interiorColor },
  { label: "Location", value: (v) => v.location },
];

export default function Compare() {
  const { compare, removeCompare, toggleCompare, clearCompare } = useLibrary();
  const [pickOpen, setPickOpen] = useState(false);
  const [pick, setPick] = useState("");

  const vehicles = useMemo(
    () => compare.map((id) => VEHICLES.find((v) => v.id === id)).filter(Boolean) as Vehicle[],
    [compare]
  );

  useSeo({
    title: `Compare${vehicles.length ? ` — ${vehicles.length} vehicles` : ""}`,
    description: "Compare AUREV vehicles side by side — power, pace, price and provenance.",
    path: "/compare",
  });

  const bestFor = (row: Row): string | null => {
    if (!row.best || !row.raw || vehicles.length < 2) return null;
    const vals = vehicles.map((v) => ({ id: v.id, x: row.raw!(v) }));
    const target = row.best === "max" ? Math.max(...vals.map((o) => o.x)) : Math.min(...vals.map((o) => o.x));
    const winners = vals.filter((o) => o.x === target);
    return winners.length === 1 ? winners[0].id : null;
  };

  return (
    <div className="mx-auto max-w-[1600px] container-px pb-28 pt-28 sm:pt-36">
      <header className="border-b border-line pb-10">
        <p className="eyebrow">Side by side</p>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
          <h1 className="mt-4 font-display text-[clamp(1.9rem,3.6vw,2.9rem)] font-black uppercase tracking-[-0.03em]">
            Side by Side
          </h1>
          {vehicles.length > 0 && (
            <div className="flex items-center gap-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-dim">
                {vehicles.length} / {MAX_COMPARE} slots
              </p>
              <button
                type="button"
                onClick={clearCompare}
                className="btn-line !text-[10px]"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </header>

      {vehicles.length === 0 ? (
        <Reveal className="mt-10">
          <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-20 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-crimson-bright">
              No slots filled
            </p>
            <h2 className="mt-4 font-display text-[clamp(1.5rem,2.6vw,2.1rem)] font-bold tracking-[-0.02em]">
              An empty table is an honest table
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ash">
              Add up to three vehicles from any card's compare toggle — or pick one below and
              start the argument with numbers.
            </p>
            <div className="mt-8">
              <ButtonLink to="/collection" variant="primary" arrow>
                Choose from the collection
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      ) : (
        <div className="mt-10">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse text-sm">
              <thead>
                <tr>
                  <th scope="col" className="sticky left-0 z-10 w-44 bg-void p-0 text-left align-bottom">
                    <span className="label-mono block pb-5">Attribute</span>
                  </th>
                  {vehicles.map((v) => (
                    <th key={v.id} scope="col" className="min-w-[16rem] border-l border-line p-4 pb-5 align-bottom text-left font-normal">
                      <div className="relative mb-4 aspect-[16/10] overflow-hidden bg-[#0b0b0b]">
                        <img src={v.images[0].src} alt="" className="absolute inset-0 size-full object-cover" loading="lazy" />
                        <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 to-transparent" />
                        <button
                          type="button"
                          onClick={() => removeCompare(v.id)}
                          aria-label={`Remove ${v.brand} ${v.model} from comparison`}
                          className="absolute right-2 top-2 z-10 grid size-7 place-items-center bg-void/75 text-mist/80 transition-colors hover:bg-crimson hover:text-white"
                        >
                          <IconClose size={12} />
                        </button>
                        <div className="absolute inset-x-3 bottom-2.5">
                          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-crimson-bright">{v.brand}</p>
                          <Link
                            to={`/vehicle/${v.id}`}
                            className="block truncate font-display text-base font-extrabold uppercase text-mist hover:text-crimson-bright"
                          >
                            {v.model}
                          </Link>
                        </div>
                      </div>
                      <p className="font-display text-lg font-black tracking-tight">{formatPrice(v.price)}</p>
                    </th>
                  ))}
                  {vehicles.length < MAX_COMPARE && (
                    <th className="w-40 border-l border-line p-4 align-bottom text-left">
                      <button
                        type="button"
                        onClick={() => setPickOpen((o) => !o)}
                        aria-expanded={pickOpen}
                        className="btn btn-ghost btn-sm w-full"
                      >
                        <span>Add vehicle</span>
                      </button>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => {
                  const best = bestFor(row);
                  return (
                    <tr key={row.label} className="group">
                      <th
                        scope="row"
                        className="sticky left-0 z-10 bg-void py-4 pr-4 text-left font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-dim"
                      >
                        {row.label}
                      </th>
                      {vehicles.map((v) => (
                        <td
                          key={v.id}
                          className={`border-l border-line px-4 py-4 align-top ${
                            best === v.id ? "bg-[rgba(176,30,46,0.08)]" : ""
                          }`}
                        >
                          <span className={`font-semibold ${best === v.id ? "text-crimson-bright" : "text-mist"}`}>
                            {row.value(v)}
                          </span>
                          {best === v.id && (
                            <span className="ml-2 align-middle font-mono text-[8px] uppercase tracking-[0.18em] text-dim">
                              best
                            </span>
                          )}
                        </td>
                      ))}
                      {vehicles.length < MAX_COMPARE && (
                        <td className="border-l border-line px-4 py-4">
                          {pickOpen ? (
                            <select
                              autoFocus
                              value={pick}
                              onChange={(e) => {
                                const v = VEHICLES.find((x) => x.id === e.target.value);
                                if (v) {
                                  toggleCompare(v.id);
                                  setPick("");
                                  setPickOpen(false);
                                }
                              }}
                              onBlur={() => setPickOpen(false)}
                              className="field__input !py-2 text-xs"
                              aria-label="Pick a vehicle to compare"
                            >
                              <option value="">Pick from list…</option>
                              {VEHICLES.filter((x) => !compare.includes(x.id)).map((x) => (
                                <option key={x.id} value={x.id}>
                                  {x.brand} {x.model} · {x.year}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-dim">
                              empty slot
                            </span>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-6 font-mono text-[9.5px] uppercase tracking-[0.2em] text-dim">
            Swipe / scroll horizontally for all columns · best value per row marked in crimson
          </p>
        </div>
      )}
    </div>
  );
}
