import { useEffect, useState } from "react";
import { ButtonLink } from "../ui/Button";
import { useParallax } from "../../lib/hooks";
import { VEHICLES } from "../../data/vehicles";

/* ------------------------------------------------------------------ */
/*  Hero — a campaign frame, nothing more. One slow parallax drift,     */
/*  a staged type entrance, hairline data. No glows.                    */
/* ------------------------------------------------------------------ */

export default function Hero() {
  const [loaded, setLoaded] = useState(false);
  const parallaxRef = useParallax(0.1);

  useEffect(() => {
    if (loaded) return;
    const img = new Image();
    img.src = "/images/hero-night.jpg?v=1";
    img.onload = () => setLoaded(true);
  }, [loaded]);

  return (
    <section aria-label="AUREV — engineered for the exceptional" className="noise relative min-h-[100svh] w-full overflow-hidden">
      {/* image */}
      <div
        ref={parallaxRef}
        aria-hidden="true"
        className="absolute inset-x-0 -top-[5%] bottom-[-8%] will-change-transform"
        style={{ transform: "translate3d(0, calc(var(--py, 0px) * -0.3), 0) scale(1.03)" }}
      >
        <img
          src="/images/hero-night.jpg?v=1"
          alt=""
          className={`size-full object-cover object-center transition-opacity duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          fetchPriority="high"
          decoding="async"
          onLoad={() => setLoaded(true)}
        />
      </div>

      {/* grading — legibility, not decoration */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.58)_0%,rgba(5,5,5,0.12)_38%,rgba(5,5,5,0.66)_78%,#050505_100%)]"
      />

      {/* side rail */}
      <p
        aria-hidden="true"
        className="vertical-rl absolute right-5 top-1/2 hidden -translate-y-1/2 font-mono text-[9.5px] uppercase tracking-[0.5em] text-mist/35 xl:block"
      >
        Maranello — Stuttgart — Goodwood
      </p>

      <div className="relative mx-auto flex min-h-[100svh] max-w-[1600px] flex-col justify-end container-px pb-10 pt-28 sm:pb-14">
        <div className="max-w-4xl">
          <p className="eyebrow hero-anim" style={{ ["--i" as string]: "0" }}>
            Global collection — MMXXVI
          </p>
          <h1
            className="mt-6 font-display text-[clamp(2.6rem,7.2vw,6.2rem)] font-black uppercase leading-[0.95] tracking-[-0.035em] text-mist hero-anim"
            style={{ ["--i" as string]: "1" }}
          >
            Engineered
            <br />
            for the <span className="serif-accent font-normal normal-case tracking-[0.01em]">exceptional.</span>
          </h1>
          <p
            className="mt-7 max-w-md text-[15px] leading-relaxed text-mist/70 hero-anim"
            style={{ ["--i" as string]: "2" }}
          >
            A curated collection of extraordinary automobiles for those who demand more — each
            one verified, each one delivered by hand.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4 hero-anim" style={{ ["--i" as string]: "3" }}>
            <ButtonLink to="/collection" variant="primary" arrow>
              Explore Collection
            </ButtonLink>
            <ButtonLink to="/sell" variant="ghost" arrow={false}>
              Sell Your Car
            </ButtonLink>
          </div>
        </div>

        {/* data strip */}
        <div className="mt-14 flex items-end justify-between border-t border-mist/10 pt-5 hero-anim" style={{ ["--i" as string]: "4" }}>
          <dl className="hidden gap-14 sm:flex" aria-label="Collection at a glance">
            {[
              [`${VEHICLES.length}`, "Vehicles in collection"],
              ["12", "Marques represented"],
              ["214", "Point inspection"],
            ].map(([n, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd>
                  <p className="font-display text-xl font-bold text-mist">{n}</p>
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-mist/45">
                    {label}
                  </p>
                </dd>
              </div>
            ))}
          </dl>

          <a
            href="#featured"
            className="group ml-auto flex items-center gap-3 font-mono text-[9.5px] uppercase tracking-[0.3em] text-mist/55 transition-colors hover:text-mist"
            aria-label="Scroll to featured collection"
          >
            Scroll
            <span aria-hidden="true" className="scroll-cue relative block h-10 w-px bg-mist/15">
              <span className="scroll-cue__dot absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-mist/70" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
