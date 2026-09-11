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

const COLUMNS: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: "Explore",
    links: [
      { label: "The Collection", to: "/collection" },
      { label: "Brands", to: "/brands" },
      { label: "Wishlist", to: "/wishlist" },
      { label: "Compare", to: "/compare" },
    ],
  },
  {
    title: "Own",
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
      {/* watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-2 select-none overflow-hidden"
      >
        <span className="block translate-y-[28%] text-center font-display text-[19vw] font-black uppercase leading-none tracking-[0.06em] text-[#0d0d0d]">
          AUREV
        </span>
      </div>

      <div className="relative mx-auto max-w-[1600px] container-px">
        <div className="grid gap-10 pt-20 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr] lg:gap-8">
          <div>
            <Logo />
            <p className="mt-6 max-w-72 text-sm leading-relaxed text-ash">
              A curated marketplace of extraordinary automobiles. Verified, delivered, and
              supported by a private concierge — from discovery to handover.
            </p>
            <ul className="mt-7 flex gap-2.5">
              {SOCIALS.map(({ label, icon: Icon, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`AUREV on ${label}`}
                    className="grid size-10 place-items-center border border-line text-ash transition-all duration-300 hover:-translate-y-0.5 hover:border-crimson hover:text-mist"
                  >
                    <Icon size={16} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="label-mono !text-mist">{col.title}</p>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="group inline-flex items-center gap-2 text-sm text-ash transition-colors hover:text-mist"
                    >
                      {l.label}
                      <IconArrowRight
                        size={13}
                        className="-translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-crimson"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <p className="label-mono !text-mist">The List</p>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ash">
              One dispatch a month. New acquisitions, private viewings, and stories — no noise.
            </p>
            {state === "done" ? (
              <p className="mt-6 flex items-center gap-3 border border-crimson/50 bg-[#16090c] px-4 py-3.5 text-sm text-mist" role="status">
                <IconCheck size={16} className="shrink-0 text-crimson-bright" />
                You're on the list. Welcome to AUREV.
              </p>
            ) : (
              <form onSubmit={subscribe} noValidate className="mt-6">
                <div className="flex border border-line-strong bg-[#0d0d0d] transition-colors focus-within:border-crimson">
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
                    className="w-full bg-transparent px-4 py-3.5 text-sm outline-none placeholder:text-dim"
                  />
                  <button
                    type="submit"
                    className="shrink-0 bg-crimson px-4 text-white transition-colors hover:bg-crimson-bright"
                    aria-label="Subscribe to the newsletter"
                  >
                    <IconArrowRight size={16} />
                  </button>
                </div>
                {state === "error" && (
                  <p role="alert" className="mt-2 text-xs text-[#e0717f]">
                    Please enter a valid email address.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line py-8 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
            © {new Date().getFullYear()} AUREV · Luxury Automotive — All rights reserved
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
            Fictional inventory for portfolio use · No affiliation with listed marques
          </p>
          <a
            href="#main"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="group inline-flex items-center gap-2 self-start font-mono text-[10px] uppercase tracking-[0.2em] text-ash transition-colors hover:text-mist md:self-auto"
          >
            Back to top
            <span className="inline-block h-px w-6 bg-line-strong transition-all duration-300 group-hover:w-10 group-hover:bg-crimson" />
          </a>
        </div>
      </div>
    </footer>
  );
}
