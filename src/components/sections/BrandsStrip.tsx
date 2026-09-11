import { Link } from "react-router-dom";
import { BRANDS, vehicleCountForBrand } from "../../data/vehicles";
import { Reveal } from "../../lib/motion";

/* ------------------------------------------------------------------ */
/*  Brands — a typographic index line. No tiles, no boxes: the houses  */
/*  are set like a masthead. Hover names turn crimson, that's all.     */
/* ------------------------------------------------------------------ */

export default function BrandsStrip() {
  return (
    <section aria-label="Brands" className="border-y border-line bg-coal">
      <div className="mx-auto max-w-[1600px] container-px py-20 sm:py-24">
        <Reveal className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
          <h2 className="font-display text-[1.35rem] font-bold tracking-[-0.01em]">
            Representing twelve houses —
            <span className="text-ash"> sourced, not partnered.</span>
          </h2>
          <Link to="/brands" className="btn-line !text-[10.5px]">
            The brand index
          </Link>
        </Reveal>

        <Reveal delay={100}>
          <p className="mt-10 flex flex-wrap items-baseline gap-x-8 gap-y-4">
            {BRANDS.map((brand, i) => (
              <Link
                key={brand.name}
                to={`/collection?brand=${encodeURIComponent(brand.name)}`}
                className="group relative font-display text-xl font-bold uppercase tracking-[-0.01em] text-[#6d6b64] transition-colors duration-300 hover:text-mist sm:text-[1.65rem]"
              >
                {brand.name}
                <sup className="ml-1 font-mono text-[8px] font-medium tracking-normal text-dim transition-colors group-hover:text-crimson">
                  {vehicleCountForBrand(brand.name)}
                </sup>
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1.5 left-0 h-px w-0 bg-crimson transition-all duration-500 group-hover:w-full"
                />
                {i < BRANDS.length - 1 && (
                  <span aria-hidden="true" className="absolute -right-4 top-1/2 hidden -translate-y-1/2 text-[#2c2c29] sm:block">
                    ·
                  </span>
                )}
              </Link>
            ))}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
