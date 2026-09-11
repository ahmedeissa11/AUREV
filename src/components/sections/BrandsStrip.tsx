import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../../lib/hooks";
import { Link } from "react-router-dom";
import { BRANDS, vehicleCountForBrand } from "../../data/vehicles";
import { Reveal } from "../../lib/motion";

/* ------------------------------------------------------------------ */
/*  Brands — the twelve houses as a ledger of cards. Each cell is a   */
/*  physical card (face, hairline edge, lift on hover); when the      */
/*  index scrolls into view the cards flip up from below into their   */
/*  places — drawbridge style, bottom origin, staggered left→right.   */
/*  JS-less / reduced-motion users simply see the set index at rest.  */
/* ------------------------------------------------------------------ */

export default function BrandsStrip() {
  const gridRef = useRef<HTMLUListElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  /* scroll-linked column drift: each column breathes vertically at its own
     rate/direction while the index crosses the viewport — cinematic,
     bounded (±60px), rAF-throttled, active only while in view */
  useEffect(() => {
    const sec = sectionRef.current;
    const grid = gridRef.current;
    if (!sec || !grid || reduced) return;
    const cards = [...grid.querySelectorAll<HTMLElement>(".brand-card")];
    const drift = [46, -60, 34, -50];
    let visible = false;
    let ticking = false;
    const paint = () => {
      ticking = false;
      const r = sec.getBoundingClientRect();
      const q = Math.min(1, Math.max(0, (window.innerHeight - r.top) / (r.height + window.innerHeight)));
      const w = q * 2 - 1; // −1 … 1 across the passage
      cards.forEach((c, i) => {
        const col = i % 4;
        const amp = drift[col % drift.length];
        c.style.setProperty("--dy", `${(amp * w * (visible ? 1 : 0)).toFixed(1)}px`);
      });
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(paint);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible) window.addEventListener("scroll", onScroll, { passive: true });
        else window.removeEventListener("scroll", onScroll);
        paint();
      },
      { threshold: 0 }
    );
    io.observe(sec);
    paint();
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduced]);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    // arm only once JS is live — un-armed cards are the static fallback
    el.classList.add("cards-armed");
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("cards-on");
          io.disconnect();
          // after the last staggered flip lands, drop the animation so the
          // cards settle into their plain base state (no held matrix3d,
          // no will-change layers lingering on text)
          window.setTimeout(() => el.classList.add("cards-done"), 1700);
        }
      },
      { threshold: 0.16 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={sectionRef} aria-label="Brands" className="border-y border-line bg-coal">
      <div className="mx-auto max-w-[1600px] container-px py-20 sm:py-28">
        <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
          <h2 className="font-editorial text-[1.7rem] leading-snug tracking-[0.005em] text-mist sm:text-[2rem]">
            Representing twelve houses —{" "}
            <em className="text-ember">sourced,</em>{" "}
            <span className="text-ash">not partnered.</span>
          </h2>
          <Link to="/brands" className="btn-line !text-[10.5px] shrink-0">
            The brand index
          </Link>
        </Reveal>

        {/* the card index */}
        <ul
          ref={gridRef}
          className="brand-cards mt-12 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4"
        >
          {BRANDS.map((brand, i) => (
            <li key={brand.name} className="brand-card" style={{ ["--i" as string]: i }}>
              <Link
                to={`/collection?brand=${encodeURIComponent(brand.name)}`}
                className="group relative flex h-full flex-col justify-between px-5 py-8 transition-[transform,border-color,background-color] duration-300 ease-out hover:-translate-y-[3px] sm:px-7 sm:py-10"
              >
                <p className="font-mono text-[8.5px] uppercase tracking-[0.34em] text-dim">
                  N&deg; {String(i + 1).padStart(2, "0")}
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 h-px w-0 bg-crimson transition-all duration-500 group-hover:w-8"
                  />
                </p>
                <p className="mt-4 font-editorial text-[1.15rem] uppercase leading-[1.15] tracking-[0.045em] text-ash transition-colors duration-300 group-hover:text-mist sm:text-[1.45rem]">
                  {brand.name}
                </p>
                <p className="mt-4 font-mono text-[8.5px] uppercase tracking-[0.28em] text-dim transition-colors duration-300 group-hover:text-mist/55">
                  {vehicleCountForBrand(brand.name)}{" "}
                  <span className="text-[#55534e]">in index</span>
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
