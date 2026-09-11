import { Link } from "react-router-dom";
import type { Vehicle } from "../../data/types";
import { Modal, CloseButton } from "../ui/Modal";
import { formatAccel, formatHp, formatMileage, formatPrice, formatSpeed } from "../../lib/format";
import { ButtonLink } from "../ui/Button";
import { FavoriteButton, CompareButton } from "./ActionButtons";
import { StatusMark } from "./CarCard";

/* ------------------------------------------------------------------ */
/*  Quick view — the card, enlarged. Same typographic language,        */
/*  no chrome.                                                          */
/* ------------------------------------------------------------------ */

export default function QuickView({ vehicle, onClose }: { vehicle: Vehicle | null; onClose: () => void }) {
  return (
    <Modal open={!!vehicle} onClose={onClose} labelledBy="qv-title">
      {vehicle && (
        <div className="w-[min(92vw,56rem)]">
          <div className="relative aspect-[16/8.2] overflow-hidden">
            <img src={vehicle.images[0].src} alt={vehicle.images[0].alt} className="size-full object-cover" />
            <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0d0d0d] to-transparent" />
            <div className="absolute left-4 top-4">
              <span className="bg-void/80 px-2.5 py-1.5">
                <StatusMark status={vehicle.status} className="!text-mist/80" />
              </span>
            </div>
            <div className="absolute right-3 top-3">
              <CloseButton onClick={onClose} />
            </div>
          </div>

          <div className="grid gap-8 p-6 sm:grid-cols-[1.35fr_1fr] sm:p-8">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-dim">
                {vehicle.brand} · {vehicle.year}
                {vehicle.badge ? ` · ${vehicle.badge}` : ""}
              </p>
              <h2 id="qv-title" className="mt-2 font-display text-2xl font-bold tracking-[-0.02em]">
                {vehicle.model} <span className="text-mist/60">{vehicle.variant}</span>
              </h2>
              <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-ash">{vehicle.description}</p>
              <div className="mt-6 flex flex-wrap items-center gap-5">
                <ButtonLink to={`/vehicle/${vehicle.id}`} variant="primary" size="sm" arrow>
                  Full details
                </ButtonLink>
                <FavoriteButton id={vehicle.id} />
                <CompareButton id={vehicle.id} />
              </div>
            </div>

            <dl className="border-line sm:border-l sm:pl-8">
              {[
                ["Price", formatPrice(vehicle.price)],
                ["Mileage", formatMileage(vehicle.mileage)],
                ["Power", formatHp(vehicle.horsepower)],
                ["0–100 km/h", formatAccel(vehicle.acceleration)],
                ["Top speed", formatSpeed(vehicle.topSpeed)],
                ["Engine", vehicle.engine],
              ].map(([k, val]) => (
                <div key={k} className="spec-row">
                  <dt>{k}</dt>
                  <dd className="max-w-[12rem] text-[13px]">{val}</dd>
                </div>
              ))}
              <Link to="/concierge" state={{ vehicle: vehicle.id, kind: "inquiry" }} onClick={onClose} className="btn-line mt-4 !text-[10px]">
                Ask about this car
              </Link>
            </dl>
          </div>
        </div>
      )}
    </Modal>
  );
}
