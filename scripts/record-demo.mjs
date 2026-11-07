/**
 * 헤드리스 녹화 + screenstudio-alt 이벤트 로그.
 *
 * 시나리오는 밖에서 준다 — 이 파일은 "어떻게 찍나"만 알고 "무엇을 찍나"는 모른다.
 */
import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

/**
 * 화면에 있는 조작 가능한 이름을 뽑는다. 시나리오를 쓰기 전에 이걸 먼저 본다 —
 * **추측하면 그 단계를 조용히 건너뛴다.**
 */
export async function listTargets(page, limit = 40) {
  return page.evaluate((n) => {
    const out = [];
    const sel = 'button, a[href], input, textarea, select, [role="button"], [role="link"], [role="textbox"], [aria-label]';
    for (const el of document.querySelectorAll(sel)) {
      const r = el.getBoundingClientRect();
      if (r.width < 4 || r.height < 4) continue;
      const name = el.getAttribute("aria-label")
        || el.getAttribute("placeholder")
        || (el.innerText ?? "").trim().split("\n")[0]
        || el.getAttribute("title") || "";
      if (name) out.push(name.slice(0, 60));
      if (out.length >= n) break;
    }
    return [...new Set(out)];
  }, limit);
}

export async function record({ url, outDir, width = 1280, height = 800, scenario, storageState }) {
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
    // 복사 버튼을 데모로 찍으려면 클립보드가 돼야 한다. 안 주면 writeText 가 던지고
    // 버튼이 아무 반응을 안 해서 **아무 일도 안 일어난 영상**이 나온다(실측).
    permissions: ["clipboard-read", "clipboard-write"],
    // 로그인 뒤 화면을 찍을 때 쓴다. Playwright 로 한 번 로그인해 storageState 를 저장해
    // 두고 그 파일 경로를 넘긴다 — 시나리오에 아이디·비밀번호를 적지 않기 위해서다
    // (영상에 입력 과정이 찍히고, 시나리오 파일에 자격증명이 남는다).
    //
    // 내 개인 세션·쿠키를 쓰는 것은 이 스킬이 아니라 `aside-browser` 다. 여기서 쓰는 건
    // **테스트 계정으로 방금 만든 상태**여야 한다.
    ...(storageState ? { storageState } : {}),
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

  /**
   * 이름으로 요소를 찾는다 — macOS 의 접근성, 안드로이드의 content-desc 와 같은 자리다.
   *
   * 순서: 접근가능 이름(role) → 보이는 글자 → placeholder/label → CSS 셀렉터.
   * CSS 를 마지막에 두는 이유는 `button.foo` 같은 게 이름으로 안 읽히기 때문이다 —
   * 쓸 수는 있게 두되 권하지는 않는다.
   */
  async function resolve(name) {
    if (!name) return null;
    // **정확 일치를 먼저 본다.** exact:false 로만 찾으면 그 글자를 품은 *조상*이나
    // 설명 문단이 먼저 잡힌다 — 그러면 클릭이 엉뚱한 데로 가고, 영상은 멀쩡히 나오는데
    // 아무 일도 안 일어난다(실측 2026-08-26: "급여 계산" 이 탭이 아니라 그 글자가 든
    // 설명 문단에 매칭돼 두 클릭이 전부 헛것이 됐다. verify 의 "클릭이 먹었나" 가 잡았다).
    //
    // tab 도 후보에 넣는다. 탭 UI 는 `role="tab"` 이라 button 으로는 안 잡히는 구현이 흔하다.
    const roles = ["tab", "button", "link", "menuitem", "textbox"];
    const tries = [
      ...roles.map((r) => () => page.getByRole(r, { name, exact: true })),
      () => page.getByLabel(name, { exact: true }),
      () => page.getByPlaceholder(name, { exact: true }),
      // 정확 일치가 없을 때만 느슨하게 — 순서가 중요하다
      ...roles.map((r) => () => page.getByRole(r, { name, exact: false })),
      () => page.getByLabel(name, { exact: false }),
      () => page.getByPlaceholder(name, { exact: false }),
      () => page.getByText(name, { exact: true }),
      () => page.getByText(name, { exact: false }),
      () => page.locator(name),          // CSS 셀렉터 폴백
    ];
    for (const make of tries) {
      try {
        const loc = make().first();
        if (await loc.count() > 0 && await loc.isVisible()) return loc;
      } catch {
        // 셀렉터로 해석이 안 되는 문자열이면 다음 방법으로
      }
    }
    // 못 찾으면 화면에 뭐가 있는지 알려준다 — 번역·오타를 그 자리에서 잡으라고.
    const names = await listTargets(page, 8);
    console.error(`요소를 못 찾았다: '${name}' · 화면에 있는 이름: ${names.join(", ")}`);
    return null;
  }

  async function boxOf(loc) {
    const b = await loc.boundingBox();
    if (!b) return null;
    return {
      point: { x: Math.round(b.x + b.width / 2), y: Math.round(b.y + b.height / 2) },
      bbox: [b.x, b.y, b.width, b.height].map(Math.round),
    };
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
    /**
     * CSS 셀렉터로 클릭. 이름으로 안 잡히는 것(캔버스 툴바 등)에만 쓴다.
     * 보통은 `press(이름)` 를 쓴다 — 그래야 UI 가 움직여도 안 깨진다.
     */
    async click(selector, { pause = 900 } = {}) {
      const t = await box(selector);
      await moveTo(t.point);
      await page.mouse.down();
      ev({ type: "down", t: now(), x: t.point.x, y: t.point.y, bbox: t.bbox });
      await page.mouse.up();
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
    async wait(ms) {
      await page.waitForTimeout(ms);
    },

    // ── 이름 기반 (SCENARIO.md 규격) ────────────────────────────────
    // 못 찾으면 false 를 돌려준다. 던지지 않는 이유는 한 단계가 안 맞았다고
    // 나머지 데모를 통째로 버릴 이유가 없어서다 — 대신 끝에 건수를 센다.
    async press(name, { pause = 900 } = {}) {
      const loc = await resolve(name);
      if (!loc) return false;
      const t = await boxOf(loc);
      if (!t) return false;
      await moveTo(t.point);
      await page.mouse.down();
      ev({ type: "down", t: now(), x: t.point.x, y: t.point.y, bbox: t.bbox });
      await page.mouse.up();
      await page.waitForTimeout(pause);
      return true;
    },

    async type(name, text, { cps = 14, pause = 700 } = {}) {
      const loc = await resolve(name);
      if (!loc) return false;
      const t = await boxOf(loc);
      if (!t) return false;
      await moveTo(t.point);
      await page.mouse.down();
      ev({ type: "down", t: now(), x: t.point.x, y: t.point.y, bbox: t.bbox });
      await page.mouse.up();
      await page.waitForTimeout(250);
      for (const ch of text) {
        await page.keyboard.type(ch);
        ev({ type: "key", t: now(), key: ch === " " ? "␣" : ch, bbox: t.bbox });
        await page.waitForTimeout((1000 / cps) * (0.6 + Math.random() * 0.8));
      }
      await page.waitForTimeout(pause);
      return true;
    },

    /**
     * 이름을 주면 그게 보이게, 숫자를 주면 그만큼.
     * `scroll(900)` 과 `scroll({ to: "FAQ" })` 를 둘 다 받는다 —
     * 캔버스 시나리오는 아직 숫자를 쓴다.
     */
    async scroll(arg = {}, opts = {}) {
      const { to, dy, pause = 1200 } =
        typeof arg === "number" ? { dy: arg, ...opts } : { ...arg, ...opts };
      if (typeof dy === "number") {
        await page.evaluate((d) => window.scrollBy({ top: d, behavior: "smooth" }), dy);
        await page.waitForTimeout(pause);
        return true;
      }
      const loc = await resolve(to);
      if (!loc) return false;
      await loc.scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
      const t = await boxOf(loc);
      if (t) await moveTo(t.point);
      await page.waitForTimeout(pause);
      return true;
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
