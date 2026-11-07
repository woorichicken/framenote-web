# scripts/

| 스크립트 | 용도 |
| --- | --- |
| [demo-scenario.mjs](demo-scenario.mjs) | **무엇을 찍나** — 이 파일만 고친다 (`pnpm demo:record`) |
| [record-demo.mjs](record-demo.mjs) | **어떻게 찍나** — 리코더. 보통 안 건드린다 |

## 데모 영상 — 사람이 안 찍는다

`site.config.ts` 의 `hero.media` 와 `features[].media` 는 데모가 필요하다. 그걸 손으로
찍으면 문구를 고칠 때마다 다시 찍어야 하고, 마우스가 흔들리고, 매번 다르게 나온다.

대신 **Playwright 가 페이지를 조작하고, 그 조작 기록으로 후처리를 건다.**

```
Playwright 헤드리스 녹화  →  demo.mp4 + demo.events.jsonl
                              ↓
                    screenstudio-alt polish.py
                              ↓
   자동 확대 · 유휴 구간 압축 · 부드러운 커서 · 키스트로크 칩
```

### 왜 이 조합인가

`polish.py`(MIT, [connerkward/screenstudio-alternative-skill](https://github.com/connerkward/screenstudio-alternative-skill))
는 원래 macOS 네이티브 이벤트 로거가 만든 `events.jsonl` 을 읽는다. 그런데 그 파일에
들어가는 건 "언제 어디를 클릭했나"뿐이고, **Playwright 는 그걸 이미 정확히 알고 있다.**
그래서 화면을 캡처하는 대신 스크립트가 같은 포맷을 직접 뱉으면 네이티브 로거도,
화면 점유도 필요 없다 — 완전히 백그라운드로 돈다.

`--smooth-cursor` 는 문서가 "커서 없이 찍힌 영상에 가장 좋다"고 말하는데,
헤드리스 Playwright 영상이 정확히 그것이다(커서를 렌더하지 않는다). 합성 커서를
그리므로 실제 마우스보다 깔끔하다.

### 준비

```bash
pnpm add -D playwright && npx playwright install chromium
brew install ffmpeg
git clone --depth 1 https://github.com/connerkward/screenstudio-alternative-skill /tmp/ssalt
python3 -m pip install --user pillow
```

### 실행

```bash
pnpm dev -p 3210 &                                   # 녹화 대상
node scripts/record-demo.mjs ./demo-out http://localhost:3210/

cd demo-out
ffmpeg -y -i page@*.webm -c:v libx264 -pix_fmt yuv420p -r 30 demo.mp4
python3 /tmp/ssalt/src/polish.py demo.mp4 --events demo.events.jsonl \
  --out demo-polished.mp4 --zoom --keys --smooth-cursor --speedup

cp demo-polished.mp4 ../public/demo.mp4
```

그리고 `site.config.ts` 에서:

```ts
media: { type: "video", src: "/demo.mp4", alt: "..." }
```

### 시나리오 고치기

`demo-scenario.mjs` 의 `scenario` 함수만 고친다. 도구는 여섯 개다.

| 도구 | 쓰는 곳 |
| --- | --- |
| `a.click(sel, {pause})` | DOM 요소. bbox 를 같이 남겨 점이 아니라 요소를 확대한다 |
| `a.type(sel, text, {cps})` | 입력. 간격을 ±40% 흔들어 기계 입력처럼 안 보이게 한다 |
| `a.drag(from, to)` | **캔버스 안쪽**(Figma·Excalidraw 류). 좌표로 끈다 |
| `a.key(k)` | 단축키 |
| `a.scroll(dy)` · `a.wait(ms)` | 이동·정지 |

**`a.page` 를 직접 쓰면 이벤트가 안 남는다.** 동작은 일어나는데 그 구간에 커서도
확대도 안 걸린다 — 영상은 멀쩡히 나와서 눈치채기 어렵다. 꼭 필요하면 이벤트를
손으로 남긴다. 출력의 클릭·키 건수가 0이면 시나리오가 안 돈 것이다.

### 리뷰 루프

영상을 만든 뒤에는 `demo-video` 스킬의 4단계(리뷰 페이지)로 간다 — 원본/보정본을
나란히 놓고 섹션마다 메모해 한 번에 복사하는 페이지를 아티팩트로 올려 고칠 점을 받는다.

### 함정

- **영상 크기와 뷰포트를 같게 둔다.** 어긋나면 `polish.py` 의 좌표 스케일이 1이 아니게
  되고 확대가 클릭 지점에서 빗나간다. `W`/`H` 상수 하나가 둘 다를 정하는 이유다.
- **`context.close()` 전에는 영상 파일이 확정되지 않는다.** 닫기 전에 파일을 읽으면 0바이트다.
- 유휴 압축(`--speedup`)은 `freezedetect` 기반이라 **애니메이션이 계속 도는 페이지**에서는
  거의 안 줄어든다. 배경 애니메이션이 있으면 녹화 중에만 꺼 두는 편이 낫다.
- 실측(2026-08-23): 14.3초 → 11.5초, 확대 2회, 커서 렌더 확인.
