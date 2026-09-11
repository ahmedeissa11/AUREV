import { Link } from "react-router-dom";

/* Wordmark lockup — pure type, no image. The trailing crimson dot is the brand tick. */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      to="/"
      aria-label="AUREV — home"
      className="group inline-flex flex-col leading-none"
      data-logo
    >
      <span
        className={`relative block font-display font-black uppercase tracking-[0.3em] text-mist ${
          compact ? "text-lg" : "text-xl sm:text-2xl"
        }`}
      >
        AUREV
        <span
          aria-hidden="true"
          className="absolute -right-[0.22em] top-[0.28em] size-[5px] bg-crimson transition-transform duration-500 group-hover:scale-150"
        />
      </span>
      {!compact && (
        <span className="mt-1.5 font-mono text-[0.5625rem] tracking-[0.42em] text-ash transition-colors duration-500 group-hover:text-mist">
          LUXURY AUTOMOTIVE
        </span>
      )}
    </Link>
  );
}
