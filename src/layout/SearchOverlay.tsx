import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { VEHICLES } from "../data/vehicles";
import { useModalBehaviour, useScrollLock } from "../lib/hooks";
import { formatMileage, formatPrice } from "../lib/format";

/* ------------------------------------------------------------------ */
/*  Global search — expands from the nav, instant results, keyboard.  */
/* ------------------------------------------------------------------ */

export default function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  useScrollLock(open);
  const panelRef = useModalBehaviour<HTMLDivElement>(open, onClose);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return VEHICLES.filter((v) =>
      `${v.brand} ${v.model} ${v.variant ?? ""} ${v.year} ${v.bodyType}`
        .toLowerCase()
        .includes(term)
    ).slice(0, 6);
  }, [q]);

  useEffect(() => {
    setCursor(0);
  }, [q]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
    setQ("");
  }, [open]);

  if (!open) return null;

  const go = (id: string) => {
    onClose();
    navigate(`/vehicle/${id}`);
  };

  return createPortal(
    <div
      className="overlay items-start justify-center !bg-[rgba(4,4,4,0.9)] pt-[10vh]"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search AUREV collection"
        className="panel w-[min(92vw,42rem)] outline-none"
      >
        <div className="flex items-center gap-3 border-b border-line px-5 py-4">
          <span className="label-mono shrink-0">Search</span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setCursor((c) => Math.min(results.length - 1, c + 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setCursor((c) => Math.max(0, c - 1));
              } else if (e.key === "Enter") {
                if (results[cursor]) go(results[cursor].id);
                else if (q.trim()) {
                  onClose();
                  navigate(`/collection?q=${encodeURIComponent(q.trim())}`);
                }
              }
            }}
            placeholder="Ferrari… GT3… shooting brake…"
            className="w-full border-0 bg-transparent text-lg outline-none placeholder:text-dim"
            aria-label="Search query"
            autoComplete="off"
          />
          <kbd className="hidden shrink-0 border border-line px-1.5 py-0.5 font-mono text-[10px] text-dim sm:block">
            ESC
          </kbd>
        </div>

        <div className="max-h-[50vh] overflow-y-auto">
          {q.trim() === "" && (
            <p className="px-5 py-6 font-mono text-[11px] uppercase tracking-[0.18em] text-dim">
              Type to search {VEHICLES.length} vehicles · Press Enter to see all results
            </p>
          )}
          {q.trim() !== "" && results.length === 0 && (
            <p className="px-5 py-8 text-center text-sm text-ash">
              Nothing matches{" "}
              <span className="text-mist">“{q}”</span>. Try a brand or model.
            </p>
          )}
          <ul role="listbox" aria-label="Vehicle results">
            {results.map((v, i) => (
              <li key={v.id} role="option" aria-selected={i === cursor}>
                <button
                  type="button"
                  onMouseEnter={() => setCursor(i)}
                  onClick={() => go(v.id)}
                  className={`flex w-full items-center gap-4 px-4 py-3 text-left transition-colors ${
                    i === cursor ? "bg-[#161616]" : ""
                  }`}
                >
                  <img
                    src={v.images[0].src}
                    alt=""
                    loading="lazy"
                    className="size-12 shrink-0 object-cover"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold tracking-wide text-mist">
                      {v.year} {v.brand} {v.model}
                    </span>
                    <span className="block truncate font-mono text-[10px] uppercase tracking-[0.14em] text-dim">
                      {v.engine} · {formatMileage(v.mileage)}
                    </span>
                  </span>
                  <span className="shrink-0 font-mono text-xs text-ash">{formatPrice(v.price)}</span>
                </button>
              </li>
            ))}
          </ul>
          {results.length > 0 && (
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate(`/collection?q=${encodeURIComponent(q.trim())}`);
              }}
              className="w-full border-t border-line px-5 py-3.5 text-left font-mono text-[11px] uppercase tracking-[0.18em] text-crimson-bright transition-colors hover:bg-[#151515] hover:text-mist"
            >
              View all results in collection →
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
