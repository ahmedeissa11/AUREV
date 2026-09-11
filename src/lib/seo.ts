import { useEffect } from "react";

/* ------------------------------------------------------------------ */
/*  SEO — client-side document head management.                       */
/*  (When the backend phase lands, these can be promoted to SSG meta.)*/
/* ------------------------------------------------------------------ */

interface SeoInput {
  title: string;
  description?: string;
  /** path only — e.g. /vehicle/ferrari-sf90… */
  path?: string;
  /** append the brand suffix? default true */
  brandSuffix?: boolean;
  image?: string;
  /** JSON-LD block */
  jsonLd?: Record<string, unknown>;
}

function upsertMeta(selector: string, attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function useSeo({
  title,
  description = "AUREV — a curated marketplace of extraordinary automobiles. Verified supercars, grand tourers and performance vehicles, delivered by concierge.",
  path,
  brandSuffix = true,
  image = "/images/hero-night.jpg",
  jsonLd,
}: SeoInput) {
  useEffect(() => {
    const full = brandSuffix && !title.includes("AUREV") ? `${title} — AUREV` : title;
    document.title = full;
    upsertMeta('meta[name="description"]', "name", "description", description);
    upsertMeta('meta[property="og:title"]', "property", "og:title", full);
    upsertMeta('meta[property="og:description"]', "property", "og:description", description);
    upsertMeta('meta[property="og:image"]', "property", "og:image", image);
    if (path) {
      upsertMeta('meta[property="og:url"]', "property", "og:url", path);
      let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = path;
    }

    let scriptId = "aurev-jsonld";
    document.getElementById(scriptId)?.remove();
    if (jsonLd) {
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.id = scriptId;
      s.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(s);
    }
  }, [title, description, path, brandSuffix, image, jsonLd]);
}
