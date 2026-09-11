import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { BRAND_NAMES } from "../data/vehicles";
import { formatNumber, shortRef } from "../lib/format";
import { useSeo } from "../lib/seo";
import { Reveal, stagger } from "../lib/motion";
import { SectionHeading } from "../components/ui/SectionHeading";
import { ButtonLink } from "../components/ui/Button";
import { SelectField, TextArea, TextField } from "../components/ui/Field";
import { IconCheck, IconClose } from "../components/ui/icons";

/* ------------------------------------------------------------------ */
/*  Sell — premium consignment experience + a form that behaves.        */
/* ------------------------------------------------------------------ */

const STEPS = [
  {
    n: "01",
    title: "Valuation",
    copy: "Submit the car. Within 48 hours a specialist returns a market-anchored valuation with comparables — not a lead-generation number.",
  },
  {
    n: "02",
    title: "Inspection",
    copy: "A 214-point technical and provenance audit at your location or our atelier. Paint, history, mechanical, cosmetic — documented.",
  },
  {
    n: "03",
    title: "Listing",
    copy: "Studio photography, cinematic detail work and editorial copy. Your car is presented the way it was engineered, not dumped in a grid.",
  },
  {
    n: "04",
    title: "Offer & handover",
    copy: "We vet every buyer, handle escrow and paperwork, and deliver the car. You receive funds the day the wire clears.",
  },
];

const REASONS = [
  { title: "Serious buyers only", copy: "Every enquiry is qualification-checked before it reaches you. No brokers, no curiosity." },
  { title: "Editorial presentation", copy: "Studio imagery and copywriting that sells the car — not the advertisement around it." },
  { title: "Market-anchored pricing", copy: "Valuations built on real comparables from our own completed sales, never lead-gen numbers." },
  { title: "Protected settlement", copy: "Escrow, title transfer and export documentation handled in-house, start to finish." },
];

interface FormState {
  brand: string;
  model: string;
  year: string;
  mileage: string;
  condition: string;
  price: string;
  description: string;
  name: string;
  email: string;
  phone: string;
}

const EMPTY_FORM: FormState = {
  brand: "",
  model: "",
  year: "",
  mileage: "",
  condition: "",
  price: "",
  description: "",
  name: "",
  email: "",
  phone: "",
};

export default function Sell() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [ref, setRef] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [photos, setPhotos] = useState<{ name: string; url: string }[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const urlsRef = useRef<string[]>([]);

  useSeo({
    title: "Sell Your Car — consignment with AUREV",
    description:
      "Represent your vehicle the way it deserves. Market-anchored valuations, studio presentation, vetted buyers and protected settlement.",
    path: "/sell",
  });

  useEffect(
    () => () => {
      urlsRef.current.forEach((u) => URL.revokeObjectURL(u));
    },
    []
  );

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    const next = Array.from(files).slice(0, 8).map((f) => {
      const url = URL.createObjectURL(f);
      urlsRef.current.push(url);
      return { name: f.name, url };
    });
    setPhotos((p) => [...p, ...next].slice(0, 8));
  };

  const removePhoto = (i: number) => setPhotos((p) => p.filter((_, idx) => idx !== i));

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.brand) e.brand = "Select a marque.";
    if (!form.model.trim()) e.model = "Model is required.";
    if (!/^(19|20)\d{2}$/.test(form.year)) e.year = "Four-digit year required.";
    if (!form.mileage || Number(form.mileage) < 0) e.mileage = "Mileage in km is required.";
    if (!form.condition) e.condition = "Select a condition grade.";
    if (!form.price || Number(form.price) < 1000) e.price = "Enter your asking price (USD).";
    if (!form.name.trim()) e.name = "Your name, please.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "A valid email is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    // mock submission — swap for POST /vehicles/sell-listings in the backend phase
    setTimeout(() => {
      setSubmitting(false);
      setRef(shortRef(form.name + form.model + form.year));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 900);
  };

  const hasErrors = useMemo(() => Object.values(errors).some(Boolean), [errors]);

  return (
    <div>
      {/* hero */}
      <section className="noise relative overflow-hidden border-b border-line">
        <div aria-hidden="true" className="absolute inset-0">
          <img src="/images/sell-inspection.jpg" alt="" className="size-full object-cover opacity-35 saturate-[0.7]" loading="eager" />
          <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.55),#050505_92%)]" />
        </div>
        <div className="relative mx-auto max-w-[1600px] container-px pb-20 pt-36 sm:pb-28 sm:pt-44">
          <Reveal>
            <p className="eyebrow">Consignment — Sell with AUREV</p>
            <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.2rem,5.6vw,4.4rem)] font-black uppercase leading-[0.98] tracking-[-0.035em]">
              Your car deserves
              <br />a better <span className="serif-accent font-normal normal-case">showroom.</span>
            </h1>
            <p className="mt-7 max-w-xl text-[15px] leading-relaxed text-mist/75">
              List privately, present perfectly, settle securely. AUREV sells a deliberately small
              number of cars per month — the ones we can represent properly.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <a href="#valuation-form" className="btn btn-primary">
                <span>Start a valuation</span>
              </a>
              <a href="#process" className="btn btn-ghost">
                <span>How it works</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* why choose aurev */}
      <section className="mx-auto max-w-[1600px] container-px py-24" aria-labelledby="why-sell">
        <SectionHeading
          eyebrow="Why sell with us"
          title={
            <>
              The difference is <span className="serif-accent">what we do next.</span>
            </>
          }
        />
        <div id="why-sell" className="mt-10 grid gap-x-16 gap-y-10 border-t border-line pt-10 sm:grid-cols-2">
          {REASONS.map(({ title, copy }, i) => (
            <Reveal key={title} delay={stagger(i, 70)}>
              <div>
                <p className="font-mono text-[9.5px] tracking-[0.26em] text-dim" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-display text-lg font-bold tracking-[-0.01em]">{title}</h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-ash">{copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* process */}
      <section id="process" className="border-y border-line bg-coal" aria-labelledby="process-h">
        <div className="mx-auto max-w-[1600px] container-px py-24">
          <div className="flex items-end justify-between gap-8">
            <h2 id="process-h" className="display-2">
              Four steps. <span className="serif-accent">No circus.</span>
            </h2>
            <p className="hidden max-w-sm pb-2 text-sm leading-relaxed text-ash md:block">
              The whole consignment usually runs two to four weeks — listing live the week after
              inspection, offer handling entirely on your terms.
            </p>
          </div>
          <ol className="mt-14 grid gap-10 md:grid-cols-2 xl:grid-cols-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={stagger(i, 110)} className="h-full">
                <li className="relative h-full border-t border-line pt-7">
                  <span aria-hidden="true" className="absolute -top-px left-0 h-px w-14 bg-crimson" />
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-crimson-bright">{s.n}</p>
                  <h3 className="mt-3 font-display text-xl font-extrabold uppercase">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ash">{s.copy}</p>
                </li>
              </Reveal>
            ))}
          </ol>

          {/* trust indicators */}
          <Reveal delay={160} className="mt-16 grid gap-10 border-t border-line pt-8 text-center sm:grid-cols-3">
            {[
              ["$210M+", "Vehicles sold since 2016"],
              ["48 h", "Valuation turnaround, guaranteed"],
              ["0.25%", "Of listed cars ever returned"],
            ].map(([n, label]) => (
              <div key={label}>
                <p className="font-display text-3xl font-black tracking-tight">{n}</p>
                <p className="mt-2 font-mono text-[9.5px] uppercase tracking-[0.22em] text-dim">{label}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* form */}
      <section id="valuation-form" className="mx-auto max-w-[1600px] container-px py-24" aria-labelledby="form-h">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="eyebrow">Valuation request</p>
            <h2 id="form-h" className="display-2 mt-5">
              Tell us what <span className="serif-accent">you drive.</span>
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ash">
              Sixty seconds now buys a real number in 48 hours. Photos optional at this stage —
              a few phone shots already make the valuation sharper.
            </p>
            <ul className="mt-10 space-y-4 border-t border-line pt-8">
              {[
                "No obligation and no listing fee — ever",
                "Discreet: your details are never syndicated",
                "We also broker private sales without listing",
              ].map((li) => (
                <li key={li} className="flex items-start gap-3 text-sm text-mist/80">
                  <IconCheck size={15} className="mt-0.5 shrink-0 text-crimson-bright" />
                  {li}
                </li>
              ))}
            </ul>
          </div>

          {ref ? (
            <Reveal className="border border-line px-6 py-12 text-center sm:px-12">
              <span className="grid size-14 place-items-center rounded-full border border-crimson/60 text-crimson-bright">
                <IconCheck size={24} />
              </span>
              <h3 className="display-3 mt-7">Valuation requested</h3>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-ash">
                Thank you, {form.name.split(" ")[0]}. Your{" "}
                <span className="text-mist">
                  {form.year} {form.brand} {form.model}
                </span>{" "}
                is queued for specialist review. Expect a market-anchored valuation at{" "}
                <span className="text-mist">{form.email}</span> within 48 hours.
              </p>
              <p className="mt-7 inline-flex items-center gap-3 border border-line-strong bg-[#101010] px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-dim">
                Reference <span className="text-crimson-bright">{ref}</span>
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <ButtonLink to="/concierge" variant="primary" size="sm" arrow>
                  Talk to concierge meanwhile
                </ButtonLink>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    setRef(null);
                    setForm(EMPTY_FORM);
                    setPhotos([]);
                  }}
                >
                  <span>List another car</span>
                </button>
              </div>
            </Reveal>
          ) : (
            <form onSubmit={submit} noValidate className="border border-line bg-[#0b0b0b] p-6 sm:p-10" aria-describedby={hasErrors ? "sell-form-error" : undefined}>
              <div className="grid gap-5 sm:grid-cols-2">
                <SelectField
                  label="Brand"
                  required
                  value={form.brand}
                  onChange={set("brand")}
                  error={errors.brand}
                  options={[{ value: "", label: "Select marque…" }, ...BRAND_NAMES.map((b) => ({ value: b, label: b }))]}
                />
                <TextField label="Model" required placeholder="e.g. 911 GT3" value={form.model} onChange={set("model")} error={errors.model} autoComplete="off" />
                <TextField label="Year" required inputMode="numeric" placeholder="2022" value={form.year} onChange={set("year")} error={errors.year} autoComplete="off" />
                <TextField
                  label="Mileage (km)"
                  required
                  inputMode="numeric"
                  placeholder={formatNumber(7_500)}
                  value={form.mileage}
                  onChange={set("mileage")}
                  error={errors.mileage}
                  autoComplete="off"
                />
                <SelectField
                  label="Condition"
                  required
                  value={form.condition}
                  onChange={set("condition")}
                  error={errors.condition}
                  options={[
                    { value: "", label: "Select grade…" },
                    { value: "concours", label: "Concours — 200+ point" },
                    { value: "excellent", label: "Excellent" },
                    { value: "good", label: "Good, driver-quality" },
                    { value: "project", label: "Project / restoration" },
                  ]}
                />
                <TextField
                  label="Asking price (USD)"
                  required
                  inputMode="numeric"
                  placeholder="250,000"
                  value={form.price}
                  onChange={set("price")}
                  error={errors.price}
                  autoComplete="off"
                />
              </div>

              <div className="mt-5">
                <TextArea
                  label="Describe the car"
                  rows={4}
                  placeholder="Specification, options, service history, ownership — anything a buyer should know."
                  value={form.description}
                  onChange={set("description")}
                />
              </div>

              {/* photos */}
              <div className="mt-7">
                <p className="field__label">Photos — optional</p>
                <div
                  role="button"
                  tabIndex={0}
                  aria-label="Add photos"
                  onClick={() => fileRef.current?.click()}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && fileRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    onFiles(e.dataTransfer.files);
                  }}
                  className="flex cursor-pointer flex-col items-center justify-center border border-dashed border-line-strong bg-[#0d0d0d] px-6 py-10 text-center transition-colors hover:border-crimson/60"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-ash">
                    Drop files or click to browse
                  </span>
                  <span className="mt-2 text-[11px] text-dim">Up to 8 images · stays on your device (demo)</span>
                  <input ref={fileRef} type="file" accept="image/*" multiple className="sr-only" onChange={(e) => onFiles(e.target.files)} />
                </div>
                {photos.length > 0 && (
                  <ul className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-8" aria-label="Attached photos">
                    {photos.map((p, i) => (
                      <li key={p.url} className="group relative aspect-square overflow-hidden border border-line">
                        <img src={p.url} alt={p.name} className="size-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removePhoto(i)}
                          aria-label={`Remove ${p.name}`}
                          className="absolute right-0.5 top-0.5 grid size-5 place-items-center bg-black/70 text-mist opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                        >
                          <IconClose size={10} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-8 grid gap-5 border-t border-line pt-8 sm:grid-cols-3">
                <TextField label="Full name" required value={form.name} onChange={set("name")} error={errors.name} autoComplete="name" />
                <TextField label="Email" type="email" required value={form.email} onChange={set("email")} error={errors.email} autoComplete="email" />
                <TextField label="Phone" type="tel" placeholder="Optional" value={form.phone} onChange={set("phone")} autoComplete="tel" />
              </div>

              {hasErrors && (
                <p id="sell-form-error" role="alert" className="mt-5 text-xs text-[#e0717f]">
                  A few fields need attention — check the highlights above.
                </p>
              )}

              <button type="submit" className="btn btn-primary mt-8 w-full" disabled={submitting}>
                <span>{submitting ? "Submitting…" : "Request my valuation"}</span>
              </button>
              <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-dim">
                Front-end demo — nothing leaves this browser
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
