/**
 * 전 라우트를 1440·390 폭으로 열어 전체 캡처를 남기고 가로 넘침을 잰다.
 * 사용: qa-shots.mjs <주소> <출력 폴더>
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const [base, outDir] = process.argv.slice(2);
const ROUTES = [["home", "/"], ["docs", "/docs"], ["changelog", "/changelog"], ["roadmap", "/roadmap"], ["feedback", "/feedback"]];
const WIDTHS = [[1440, 900], [390, 844]];
const LEFTOVER = /CLI Manager|solhun\.com\/pricing|agent-swap|YourProject|your-package|TODO|Lorem|Get started|Quick start|\bAll\b|Post Feedback|In Progress|Planned/;

mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
let problems = 0;
for (const [width, height] of WIDTHS) {
  const context = await browser.newContext({ viewport: { width, height } });
  for (const [name, path] of ROUTES) {
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(base + path, { waitUntil: "networkidle" });
    // 영상·지연 로딩이 뜨도록 한 번 끝까지 내렸다 올린다
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(500);
    const m = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      text: document.body.innerText,
      videos: [...document.querySelectorAll("video")].map((v) => ({ src: v.currentSrc || v.src, ready: v.readyState, w: v.videoWidth })),
      brokenImages: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src),
      wide: [...document.querySelectorAll("body *")].filter((el) => el.getBoundingClientRect().right > document.documentElement.clientWidth + 1 && getComputedStyle(el).position !== "fixed").slice(0, 3).map((el) => el.tagName + "." + String(el.className).slice(0, 50)),
    }));
    const hit = m.text.match(LEFTOVER)?.[0] ?? null;
    const bad = m.overflow > 0 || hit || m.brokenImages.length || errors.length || m.videos.some((v) => v.w === 0);
    if (bad) problems++;
    console.log(`${width} ${name}: 넘침=${m.overflow} 잔재=${hit} 깨진그림=${m.brokenImages.length} 오류=${errors.length} 영상=${m.videos.filter((v) => v.w > 0).length}/${m.videos.length}${m.wide.length ? " 넓은요소=" + m.wide.join(",") : ""}${errors.length ? " " + errors[0] : ""}`);
    await page.screenshot({ path: join(outDir, `${name}-${width}.png`), fullPage: true });
    await page.close();
  }
  await context.close();
}
await browser.close();
console.log(`문제 ${problems}건`);
process.exit(problems ? 1 : 0);
