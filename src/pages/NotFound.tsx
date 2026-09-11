import { Link } from "react-router-dom";
import { useSeo } from "../lib/seo";
import { ButtonLink } from "../components/ui/Button";
import { Reveal } from "../lib/motion";

export default function NotFound() {
  useSeo({
    title: "404 — Wrong turn",
    description: "This page is not in the AUREV collection.",
    path: "/404",
  });

  return (
    <section className="noise relative flex min-h-[100svh] items-center overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0">
        <img src="/images/perf-tunnel.jpg" alt="" className="size-full object-cover opacity-25 saturate-[0.5]" />
        <span className="absolute inset-0 bg-[linear-gradient(180deg,#050505,rgba(5,5,5,0.55)_40%,#050505)]" />
      </div>
      <div className="relative mx-auto w-full max-w-[1600px] container-px">
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-crimson-bright">Error 404</p>
          <h1 className="display-1 mt-6">
            Wrong <span className="serif-accent">exit.</span>
          </h1>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ash">
            This page isn't on the AUREV map. Take the next junction back — the collection is
            always open.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <ButtonLink to="/" variant="primary" arrow>
              Return home
            </ButtonLink>
            <Link to="/collection" className="btn btn-ghost">
              <span>The collection</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
