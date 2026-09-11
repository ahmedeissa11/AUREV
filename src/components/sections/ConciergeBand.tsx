import { Reveal } from "../../lib/motion";
import { ButtonLink } from "../ui/Button";
import { IconPhone } from "../ui/icons";
import { asset } from "../../lib/asset";

/* ------------------------------------------------------------------ */
/*  Concierge band — photo right, promise left. Flat, not filtered.     */
/* ------------------------------------------------------------------ */

export default function ConciergeBand() {
  return (
    <section aria-label="Concierge" className="grid grid-cols-1 border-y border-line lg:grid-cols-2">
      <Reveal className="flex flex-col justify-center gap-6 px-6 py-20 sm:px-10 lg:py-28 xl:px-16">
        <p className="eyebrow">Concierge — 24/7</p>
        <h2 className="display-2">
          Someone answers. <span className="serif-accent font-normal">Always.</span>
        </h2>
        <p className="max-w-md text-[15px] leading-relaxed text-ash">
          A named specialist from first enquiry to handover: viewings at our facilities or yours,
          shipping quotes, import paperwork, and a line that does not go quiet after the sale.
        </p>
        <div className="flex flex-wrap items-center gap-5 pt-1">
          <ButtonLink to="/concierge" variant="primary" arrow>
            Contact Concierge
          </ButtonLink>
          <a
            href="tel:+37797001234"
            className="inline-flex items-center gap-2.5 font-mono text-[10.5px] uppercase tracking-[0.18em] text-ash transition-colors hover:text-mist"
          >
            <IconPhone size={14} className="text-crimson" />
            +377 97 00 12 34
          </a>
        </div>
      </Reveal>

      <figure className="relative min-h-[280px] overflow-hidden lg:min-h-full">
        <img
          src={asset("/images/concierge-night.jpg")}
          alt="A client collected at the AUREV atelier, after dark"
          loading="lazy"
          className="absolute inset-0 size-full object-cover"
        />
        <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,#050505_0%,transparent_38%)]" />
        <figcaption className="absolute bottom-4 right-5 font-mono text-[9px] uppercase tracking-[0.26em] text-mist/45">
          Handover, 23:14 — Port of Monaco
        </figcaption>
      </figure>
    </section>
  );
}
