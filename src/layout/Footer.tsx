import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../components/ui/Logo";
import {
  IconArrowRight,
  IconInstagram,
  IconLinkedin,
  IconX,
  IconYoutube,
  IconCheck,
} from "../components/ui/icons";

const COLUMNS: { no: string; title: string; links: { label: string; to: string }[] }[] = [
  {
    no: "01",
    title: "Explore",
    links: [
      { label: "The Collection", to: "/collection" },
      { label: "Brands", to: "/brands" },
      { label: "Wishlist", to: "/wishlist" },
      { label: "Compare", to: "/compare" },
    ],
  },
  {
    no: "02",
    title: "Ownership",
    links: [
      { label: "Sell Your Car", to: "/sell" },
      { label: "Concierge", to: "/concierge" },
      { label: "About AUREV", to: "/about" },
    ],
  },
];

const SOCIALS = [
  { label: "Instagram", icon: IconInstagram, href: "https://instagram.com" },
  { label: "X", icon: IconX, href: "https://x.com" },
  { label: "YouTube", icon: IconYoutube, href: "https://youtube.com" },
  { label: "LinkedIn", icon: IconLinkedin, href: "https://linkedin.com" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");

  const subscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState("error");
      return;
    }
    setState("done");
  };

  return (
    <footer className="relative mt-px border-t border-line bg-coal">
      <div className="relative mx-auto max-w-[1600px] container-px">
        {/* ————— the sign-off ————— */}
        <div className="grid gap-12 pt-20 pb-16 lg:grid-cols-[1.3fr_1fr] lg:gap-24">
          <div>
            <Logo />
            <p className="mt-9 eyebrow">The house — Port of Monaco · Modena</p>
            <p className="mt-5 max-w-2xl font-editorial text-[clamp(1.85rem,3.5vw,3.05rem)] leading-[1.16] tracking-[0.004em] text-mist">
              We stay on the line{" "}
              <em className="text-ember">after</em> the wire clears. One number, one standard —
              no showroom.
            </p>
            <p className="mt-8 max-w-md text-[13.5px] leading-relaxed text-ash">
              A curated marketplace of extraordinary automobiles: verified, delivered, and
              supported privately — from first discovery to handover on the dock.
            </p>
          </div>

          {/* the dispatch — engraved field, no box */}
          <div className="lg:pt-14">
            <p className="label-mono !text-mist">The List</p>
            <p className="mt-4 max-w-xs text-[13.5px] leading-relaxed text-ash">
              One dispatch a month. New acquisitions, private viewings, stories — no noise, no
              promotions.
            </p>
            {state === "done" ? (
              <p
                role="status"
                className="mt-8 flex items-center gap-3 border-b border-crimson/55 pb-3 font-mono text-[10px] uppercase tracking-[0.24em] text-mist"
              >
                <IconCheck size={14} className="shrink-0 text-crimson-bright" />
                You're on the list. Welcome to AUREV.
              </p>
            ) : (
              <form onSubmit={subscribe} noValidate className="mt-8">
                <div className="flex items-center gap-5 border-b border-line-strong pb-3 transition-colors duration-300 focus-within:border-crimson">
                  <label htmlFor="footer-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="footer-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (state === "error") setState("idle");
                    }}
                    placeholder="your@email.com"
                    aria-invalid={state === "error" || undefined}
                    className="w-full bg-transparent text-[14px] text-mist outline-none placeholder:text-dim"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe to the newsletter"
                    className="group inline-flex shrink-0 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-mist transition-colors duration-300 hover:text-crimson-bright"
                  >
                    Join
                    <IconArrowRight
                      size={13}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </button>
                </div>
                {state === "error" && (
                  <p role="alert" className="mt-2.5 font-mono text-[9.5px] uppercase tracking-[0.18em] text-[#e0717f]">
                    A valid email, please.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* ————— navigation + channels ————— */}
        <div className="grid gap-10 border-t border-line py-14 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.25fr] lg:gap-16">
          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="flex items-baseline gap-4 font-mono text-[9.5px] uppercase tracking-[0.3em] text-dim">
                <span className="text-crimson">{col.no}</span>
                {col.title}
                <span aria-hidden="true" className="inline-block h-px flex-1 bg-line" />
              </p>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="group relative inline-block text-[14px] text-ash transition-colors duration-300 hover:text-mist after:absolute after:-bottom-1 after:left-1/2 after:h-px after:w-0 after:-translate-x-1/2 after:bg-crimson after:transition-[width] after:duration-500 after:ease-[cubic-bezier(.16,1,.3,1)] hover:after:w-full"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <p className="flex items-baseline gap-4 font-mono text-[9.5px] uppercase tracking-[0.3em] text-dim">
              <span className="text-crimson">03</span>
              Channels
              <span aria-hidden="true" className="inline-block h-px flex-1 bg-line" />
            </p>
            <ul className="mt-5 flex flex-wrap items-center gap-x-7 gap-y-3">
              {SOCIALS.map(({ label, icon: Icon, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`AUREV on ${label}`}
                    className="group inline-flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-ash transition-colors duration-300 hover:text-mist"
                  >
                    <Icon size={14} className="opacity-55 transition-opacity duration-300 group-hover:opacity-100" />
                    <span className="relative after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-crimson/70 after:transition-all after:duration-500 group-hover:after:w-full">
                      {label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-6 font-mono text-[9px] uppercase leading-relaxed tracking-[0.18em] text-[#55534e]">
              Viewing rooms by appointment
              <br />
              Port of Monaco — sea · Modena — road
            </p>
          </div>
        </div>

        {/* ————— colophon ————— */}
        <div className="flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-line py-8">
          <p className="flex items-center gap-3 font-mono text-[9.5px] uppercase tracking-[0.22em] text-dim">
            <span aria-hidden="true" className="inline-block size-[5px] bg-crimson" />©{" "}
            {new Date().getFullYear()} AUREV — all rights reserved
          </p>
          <p className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-[#55534e]">
            Fictional inventory for portfolio use · no affiliation with listed marques
          </p>
          <a
            href="#main"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="group ml-auto inline-flex items-center gap-3 font-mono text-[9.5px] uppercase tracking-[0.22em] text-ash transition-colors duration-300 hover:text-mist"
          >
            Back to top
            <span
              aria-hidden="true"
              className="inline-block h-px w-8 bg-line-strong transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:w-12 group-hover:bg-crimson"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
