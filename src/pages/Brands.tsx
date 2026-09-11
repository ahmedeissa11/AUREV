import { useState } from "react";
import { Link } from "react-router-dom";
import { BRANDS, vehicleCountForBrand } from "../data/vehicles";
import { useSeo } from "../lib/seo";
import { Reveal } from "../lib/motion";
import { ButtonLink } from "../components/ui/Button";

/* ------------------------------------------------------------------ */
/*  Brands — a magazine index. Rows, hairlines, a thumbnail that       */
/*  appears inside the row it belongs to. Nothing floats.              */
/* ------------------------------------------------------------------ */

export default function Brands() {
  const [hover, setHover] = useState<number | null>(null);

  useSeo({
    title: "Brands — the houses we represent",
    description:
      "Ferrari, Lamborghini, Porsche, McLaren, Aston Martin, Bentley, Rolls-Royce and more — the marques AUREV curates inventory from.",
    path: "/brands",
  });

  return (
    <div className="mx-auto max-w-[1600px] container-px pb-24 pt-20 sm:pb-28 sm:pt-36">
      <header className="grid gap-10 border-b border-line pb-10 lg:grid-cols-[1.1fr_1fr] lg:items-end">
        <div>
          <p className="eyebrow">Marques — index</p>
          <h1 className="mt-4 font-display text-[clamp(1.9rem,3.6vw,2.9rem)] font-black uppercase tracking-[-0.03em]">
            The Houses
          </h1>
        </div>
        <Reveal delay={100}>
          <p className="max-w-md text-[14.5px] leading-relaxed text-ash">
            Twelve manufacturers. No partnerships, no press cars, no loyalty to logos — only to
            the standard. If a marque's best examples are worth representing, they are below.
          </p>
          <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.22em] text-dim">
            No official affiliation with listed marques is implied
          </p>
        </Reveal>
      </header>

      <ul className="mt-2">
        {BRANDS.map((b, i) => {
          const count = vehicleCountForBrand(b.name);
          return (
            <li key={b.name} className="border-b border-line" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <Link
                to={count ? `/collection?brand=${encodeURIComponent(b.name)}` : "/collection"}
                className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-x-6 py-7 sm:grid-cols-[3.5rem_1.1fr_1.4fr_auto] sm:gap-x-10"
                aria-label={`${b.name} — ${count ? `${count} vehicles in stock` : "currently sourcing"}`}
              >
                <span className="font-mono text-[10px] tracking-[0.2em] text-dim transition-colors group-hover:text-crimson-bright">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-display text-[1.5rem] font-extrabold uppercase leading-tight tracking-[-0.02em] text-mist transition-all duration-500 group-hover:translate-x-1.5 sm:text-[2rem]">
                    {b.name}
                  </span>
                  <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.18em] text-dim sm:hidden">
                    {b.country} · {count ? `${count} in stock` : "sourcing"}
                  </span>
                </span>
                <span className="hidden text-[13.5px] leading-snug text-ash transition-colors duration-300 group-hover:text-mist sm:block">
                  {b.blurb}
                </span>
                <span className="flex items-center gap-8 justify-self-end">
                  {/* in-row plate: the thumbnail belongs to the line it sits on */}
                  <img
                    src={b.image}
                    alt=""
                    loading="lazy"
                    aria-hidden="true"
                    className={`hidden h-[4.5rem] w-28 shrink-0 object-cover transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:block ${
                      hover === i ? "opacity-100 translate-x-0" : "opacity-0 translate-x-3"
                    }`}
                  />
                  <span className="hidden font-mono text-[9.5px] uppercase tracking-[0.2em] text-dim sm:block">
                    {count ? `${String(count).padStart(2, "0")} in stock` : "sourcing"}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`inline-block h-px transition-all duration-500 ${
                      hover === i ? "w-10 bg-crimson" : "w-5 bg-line-strong"
                    }`}
                  />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <Reveal className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-line pt-10 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-xl font-bold tracking-[-0.015em] sm:text-2xl">
            Looking for something the index doesn't hold?
          </h2>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-ash">
            A third of our deliveries begin as a sourcing request. Name the car; we will tell you
            the truth about whether it can be found.
          </p>
        </div>
        <ButtonLink to="/concierge" variant="primary" arrow>
          Ask Concierge
        </ButtonLink>
      </Reveal>
    </div>
  );
}
