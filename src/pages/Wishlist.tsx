import { useMemo } from "react";
import { Link } from "react-router-dom";
import { VEHICLES } from "../data/vehicles";
import { useLibrary } from "../state/LibraryContext";
import { useSeo } from "../lib/seo";
import CarCard from "../components/cars/CarCard";
import { ButtonLink } from "../components/ui/Button";

/* ------------------------------------------------------------------ */
/*  Wishlist — saved garage. A list, not a hero.                        */
/* ------------------------------------------------------------------ */

export default function Wishlist() {
  const { wishlist, compare, toggleCompare } = useLibrary();
  const saved = useMemo(() => VEHICLES.filter((v) => wishlist.includes(v.id)), [wishlist]);

  useSeo({
    title: `Wishlist${saved.length ? ` — ${saved.length} saved` : ""}`,
    description: "Your saved vehicles at AUREV.",
    path: "/wishlist",
  });

  const addTopToCompare = () => {
    saved.slice(0, 3).forEach((v) => {
      if (!compare.includes(v.id)) toggleCompare(v.id);
    });
  };

  return (
    <div className="mx-auto max-w-[1600px] container-px pb-28 pt-28 sm:pt-36">
      <header className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-8">
        <div>
          <p className="eyebrow">Saved on this device</p>
          <h1 className="mt-4 font-display text-[clamp(1.9rem,3.6vw,2.9rem)] font-black uppercase tracking-[-0.03em]">
            Your Garage
          </h1>
        </div>
        {saved.length > 0 && (
          <div className="flex items-center gap-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-dim">
              {String(saved.length).padStart(2, "0")} vehicles
            </p>
            <button type="button" onClick={addTopToCompare} className="btn-line !text-[10px]">
              Compare the first three
            </button>
          </div>
        )}
      </header>

      {saved.length === 0 ? (
        <div className="mx-auto max-w-xl py-24 text-center sm:py-32">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-crimson-bright">Empty</p>
          <h2 className="mt-5 font-display text-[clamp(1.5rem,2.6vw,2.1rem)] font-bold tracking-[-0.02em]">
            Nothing saved yet
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-ash">
            Tap “save” on any vehicle to keep it here. The list stays on this device — ready
            whenever you are.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <ButtonLink to="/collection" variant="primary" arrow>
              Browse the collection
            </ButtonLink>
            <Link to="/brands" className="btn btn-ghost">
              <span>View brands</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2">
          {saved.map((v) => (
            <CarCard key={v.id} vehicle={v} />
          ))}
        </div>
      )}
    </div>
  );
}
