import { record } from "./record-demo.mjs";

/**
 * 이 파일만 고친다 — "무엇을 찍나"가 여기 있고, "어떻게 찍나"는 record-demo.mjs 에 있다.
 *
 * 도구: click · type · drag · key · scroll · wait
 * 캔버스 안쪽처럼 셀렉터가 없는 곳은 drag(좌표) 로 한다.
 * page 를 직접 쓰면 이벤트가 안 남아 커서·확대가 그 구간에 안 걸린다.
 */
await record({
  url: process.argv[3] ?? "http://localhost:3210/",
  outDir: process.argv[2] ?? "./demo-out",
  scenario: async (a) => {
    // TODO(create-opensource) — 이 프로젝트의 데모로 바꾼다
    await a.click('button:text-is("pnpm")');
    await a.click('button[aria-label*="Copy"]', { pause: 1700 });
    await a.scroll(900);
    await a.click("button[aria-expanded]", { pause: 1500 });
  },
});
