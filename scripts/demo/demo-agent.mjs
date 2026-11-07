#!/usr/bin/env node
/**
 * 데모에서 에이전트 자리에 앉는 짧은 스크립트. LLM 이 아니다 — 무엇을 고칠지 미리 정해져 있다.
 *
 * 그래도 framenote 쪽 접점은 실제 에이전트와 같다: server.json 으로 주소를 찾고,
 * /feed 신호를 받아 /api/notes 로 전문을 읽고, /api/status 로 메모 단위 상태를 바꾼다.
 * 재렌더도 진짜로 돈다. 영상 소개에 이 사실을 함께 적는다.
 *
 * 사용: demo-agent.mjs <저장 루트(.framenote 가 있는 폴더)> <새 영상 경로>
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const [storeRoot, nextVideo] = process.argv.slice(2);
const HERE = dirname(fileURLToPath(import.meta.url));
const FIXED_CAPTION_Y = 610;

const servers = JSON.parse(readFileSync(join(storeRoot, ".framenote/server.json"), "utf8"));
const { port } = Array.isArray(servers) ? servers[0] : servers;
const base = `http://127.0.0.1:${port}`;

async function setStatus(updates) {
  const res = await fetch(`${base}/api/status`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ updates }),
  });
  if (!res.ok) throw new Error(`상태 변경 실패 ${res.status}: ${await res.text()}`);
}

const feed = new WebSocket(`ws://127.0.0.1:${port}/feed`);
feed.onopen = () => console.log(`붙음 ${base}/feed`);
feed.onmessage = async (event) => {
  const signal = JSON.parse(String(event.data));
  if (signal.type !== "batch") return;
  console.log("신호", signal);
  const notes = await (await fetch(`${base}/api/notes?batch=${signal.batch}`)).json();
  for (const note of notes) console.log(`메모 ${note.id} 프레임 ${note.range} ${JSON.stringify(note.rect)} — ${note.what}`);

  await setStatus(notes.map((note) => ({ noteId: note.id, status: "working" })));
  execFileSync("python3", [join(HERE, "render-sample.py"), "--caption-y", String(FIXED_CAPTION_Y), "--out", nextVideo], { stdio: "inherit" });
  await setStatus(notes.map((note) => ({ noteId: note.id, status: "applied", renderedFile: nextVideo })));
  console.log("반영", nextVideo);
};
