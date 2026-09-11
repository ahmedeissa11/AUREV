import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { useLocalStorage } from "../lib/hooks";

/* ------------------------------------------------------------------ */
/*  Library — wishlist & compare state, persisted in localStorage.    */
/*  Frontend-only today; the same context will hydrate from the       */
/*  user's account once the backend phase exists.                     */
/* ------------------------------------------------------------------ */

export const MAX_COMPARE = 3;

interface LibraryState {
  wishlist: string[];
  compare: string[];
  isFavorite: (id: string) => boolean;
  isCompared: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  toggleCompare: (id: string) => boolean | "full";
  removeFavorite: (id: string) => void;
  removeCompare: (id: string) => void;
  clearCompare: () => void;
}

const LibraryContext = createContext<LibraryState | null>(null);

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useLocalStorage<string[]>("aurev:wishlist:v1", []);
  const [compare, setCompare] = useLocalStorage<string[]>("aurev:compare:v1", []);

  const toggleFavorite = useCallback(
    (id: string) => {
      setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    },
    [setWishlist]
  );

  const removeFavorite = useCallback(
    (id: string) => setWishlist((prev) => prev.filter((x) => x !== id)),
    [setWishlist]
  );

  const toggleCompare = useCallback(
    (id: string): boolean | "full" => {
      let outcome: boolean | "full" = false;
      setCompare((prev) => {
        if (prev.includes(id)) {
          outcome = false;
          return prev.filter((x) => x !== id);
        }
        if (prev.length >= MAX_COMPARE) {
          outcome = "full";
          return prev;
        }
        outcome = true;
        return [...prev, id];
      });
      return outcome;
    },
    [setCompare]
  );

  const removeCompare = useCallback(
    (id: string) => setCompare((prev) => prev.filter((x) => x !== id)),
    [setCompare]
  );

  const clearCompare = useCallback(() => setCompare([]), [setCompare]);

  const value = useMemo<LibraryState>(
    () => ({
      wishlist,
      compare,
      isFavorite: (id) => wishlist.includes(id),
      isCompared: (id) => compare.includes(id),
      toggleFavorite,
      toggleCompare,
      removeFavorite,
      removeCompare,
      clearCompare,
    }),
    [wishlist, compare, toggleFavorite, toggleCompare, removeFavorite, removeCompare, clearCompare]
  );

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary(): LibraryState {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibrary must be used inside <LibraryProvider>");
  return ctx;
}
