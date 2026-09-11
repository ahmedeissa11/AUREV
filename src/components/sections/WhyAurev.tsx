import { Reveal } from "../../lib/motion";
import { useParallax } from "../../lib/hooks";
import { asset } from "../../lib/asset";

/* ------------------------------------------------------------------ */
/*  Why AUREV — four promises set as a typographic ledger. No icons.    */
/*  The crimson is a single tick per row; the rest is air.              */
/* ------------------------------------------------------------------ */

const PILLARS = [
  {
    title: "Verified vehicles",
    copy: "214-point mechanical inspection, provenance audit, ownership trace and road evaluation. No exceptions, no expedited exceptions.",
  },
  {
    title: "Curated collection",
    copy: "Exceptional automobiles selected with intention — we decline far more than we accept, and the list stays short on purpose.",
  },
  {
    title: "Secure transactions",
    copy: "Escrowed settlement, registered title handling and complete cross-border paperwork, executed in-house.",
  },
  {
    title: "Concierge service",
    copy: "A named specialist from discovery to delivery — and a direct line that stays open long after the wire clears.",
  },
];

export default function WhyAurev() {
  const plateRef = useParallax(0.1);
  return (
    <section aria-label="Why AUREV" className="mx-auto max-w-[1600px] container-px py-16 sm:py-28">
      <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <Reveal>
          <p className="eyebrow">The standard</p>
          <h2 className="display-2 mt-5">
            A marketplace is only<br className="hidden sm:block" /> worth its promises.
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ash">
            Ours are deliberately unglamorous — verify, curate, protect, accompany. Four lines
            you could engrave on a tool, not print on a pitch deck.
          </p>

          {/* the plate — an editorial frame under the promise copy */}
          <figure className="mt-12">
            <div className="group relative aspect-[5/4] overflow-hidden bg-[#0b0b0b]">
              <div
                ref={plateRef}
                aria-hidden="true"
                className="absolute inset-x-0 -top-[7%] bottom-[-7%]"
                style={{ transform: "translate3d(0, calc(var(--py,0px) * -0.5), 0)" }}
              >
                <img
                  src={asset("/images/why-standard.jpg")}
                  alt="Silver supercar resting on the atelier floor after a night inspection"
                  loading="lazy"
                  decoding="async"
                  className="size-full scale-[1.001] object-cover saturate-[0.72] transition-transform duration-[1400ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.035]"
                />
              </div>
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.3),transparent_30%,transparent_62%,rgba(5,5,5,0.5))]"
              />
            </div>
            <figcaption className="mt-3 flex items-baseline justify-between gap-4 font-mono text-[9px] uppercase tracking-[0.26em] text-dim">
              <span>Atelier floor — 02:14, after inspection</span>
              <span aria-hidden="true">Modena</span>
            </figcaption>
          </figure>
        </Reveal>

        <ol className="divide-y divide-line border-t border-line">
          {PILLARS.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 70}>
              <div className="grid grid-cols-[3rem_1fr] gap-x-6 py-7 sm:grid-cols-[4rem_1fr] sm:py-8">
                <span className="pt-1 font-mono text-[10px] tracking-[0.22em] text-dim" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="flex items-baseline gap-3 font-display text-lg font-bold tracking-[-0.01em] sm:text-xl">
                    <span className="inline-block size-[5px] translate-y-[-2px] bg-crimson" aria-hidden="true" />
                    {p.title}
                  </h3>
                  <p className="mt-2 max-w-lg text-[14.5px] leading-relaxed text-ash">{p.copy}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
