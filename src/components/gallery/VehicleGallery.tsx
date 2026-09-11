import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { VehicleImage } from "../../data/types";
import { useModalBehaviour, useScrollLock } from "../../lib/hooks";
import {
  IconChevronLeft,
  IconChevronRight,
  IconClose,
  IconExpand,
} from "../ui/icons";

/* ------------------------------------------------------------------ */
/*  VehicleGallery — stage + labelled thumbnails + fullscreen viewer.  */
/*  Keyboard (←/→/Esc) and swipe supported; crossfade transitions.     */
/* ------------------------------------------------------------------ */

export default function VehicleGallery({ images, alt }: { images: VehicleImage[]; alt: string }) {
  const [index, setIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const step = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i + dir + images.length) % images.length),
    [images.length]
  );

  useEffect(() => {
    if (fullscreen) return; // lightbox owns its own keys
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, fullscreen]);

  return (
    <div>
      <div className="relative">
        <div className="gallery-stage group/gallery aspect-[16/10] w-full">
          {images.map((img, i) => (
            <img
              key={img.src}
              src={img.src}
              alt={i === index ? `${alt} — ${img.label}` : ""}
              aria-hidden={i === index ? undefined : true}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
              className={i === index ? "is-active" : ""}
            />
          ))}

          {images.length > 1 && (
            <>
              <GalleryNav side="left" onClick={() => step(-1)} />
              <GalleryNav side="right" onClick={() => step(1)} />
            </>
          )}

          <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
            <span className="bg-void/80 px-2.5 py-1.5 font-mono text-[10px] tracking-[0.18em] text-mist/80">
              {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => setFullscreen(true)}
              aria-label="Open fullscreen viewer"
              className="grid size-11 place-items-center bg-void/80 text-mist/70 transition-colors hover:bg-void hover:text-crimson-bright lg:size-8"
            >
              <IconExpand size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* thumbnails */}
      <div className="mt-3 flex gap-3" role="tablist" aria-label="Vehicle views">
        {images.map((img, i) => (
          <button
            key={img.src}
            role="tab"
            type="button"
            aria-selected={i === index}
            aria-current={i === index}
            aria-label={`Show ${img.label}`}
            onClick={() => setIndex(i)}
            className="thumb-btn w-24 sm:w-28"
          >
            <img src={img.src} alt="" loading="lazy" />
            <span className="mt-1 block truncate text-left font-mono text-[8.5px] uppercase tracking-[0.14em] text-ash">
              {img.label}
            </span>
          </button>
        ))}
      </div>

      <Lightbox
        open={fullscreen}
        images={images}
        index={index}
        onClose={() => setFullscreen(false)}
        onStep={step}
      />
    </div>
  );
}

function GalleryNav({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous view" : "Next view"}
      className={`absolute top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center bg-void/70 text-mist/80 transition-all duration-300 hover:bg-void hover:text-crimson-bright ${
        side === "left" ? "left-3 opacity-0 group-hover/gallery:opacity-100 focus-visible:opacity-100" : "right-3 opacity-0 group-hover/gallery:opacity-100 focus-visible:opacity-100"
      }`}
    >
      {side === "left" ? <IconChevronLeft size={16} /> : <IconChevronRight size={16} />}
    </button>
  );
}

/* fullscreen viewer */
function Lightbox({
  open,
  images,
  index,
  onClose,
  onStep,
}: {
  open: boolean;
  images: VehicleImage[];
  index: number;
  onClose: () => void;
  onStep: (dir: 1 | -1) => void;
}) {
  useScrollLock(open);
  const ref = useModalBehaviour<HTMLDivElement>(open, onClose);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") onStep(-1);
      if (e.key === "ArrowRight") onStep(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onStep]);

  if (!open) return null;

  return createPortal(
    <div
      className="overlay items-center justify-center !bg-[#030303f7]"
      role="dialog"
      aria-modal="true"
      aria-label="Vehicle viewer"
      ref={ref}
      tabIndex={-1}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 48) onStep(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <button
        type="button"
        aria-label="Close viewer"
        onClick={onClose}
        className="absolute right-5 top-5 z-10 grid size-11 place-items-center border border-white/15 text-mist/70 transition hover:border-crimson hover:text-mist"
      >
        <IconClose size={16} />
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous"
            onClick={() => onStep(-1)}
            className="absolute left-3 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center border border-white/15 text-mist/70 transition hover:border-crimson hover:text-mist sm:left-6"
          >
            <IconChevronLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => onStep(1)}
            className="absolute right-3 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center border border-white/15 text-mist/70 transition hover:border-crimson hover:text-mist sm:right-6"
          >
            <IconChevronRight size={18} />
          </button>
        </>
      )}

      <figure className="flex h-full max-h-dvh w-full flex-col items-center justify-center p-4 sm:p-10">
        <img
          key={images[index].src}
          src={images[index].src}
          alt={images[index].alt}
          className="max-h-[78dvh] w-auto max-w-full object-contain"
        />
        <figcaption className="mt-5 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.24em] text-ash">
          <span className="text-crimson-bright">
            {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
          </span>
          {images[index].label}
        </figcaption>
      </figure>
    </div>,
    document.body
  );
}
