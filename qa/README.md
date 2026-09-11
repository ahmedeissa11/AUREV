# Headless QA harness

Self-contained browser checks (Chromium via @sparticuz/chromium + puppeteer-core — no downloads
needed, uses the shared node_modules):

    npm i -D puppeteer-core @sparticuz/chromium   # (already in devDependencies if present)
    node qa/home-regression.mjs                   # 16 checks: hero film pin/progress, reel driver,
                                                  # brands cards, routing, RM, overflow, console
    node qa/hero-film.spec.mjs                    # scroll→time mapping 0/25/50/100%, rewind,
                                                  # spent/disarm, seam identity, RM static, mobile

Scripts expect a dev server on http://localhost:5173.
