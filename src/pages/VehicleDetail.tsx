import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import type { Vehicle } from "../data/types";
import { fetchSimilar, fetchVehicle } from "../data/api";
import {
  formatAccel,
  formatHp,
  formatMileage,
  formatPrice,
  formatSpeed,
  formatTorque,
  shortRef,
} from "../lib/format";
import { useSeo } from "../lib/seo";
import { Reveal } from "../lib/motion";
import VehicleGallery from "../components/gallery/VehicleGallery";
import CarCard, { StatusMark } from "../components/cars/CarCard";
import { FavoriteButton, CompareButton } from "../components/cars/ActionButtons";
import { ButtonLink } from "../components/ui/Button";
import { Modal, CloseButton } from "../components/ui/Modal";
import { TextField, TextArea } from "../components/ui/Field";
import { PageSkeleton } from "../components/ui/Skeleton";
import { IconCheck, IconChevronLeft, IconPin } from "../components/ui/icons";

/* ------------------------------------------------------------------ */
/*  Vehicle detail — the digital showroom: gallery, data, theatre.     */
/* ------------------------------------------------------------------ */

export default function VehicleDetail() {
  const { id = "" } = useParams();
  const [vehicle, setVehicle] = useState<Vehicle | null | undefined>(undefined);

  useEffect(() => {
    let done = false;
    setVehicle(undefined);
    fetchVehicle(id).then((v) => !done && setVehicle(v));
    return () => {
      done = true;
    };
  }, [id]);

  if (vehicle === undefined) return <PageSkeleton />;
  if (vehicle === null) return <NotFoundVehicle />;
  return <DetailContent key={vehicle.id} vehicle={vehicle} />;
}

function NotFoundVehicle() {
  return (
    <div className="mx-auto flex min-h-[70dvh] max-w-2xl flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-crimson-bright">404</p>
      <h1 className="display-2 mt-4">This one already found its garage</h1>
      <p className="mt-4 text-sm text-ash">
        The vehicle you're looking for is not in the current collection — or never was.
      </p>
      <ButtonLink to="/collection" variant="primary" arrow className="mt-8">
        Back to the collection
      </ButtonLink>
    </div>
  );
}

function DetailContent({ vehicle: v }: { vehicle: Vehicle }) {
  const [similar, setSimilar] = useState<Vehicle[]>([]);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  useEffect(() => {
    let done = false;
    fetchSimilar(v.id, 3).then((s) => !done && setSimilar(s));
    return () => {
      done = true;
    };
  }, [v.id]);

  const title = `${v.year} ${v.brand} ${v.model}${v.variant ? ` ${v.variant}` : ""}`;

  useSeo({
    title: `${title} — ${formatPrice(v.price)}`,
    description: `${v.description.slice(0, 150)}…`,
    path: `/vehicle/${v.id}`,
    image: v.images[0].src,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Car",
      name: title,
      brand: { "@type": "Brand", name: v.brand },
      model: v.model,
      vehicleModelDate: String(v.year),
      mileageFromOdometer: { "@type": "QuantitativeValue", value: v.mileage, unitCode: "KMT" },
      vehicleEngine: {
        "@type": "EngineSpecification",
        name: v.engine,
        enginePower: { "@type": "QuantitativeValue", value: v.horsepower, unitCode: "HP" },
      },
      offers: {
        "@type": "Offer",
        price: String(v.price),
        priceCurrency: "USD",
        availability: v.status === "available" ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
      },
    },
  });

  return (
    <div className="mx-auto max-w-[1600px] container-px pb-24 pt-24 sm:pt-28">
      {/* breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
        <Link to="/" className="transition-colors hover:text-mist">Home</Link>
        <span aria-hidden="true" className="h-px w-6 bg-line-strong" />
        <Link to="/collection" className="flex items-center gap-1.5 transition-colors hover:text-mist">
          <IconChevronLeft size={12} /> Collection
        </Link>
        <span aria-hidden="true" className="h-px w-6 bg-line-strong" />
        <span className="truncate text-ash">{v.brand} {v.model}</span>
      </nav>

      <div className="grid gap-10 xl:grid-cols-[minmax(0,1.55fr)_minmax(21rem,1fr)] xl:gap-14">
        <Reveal variant="fade">
          <VehicleGallery images={v.images} alt={title} />
        </Reveal>

        <div>
          <Reveal>
            <div className="flex flex-wrap items-center gap-6">
              <StatusMark status={v.status} />
              {v.badge && (
                <span className="font-mono text-[9.5px] uppercase tracking-[0.26em] text-crimson-bright">{v.badge}</span>
              )}
            </div>
            <h1 className="mt-5 font-display text-[clamp(1.9rem,3.4vw,2.7rem)] font-black uppercase leading-[1.0] tracking-[-0.03em]">
              {v.brand} {v.model}
            </h1>
            <p className="mt-1.5 font-display text-lg font-bold tracking-[0.01em] text-ash">
              {v.variant} · {v.year}
            </p>
            <p className="mt-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
              <IconPin size={13} className="text-crimson" /> {v.location}
            </p>

            <div className="mt-8 border-t-2 border-mist/80 pt-5">
              <p className="font-mono text-[9.5px] uppercase tracking-[0.3em] text-dim">Asking price</p>
              <p className="mt-1.5 font-display text-[2.6rem] font-black leading-none tracking-[-0.03em] text-mist">
                {formatPrice(v.price)}
              </p>
              <p className="mt-3 max-w-xs text-[12px] leading-relaxed text-dim">
                Includes AUREV certification file and export paperwork. Trade-in and escrow
                settlement handled in-house.
              </p>
              <div className="mt-6 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => setInquiryOpen(true)}
                  disabled={v.status === "reserved"}
                  className="btn btn-primary btn-sm w-full disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span>{v.status === "reserved" ? "Currently Reserved" : "Request Information"}</span>
                </button>
                <ButtonLink
                  to="/concierge"
                  state={{ vehicle: v.id, kind: "viewing" }}
                  variant="ghost"
                  size="sm"
                  arrow={false}
                >
                  Schedule Viewing
                </ButtonLink>
              </div>
              <div className="mt-5 flex items-center gap-6 border-t border-line pt-4">
                <FavoriteButton id={v.id} />
                <CompareButton id={v.id} />
              </div>
            </div>
          </Reveal>

          <Reveal delay={100} className="mt-9">
            <dl className="grid grid-cols-2 gap-x-8 border-t border-line pt-1">
              {[
                ["Year", String(v.year)],
                ["Mileage", formatMileage(v.mileage)],
                ["Transmission", v.transmission],
                ["Drivetrain", v.drivetrain],
                ["Fuel", v.fuel],
                ["Body", v.bodyType],
              ].map(([k, val]) => (
                <div key={k} className="spec-row">
                  <dt>{k}</dt>
                  <dd>{val}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={150} className="mt-10">
            <p className="eyebrow">Performance</p>
            <div className="mt-5 space-y-5" aria-label="Performance figures">
              <PerfLine label="0–100 km/h" display={formatAccel(v.acceleration)} pct={((4.5 - v.acceleration) / (4.5 - 2.3)) * 100} />
              <PerfLine label="Top speed" display={formatSpeed(v.topSpeed)} pct={((v.topSpeed - 240) / (345 - 240)) * 100} />
              <PerfLine label="Power" display={formatHp(v.horsepower)} pct={(v.horsepower / 1000) * 100} />
              <PerfLine label="Torque" display={formatTorque(v.torque)} pct={(v.torque / 1100) * 100} />
            </div>
          </Reveal>
        </div>
      </div>

      {/* specs + colours + description */}
      <div className="mt-20 grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <Reveal>
          <section aria-labelledby="specs-h">
            <h2 id="specs-h" className="font-display text-2xl font-bold uppercase tracking-[-0.02em]">
              Technical specification
            </h2>
            <dl className="mt-6">
              {[
                ["Engine", v.engine],
                ["Power", formatHp(v.horsepower)],
                ["Torque", formatTorque(v.torque)],
                ["Acceleration (0–100 km/h)", `${v.acceleration.toFixed(1)} s`],
                ["Top speed", formatSpeed(v.topSpeed)],
                ["Transmission", v.transmission],
                ["Drivetrain", v.drivetrain],
                ["Fuel", v.fuel],
                ["Body type", v.bodyType],
                ["Year", String(v.year)],
                ["Mileage", formatMileage(v.mileage)],
              ].map(([k, val]) => (
                <div key={k} className="spec-row">
                  <dt>{k}</dt>
                  <dd>{val}</dd>
                </div>
              ))}
            </dl>
          </section>
        </Reveal>

        <Reveal delay={120}>
          <div className="space-y-10">
            <div className="grid gap-4 sm:grid-cols-2">
              <ColorCard label="Exterior" name={v.exteriorColor} swatch={v.exteriorHex} />
              <ColorCard label="Interior" name={v.interiorColor} />
            </div>
            <section aria-labelledby="desc-h">
              <h2 id="desc-h" className="font-display text-2xl font-bold uppercase tracking-[-0.02em]">
                Description
              </h2>
              <p className="mt-5 text-[15px] leading-relaxed text-ash">{v.description}</p>
              <figure className="mt-7 border-l border-crimson/70 pl-6">
                <figcaption className="font-mono text-[9.5px] uppercase tracking-[0.3em] text-dim">
                  Curator's note — AUREV {v.location}
                </figcaption>
                <blockquote className="mt-3 font-accent text-[1.35rem] italic leading-snug text-mist">
                  “{v.curatorNote}”
                </blockquote>
              </figure>
            </section>
          </div>
        </Reveal>
      </div>

      {/* equipment */}
      <Reveal className="mt-20">
        <section aria-labelledby="feat-h" className="sm:p-2">
          <div className="flex items-end justify-between gap-6 border-b border-line pb-4">
            <h2 id="feat-h" className="font-display text-2xl font-bold tracking-[-0.02em] uppercase">
              Equipment
            </h2>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
              {String(v.features.length).padStart(2, "0")} options on file
            </p>
          </div>
          <ul className="mt-8 grid gap-x-10 sm:grid-cols-2">
            {v.features.map((ft) => (
              <li key={ft} className="flex items-start gap-3 border-b border-line/60 py-3.5 text-sm text-ash">
                <IconCheck size={14} className="mt-0.5 shrink-0 text-crimson-bright" />
                {ft}
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      {/* similar */}
      {similar.length > 0 && (
        <Reveal className="mt-20">
          <section aria-labelledby="sim-h">
            <div className="flex items-end justify-between">
              <h2 id="sim-h" className="display-3">
                You may also <span className="serif-accent font-normal">consider</span>
              </h2>
              <Link to="/collection" className="btn-line hidden !text-[10px] sm:inline-flex">
                Full collection
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-3">
              {similar.map((s, i) => (
                <Reveal key={s.id} delay={i * 90} className="h-full">
                  <CarCard vehicle={s} hideActions />
                </Reveal>
              ))}
            </div>
          </section>
        </Reveal>
      )}

      <InquiryModal open={inquiryOpen} vehicle={v} onClose={() => setInquiryOpen(false)} />
    </div>
  );
}

/* ------------------------------------------------------------------ */

function PerfLine({ label, display, pct }: { label: string; display: string; pct: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const clamped = Math.max(8, Math.min(100, pct));
  return (
    <div ref={ref} className={`perf-bar ${inView ? "is-in" : ""}`}>
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-dim">{label}</span>
        <span className="font-mono text-[11px] text-mist">{display}</span>
      </div>
      <div className="mt-2 h-0.5 w-full bg-line">
        <div className="perf-bar__fill" style={{ ["--w" as string]: `${clamped}%` }} />
      </div>
    </div>
  );
}

function ColorCard({ label, name, swatch }: { label: string; name: string; swatch?: string }) {
  return (
    <div className="border-t border-line pt-4">
      <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-dim">{label}</p>
      <div className="mt-2.5 flex items-center gap-3.5">
        {swatch && (
          <span
            aria-hidden="true"
            className="size-6 shrink-0 border border-white/20"
            style={{ background: swatch }}
          />
        )}
        <p className="text-sm font-semibold leading-snug text-mist">{name}</p>
      </div>
    </div>
  );
}

function InquiryModal({ open, vehicle, onClose }: { open: boolean; vehicle: Vehicle; onClose: () => void }) {
  const [sent, setSent] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => setSent(null), 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Name and a valid email are required.");
      return;
    }
    setError(null);
    setSent(shortRef(vehicle.id + name));
  };

  return (
    <Modal open={open} onClose={onClose} labelledBy="inq-title">
      <div className="w-[min(92vw,30rem)] p-7">
        {sent ? (
          <div className="py-6 text-center">
            <p className="flex items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-crimson-bright">
              <IconCheck size={16} /> Sent
            </p>
            <h2 id="inq-title" className="mt-4 font-display text-xl font-bold uppercase">
              Request received
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ash">
              A specialist will respond about the {vehicle.brand} {vehicle.model} within one
              business day. Reference{" "}
              <span className="font-mono text-mist">{sent}</span>.
            </p>
            <button type="button" onClick={onClose} className="btn btn-ghost btn-sm mt-7 w-full">
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="font-mono text-[9.5px] uppercase tracking-[0.3em] text-dim">Inquire</p>
                <h2 id="inq-title" className="mt-2 font-display text-xl font-extrabold uppercase leading-tight">
                  {vehicle.brand} {vehicle.model}
                </h2>
              </div>
              <CloseButton onClick={onClose} />
            </div>
            <form onSubmit={submit} noValidate className="mt-6 space-y-4">
              <TextField label="Full name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="A. Owner" autoComplete="name" />
              <TextField label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" autoComplete="email" />
              <TextArea
                label="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`I'd like to know more about the ${vehicle.model}…`}
                rows={4}
              />
              {error && (
                <p role="alert" className="text-xs text-[#e0717f]">
                  {error}
                </p>
              )}
              <button type="submit" className="btn btn-primary w-full">
                <span>Send request</span>
              </button>
              <p className="text-center font-mono text-[9px] uppercase tracking-[0.2em] text-dim">
                Private demo · no obligation · answered in person
              </p>
            </form>
          </>
        )}
      </div>
    </Modal>
  );
}
