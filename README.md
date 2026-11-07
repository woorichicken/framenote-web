# framenote-web

[framenote](https://github.com/woorichicken/framenote) 소개 사이트 — https://framenote.solhun.com

오픈소스 랜딩 템플릿에서 출발했다. 문구·링크·이미지는 전부 `site.config.ts` 에 있고,
별·기여자·릴리스 버전은 빌드 때 GitHub API 에서 읽는다.

```bash
pnpm install
cp .env.example .env.local   # DATABASE_URL, ADMIN_API_KEY, 제보 위젯 값
pnpm db:migrate
pnpm dev
```

변경 기록·로드맵·의견은 Postgres(Neon)에 저장하고, 키로 보호된 API(`ADMIN_API_KEY`)로 쓴다.

| 경로 | 내용 |
| --- | --- |
| `/` | 히어로 · 실행 명령 · 예제 · 기능 4개 · FAQ |
| `/docs` | 실행 → 에이전트 연결 → README 의 절로 보내는 링크 (문서 정본은 framenote 저장소) |
| `/changelog` · `/roadmap` · `/feedback` | DB 기반 |
| `/admin/*` | 관리 화면 (색인 차단) |

영상은 사람이 안 찍는다 — `zsh scripts/demo/record-all.sh <빈 폴더>` 가 실제 framenote 를 띄워 조작한다.
로고는 `brand/mark.png` 에서 `python3 scripts/make-brand-assets.py` 로 파비콘·머리 로고·공유 카드를 만든다.

MIT
