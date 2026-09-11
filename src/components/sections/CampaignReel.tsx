import { useEffect, useRef, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { VEHICLES } from "../../data/vehicles";
import { formatPrice, formatHp, formatTorque, formatAccel } from "../../lib/format";

/* ------------------------------------------------------------------ */
/*  The Reel — three pinned, scroll-driven stages that follow the hero.*/
/*  One rAF driver writes a single --p per stage; every transform,     */
/*  mask and fade is pure CSS custom-property math. No libraries.      */
/*  Reduced motion / no-JS: base CSS renders each stage fully open.    */
/* ------------------------------------------------------------------ */

const gt3 = VEHICLES.find((v) => v.id === "porsche-911-gt3-992") ?? VEHICLES[0];
const gt3Name = `${gt3.model}${gt3.variant ? ` ${gt3.variant}` : ""}`;

/** word-level reveal, ~42ms stagger — only lifts when the driver arms it */
function Words({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={`reel__words ${className}`}>
      {text.split(" ").map((w, i) => (
        <span key={`${w}-${i}`} className="w" style={{ "--i": i } as CSSProperties}>
          <i>{w}</i>
        </span>
      ))}
    </span>
  );
}

export default function CampaignReel() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const rootEl = root.current;
    if (!rootEl) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const stages = Array.from(rootEl.querySelectorAll<HTMLElement>("[data-reel-stage]"));
    const rows = Array.from(rootEl.querySelectorAll<HTMLElement>("[data-reel-row]"));
    const finalStage = stages[stages.length - 1] ?? null;
    let raf = 0;

    const measure = () => {
      raf = 0;
      const vh = window.innerHeight || 1;
      let p3 = 1;
      for (const el of stages) {
        const r = el.getBoundingClientRect();
        const span = Math.max(1, r.height - vh);
        const p = Math.min(1, Math.max(0, -r.top / span));
        el.style.setProperty("--p", p.toFixed(4));
        if (el === finalStage) p3 = p;
      }
      // discrete color states only — opacity/tick are continuous CSS math
      for (const row of rows) {
        const t = Number(row.dataset.reelRow) || 0;
        row.classList.toggle("is-lit", p3 >= t);
        row.classList.toggle("is-active", p3 >= t && p3 < t + 0.155);
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };

    measure();
    rootEl.classList.add("reel-on");
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // one discrete flip — enough to light the stage-three headline once
    let io: IntersectionObserver | null = null;
    const words = rootEl.querySelector<HTMLElement>(".reel__words");
    if (words && "IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries)
            if (e.isIntersecting) {
              words.classList.add("is-lit");
              io?.disconnect();
            }
        },
        { threshold: 0.35 }
      );
      io.observe(words);
    } else {
      words?.classList.add("is-lit");
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
      io?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const specs: ReadonlyArray<{ k: string; v: string; t: number }> = [
    { k: "Power", v: formatHp(gt3.horsepower), t: 0.14 },
    { k: "Torque", v: formatTorque(gt3.torque), t: 0.34 },
    { k: "0–100 km/h", v: formatAccel(gt3.acceleration), t: 0.54 },
    { k: "Top speed", v: `${gt3.topSpeed} km/h`, t: 0.74 },
  ];

  return (
    <section ref={root} className="reel" aria-label="AUREV — the collection, in three frames">
      {/* ================= STAGE 01 — THE POSTER ================= */}
      <div className="reel__stage reel__stage--1" data-reel-stage="1">
        <div className="reel__pin noise">
          <div className="reel__img" aria-hidden="true">
            <img
              src="/images/v-huracan.jpg"
              alt=""
              fetchPriority="high"
              decoding="async"
              className="size-full object-cover"
            />
          </div>
          <div className="reel__grade" aria-hidden="true" />
          <div className="reel__dip" aria-hidden="true" />

          {/* furniture — four quiet corners */}
          <p className="reel__corner absolute left-5 top-6 sm:left-8 sm:top-8">
            AUREV / Automotive
          </p>
          <p className="reel__corner absolute right-5 top-6 hidden sm:block sm:right-8 sm:top-8">
            Curated performance
          </p>
          <p className="reel__corner absolute bottom-6 left-5 sm:left-8">
            <span className="mr-3 inline-block bg-crimson px-1.5 py-0.5 text-white">01</span>
            Signature collection
          </p>
          <p className="reel__corner absolute bottom-6 right-5 hidden text-right lg:right-8 md:block">
            Frame 01 — Lamborghini Huracán EVO
            <br />
            AUREV studio, Modena
          </p>

          {/* poster type, cut into the photograph */}
          <div className="reel__type pointer-events-none absolute inset-x-5 bottom-[16svh] sm:inset-x-8">
            <p
              aria-hidden="true"
              className="reel__wordmark select-none"
              style={{ textShadow: "none" }}
            >
              AUREV
            </p>
            <p className="mt-3 max-w-sm font-display text-[15px] font-medium leading-snug tracking-[-0.01em] text-mist/75 sm:text-[17px]">
              The collection, read as a campaign — three frames, no noise, the cars first.
            </p>
          </div>

          {/* the next plate, rising from the bottom of this one */}
          <div className="reel__teaser absolute inset-x-0 bottom-0 h-[30svh] border-t border-mist/15 bg-void" aria-hidden="true">
            <img
              src="/images/v-gt3.jpg"
              alt=""
              loading="lazy"
              decoding="async"
              className="size-full object-cover object-center opacity-70"
            />
          </div>
        </div>
      </div>

      {/* ================= STAGE 02 — THE REVEAL ================= */}
      <div className="reel__stage reel__stage--2" data-reel-stage="2">
        <div className="reel__pin">
          <div className="reel__img inset-0" aria-hidden="true">
            <img
              src="/images/v-gt3.jpg"
              alt="Porsche 911 GT3 in GT Silver, front three-quarter view in a dark studio"
              loading="lazy"
              decoding="async"
              className="size-full object-cover"
            />
          </div>
          <div className="reel__dip" aria-hidden="true" />

          <div className="relative z-[1] mx-auto flex h-full w-full max-w-[1600px] flex-col justify-between container-px py-[10svh]">
            <header className="reel__fade">
              <p className="reel__corner">02 / Reveal — Stuttgart</p>
              <h2 className="mt-5 max-w-4xl font-display font-black uppercase leading-[0.92] tracking-[-0.04em] text-mist text-[clamp(2.6rem,9.5vw,8.4rem)]">
                The art of
                <br />
                performance
              </h2>
            </header>

            <aside className="reel__cap max-w-md">
              <span aria-hidden="true" className="mb-4 block h-px w-10 bg-crimson" />
              <p className="reel__corner !text-mist/80">02 / AUREV Collection</p>
              <p className="mt-3 font-display text-xl font-bold tracking-[-0.015em] text-mist sm:text-2xl">
                Porsche 911 — GT Performance
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-ash">
                {gt3.year} GT3 · {gt3.horsepower} hp of naturally aspirated argument ·
                presented from the rear axle forward.
              </p>
            </aside>
          </div>
        </div>
      </div>

      {/* ================= STAGE 03 — THE TECHNICAL SHEET ================= */}
      <div className="reel__stage reel__stage--3" data-reel-stage="3">
        <div className="reel__pin">
          <p className="reel__hint reel__corner absolute bottom-6 left-1/2 -translate-x-1/2">
            ↓
          </p>

          <div className="relative z-[1] mx-auto grid h-full w-full max-w-[1600px] grid-cols-1 items-center gap-x-16 gap-y-8 container-px py-[8svh] lg:grid-cols-[1.08fr_0.92fr]">
            {/* left — the sheet */}
            <div className="min-w-0">
              <p className="reel__corner">03 / Specification — honest numbers</p>
              <h2 className="mt-5 font-display text-[clamp(1.8rem,4.6vw,3.6rem)] font-bold leading-[1.04] tracking-[-0.03em] text-mist">
                <Words text="The measure of the machine." />
              </h2>

              <ul className="mt-8 sm:mt-10">
                {specs.map(({ k, v, t }, i) => (
                  <li
                    key={k}
                    data-reel-row={t}
                    className="reel__row grid grid-cols-[2.4rem_1fr_auto] items-baseline gap-x-5 border-t border-line py-4 sm:gap-x-8 sm:py-5"
                    style={{ "--t": t } as CSSProperties}
                  >
                    <span className="n font-mono text-[10px] tracking-[0.22em]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-ash sm:text-[15px]">
                      {k}
                    </span>
                    <span className="v font-display text-lg font-black tracking-[-0.01em] tabular-nums sm:text-2xl">
                      {v}
                    </span>
                  </li>
                ))}
                <li aria-hidden="true" className="h-px w-full bg-line" />
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-4">
                <Link to={`/vehicle/${gt3.id}`} className="btn-line !text-[10.5px]">
                  Open the {gt3.brand} {gt3Name} dossier
                </Link>
                <p className="font-mono text-[9.5px] uppercase tracking-[0.24em] text-dim">
                  {formatPrice(gt3.price)} · {gt3.location}
                </p>
              </div>
            </div>

            {/* right — the plate, settling */}
            <figure className="reel__figure">
              <div className="mb-4 flex items-end justify-between gap-6">
                <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-crimson-bright">
                  AUREV / Performance
                </span>
                <span className="h-px flex-1 bg-line" aria-hidden="true" />
                <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-dim">
                  Plate 03
                </span>
              </div>
              <div className="reel__frame relative overflow-clip bg-[#0b0b0b]">
                <div className="reel__img inset-0" aria-hidden="true">
                  <img
                    src="/images/v-gt3-rear.jpg"
                    alt={`${gt3.brand} ${gt3.model} rear three-quarter with fixed wing, GT Silver`}
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover"
                  />
                </div>
              </div>
              <figcaption className="mt-3 font-mono text-[9px] uppercase leading-relaxed tracking-[0.22em] text-dim">
                {gt3.brand} {gt3Name} — rear / wing · {gt3.exteriorColor} · {gt3.year}
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
