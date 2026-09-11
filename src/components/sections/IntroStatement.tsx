import { Link } from "react-router-dom";
import { Reveal } from "../../lib/motion";

/* A narrow reading column directly under the ticker — no center-stage quote. */
export default function IntroStatement() {
  return (
    <section aria-label="AUREV statement" className="mx-auto max-w-[1600px] container-px pb-4 pt-24 sm:pt-28">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-ash">Monaco · est. 2016</p>
        </Reveal>
        <Reveal delay={80}>
          <p className="max-w-xl font-display text-[1.4rem] font-bold leading-[1.28] tracking-[-0.015em] sm:text-[1.75rem]">
            We do not list cars.{" "}
            <span className="serif-accent font-normal">
              We represent the few worth representing — verified, documented, delivered the way
              their owners expected.
            </span>{" "}
            <Link to="/about" className="whitespace-nowrap text-crimson-bright underline decoration-crimson/40 decoration-1 underline-offset-4 transition-colors hover:text-mist">
              The house story →
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
