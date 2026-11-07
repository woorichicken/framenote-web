/**
 * 운영 주소 점검: 영상 재생과 실제 제보 1건.
 *
 * 왜 스크립트인가: 「버튼이 보인다」는 「제보가 도착한다」의 증거가 아니고,
 * 「src 가 있다」는 「영상이 돈다」의 증거가 아니다. 둘 다 실제 동작으로 잰다.
 *
 * 사용: ops-check.mjs <주소> <제보 코멘트>
 */
import { chromium } from "playwright";

const [base, comment] = process.argv.slice(2);
const PLAY_WAIT_MS = 1500;
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
const ingest = [];
page.on("response", (res) => {
  if (res.url().includes("dp-agentation-ingest")) ingest.push(`${res.request().method()} ${res.status()}`);
});

await page.goto(base, { waitUntil: "networkidle" });

// 영상이 실제로 진행하는가 — 자리만 있는 게 아니라 currentTime 이 움직여야 한다
const videos = await page.locator("video").count();
for (let i = 0; i < videos; i++) {
  const video = page.locator("video").nth(i);
  await video.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const before = await video.evaluate((v) => { v.muted = true; void v.play(); return v.currentTime; });
  await page.waitForTimeout(PLAY_WAIT_MS);
  const after = await video.evaluate((v) => ({ t: v.currentTime, w: v.videoWidth, d: v.duration, src: v.currentSrc.split("/").pop(), paused: v.paused }));
  console.log(`영상 ${after.src}: ${after.w}px ${after.d.toFixed(1)}초 ${before.toFixed(2)}→${after.t.toFixed(2)} ${after.t !== before ? "재생됨" : "멈춤"}`);
}

// 실제 제보 — 플로팅 버튼 → 화면 전체로 보내기 → 코멘트 → 보내기
await page.evaluate(() => window.scrollTo(0, 0));
const floating = page.getByRole("button", { name: /피드백/ }).last();
await floating.waitFor({ timeout: 15000 });
await floating.click();
await page.waitForTimeout(600);
await page.getByRole("button", { name: /화면 전체로/ }).click();
const box = page.getByPlaceholder("무엇이 불편했는지 알려주세요");
await box.waitFor({ timeout: 15000 });
await box.fill(comment);
await page.waitForTimeout(1500); // 스크린샷 캡처가 끝나기를 기다린다
const send = page.getByRole("button", { name: /^보내기$|제보 보내기/ }).last();
await send.click();
await page.getByText(/보냈습니다/).first().waitFor({ timeout: 30000 });
await page.waitForTimeout(1500);
console.log(`제보 화면: 보냈습니다 · 수집 요청 ${ingest.join(", ") || "없음"}`);
await browser.close();
