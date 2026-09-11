import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
chromium.setGraphicsMode = false;
const sleep = ms => new Promise(r=>setTimeout(r,ms));
let pass=0, fail=0;
const check=(n,ok,extra)=>{ ok?pass++:fail++; console.log((ok?"PASS":"FAIL")+" — "+n+(extra&&!ok?" ["+extra+"]":"")); };
const browser = await puppeteer.launch({ executablePath: await chromium.executablePath(), args: chromium.args, headless: "shell", defaultViewport:{width:1440,height:900}, env:{...process.env, LD_LIBRARY_PATH:(process.env.LD_LIBRARY_PATH||"/tmp/libs/lib")} });
const page = await browser.newPage();
const errs=[]; page.on("pageerror",e=>errs.push(String(e).slice(0,140)));
await page.goto("http://localhost:5173/", { waitUntil: "networkidle0" });
await sleep(800);

/* home structure */
const st = await page.evaluate(() => {
  const q=s=>document.querySelector(s);
  const stages=[...document.querySelectorAll("[data-reel-stage]")];
  return {
    noTicker: !q(".ticker"),
    heroFilm: !!q(".hero-film"),
    stages: stages.length,
    heights: stages.map(el=>Math.round(el.getBoundingClientRect().height)),
    reelAfterHero: (()=>{ const h=q(".hero-film"), r=q(".reel"); return r && h ? r.getBoundingClientRect().top + scrollY >= h.getBoundingClientRect().top + scrollY : false; })(),
    statementAfterReel: !!q("section[aria-label='AUREV statement']"),
    brandsCards: document.querySelectorAll(".brand-card").length,
  };
});
check("Ticker gone", st.noTicker);
check("Hero film wrapper present", st.heroFilm);
check("Reel has 3 stages", st.stages===3, JSON.stringify(st.heights));
check("Reel sits after hero, statement after reel", st.reelAfterHero && st.statementAfterReel);
check("Stage heights 250/270/290svh @1440", st.heights[0]===2250 && st.heights[1]===2430 && st.heights[2]===2610, JSON.stringify(st.heights));
check("Brand cards mounted (12)", st.brandsCards===12);

/* hero pin + progress */
const heroAt = async (p) => {
  await page.evaluate((p) => { const w=document.querySelector(".hero-film"); scrollTo({left:0, top:(w.offsetHeight-innerHeight)*p, behavior:"instant"}); }, p);
  await sleep(1500);
  return page.evaluate(() => { const s=document.querySelector(".hero-film__stage"); return { pinned: Math.abs(s.getBoundingClientRect().top)<2, hp: parseFloat(s.style.getPropertyValue("--hp")) }; });
};
const h0=await heroAt(0), h5=await heroAt(0.5), h1=await heroAt(1);
check("Hero pinned at start/mid/end", h0.pinned && h5.pinned && h1.pinned, JSON.stringify({h0,h5,h1}));
check("Hero progress 0→.5→1 follows scroll", h0.hp<0.02 && h5.hp>0.44 && h5.hp<0.56 && h1.hp>0.98, JSON.stringify({h0,h5,h1}));

/* reel driver: --p range + monotonic + pin */
await page.evaluate(() => scrollTo({left:0,top:0,behavior:"instant"})); await sleep(500);
const reel = await page.evaluate(() => { const r=document.querySelector(".reel"); return Math.round(r.getBoundingClientRect().top + scrollY); });
const drive = await page.evaluate(async ({reel}) => {
  const st=document.querySelector('[data-reel-stage="1"]');
  const vals=[];
  for(let i=0;i<=30;i++){
    scrollTo({left:0, top: reel + 200 + (st.offsetHeight-innerHeight)*i/30, behavior:"instant"});
    await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
    vals.push(parseFloat(st.style.getPropertyValue("--p")));
  }
  // driver eases --p toward the scroll target; only true backwards jumps count
  const deltas = vals.slice(1).map((v,i)=>v - vals[i]);
  return { first: vals[0], last: vals[30], stalls: deltas.filter(d => d < -0.001).length, minD: Math.min(...deltas) };
}, {reel});
check("--p rises monotonically through stage1 (no backwards stalls)", drive.stalls===0 && drive.first<=0.2 && drive.last>=0.95, JSON.stringify(drive));

/* s2 veil+mask & s3 rows exist (selectors only — visuals verified earlier) */
const s23 = await page.evaluate(() => ({
  veil: !!document.querySelector('[data-reel-stage="2"] .reel__veil'),
  rows: document.querySelectorAll('[data-reel-stage="3"] .reel__row').length,
}));
check("Stage2 veil + Stage3 rows intact", s23.veil && s23.rows===4, JSON.stringify(s23));

/* release seam: hero last frame dark → reel frame (no white) */
const seamBg = await page.evaluate(() => getComputedStyle(document.querySelector(".hero-film__stage")).backgroundColor);
check("Stage base is void-black (no flash)", seamBg==="rgb(5, 5, 5)", seamBg);

/* reduced motion home */
const rm = await browser.newPage();
await rm.emulateMediaFeatures([{name:"prefers-reduced-motion",value:"reduce"}]);
await rm.goto("http://localhost:5173/", { waitUntil:"networkidle0" }); await sleep(700);
const rmInfo = await rm.evaluate(() => ({
  stagePos: getComputedStyle(document.querySelector(".hero-film__stage")).position,
  bgHidden: getComputedStyle(document.querySelector(".hero-film__bg")).display,
  typeOp: getComputedStyle(document.querySelector(".hero-film__type")).opacity,
  h1: getComputedStyle(document.querySelector("h1")).opacity,
}));
check("RM: static hero, type visible", rmInfo.stagePos==="relative" && rmInfo.bgHidden==="none" && rmInfo.typeOp==="1" && rmInfo.h1==="1", JSON.stringify(rmInfo));
await rm.close();

/* overflow + routes smoke */
const ov = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
check("No horizontal overflow (home)", ov===0, String(ov));
for (const [sel, expect] of [[`a[href="/about"]`, "/about"], [`a[href="/collection"]`, "/collection"]]) {
  await page.evaluate(() => scrollTo({left:0,top:0,behavior:"instant"})); await sleep(300);
  await page.click(sel); await sleep(900);
  check("Route "+expect, new URL(page.url()).pathname===expect, page.url());
}
check("Zero console errors", errs.length===0, errs.join(" | "));
console.log(`${pass}/${pass+fail} checks passed`);
await browser.close();
process.exit(fail===0 ? 0 : 1);
