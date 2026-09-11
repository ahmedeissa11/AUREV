import { Link } from "react-router-dom";
import { Reveal } from "../../lib/motion";

/* The house statement — set as a centered plate. On scroll it glides in
   from the left, unhurried: a sweep, not a bounce. */
export default function IntroStatement() {
  return (
    <section aria-label="AUREV statement" className="mx-auto max-w-[1600px] container-px pb-10 pt-20 sm:pb-12 sm:pt-40">
      <div className="mx-auto max-w-3xl text-center">
        <span aria-hidden="true" className="mx-auto mb-8 block h-px w-10 bg-crimson" />
        <Reveal variant="left" className="reveal--glide">
          <p className="font-mono text-[10px] uppercase tracking-[0.42em] text-ash">
            Monaco · est. 2016
          </p>
        </Reveal>
        <Reveal variant="left" className="reveal--glide" delay={160}>
          <p className="mt-7 font-display text-[1.5rem] font-bold leading-[1.45] tracking-[-0.015em] text-mist sm:text-[1.85rem]">
            We do not list cars.{" "}
            <span className="serif-accent text-[1.1em] font-normal italic leading-normal text-ash">
              We represent the few worth representing — verified, documented, delivered the way
              their owners expected.
            </span>{" "}
            <Link
              to="/about"
              className="whitespace-nowrap -my-2 py-2 inline-flex text-crimson-bright underline decoration-crimson/40 decoration-1 underline-offset-4 transition-colors hover:text-mist"
            >
              The house story →
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
