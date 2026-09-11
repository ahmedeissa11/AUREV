import {
  createElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

/* ------------------------------------------------------------------ */
/*  Reveal — the house scroll animation.                              */
/*  IntersectionObserver flips `.is-in`; all easing lives in CSS.     */
/*  Reduced motion is respected both in CSS and here (observer-free). */
/* ------------------------------------------------------------------ */

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** stagger delay in ms */
  delay?: number;
  variant?: "up" | "left" | "right" | "scale" | "fade";
  as?: ElementType;
  style?: CSSProperties;
  id?: string;
}

export function Reveal({
  children,
  className = "",
  delay = 0,
  variant = "up",
  as = "div",
  style,
  id,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      typeof IntersectionObserver === "undefined" ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return createElement(
    as,
    {
      ref,
      id,
      className: `reveal reveal--${variant} ${inView ? "is-in" : ""} ${className}`.trim(),
      style: { ["--d" as string]: `${delay}ms`, ...style } as CSSProperties,
    },
    children
  );
}

/** shorthand for staggered groups: <RevealGroup>…<Reveal delay={i*90}> */
export function stagger(index: number, step = 90): number {
  return index * step;
}
