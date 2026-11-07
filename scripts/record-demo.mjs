/**
 * 헤드리스 녹화 + screenstudio-alt 이벤트 로그.
 *
 * 시나리오는 밖에서 준다 — 이 파일은 "어떻게 찍나"만 알고 "무엇을 찍나"는 모른다.
 */
import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

export async function record({ url, outDir, width = 1280, height = 800, scenario }) {
  mkdirSync(outDir, { recursive: true });

  const events = [];
  let t0 = 0;
  const now = () => (Date.now() - t0) / 1000;
  const ev = (o) => events.push(o);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width, height },
    // 영상 크기 = 뷰포트. 어긋나면 polish.py 의 좌표 스케일이 1이 아니게 되고
    // 확대가 클릭 지점에서 빗나간다.
    recordVideo: { dir: outDir, size: { width, height } },
  });
  const page = await context.newPage();

  let cur = { x: width / 2, y: height / 2 };

  /** 사람처럼: ease-in-out 가속·감속 + 먼 거리에서 살짝 지나쳤다 되돌아오기. */
  async function moveTo(to, { ms = 700 } = {}) {
    const steps = Math.max(12, Math.round(ms / 16));
    const dist = Math.hypot(to.x - cur.x, to.y - cur.y);
    const os = dist > 220 ? Math.min(28, dist * 0.06) : 0;
    const ang = Math.atan2(to.y - cur.y, to.x - cur.x);
    const peak = { x: to.x + Math.cos(ang) * os, y: to.y + Math.sin(ang) * os };
    const from = cur;

    for (let i = 1; i <= steps; i++) {
      const p = i / steps;
      const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      const x = from.x + (peak.x - from.x) * e;
      const y = from.y + (peak.y - from.y) * e;
      await page.mouse.move(x, y);
      ev({ type: "move", t: now(), x: Math.round(x), y: Math.round(y) });
      await page.waitForTimeout(ms / steps);
    }
    if (os > 0) {
      for (let i = 1; i <= 8; i++) {
        const p = i / 8;
        const x = peak.x + (to.x - peak.x) * p;
        const y = peak.y + (to.y - peak.y) * p;
        await page.mouse.move(x, y);
        ev({ type: "move", t: now(), x: Math.round(x), y: Math.round(y) });
        await page.waitForTimeout(14);
      }
    }
    cur = to;
  }

  async function box(selector) {
    const b = await page.locator(selector).first().boundingBox();
    if (!b) throw new Error(`요소를 못 찾았다: ${selector}`);
    return {
      point: { x: Math.round(b.x + b.width / 2), y: Math.round(b.y + b.height / 2) },
      bbox: [b.x, b.y, b.width, b.height].map(Math.round),
    };
  }

  /** 시나리오가 쓰는 도구들. 여기 없는 건 `page` 로 직접 한다. */
  const api = {
    page,
    /** 요소로 이동해서 클릭. bbox 를 같이 남겨 polish.py 가 점이 아니라 요소를 잡게 한다. */
    async click(selector, { pause = 900 } = {}) {
      const t = await box(selector);
      await moveTo(t.point);
      await page.mouse.down();
      ev({ type: "down", t: now(), x: t.point.x, y: t.point.y, bbox: t.bbox });
      await page.mouse.up();
      await page.waitForTimeout(pause);
    },
    /** 한 글자씩 친다. 각 글자를 key 이벤트로 남겨야 키스트로크 칩이 뜬다. */
    async type(selector, text, { cps = 14, pause = 600 } = {}) {
      const t = await box(selector);
      await moveTo(t.point);
      await page.mouse.down();
      ev({ type: "down", t: now(), x: t.point.x, y: t.point.y, bbox: t.bbox });
      await page.mouse.up();
      await page.waitForTimeout(300);
      for (const ch of text) {
        await page.keyboard.type(ch);
        ev({ type: "key", t: now(), key: ch, bbox: t.bbox });
        // 사람 타이핑은 등간격이 아니다. ±40% 흔든다.
        await page.waitForTimeout((1000 / cps) * (0.6 + Math.random() * 0.8));
      }
      await page.waitForTimeout(pause);
    },
    /**
     * 좌표에서 좌표로 끌기. 캔버스 앱(Figma·Excalidraw)에서 도형을 그리는 동작이다.
     *
     * 캔버스 안쪽은 DOM 요소가 없어서 셀렉터로 못 집는다. 그런데 `page.mouse` 를
     * 직접 쓰면 그림은 그려지는데 **이벤트가 안 남아** 후처리가 그 구간을 못 본다 —
     * 커서도 안 그려지고 확대도 안 걸린다. 영상은 멀쩡히 나와서 눈치채기 어렵다.
     * 그래서 끌기도 반드시 이 헬퍼로 한다.
     */
    async drag(from, to, { steps = 22, pause = 800 } = {}) {
      await moveTo(from);
      await page.mouse.down();
      ev({ type: "down", t: now(), x: from.x, y: from.y });
      for (let i = 1; i <= steps; i++) {
        const p = i / steps;
        const x = Math.round(from.x + (to.x - from.x) * p);
        const y = Math.round(from.y + (to.y - from.y) * p);
        await page.mouse.move(x, y);
        ev({ type: "move", t: now(), x, y });
        await page.waitForTimeout(16);
      }
      await page.mouse.up();
      ev({ type: "down", t: now(), x: to.x, y: to.y }); // 끝점에도 확대가 걸리게
      cur = to;
      await page.waitForTimeout(pause);
    },
    /** 단축키. 캔버스 앱은 도구 전환을 대부분 키로 한다. */
    async key(k, { pause = 500 } = {}) {
      await page.keyboard.press(k);
      ev({ type: "key", t: now(), key: k });
      await page.waitForTimeout(pause);
    },
    async scroll(dy, { pause = 1400 } = {}) {
      await page.evaluate((d) => window.scrollBy({ top: d, behavior: "smooth" }), dy);
      await page.waitForTimeout(pause);
    },
    async wait(ms) {
      await page.waitForTimeout(ms);
    },
  };

  t0 = Date.now();
  ev({ type: "header", display: { w: width, h: height } });

  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await page.mouse.move(cur.x, cur.y);
  ev({ type: "move", t: now(), x: cur.x, y: cur.y });
  await page.waitForTimeout(500);

  await scenario(api);
  await page.waitForTimeout(700);

  const seconds = now();
  await context.close(); // 이 시점에 영상 파일이 확정된다
  await browser.close();

  writeFileSync(
    join(outDir, "demo.events.jsonl"),
    events.map((e) => JSON.stringify(e)).join("\n") + "\n",
  );

  const clicks = events.filter((e) => e.type === "down").length;
  const keys = events.filter((e) => e.type === "key").length;
  console.log(`이벤트 ${events.length}건 (클릭 ${clicks} · 키 ${keys}) · ${seconds.toFixed(1)}초`);
  return { events: events.length, clicks, keys, seconds };
}
