import { useEffect, useRef, useState } from "react";
import { useSeo } from "../lib/seo";
import { Reveal, stagger } from "../lib/motion";
import { useParallax } from "../lib/hooks";
import { ButtonLink } from "../components/ui/Button";
import { SectionHeading } from "../components/ui/SectionHeading";
import { asset } from "../lib/asset";

/* ------------------------------------------------------------------ */
/*  About — cinematic house story: type, photography, counts.          */
/* ------------------------------------------------------------------ */

const STATS = [
  { value: 640, suffix: "+", label: "Vehicles represented" },
  { value: 214, suffix: "", label: "Point inspection" },
  { value: 26, suffix: "", label: "Countries delivered to" },
  { value: 98, suffix: "%", label: "Sold within 45 days" },
];

const TIMELINE = [
  { year: "2016", title: "A garage in Fontvieille", copy: "Two engineers and one lift. The first consignment — a 997 GT3 — sold in nine days." },
  { year: "2019", title: "The atelier moves", copy: "A converted cargo terminal in Monaco becomes the studio, vault and workshop. The 214-point standard is written." },
  { year: "2022", title: "Cross-border delivery", copy: "Dedicated transport and import desk. AUREV cars now land in 26 countries, door to door, with the same paperwork standard." },
  { year: "2026", title: "The collection, online", copy: "The same curation, built for the screen — every listing shot, verified and narrated like the cover story it is." },
];

const VALUES = [
  { title: "Provenance over profit", copy: "A car we cannot fully document is a car we do not sell. That decision has cost us money and bought us everything else." },
  { title: "Restraint is a feature", copy: "Fewer cars, better specified. The list is short because the standard is high." },
  { title: "The last 10%", copy: "Delivery, service introductions, documentation — what other marketplaces abandon is where our work begins." },
];

function StatNum({ value, suffix, label }: (typeof STATS)[number]) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [n, setN] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setActive(true);
          io.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(value);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 1600);
      setN(Math.round(value * (1 - Math.pow(1 - p, 4))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, value]);

  return (
    <div ref={ref} className="border-b border-line py-8 pr-6 sm:border-b-0 sm:py-10">
      <p className="font-display text-[2.6rem] font-black tracking-[-0.04em] text-mist sm:text-5xl">
        {n}
        <span className="text-[1.6rem] font-bold text-mist/50">{suffix}</span>
      </p>
      <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.24em] text-dim">{label}</p>
    </div>
  );
}

export default function About() {
  const parallaxRef = useParallax(0.14);

  useSeo({
    title: "About — the house of AUREV",
    description:
      "Since 2016 in Fontvieille, then Monaco: AUREV is a curated luxury automotive marketplace built on verification, restraint and concierge service.",
    path: "/about",
  });

  return (
    <div>
      {/* statement hero */}
      <section className="relative mx-auto max-w-[1600px] container-px overflow-hidden pb-16 pt-36 sm:pt-48">
        <Reveal>
          <p className="eyebrow">Since MMXVI — Fontvieille → worldwide</p>
        </Reveal>
        <h1 className="hero-serif rise-words mt-8 max-w-4xl text-[clamp(2.3rem,5.6vw,4.6rem)] leading-[1.08] tracking-[-0.008em] text-mist">
          {[
            "We","started","with","a","single","911","and",
            { t: "a", ember: true },{ t: "refusal", ember: true },
            "to","compromise.",
          ].map((w, i) => {
            const word: { t: string; ember?: boolean } = typeof w === "string" ? { t: w } : w;
            return (
              <span
                key={word.t + i}
                className={`w${word.ember ? " w-ember" : ""}`}
                style={{ ["--i" as string]: i }}
              >
                {word.t}
              </span>
            );
          })}
        </h1>
        <Reveal delay={160}>
          <p className="mt-10 max-w-xl text-[15px] leading-relaxed text-ash sm:text-base">
            AUREV began because two engineers were tired of watching extraordinary cars destroyed
            by ordinary salesrooms. Ten years later the idea hasn't changed: verify everything,
            present every car like it's the only one, and stay on the phone after the wire clears.
          </p>
        </Reveal>
      </section>

      {/* full-bleed image */}
      <section aria-label="The AUREV atelier" className="relative h-[52vh] min-h-[360px] overflow-hidden border-y border-line sm:h-[64vh]">
        <div ref={parallaxRef} aria-hidden="true" className="absolute inset-x-0 -top-[10%] bottom-[-10%]" style={{ transform: "translate3d(0, calc(var(--py,0px) * -0.5), 0)" }}>
          <img src={asset("/images/about-architecture.jpg")} alt="" className="size-full object-cover opacity-70 saturate-[0.65]" loading="lazy" />
        </div>
        <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.4),transparent_30%,rgba(5,5,5,0.85)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1600px] container-px pb-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-mist/70">
            The atelier — Port of Monaco · Est. 2019
          </p>
        </div>
      </section>

      {/* stats */}
      <section aria-label="AUREV by the numbers" className="mx-auto max-w-[1600px] container-px py-20">
        <Reveal className="grid grid-cols-2 border-t border-line lg:grid-cols-4">
          {STATS.map((s) => (
            <StatNum key={s.label} {...s} />
          ))}
        </Reveal>
      </section>

      {/* story */}
      <section className="mx-auto max-w-[1600px] container-px py-12" aria-labelledby="story-h">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
          <div>
            <Reveal>
              <p className="eyebrow">Philosophy</p>
              <h2 id="story-h" className="display-2 mt-5">
                Restraint,
                <br />
                <span className="serif-accent">engineered.</span>
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <blockquote className="mt-10 border-l border-crimson pl-6">
                <p className="font-accent text-2xl italic leading-snug text-mist sm:text-[1.7rem]">
                  “A marketplace is a promise about what it refuses to carry. Ours is simple: if
                  we can't prove it, we don't sell it.”
                </p>
                <footer className="mt-4 font-mono text-[9.5px] uppercase tracking-[0.24em] text-dim">
                  — E. Riva, Founder
                </footer>
              </blockquote>
            </Reveal>
          </div>
          <div className="space-y-6 text-[15px] leading-relaxed text-ash">
            <Reveal>
              <p>
                We were never a startup chasing volume. The first years were one car at a time —
                photographed on the same black floor, inspected with the same absurd checklist,
                described in the same unhurried voice. Collectors noticed. So did the auction
                houses.
              </p>
            </Reveal>
            <Reveal delay={80}>
              <p>
                Today AUREV represents roughly 60 vehicles a year from a waiting list of thousands
                — chosen for documentation, specification and story. Every consignment includes a
                full technical audit, studio imagery, and an editorial write-up that says what
                the car is and isn't.
              </p>
            </Reveal>
            <Reveal delay={160}>
              <p>
                We deliberately do not do: instant purchase offers, algorithmic pricing, or
                "hot deals". The luxury in a luxury car is the truth about it — everything else
                is logistics, and logistics is our specialty.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* timeline */}
      <section className="border-y border-line bg-coal" aria-labelledby="tl-h">
        <div className="mx-auto max-w-[1600px] container-px py-24">
          <h2 id="tl-h" className="display-2">
            Ten years, <span className="serif-accent">four chapters.</span>
          </h2>
          <ol className="mt-10 border-t border-line">
            {TIMELINE.map((t, i) => (
              <Reveal key={t.year} as="li" delay={stagger(i, 60)}>
                <div className="grid grid-cols-[4.5rem_1fr] gap-x-8 border-b border-line py-7 sm:grid-cols-[9rem_16rem_1fr] sm:gap-x-12 sm:py-8">
                  <p className="font-mono text-[11px] tracking-[0.14em] text-crimson-bright">{t.year}</p>
                  <h3 className="font-display text-lg font-bold leading-snug tracking-[-0.01em]">{t.title}</h3>
                  <p className="col-span-2 mt-2 max-w-xl text-sm leading-relaxed text-ash sm:col-span-1 sm:mt-0">
                    {t.copy}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* values */}
      <section className="mx-auto max-w-[1600px] container-px py-24" aria-labelledby="values-h">
        <SectionHeading eyebrow="Values" title={<>What we won't <span className="serif-accent font-normal">do.</span></>} />
        <div className="mt-12 grid gap-x-14 gap-y-10 border-t border-line pt-10 lg:grid-cols-3">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={stagger(i, 90)}>
              <p className="font-mono text-[9.5px] tracking-[0.3em] text-dim">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-4 font-display text-xl font-bold tracking-[-0.015em]">{v.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ash">{v.copy}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-[1600px] container-px pb-28">
        <Reveal className="border-t border-line px-0 py-16 text-center sm:px-0">
          <h2 className="mx-auto max-w-3xl font-display text-[clamp(1.5rem,2.8vw,2.2rem)] font-bold tracking-[-0.02em]">
            Come see what the standard <span className="serif-accent font-normal">looks like.</span>
          </h2>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <ButtonLink to="/collection" variant="primary" arrow>
              Explore the collection
            </ButtonLink>
            <ButtonLink to="/concierge" variant="ghost">
              <span>Visit the atelier</span>
            </ButtonLink>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
