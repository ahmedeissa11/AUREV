import { useState } from "react";
import { useLibrary } from "../../state/LibraryContext";
import { IconHeart } from "../ui/icons";

/* ------------------------------------------------------------------ */
/*  Save / Compare — flat type actions, not buttons. The interface     */
/*  whispers; the car speaks.                                          */
/* ------------------------------------------------------------------ */

const base =
  "-my-3 inline-flex items-center gap-1.5 py-3 font-mono text-[9.5px] font-bold uppercase tracking-[0.18em] transition-colors duration-300";
const off = "text-dim hover:text-mist";
const on = "text-crimson-bright";

export function FavoriteButton({ id, compact = false }: { id: string; compact?: boolean }) {
  const { isFavorite, toggleFavorite } = useLibrary();
  const [pop, setPop] = useState(false);
  const fav = isFavorite(id);

  return (
    <button
      type="button"
      aria-pressed={fav}
      aria-label={fav ? "Remove from wishlist" : "Save to wishlist"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(id);
        if (!fav) {
          setPop(true);
          setTimeout(() => setPop(false), 400);
        }
      }}
      className={`${base} ${fav ? on : off} ${pop ? "heart-pop" : ""} ${compact ? "" : ""}`}
    >
      <IconHeart size={13} filled={fav} />
      {fav ? "Saved" : "Save"}
    </button>
  );
}

export function CompareButton({ id, flashLabel = "max 3" }: { id: string; flashLabel?: string }) {
  const { isCompared, toggleCompare } = useLibrary();
  const [flash, setFlash] = useState(false);
  const active = isCompared(id);

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? "Remove from comparison" : "Add to comparison"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const r = toggleCompare(id);
        if (r === "full") {
          setFlash(true);
          setTimeout(() => setFlash(false), 1400);
        }
      }}
      className={`${base} ${active ? on : off}`}
    >
      {flash ? <span className="text-[#c98892]">{flashLabel}</span> : active ? "Added" : "Compare"}
      <span aria-hidden="true" className={`inline-block size-[5px] ${active ? "bg-crimson" : "bg-[#3d3d3a]"}`} />
    </button>
  );
}
