import { createPortal } from "react-dom";
import { NavLink, Link } from "react-router-dom";
import { useModalBehaviour, useScrollLock } from "../lib/hooks";
import { IconClose, IconArrowRight, IconPhone, IconMail } from "../components/ui/icons";
import { Logo } from "../components/ui/Logo";

/* ------------------------------------------------------------------ */
/*  Mobile menu — designed, not collapsed: full-bleed editorial list. */
/* ------------------------------------------------------------------ */

interface NavItem {
  to: string;
  label: string;
}

export default function MobileMenu({
  open,
  onClose,
  nav,
}: {
  open: boolean;
  onClose: () => void;
  nav: NavItem[];
}) {
  useScrollLock(open);
  const ref = useModalBehaviour<HTMLDivElement>(open, onClose);
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[95] flex flex-col bg-void">
      <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label="Menu" className="relative flex h-full flex-col outline-none">
        <div className="flex items-center justify-between border-b border-line container-px h-16 shrink-0">
          <Logo compact />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="grid size-10 place-items-center border border-line text-mist transition hover:border-crimson"
          >
            <IconClose size={16} />
          </button>
        </div>

        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 container-px">
          <ul className="divide-y divide-line border-b border-line">
            {nav.map((item, i) => (
              <li
                key={item.to}
                style={{ animationDelay: `${90 + i * 70}ms` }}
                className="menu-stagger"
              >
                <NavLink
                  to={item.to}
                  onClick={onClose}
                  className="group flex items-baseline justify-between py-4"
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`font-display text-3xl font-bold tracking-[-0.02em] transition-colors ${
                          isActive ? "text-crimson-bright" : "text-mist group-hover:text-crimson-bright"
                        }`}
                      >
                        {item.label}
                      </span>
                      <span className="flex items-center gap-3">
                        <span className="font-mono text-[10px] text-dim">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <IconArrowRight size={16} className="text-dim transition-all duration-300 group-hover:translate-x-1 group-hover:text-crimson" />
                      </span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="menu-stagger mt-8 flex gap-3" style={{ animationDelay: "480ms" }}>
            <Link
              to="/wishlist"
              onClick={onClose}
              className="chip flex-1 justify-center py-3"
            >
              Wishlist
            </Link>
            <Link
              to="/compare"
              onClick={onClose}
              className="chip flex-1 justify-center py-3"
            >
              Compare
            </Link>
          </div>
        </nav>

        <div className="shrink-0 border-t border-line px-5 py-6 container-px">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-dim">Concierge — 24/7</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-ash">
            <a href="tel:+37797001234" className="flex items-center gap-3 transition-colors hover:text-mist">
              <IconPhone size={15} className="text-crimson" /> +377 97 00 12 34
            </a>
            <a href="mailto:concierge@aurev.com" className="flex items-center gap-3 transition-colors hover:text-mist">
              <IconMail size={15} className="text-crimson" /> concierge@aurev.com
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
