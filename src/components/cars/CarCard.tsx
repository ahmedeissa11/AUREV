import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import type { Vehicle } from "../../data/types";
import { formatHp, formatMileage, formatPrice } from "../../lib/format";
import { FavoriteButton, CompareButton } from "./ActionButtons";

/* ------------------------------------------------------------------ */
/*  CarCard — image, name, data, price. That is the whole object.      */
/*  The only "UI" is a crimson hairline drawn under the photograph     */
/*  on hover and two flat type-actions in the ledger row.              */
/* ------------------------------------------------------------------ */

export function StatusMark({ status, className = "" }: { status: Vehicle["status"]; className?: string }) {
  return (
    <span className={`status-mark ${status === "reserved" ? "status-mark--reserved" : ""} ${className}`}>
      <span className="tick" aria-hidden="true" />
      {status === "available" ? "Available" : "Reserved"}
    </span>
  );
}

interface CarCardProps {
  vehicle: Vehicle;
  layout?: "default" | "row";
  onQuickView?: (v: Vehicle) => void;
  hideActions?: boolean;
}

export default function CarCard({
  vehicle: v,
  layout = "default",
  onQuickView,
  hideActions,
}: CarCardProps) {
  const [loaded, setLoaded] = useState(false);
  const modelLine = `${v.model}${v.variant ? ` ${v.variant}` : ""}`;
  const title = `${v.year} ${v.brand} ${modelLine}`;

  const media = (
    <div className={`car-card__media ${layout === "row" ? "lg:aspect-auto" : ""}`}>
      <img
        src={v.images[0].src}
        alt={v.images[0].alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"} ${
          v.status === "reserved" ? "grayscale-[0.4] saturate-[0.75]" : ""
        }`}
      />
      <span className="car-card__frame" aria-hidden="true" />
      {v.status === "reserved" && (
        <span className="absolute bottom-0 left-0 bg-void/85 px-2.5 py-1 font-mono text-[8.5px] font-bold uppercase tracking-[0.22em] text-[#d99aa4]">
          Reserved
        </span>
      )}
    </div>
  );

  const body: ReactNode = (
    <div className="flex flex-1 flex-col gap-4 pt-4">
      <div>
        <p className="font-mono text-[9.5px] uppercase tracking-[0.26em] text-dim">
          <span className="text-ash">{v.brand}</span>
          <span className="mx-2 text-[#333]">/</span>
          {v.year}
          {v.badge ? (
            <>
              <span className="mx-2 text-[#333]">/</span>
              <span className="text-ash">{v.badge}</span>
            </>
          ) : null}
        </p>
        <h3 className="mt-2 font-display text-lg font-bold leading-snug tracking-[-0.015em] text-mist transition-colors duration-300 group-hover/card:text-[#d8d4ca] sm:text-xl">
          <Link
            to={`/vehicle/${v.id}`}
            className="after:absolute after:inset-0 after:z-10 after:content-['']"
            aria-label={`View ${title}`}
          >
            {modelLine}
          </Link>
        </h3>
      </div>

      <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-dim">
        {formatMileage(v.mileage)}
        <span className="mx-2 text-[#333]">·</span>
        {formatHp(v.horsepower)}
        <span className="mx-2 text-[#333]">·</span>
        {v.engine.replace(/ Twin-Turbo| Naturally Aspirated| Electric| \(.*\)/i, "")}
      </p>

      <div className="mt-auto flex items-end justify-between border-t border-line pt-3">
        <div className="flex items-baseline gap-4">
          <p className="font-display text-lg font-bold tracking-[-0.02em] text-mist">{formatPrice(v.price)}</p>
          <StatusMark status={v.status} className="hidden md:inline-flex" />
        </div>
        {!hideActions && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {onQuickView && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onQuickView(v);
                }}
                className="hidden font-mono text-[9.5px] font-bold uppercase tracking-[0.18em] text-dim transition-colors hover:text-mist md:inline-flex"
              >
                Quick&nbsp;view
              </button>
            )}
            <FavoriteButton id={v.id} />
            <CompareButton id={v.id} />
          </div>
        )}
      </div>
    </div>
  );

  if (layout === "row") {
    return (
      <article className="car-card group/card grid grid-cols-1 gap-0 md:grid-cols-[minmax(0,1fr)_20rem] md:gap-8">
        {media}
        <div className="flex flex-col justify-center py-4 md:py-8">{body}</div>
      </article>
    );
  }

  return (
    <article className="car-card group/card flex flex-col">
      {media}
      {body}
    </article>
  );
}
