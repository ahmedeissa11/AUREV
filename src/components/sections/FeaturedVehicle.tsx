import { Link } from "react-router-dom";
import { findVehicle } from "../../data/vehicles";
import { formatAccel, formatHp, formatMileage, formatPrice, formatSpeed, formatTorque } from "../../lib/format";
import { Reveal } from "../../lib/motion";
import { IconArrowRight } from "../ui/icons";
import { asset } from "../../lib/asset";

/* ------------------------------------------------------------------ */
/*  Featured vehicle — a magazine cover in HTML: bleed image left,      */
/*  column of type right, four bars of data. One reveal for the text.    */
/* ------------------------------------------------------------------ */

export default function FeaturedVehicle() {
  const car = findVehicle("ferrari-sf90-stradale-assetto-fiorano")!;

  const bars = [
    { label: "Power", value: car.horsepower, max: 1100, display: formatHp(car.horsepower) },
    { label: "Torque", value: car.torque, max: 1100, display: formatTorque(car.torque) },
    { label: "Top speed", value: car.topSpeed, max: 400, display: formatSpeed(car.topSpeed) },
    { label: "0–100", value: Math.round((12 - car.acceleration) * 100), max: 1000, display: formatAccel(car.acceleration) },
  ];

  return (
    <section aria-label="Featured vehicle" className="relative bg-void">
      <div className="grid grid-cols-1 lg:min-h-[80vh] lg:grid-cols-[1.2fr_1fr]">
        {/* photograph — full-bleed, captioned like a plate */}
        <figure className="relative order-1 overflow-hidden lg:order-2">
          <img
            src={asset("/images/v-sf90-rear.jpg")}
            alt={car.images[1]?.alt ?? `${car.brand} ${car.model}`}
            loading="lazy"
            className="absolute inset-0 size-full object-cover"
          />
          <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(270deg,rgba(5,5,5,0.85)_0%,rgba(5,5,5,0.1)_42%,transparent_75%)]" />
          <figcaption className="absolute bottom-5 right-5 hidden font-mono text-[9px] uppercase tracking-[0.26em] text-mist/45 lg:block">
            Plate 01 — Assetto Fiorano, rear three-quarter, Monaco atelier
          </figcaption>
        </figure>

        {/* editorial column */}
        <div className="relative order-2 flex flex-col justify-center px-6 py-16 sm:px-10 lg:order-1 lg:py-24 xl:px-16">
          <Reveal className="max-w-lg">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-crimson-bright">
              Feature — {car.badge}
            </p>
            <h2 className="mt-6 font-display text-[clamp(2rem,4.6vw,3.6rem)] font-black uppercase leading-[0.98] tracking-[-0.03em]">
              SF90 Stradale
            </h2>
            <p className="mt-2 font-display text-lg font-bold uppercase tracking-[0.02em] text-mist/55">
              Assetto Fiorano — one of forty
            </p>
            <p className="mt-7 text-[15px] leading-relaxed text-ash">
              {car.description}
            </p>
          </Reveal>

          <Reveal delay={80} className="mt-9 max-w-lg">
            <dl className="space-y-4">
              {bars.map((b) => (
                <div key={b.label} className="perf-bar flex items-center gap-5">
                  <dt className="w-20 shrink-0 font-mono text-[9.5px] uppercase tracking-[0.2em] text-dim">{b.label}</dt>
                  <div className="h-px flex-1 bg-line">
                    <div className="perf-bar__fill" style={{ ["--w" as string]: `${Math.min(100, (b.value / b.max) * 100)}%` }} />
                  </div>
                  <dd className="w-24 shrink-0 text-right font-mono text-[10.5px] tracking-[0.04em] text-mist">{b.display}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={140} className="mt-10 flex max-w-lg flex-wrap items-center gap-x-8 gap-y-5">
            <p className="font-display text-3xl font-black tracking-[-0.03em]">{formatPrice(car.price)}</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-dim">
              {formatMileage(car.mileage)} · {car.location}
            </p>
            <Link
              to={`/vehicle/${car.id}`}
              className="group ml-auto inline-flex items-center gap-3 border border-mist/25 px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-mist transition-colors duration-300 hover:border-crimson hover:bg-crimson"
            >
              Discover this vehicle
              <IconArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
