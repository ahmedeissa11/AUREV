import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useLibrary } from "../state/LibraryContext";
import { useScrolled } from "../lib/hooks";
import { Logo } from "../components/ui/Logo";
import { ButtonLink } from "../components/ui/Button";
import { IconHeart, IconMenu, IconSearch } from "../components/ui/icons";
import SearchOverlay from "./SearchOverlay";
import MobileMenu from "./MobileMenu";

const NAV = [
  { to: "/collection", label: "Collection" },
  { to: "/brands", label: "Brands" },
  { to: "/sell", label: "Sell Your Car" },
  { to: "/about", label: "About" },
  { to: "/concierge", label: "Concierge" },
];

export default function Header() {
  const scrolled = useScrolled(32);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { wishlist, compare } = useLibrary();
  const location = useLocation();

  /* close transient layers on navigation */
  useEffect(() => {
    setSearchOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  /* "/" opens search — a small editor's-key courtesy */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
      if (e.key === "/" && !typing && !searchOpen) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-500 ${
          scrolled || menuOpen
            ? "border-line bg-[#060606]"
            : "border-transparent bg-gradient-to-b from-[rgba(5,5,5,0.55)] to-transparent"
        }`}
      >
        <div
          className={`container-px mx-auto flex max-w-[1600px] items-center justify-between transition-[height] duration-500 ${
            scrolled ? "h-[64px]" : "h-[76px] sm:h-[88px]"
          }`}
        >
          <Logo compact={scrolled} />

          <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-link ${isActive ? "" : ""}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search vehicles"
              className="grid size-10 place-items-center text-ash transition-colors hover:text-mist"
            >
              <IconSearch size={17} />
            </button>

            <Link
              to="/wishlist"
              aria-label={`Wishlist — ${wishlist.length} vehicle${wishlist.length === 1 ? "" : "s"}`}
              className="relative grid size-10 place-items-center text-ash transition-colors hover:text-mist"
            >
              <IconHeart size={17} filled={wishlist.length > 0} />
              {wishlist.length > 0 && (
                <span className="absolute right-0.5 top-1 font-mono text-[9px] font-bold leading-none text-crimson-bright">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {compare.length > 0 && (
              <Link
                to="/compare"
                className="hidden font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-crimson-bright transition-colors hover:text-mist sm:inline-flex sm:items-center sm:gap-2"
                aria-label={`Compare ${compare.length} vehicles`}
              >
                <span className="inline-block size-[5px] bg-crimson" aria-hidden="true" />
                Compare · {String(compare.length).padStart(2, "0")}
              </Link>
            )}

            <div className="hidden md:block">
              <ButtonLink to="/sell" variant="primary" size="sm" arrow={false}>
                Sell Your Car
              </ButtonLink>
            </div>

            <button
              type="button"
              className="grid size-10 place-items-center text-mist lg:hidden"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <IconMenu size={20} />
            </button>
          </div>
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} nav={NAV} />
    </>
  );
}
