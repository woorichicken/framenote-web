import { record } from "./record-demo.mjs";

/**
 * 이 파일만 고친다 — "무엇을 찍나"가 여기 있고, "어떻게 찍나"는 record-demo.mjs 에 있다.
 *
 * 전부 실제 framenote 를 조작한다. 실행은 scripts/demo/record-all.sh 가 묶는다.
 * 사용: demo-scenario.mjs <main|ruler|static> <출력 폴더> <주소>
 */
const [name, outDir, url] = process.argv.slice(2);

/** 영상 요소 위의 비율 좌표를 화면 좌표로 바꾼다. 창 크기가 달라져도 같은 자리를 가리키게. */
async function videoPoint(a, rx, ry) {
  const box = await a.page.locator("#v").boundingBox();
  return { x: Math.round(box.x + box.width * rx), y: Math.round(box.y + box.height * ry) };
}

async function scrubPoint(a, ratio) {
  const box = await a.page.locator("#scrub").boundingBox();
  return { x: Math.round(box.x + box.width * ratio), y: Math.round(box.y + box.height / 2) };
}

async function waitPlayerReady(a) {
  await a.page.waitForFunction(() => {
    const v = document.getElementById("v");
    return typeof window.__currentFrame === "function" && v && v.readyState >= 3;
  }, undefined, { timeout: 20_000 });
}

/** 자막 위에 네모를 치고 메모를 쓴다. 왜 이 자리인가: 샘플의 자막이 화면 아래로 잘려 있다. */
async function writeCaptionNote(a) {
  await a.drag(await scrubPoint(a, 0.3), await scrubPoint(a, 0.62), { pause: 1100 });
  await a.drag(await videoPoint(a, 0.24, 0.88), await videoPoint(a, 0.76, 0.995), { pause: 700 });
  await a.type("#what", "자막이 화면 아래로 잘린다", { cps: 12, pause: 300 });
  await a.type("#want", "안전영역 안으로 올려줘", { cps: 12, pause: 400 });
  await a.press("#save", { pause: 1100 });
}

const scenarios = {
  /** 메모 → 보내기 → 에이전트 반영 → 같은 창에서 영상 교체 */
  async main(a) {
    await waitPlayerReady(a);
    await a.wait(600);
    await writeCaptionNote(a);
    await a.press("#send", { pause: 400 });
    await a.page.waitForFunction(() => document.getElementById("file")?.textContent === "final-fixed.mp4", undefined, { timeout: 60_000 });
    await a.wait(2600);
  },

  /** 화살표로 한 프레임씩 옮기며 표시 번호와 영상 속 눈금이 같은 것을 보여준다 */
  async ruler(a) {
    await waitPlayerReady(a);
    await a.click("#scrub", { pause: 900 });
    for (let i = 0; i < 6; i++) await a.key("ArrowRight", { pause: 550 });
    await a.key("Shift+ArrowRight", { pause: 900 });
    for (let i = 0; i < 3; i++) await a.key("ArrowLeft", { pause: 550 });
    await a.wait(800);
  },

  /** 서버 없이 HTML 한 장을 file:// 로 열어 메모하고 파일로 꺼낸다 */
  async static(a) {
    await waitPlayerReady(a);
    await a.wait(500);
    await writeCaptionNote(a);
    await a.press("#send", { pause: 1600 });
  },
};

if (!scenarios[name]) throw new Error(`없는 시나리오: ${name}`);
await record({ url, outDir, scenario: scenarios[name] });
