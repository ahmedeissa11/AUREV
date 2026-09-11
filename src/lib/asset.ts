/* ------------------------------------------------------------------ */
/*  asset() — deployment-path helper.                                  */
/*  Public assets are referenced absolutely ("/images/…") so they are  */
/*  routed through Vite's BASE_URL: '/' in dev, '/AUREV/' on GitHub    */
/*  Pages. Zero visual impact — pure path plumbing for deployment.     */
/* ------------------------------------------------------------------ */
export function asset(path: string): string {
  const base = import.meta.env.BASE_URL || "/";
  return base + path.replace(/^\/+/, "");
}
