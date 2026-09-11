import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Vehicle } from "../../data/types";
import { fetchFeatured } from "../../data/api";
import { formatHp, formatMileage, formatPrice } from "../../lib/format";
import CarCard from "../cars/CarCard";
import QuickView from "../cars/QuickView";
import { CarGridSkeleton } from "../ui/Skeleton";
import { Reveal } from "../../lib/motion";
import { IconArrowRight } from "../ui/icons";

/* ------------------------------------------------------------------ */
/*  Featured — one big photograph, a ledger of companions, a trio.      */
/*  No boxes, no badges, no per-card animation choreography.           */
/* ------------------------------------------------------------------ */

export default function FeaturedCollection() {
  const [vehicles, setVehicles] = useState<Vehicle[] | null>(null);
  const [quick, setQuick] = useState<Vehicle | null>(null);

  useEffect(() => {
    let done = false;
    fetchFeatured(6).then((v) => !done && setVehicles(v));
    return () => {
      done = true;
    };
  }, []);

  return (
    <section id="featured" className="mx-auto max-w-[1600px] container-px py-16 sm:py-28">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <Reveal>
          <p className="eyebrow">The collection</p>
          <h2 className="display-2 mt-4">
            Six of the thirteen <span className="serif-accent font-normal">currently on the floor.</span>
          </h2>
        </Reveal>
        <Reveal>
          <Link to="/collection" className="btn-line !text-[11px]">
            All vehicles <IconArrowRight size={14} className="btn-arrow" />
          </Link>
        </Reveal>
      </div>

      {!vehicles ? (
        <div className="mt-12">
          <CarGridSkeleton count={4} />
        </div>
      ) : (
        <>
          <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-14 lg:grid-cols-12">
            {/* lead photograph */}
            <Reveal className="lg:col-span-7">
              <LeadFeature v={vehicles[0]} />
            </Reveal>

            {/* ledger companions */}
            <div className="lg:col-span-5 lg:pt-2">
              <p className="label-mono border-b border-line pb-3">Also available — by arrangement</p>
              <ul className="divide-y divide-line">
                {vehicles.slice(1, 4).map((v) => (
                  <li key={v.id}>
                    <LedgerRow v={v} />
                  </li>
                ))}
              </ul>
              <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:gap-6">
                <CarCard vehicle={vehicles[4]} onQuickView={setQuick} />
                {vehicles[5] && <div className="hidden sm:block"><CarCard vehicle={vehicles[5]} onQuickView={setQuick} /></div>}
              </div>
            </div>
          </div>
        </>
      )}

      <QuickView vehicle={quick} onClose={() => setQuick(null)} />
    </section>
  );
}

function LeadFeature({ v }: { v: Vehicle }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <article className="car-feature min-h-[24rem] lg:min-h-[34rem]">
      <img
        src={v.images[0].src}
        alt={v.images[0].alt}
        onLoad={() => setLoaded(true)}
        loading="eager"
        decoding="async"
        className={`transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
      <div className="relative z-10 flex flex-col gap-2 p-6 sm:p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-mist/60">
          {v.brand} · {v.year}
          {v.badge ? ` · ${v.badge}` : ""}
        </p>
        <h3 className="font-display text-2xl font-bold tracking-[-0.02em] sm:text-4xl">
          {v.model} <span className="text-mist/70">{v.variant}</span>
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-x-8 gap-y-2 border-t border-mist/10 pt-4">
          <p className="text-lg font-bold tracking-[-0.02em]">{formatPrice(v.price)}</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-mist/60">
            {formatMileage(v.mileage)} · {formatHp(v.horsepower)} · {v.location}
          </p>
          <Link
            to={`/vehicle/${v.id}`}
            aria-label={`View ${v.brand} ${v.model}`}
            className="group ml-auto inline-flex items-center gap-2 border border-mist/25 px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-mist transition-colors duration-300 hover:border-crimson hover:bg-crimson"
          >
            Discover
            <IconArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

/* dense hairline row: the way inventory actually reads in a good salesroom */
function LedgerRow({ v }: { v: Vehicle }) {
  return (
    <Link to={`/vehicle/${v.id}`} className="group flex items-center gap-5 py-4">
      <img
        src={v.images[0].src}
        alt=""
        loading="lazy"
        className="h-14 w-24 shrink-0 object-cover"
      />
      <span className="min-w-0 flex-1">
        <span className="block font-mono text-[9px] uppercase tracking-[0.24em] text-dim transition-colors group-hover:text-ash">
          {v.brand} · {v.year}
        </span>
        <span className="mt-1 block truncate text-[15px] font-semibold tracking-[-0.01em] text-mist">
          {v.model}
        </span>
      </span>
      <span className="shrink-0 text-right">
        <span className="block text-sm font-bold text-mist">{formatPrice(v.price)}</span>
        <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[0.16em] text-dim">
          {formatMileage(v.mileage)}
        </span>
      </span>
      <IconArrowRight size={14} className="shrink-0 text-dim transition-all duration-300 group-hover:translate-x-1 group-hover:text-crimson" />
    </Link>
  );
}
