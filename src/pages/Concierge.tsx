import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import type { Vehicle } from "../data/types";
import { VEHICLES, findVehicle } from "../data/vehicles";
import { formatPrice, shortRef } from "../lib/format";
import { useSeo } from "../lib/seo";
import { Reveal } from "../lib/motion";
import { SelectField, TextArea, TextField } from "../components/ui/Field";
import { ButtonLink } from "../components/ui/Button";
import { asset } from "../lib/asset";
import {
  IconCheck,
  IconMail,
  IconPhone,
  IconPin,
  IconCalendar,
  IconConcierge,
  IconDiamond,
  IconSearch,
} from "../components/ui/icons";

/* ------------------------------------------------------------------ */
/*  Concierge — one form, five conversations. Adapts to intent.        */
/* ------------------------------------------------------------------ */

type Kind = "inquiry" | "viewing" | "purchase" | "sell" | "general";

const KINDS: { id: Kind; label: string; icon: typeof IconSearch; note: string }[] = [
  { id: "inquiry", label: "Vehicle inquiry", icon: IconSearch, note: "Questions about a car in the collection — history, condition, options." },
  { id: "viewing", label: "Schedule viewing", icon: IconCalendar, note: "Private appointment at the atelier or another location." },
  { id: "purchase", label: "Purchase assistance", icon: IconDiamond, note: "Sourcing, comparison, negotiation, import and delivery." },
  { id: "sell", label: "Sell a vehicle", icon: IconConcierge, note: "Valuation and consignment — or a discreet private sale." },
  { id: "general", label: "General inquiry", icon: IconMail, note: "Anything else a human can answer." },
];

const TIMES = ["09:00", "11:00", "14:00", "16:00", "18:00"];

interface Fields {
  name: string;
  email: string;
  phone: string;
  subject: string;
  date: string;
  time: string;
  budget: string;
  message: string;
}

export default function Concierge() {
  const location = useLocation();
  const state = (location.state ?? {}) as { vehicle?: string; kind?: Kind };
  const vehicle: Vehicle | null = useMemo(() => (state.vehicle ? findVehicle(state.vehicle) ?? null : null), [state.vehicle]);

  const [kind, setKind] = useState<Kind>(state.kind ?? "inquiry");
  const [f, setF] = useState<Fields>({ name: "", email: "", phone: "", subject: "", date: "", time: "", budget: "", message: "" });
  const [errors, setErrors] = useState<string | null>(null);
  const [ref, setRef] = useState<string | null>(null);

  useEffect(() => {
    if (state.kind) setKind(state.kind);
  }, [state.kind]);

  useSeo({
    title: "Concierge — private client desk",
    description:
      "Vehicle inquiries, private viewings, purchase assistance and consignment — a named AUREV specialist answers within one business day.",
    path: "/concierge",
  });

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setF((prev) => ({ ...prev, [k]: e.target.value }));
    setErrors(null);
  };

  const submit = (ev: FormEvent) => {
    ev.preventDefault();
    if (!f.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) {
      setErrors("Please provide your name and a valid email so the right specialist can reply.");
      return;
    }
    if (kind === "viewing" && (!f.date || !f.time)) {
      setErrors("Pick a date and a preferred time for the viewing.");
      return;
    }
    setRef(shortRef(f.email + kind + f.subject));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const active = KINDS.find((k) => k.id === kind)!;

  return (
    <div className="mx-auto max-w-[1600px] container-px pb-24 pt-20 sm:pb-28 sm:pt-36">
      <header className="grid gap-10 border-b border-line pb-12 lg:grid-cols-[1.3fr_1fr] lg:items-end">
        <div>
          <p className="eyebrow">Private client desk — 24/7</p>
          <h1 className="display-1 mt-6 max-w-3xl">
            A named <span className="serif-accent">human,</span>
            <br />
            from hello to handover.
          </h1>
        </div>
        <Reveal delay={120}>
          <p className="max-w-md text-[15px] leading-relaxed text-ash">
            No chatbots, no queues, no call-centre scripts. Tell us what you need below — a
            specialist replies within one business day, and stays yours for the long term.
          </p>
        </Reveal>
      </header>

      {ref ? (
        <Reveal className="mx-auto mt-16 max-w-2xl border-t-2 border-mist/70 px-6 py-12 text-center">
          <p className="flex items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-[0.34em] text-crimson-bright">
            <IconCheck size={15} /> Request received
          </p>
          <h2 className="mt-5 font-display text-[clamp(1.5rem,2.6vw,2.1rem)] font-bold tracking-[-0.02em]">Your concierge is on it</h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ash">
            {active.label} submitted for <span className="text-mist">{f.name}</span>. Expect a
            direct reply at <span className="text-mist">{f.email}</span> within one business day.
          </p>
          <p className="mt-7 inline-flex items-center gap-3 border border-line-strong px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-dim">
            Ticket <span className="text-crimson-bright">{ref}</span>
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <ButtonLink to="/collection" variant="primary" size="sm" arrow>
              Keep browsing
            </ButtonLink>
            <button type="button" onClick={() => setRef(null)} className="btn btn-ghost btn-sm">
              <span>New request</span>
            </button>
          </div>
        </Reveal>
      ) : (
        <div className="mt-12 grid gap-14 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          {/* form column */}
          <div>
            {/* intent switcher — a quiet ledger of request types */}
            <div role="radiogroup" aria-label="Type of request" className="border-t border-line">
              {KINDS.map((k) => (
                <button
                  key={k.id}
                  type="button"
                  role="radio"
                  aria-checked={kind === k.id}
                  onClick={() => setKind(k.id)}
                  className={`group flex w-full items-baseline gap-5 border-b border-line py-4 text-left transition-colors duration-300 ${
                    kind === k.id ? "" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`mt-0.5 inline-block size-2.5 shrink-0 border transition-colors duration-300 ${
                      kind === k.id ? "border-crimson bg-crimson" : "border-line-strong group-hover:border-ash"
                    }`}
                  />
                  <span>
                    <span className={`block font-display text-[15px] font-bold tracking-[-0.01em] transition-colors ${kind === k.id ? "text-crimson-bright" : "text-mist"}`}>
                      {k.label}
                    </span>
                    <span className="mt-0.5 block text-[12.5px] leading-relaxed text-ash">{k.note}</span>
                  </span>
                </button>
              ))}
            </div>

            <form onSubmit={submit} noValidate className="mt-8 p-0 sm:p-0">
              {/* context card when arriving from a vehicle */}
              {vehicle && (kind === "inquiry" || kind === "viewing") && (
                <div className="mb-8 flex items-center gap-4 border-l border-crimson bg-[#0b0b0b] p-3.5">
                  <img src={vehicle.images[0].src} alt="" className="h-14 w-24 shrink-0 border border-line object-cover" loading="lazy" />
                  <div className="min-w-0">
                    <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-crimson-bright">
                      Regarding — from vehicle page
                    </p>
                    <p className="mt-1 truncate text-sm font-bold text-mist">
                      {vehicle.year} {vehicle.brand} {vehicle.model}
                    </p>
                  </div>
                  <Link to={`/vehicle/${vehicle.id}`} className="ml-auto hidden shrink-0 font-mono text-[9.5px] uppercase tracking-[0.2em] text-ash underline-offset-4 hover:text-mist hover:underline sm:block">
                    {formatPrice(vehicle.price)}
                  </Link>
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <TextField label="Full name" required value={f.name} onChange={set("name")} autoComplete="name" placeholder="Aurelio Visconti" />
                <TextField label="Email" type="email" required value={f.email} onChange={set("email")} autoComplete="email" placeholder="you@email.com" />
                <TextField label="Phone" type="tel" placeholder="Optional — for urgent matters" value={f.phone} onChange={set("phone")} autoComplete="tel" />
                {kind !== "purchase" && (
                  <SelectField
                    label={kind === "viewing" ? "Preferred vehicle" : "Subject"}
                    value={f.subject}
                    onChange={set("subject")}
                    options={[
                      { value: "", label: kind === "viewing" ? "Any / undecided" : "General" },
                      ...VEHICLES.map((v) => ({ value: v.id, label: `${v.brand} ${v.model} · ${v.year}` })),
                    ]}
                  />
                )}
                {kind === "purchase" && (
                  <SelectField
                    label="Budget"
                    value={f.budget}
                    onChange={set("budget")}
                    options={[
                      { value: "", label: "Select range…" },
                      { value: "u150", label: "Under $150,000" },
                      { value: "150-300", label: "$150,000 — $300,000" },
                      { value: "300-600", label: "$300,000 — $600,000" },
                      { value: "600+", label: "$600,000 +" },
                    ]}
                  />
                )}
              </div>

              {kind === "viewing" && (
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <TextField label="Preferred date" type="date" required value={f.date} onChange={set("date")} min={new Date().toISOString().split("T")[0]} />
                  <div>
                    <p className="field__label" id="time-label">Preferred time</p>
                    <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="time-label">
                      {TIMES.map((t) => (
                        <button
                          key={t}
                          type="button"
                          role="radio"
                          aria-checked={f.time === t}
                          onClick={() => setF((prev) => ({ ...prev, time: t }))}
                          className={`chip font-mono ${f.time === t ? "!border-crimson !bg-crimson text-white" : ""}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-5">
                <TextArea
                  label={kind === "viewing" ? "Anything we should prepare?" : "Message"}
                  rows={5}
                  value={f.message}
                  onChange={set("message")}
                  placeholder={
                    kind === "viewing"
                      ? "We can have the car warmed, the lift free, and coffee from the good machine."
                      : "Tell us what matters. The more specific, the sharper the answer."
                  }
                />
              </div>

              {errors && (
                <p role="alert" className="mt-4 text-xs text-[#e0717f]">
                  {errors}
                </p>
              )}

              <button type="submit" className="btn btn-primary mt-8 w-full sm:w-auto">
                <span>Send to concierge</span>
                <svg className="btn-arrow" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path d="M4 12h15m-5-6 6 6-6 6" strokeLinecap="square" />
                </svg>
              </button>
            </form>
          </div>

          {/* direct lines column */}
          <aside aria-label="Direct contact" className="lg:pt-2">
            <div className="border-t-2 border-mist/70 bg-[#0b0b0b]">
              <img src={asset("/images/concierge-night.jpg")} alt="AUREV atelier at night" loading="lazy" className="aspect-[16/9] w-full object-cover opacity-80" />
              <div className="p-6 sm:p-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-crimson-bright">Direct lines</p>
                <ul className="mt-5 space-y-4">
                  {[
                    { icon: IconPhone, label: "+377 97 00 12 34", href: "tel:+37797001234", meta: "Mon–Sat, 08:00 — 21:00 CET" },
                    { icon: IconMail, label: "concierge@aurev.com", href: "mailto:concierge@aurev.com", meta: "One business day, from a human" },
                  ].map((c) => (
                    <li key={c.href}>
                      <a href={c.href} className="group flex items-start gap-4">
                        <span className="mt-0.5 grid size-9 shrink-0 place-items-center border border-line-strong text-ash transition-colors duration-300 group-hover:border-crimson group-hover:text-crimson-bright">
                          <c.icon size={15} />
                        </span>
                        <span>
                          <span className="block text-[15px] font-semibold text-mist transition-colors group-hover:text-crimson-bright">
                            {c.label}
                          </span>
                          <span className="mt-0.5 block font-mono text-[9.5px] uppercase tracking-[0.16em] text-dim">{c.meta}</span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
                <div className="mt-7 border-t border-line pt-6">
                  <p className="flex items-start gap-4 text-sm leading-relaxed text-ash">
                    <IconPin size={15} className="mt-1 shrink-0 text-crimson" />
                    <span>
                      AUREV Atelier — Quai Antoine 1er,
                      <br />
                      98000 Monaco. Visits by appointment.
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <p className="mt-6 text-[12.5px] leading-relaxed text-dim">
              Demo experience — submissions stay in your browser. In production this desk routes
              to the concierge team.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}

