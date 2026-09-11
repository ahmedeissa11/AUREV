import type { SVGProps } from "react";

/* One icon set, one stroke language: 1.4px, square caps, currentColor. */

type P = SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 18, children, ...rest }: P) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const IconSearch = (p: P) => (
  <Base {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16 16l4.5 4.5" />
  </Base>
);

export const IconHeart = ({ filled, ...p }: P & { filled?: boolean }) => (
  <Base {...p}>
    <path
      d="M12 20.5s-7.5-4.7-7.5-10A4 4 0 0 1 12 8a4 4 0 0 1 7.5 2.5c0 5.3-7.5 10-7.5 10Z"
      fill={filled ? "currentColor" : "none"}
      strokeWidth={1.4}
    />
  </Base>
);

export const IconCompare = (p: P) => (
  <Base {...p}>
    <path d="M4 6h7M4 12h7M4 18h7M17 4v16M13.5 8l3.5-4 3.5 4" />
  </Base>
);

export const IconArrowRight = (p: P) => (
  <Base {...p}>
    <path d="M4 12h15m-5-6 6 6-6 6" />
  </Base>
);

export const IconArrowUpRight = (p: P) => (
  <Base {...p}>
    <path d="M7 17 17 7m-7 0h7v7" />
  </Base>
);

export const IconClose = (p: P) => (
  <Base {...p}>
    <path d="m5 5 14 14M19 5 5 19" />
  </Base>
);

export const IconMenu = (p: P) => (
  <Base {...p}>
    <path d="M4 7h16M4 12h16M4 17h10" />
  </Base>
);

export const IconExpand = (p: P) => (
  <Base {...p}>
    <path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" />
  </Base>
);

export const IconChevronLeft = (p: P) => (
  <Base {...p}>
    <path d="m14.5 5-7 7 7 7" />
  </Base>
);

export const IconChevronRight = (p: P) => (
  <Base {...p}>
    <path d="m9.5 5 7 7-7 7" />
  </Base>
);

export const IconCheck = (p: P) => (
  <Base {...p}>
    <path d="m4.5 12.5 5 5 10-11" />
  </Base>
);

export const IconShield = (p: P) => (
  <Base {...p}>
    <path d="M12 3.5 4.8 6v5.2c0 5 3.1 8.2 7.2 9.8 4.1-1.6 7.2-4.8 7.2-9.8V6Z" />
    <path d="m8.8 12 2.2 2.2 4.2-4.4" />
  </Base>
);

export const IconDiamond = (p: P) => (
  <Base {...p}>
    <path d="M7 3.5h10L20.5 9 12 20.5 3.5 9Z" />
    <path d="M3.5 9h17M7 3.5 12 9l-5 11.5M17 3.5 12 9l5 11.5" />
  </Base>
);

export const IconLock = (p: P) => (
  <Base {...p}>
    <rect x="5" y="10.5" width="14" height="9.5" />
    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
  </Base>
);

export const IconConcierge = (p: P) => (
  <Base {...p}>
    <path d="M3.5 17.5h17M5.5 17.5a6.5 6.5 0 0 1 13 0M12 7v3.5M12 4.5v.5M6.5 20.5h11" />
  </Base>
);

export const IconGauge = (p: P) => (
  <Base {...p}>
    <path d="M4 17a8 8 0 1 1 16 0" />
    <path d="m14.5 9.5-2.8 4.2" />
    <path d="M2.5 17h3M18.5 17h3" />
  </Base>
);

export const IconCalendar = (p: P) => (
  <Base {...p}>
    <rect x="4" y="5.5" width="16" height="15" />
    <path d="M4 10.5h16M8 3.5v4M16 3.5v4" />
  </Base>
);

export const IconPhone = (p: P) => (
  <Base {...p}>
    <path d="M5 4h4l1.5 4.5L8 10c1 2.5 3.5 5 6 6l1.5-2.5L20 15v4a1.5 1.5 0 0 1-1.7 1.5C10.6 19.7 4.3 13.4 3.5 5.7A1.5 1.5 0 0 1 5 4Z" />
  </Base>
);

export const IconMail = (p: P) => (
  <Base {...p}>
    <rect x="3" y="5" width="18" height="14" />
    <path d="m3 6 9 7 9-7" />
  </Base>
);

export const IconPin = (p: P) => (
  <Base {...p}>
    <path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </Base>
);

export const IconPlus = (p: P) => (
  <Base {...p}>
    <path d="M12 5v14M5 12h14" />
  </Base>
);

export const IconMinus = (p: P) => (
  <Base {...p}>
    <path d="M5 12h14" />
  </Base>
);

export const IconSliders = (p: P) => (
  <Base {...p}>
    <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
    <circle cx="15.5" cy="7" r="2.2" />
    <circle cx="7.5" cy="17" r="2.2" />
  </Base>
);

export const IconTrash = (p: P) => (
  <Base {...p}>
    <path d="M5 7h14M9 7V4.5h6V7M6.5 7l1 13h9l1-13M10.5 10.5v6M13.5 10.5v6" />
  </Base>
);

export const IconInstagram = (p: P) => (
  <Base {...p}>
    <rect x="4" y="4" width="16" height="16" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17" cy="7" r="0.9" fill="currentColor" stroke="none" />
  </Base>
);

export const IconYoutube = (p: P) => (
  <Base {...p}>
    <rect x="3" y="6" width="18" height="12" />
    <path d="m10.5 9.5 5 2.5-5 2.5Z" fill="currentColor" stroke="none" />
  </Base>
);

export const IconX = (p: P) => (
  <Base {...p}>
    <path d="M4.5 4.5 19 19M19 4.5 4.5 19" strokeWidth={2.2} />
  </Base>
);

export const IconLinkedin = (p: P) => (
  <Base {...p}>
    <rect x="4" y="4" width="16" height="16" />
    <path d="M8 11v6M8 8v.01M12 17v-3.5A1.8 1.8 0 0 1 15.6 13v4" />
  </Base>
);
