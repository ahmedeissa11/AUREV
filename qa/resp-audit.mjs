/*  resp-audit — 13 viewports × 11 routes responsive audit (overflow, clipping,
    touch targets, header collisions, hero/reel pacing). Run dev server first:
    LD_LIBRARY_PATH=... node qa/resp-audit.mjs  */
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import fs from "node:fs";
chromium.setGraphicsMode = false;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const VWS = [320, 360, 375, 390, 414, 430, 768, 820, 1024, 1280, 1440, 1536, 1920];
const ROUTES = ["/", "/collection", "/collection?q=gt3", "/vehicle/porsche-911-gt3-992", "/brands", "/wishlist", "/compare", "/sell", "/about", "/concierge", "/showroom"];
const browser = await puppeteer.launch({
  executablePath: await chromium.executablePath(), args: chromium.args, headless: "shell",
  defaultViewport: { width: 390, height: 844 },
  env: { ...process.env, LD_LIBRARY_PATH: process.env.LD_LIBRARY_PATH || "/tmp/libs/lib" },
});
const page = await browser.newPage();
const problems = [];
const req404 = new Set(); const errs = new Set();
page.on("response", (r) => { if (r.status() >= 400) req404.add(r.status() + " " + r.url().replace("http://localhost:5173", "")); });
page.on("pageerror", (e) => errs.add(String(e).slice(0, 120)));
page.on("requestfailed", (r) => errs.add("REQFAIL " + r.url().replace("http://localhost:5173", "")));
for (const vw of VWS) {
  const vh = vw < 700 ? Math.round(vw * 2.05) : vw < 1100 ? 950 : 900;
  await page.setViewport({ width: vw, height: vh, isMobile: vw < 700, hasTouch: vw < 700 });
  for (const route of ROUTES) {
    await page.goto("http://localhost:5173" + route, { waitUntil: "domcontentloaded" });
    await sleep(650);
    const res = await page.evaluate((vw) => {
      const out = { overflow: 0, clip: [], small: [], h1lines: 0, headerH: 0, headerHit: false, tall: [] };
      out.overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
      const inScrollX = (el) => { for (let p = el; p && p !== document.body; p = p.parentElement) { const cs = getComputedStyle(p); if (/auto|scroll|hidden/.test(cs.overflowX)) return true; } return false; };
      for (const el of document.querySelectorAll("body *")) {
        const r = el.getBoundingClientRect();
        if (r.width < 5 || r.height < 5) continue;
        const cs = getComputedStyle(el);
        if (cs.visibility === "hidden" || cs.display === "none" || +cs.opacity < 0.05) continue;
        if ((r.right > vw + 3 || r.left < -3) && !inScrollX(el))
          out.clip.push({ sel: (el.tagName + "." + (el.className?.toString().split(" ")[0] || "")).slice(0, 44), right: Math.round(r.right), left: Math.round(r.left), w: Math.round(r.width), pos: cs.position });
      }
      out.clip = out.clip.slice(0, 5);
      for (const el of document.querySelectorAll('a[href],button,input:not([type=hidden]),select,textarea,[role="button"]')) {
        const r = el.getBoundingClientRect();
        if (r.width <= 0 || r.height <= 0 || !el.offsetParent) continue;
        if (Math.min(r.width, r.height) < 38 && getComputedStyle(el).position === "static")
          out.small.push({ sel: (el.tagName + "." + (el.getAttribute("aria-label") || el.className?.toString().split(" ")[0] || el.innerText?.slice(0, 12) || "")).slice(0, 42), w: Math.round(r.width), h: Math.round(r.height) });
      }
      const seen = new Set();
      out.small = out.small.filter((s) => { const k = s.sel; if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 6);
      const h1 = document.querySelector("main h1, h1");
      if (h1) { const cs = getComputedStyle(h1); const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.25; out.h1lines = Math.round(h1.getBoundingClientRect().height / lh); out.h1px = Math.round(parseFloat(cs.fontSize)); }
      const hdr = document.querySelector("header");
      if (hdr) {
        out.headerH = Math.round(hdr.getBoundingClientRect().height);
        const kids = [...hdr.querySelectorAll("a,button")].map((k) => k.getBoundingClientRect()).filter((r) => r.width > 0);
        for (let i = 0; i < kids.length; i++) for (let j = i + 1; j < kids.length; j++) {
          const a = kids[i], b = kids[j];
          if (a.left < b.right - 2 && b.left < a.right - 2 && a.top < b.bottom - 2 && b.top < a.bottom - 2) out.headerHit = true;
        }
      }
      for (const sec of document.querySelectorAll("section, .reel__stage")) {
        const h = sec.offsetHeight;
        if (h > innerHeight * 7) out.tall.push((sec.className.split(" ")[0] || "section").slice(0, 26) + ":" + Math.round((h / innerHeight) * 10) / 10);
      }
      return out;
    }, vw);
    const tag = vw + "@" + route;
    if (res.overflow > 0) problems.push({ tag, type: "H-OVERFLOW", px: res.overflow });
    if (res.clip.length) problems.push({ tag, type: "CLIPPED", items: res.clip });
    if (res.small.length && vw < 800) problems.push({ tag, type: "SMALL-TARGETS", items: res.small });
    if (vw < 430 && res.h1lines > 5) problems.push({ tag, type: "H1-LINES", lines: res.h1lines, px: res.h1px });
    if (res.headerHit) problems.push({ tag, type: "HEADER-COLLISION", headerH: res.headerH });
    if (res.tall.length) problems.push({ tag, type: "EXCESSIVE-HEIGHT(x-vh)", items: res.tall });
  }
}
fs.writeFileSync("/home/user/AUREV/qa/audit-out.json", JSON.stringify({ problems, req404: [...req404], errs: [...errs] }, null, 1));
console.log("PROBLEMS:", problems.length, "| 404s:", req404.size, "| errors:", errs.size);
await browser.close();
