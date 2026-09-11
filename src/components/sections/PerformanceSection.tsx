import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { findVehicle } from "../../data/vehicles";
import { formatNumber } from "../../lib/format";
import { useCountUp } from "../../lib/hooks";
import { Reveal } from "../../lib/motion";
import { IconArrowRight } from "../ui/icons";
import { asset } from "../../lib/asset";

/* ------------------------------------------------------------------ */
/*  Performance — a full-bleed frame with four figures laid over it.    */
/*  Static image (the motion lives in the numbers, not the scroll).     */
/* ------------------------------------------------------------------ */

function Stat({
  label,
  value,
  suffix = "",
  decimalDivisor,
  active,
}: {
  label: string;
  value: number;
  suffix?: string;
  decimalDivisor?: number;
  active: boolean;
}) {
  const n = useCountUp(value, active);
  const shown = decimalDivisor ? (n / decimalDivisor).toFixed(1) : formatNumber(n);
  return (
    <div className="border-t border-mist/15 pt-5">
      <p className="font-mono text-[9.5px] uppercase tracking-[0.3em] text-mist/50">{label}</p>
      <p className="mt-2.5 font-display text-[1.85rem] font-extrabold leading-none tracking-[-0.035em] text-mist sm:text-[2.45rem]">
        {shown}
        <span className="text-[0.62em] font-semibold text-mist/55">{suffix}</span>
      </p>
    </div>
  );
}

export default function PerformanceSection() {
  const car = findVehicle("ferrari-sf90-stradale-assetto-fiorano")!;
  const stripRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setActive(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section aria-label="Performance" className="noise relative overflow-hidden bg-void">
      <div aria-hidden="true" className="absolute inset-0">
        <img
          src={asset("/images/perf-tunnel.jpg")}
          alt=""
          loading="lazy"
          className="size-full object-cover object-center opacity-[0.62] saturate-[0.68]"
        />
        <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.62)_0%,rgba(5,5,5,0.3)_34%,rgba(5,5,5,0.55)_68%,#050505_100%)]" />
      </div>

      <div className="relative mx-auto flex min-h-[92svh] max-w-[1600px] flex-col justify-between gap-14 container-px pt-20 pb-14 sm:pt-24 sm:pb-16">
          <Reveal className="lg:max-w-[46%]">
            <p className="eyebrow">Reference vehicle — {car.brand} {car.model}</p>
            <h2 className="display-2 mt-5">
              Numbers only move you <span className="serif-accent font-normal">once.</span>
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-mist/70">
              A hybrid V8 that treats 0–100 like a formality, and a Fiorano-bred chassis that
              makes the figures irrelevant within a corner.
            </p>
            <Link to={`/vehicle/${car.id}`} className="btn-line mt-7 !text-[11px]">
              Discover this vehicle <IconArrowRight size={14} className="btn-arrow" />
            </Link>
          </Reveal>

        <div ref={stripRef} className="grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-4 lg:grid-cols-4 lg:w-[64%] lg:ms-auto" aria-label={`${car.brand} ${car.model} — key figures`}>
            <Reveal variant="fade">
              <Stat label="Horsepower" value={car.horsepower} suffix=" hp" active={active} />
            </Reveal>
            <Reveal variant="fade">
              <Stat label="0–100 km/h" value={Math.round(car.acceleration * 10)} decimalDivisor={10} suffix="s" active={active} />
            </Reveal>
            <Reveal variant="fade">
              <Stat label="Top speed" value={car.topSpeed} suffix=" km/h" active={active} />
            </Reveal>
            <Reveal variant="fade">
              <Stat label="Torque" value={car.torque} suffix=" Nm" active={active} />
            </Reveal>
        </div>
      </div>
    </section>
  );
}
