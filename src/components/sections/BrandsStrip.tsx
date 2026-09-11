import { Link } from "react-router-dom";
import { BRANDS, vehicleCountForBrand } from "../../data/vehicles";
import { Reveal } from "../../lib/motion";

/* ------------------------------------------------------------------ */
/*  Brands — the houses set as a luxury index: a hairline grid of     */
/*  twelve cells, each numbered and counted like a ledger of marque.  */
/*  No tiles-with-shadows, no logos: typographic, quiet, expensive.   */
/* ------------------------------------------------------------------ */

export default function BrandsStrip() {
  return (
    <section aria-label="Brands" className="border-y border-line bg-coal">
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

        {/* hairline ledger grid — gaps are the rules (1px), not borders */}
        <Reveal delay={100} className="mt-12">
          <ul className="grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3 lg:grid-cols-4">
            {BRANDS.map((brand, i) => (
              <li key={brand.name}>
                <Link
                  to={`/collection?brand=${encodeURIComponent(brand.name)}`}
                  className="group relative flex h-full flex-col justify-between bg-coal px-5 py-8 transition-colors duration-300 hover:bg-[#0f0f0e] sm:px-7 sm:py-10"
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
        </Reveal>
      </div>
    </section>
  );
}
