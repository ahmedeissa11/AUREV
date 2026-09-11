import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "../ui/Button";
import { usePrefersReducedMotion } from "../../lib/hooks";
import { VEHICLES } from "../../data/vehicles";

/* ------------------------------------------------------------------ */
/*  Hero — a scroll-controlled cinematic pass over the handover frame. */
/*  No video asset exists (no image-to-video generation in this        */
/*  environment), so the film is a genuine 2.5D simulation cut from    */
/*  the SOURCE IMAGE ITSELF: a blurred, darkened depth plane behind a  */
/*  sharp foreground plane masked to the car line, a slow push-in      */
/*  toward the vehicle, a whisper of camera drift, and the garage's    */
/*  crimson light creeping across the bodywork.                        */
/*  Scroll position drives the shot: one rAF loop writes --hp (0→1)    */
/*  onto the sticky stage — no React state per frame, no CSS scroll    */
/*  timing dependency, exact mapping down (play) / up (rewind).        */
/* ------------------------------------------------------------------ */

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export default function Hero() {
  const [loaded, setLoaded] = useState(false);
  const [litReady, setLitReady] = useState(false);
  const reduced = usePrefersReducedMotion();
  const wrapRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // poster logic: the still IS the poster — it's painted by the same layers
  useEffect(() => {
    if (loaded) return;
    const img = new Image();
    img.src = "/images/hero-handover.jpg?v=1";
    img.onload = () => setLoaded(true);
  }, [loaded]);

  // the scroll → time controller
  useEffect(() => {
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    if (!wrap || !stage) return;
    if (reduced) {
      stage.style.setProperty("--hp", "0");
      return;
    }
    let target = 0;
    let cur = 0;
    let raf = 0;
    const paint = () => {
      cur += (target - cur) * 0.13; // slight inertia so it reads as a dolly, not a slider
      if (Math.abs(target - cur) < 0.0006) cur = target;
      stage.style.setProperty("--hp", cur.toFixed(4));
      // once the title has faded out, the frame belongs to the film:
      // disarm its (now invisible) buttons so stray clicks can't navigate
      stage.classList.toggle("is-spent", cur > 0.84);
      raf = cur !== target ? requestAnimationFrame(paint) : 0;
    };
    const onScroll = () => {
      const r = wrap.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      target = span <= 0 ? 0 : clamp01(-r.top / span);
      if (!raf) raf = requestAnimationFrame(paint);
    };
    // cost stays near zero outside the hero: listeners live only while pinned
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          window.addEventListener("scroll", onScroll, { passive: true });
          onScroll();
        } else {
          window.removeEventListener("scroll", onScroll);
          if (raf) cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0 }
    );
    io.observe(wrap);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <section ref={wrapRef} aria-label="AUREV — engineered for the exceptional" className="hero-film relative w-full">
      <div ref={stageRef} className="hero-film__stage noise">
        {/* depth plane — the same frame, defocused: falls behind the push-in */}
        <div className="hero-film__bg" aria-hidden="true">
          <img src="/images/hero-handover.jpg?v=1" alt="" className="size-full object-cover" loading="eager" decoding="async" />
        </div>

        {/* foreground plane — sharp, feathered along the roofline so the seam
            reads as depth of field, never as a tear; pushes toward the car */}
        <div className="hero-film__fg" aria-hidden="true">
          <img
            src="/images/hero-handover.jpg?v=1"
            alt=""
            className={`size-full object-cover object-center transition-opacity duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
            fetchPriority="high"
            decoding="async"
            onLoad={() => setLoaded(true)}
          />
          {/* relit pass of the same frame — scroll crossfades it over the
              original: lamps and underglow ignite inside the photo itself */}
          <img
            src="/images/hero-handover-lit.jpg"
            alt=""
            aria-hidden="true"
            className={`hero-film__lit absolute inset-0 size-full object-cover object-center ${
              litReady ? "is-ready" : ""
            }`}
            loading="eager"
            fetchPriority="low"
            decoding="async"
            onLoad={() => setLitReady(true)}
          />
        </div>

        {/* grading — legibility, not decoration */}
        <div
          aria-hidden="true"
          className="hero-film__grade absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.58)_0%,rgba(5,5,5,0.12)_38%,rgba(5,5,5,0.66)_78%,#050505_100%)]"
        />
        {/* the red wall light, drifting with the dolly — restrained */}
        <div className="hero-film__bloom" aria-hidden="true" />

        {/* the narrative caption — mirrors the print mark in the campaign frame */}
        <p
          aria-hidden="true"
          className="hero-anim absolute bottom-[13svh] right-5 z-[2] font-mono text-[9px] uppercase tracking-[0.34em] text-mist/70 sm:right-8"
          style={{ ["--i" as string]: "6" }}
        >
          Handover, 23:14 — Port of Monaco
        </p>

        {/* side rail */}
        <p
          aria-hidden="true"
          className="vertical-rl absolute right-5 top-1/2 hidden -translate-y-1/2 font-mono text-[9.5px] uppercase tracking-[0.5em] text-mist/35 xl:block"
        >
          Maranello — Stuttgart — Goodwood
        </p>

        {/* type layer — rides with the camera, exits before the reel takes over */}
        <div className="hero-film__type">
          <div className="relative mx-auto flex h-full max-w-[1600px] flex-col justify-end container-px pb-10 pt-28 sm:pb-14">
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
        </div>
      </div>
    </section>
  );
}
