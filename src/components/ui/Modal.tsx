import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import { useModalBehaviour, useScrollLock } from "../../lib/hooks";
import { IconClose } from "./icons";

/* ------------------------------------------------------------------ */
/*  Modal & Drawer — shared focus-trapped overlay behaviour.          */
/* ------------------------------------------------------------------ */

interface OverlayProps {
  open: boolean;
  onClose: () => void;
  labelledBy?: string;
  children: ReactNode;
  className?: string;
}

function Overlay({ open, onClose, labelledBy, children, className, side }: OverlayProps & { side?: "left" | "right" }) {
  useScrollLock(open);
  const ref = useModalBehaviour<HTMLDivElement>(open, onClose);
  if (!open) return null;
  return createPortal(
    <div
      className={`overlay ${
        side ? (side === "right" ? "items-stretch justify-end" : "items-stretch") : "items-center justify-center"
      } ${className ?? ""}`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={
          side
            ? `drawer drawer--${side} panel h-full max-w-[26rem] outline-none`
            : "panel outline-none"
        }
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

export function Modal({ children, ...rest }: OverlayProps) {
  return <Overlay {...rest}>{children}</Overlay>;
}

export function Drawer({ children, side = "left", ...rest }: OverlayProps & { side?: "left" | "right" }) {
  return (
    <Overlay side={side} {...rest}>
      {children}
    </Overlay>
  );
}

export function CloseButton({ onClick, label = "Close" }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid size-9 place-items-center border border-line text-ash transition hover:border-crimson hover:text-mist"
    >
      <IconClose size={14} />
    </button>
  );
}
