import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
chromium.setGraphicsMode = false;
const sleep = ms => new Promise(r=>setTimeout(r,ms));
const browser = await puppeteer.launch({ executablePath: await chromium.executablePath(), args: chromium.args, headless: "shell", defaultViewport:{width:1440,height:900}, env:{...process.env, LD_LIBRARY_PATH:(process.env.LD_LIBRARY_PATH||"/tmp/libs/lib")} });
const page = await browser.newPage();
const errs=[]; page.on("pageerror",e=>errs.push(String(e).slice(0,140)));
await page.goto("http://localhost:5173/", { waitUntil: "networkidle0" });
await sleep(700);
const geo = await page.evaluate(() => { const w=document.querySelector(".hero-film"); return { wrapH: w.offsetHeight, vh: innerHeight }; });
const stateAt = async (p) => {
  await page.evaluate(({wrapH, vh, p}) => scrollTo({left:0, top:(wrapH - vh) * p, behavior:"instant"}), { ...geo, p });
  let prev = -1;
  for (let i = 0; i < 40; i++) {
    await sleep(150);
    const cur = await page.evaluate(() => parseFloat(document.querySelector(".hero-film__stage").style.getPropertyValue("--hp")));
    if (i > 1 && Math.abs(cur - prev) < 0.0005) break;
    prev = cur;
  }
  return page.evaluate(() => {
    const stage=document.querySelector(".hero-film__stage");
    const fg=getComputedStyle(document.querySelector(".hero-film__fg"));
    const bg=getComputedStyle(document.querySelector(".hero-film__bg"));
    const ty=getComputedStyle(document.querySelector(".hero-film__type"));
    const st=stage.getBoundingClientRect();
    return { hp: parseFloat(stage.style.getPropertyValue("--hp")), pinned: Math.abs(st.top) < 1.5,
      fgT: fg.transform.slice(0,46), bgT: bg.transform.slice(0,46),
      tyOp: +(+ty.opacity).toFixed(2), spent: stage.classList.contains("is-spent"), pe: ty.pointerEvents };
  });
};
const s0 = await stateAt(0);
const s25 = await stateAt(0.25);
const s50 = await stateAt(0.5);
const s100 = await stateAt(1);
const s25r = await stateAt(0.25);
const videos = await page.evaluate(() => document.querySelectorAll("video,[autoplay]").length);
const seam = await page.evaluate(() => { const img=document.querySelector(".hero-film__fg img"); return { src: img.currentSrc.split("/").pop(), nat: img.naturalWidth+"x"+img.naturalHeight, sameSrcBg: document.querySelector(".hero-film__bg img").src===img.src }; });
await page.evaluate(({wrapH,vh}) => scrollTo({left:0, top:(wrapH-vh)*0.42, behavior:"instant"}), geo); await sleep(600);
await page.screenshot({ path: "qa-shots/hero-film-mid.png" });
await page.evaluate(() => scrollTo({left:0, top:0, behavior:"instant"})); await sleep(600);
const ovD = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
await page.screenshot({ path: "qa-shots/hero-film-rest.png" });
const rm = await browser.newPage();
await rm.emulateMediaFeatures([{name:"prefers-reduced-motion",value:"reduce"}]);
await rm.goto("http://localhost:5173/", { waitUntil:"networkidle0" });
await sleep(600);
const rmInfo = await rm.evaluate(() => {
  const st=document.querySelector(".hero-film__stage");
  return { h: document.querySelector(".hero-film").offsetHeight, mode: getComputedStyle(st).position,
    bgHidden: getComputedStyle(document.querySelector(".hero-film__bg")).display,
    typeOp: getComputedStyle(document.querySelector(".hero-film__type")).opacity,
    hp: st.style.getPropertyValue("--hp") || "0" };
});
const mbp = await browser.newPage();
await mbp.setViewport({width:390,height:844});
await mbp.goto("http://localhost:5173/", { waitUntil:"networkidle0" });
await sleep(600);
const mbGeo = await mbp.evaluate(() => ({ h: document.querySelector(".hero-film").offsetHeight, vh: innerHeight }));
await mbp.evaluate(({h,vh}) => scrollTo({left:0, top:(h-vh)*0.5, behavior:"instant"}), mbGeo);
await sleep(700);
const mbInfo = await mbp.evaluate(() => ({ ov: document.documentElement.scrollWidth - innerWidth, pinned: Math.abs(document.querySelector(".hero-film__stage").getBoundingClientRect().top) < 1.5, hp: parseFloat(document.querySelector(".hero-film__stage").style.getPropertyValue("--hp")) }));
await mbp.screenshot({ path: "qa-shots/hero-film-mobile.png" });
console.log(JSON.stringify({ geo, s0, s25, s50, s100, s25r, videos, seam, ovD, rmInfo, mbGeo, mbInfo, errs }, null, 1));
await browser.close();
const ok = geo.wrapH>=1100 && s0.pinned && s0.hp<0.02 && s25.hp>0.18 && s25.hp<0.32 && s50.hp>0.43 && s50.hp<0.57 && s100.hp>0.985 && s100.spent && s100.pe==="none" && s0.tyOp>0.95 && s50.tyOp<0.6 && s100.tyOp<0.02 && s25r.hp>0.18 && s25r.hp<0.32 && s50.fgT!==s0.fgT && s50.bgT!==s0.bgT && videos===0 && seam.sameSrcBg && ovD===0 && mbInfo.ov===0 && mbInfo.pinned && rmInfo.mode==="relative" && rmInfo.bgHidden==="none" && rmInfo.typeOp==="1" && errs.length===0;
console.log(ok?"PASS":"FAIL"); process.exit(ok?0:1);
