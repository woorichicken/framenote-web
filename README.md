# oss-landing-template

오픈소스 프로젝트 홈페이지 템플릿. **`site.config.ts` 하나만 고치면 사이트가 바뀐다.**

`solhun.com`(CLI Manager 랜딩)에서 뽑아 오픈소스용으로 다시 만든 것이다 —
결제·다운로드·후기를 빼고, 설치 커맨드·GitHub 실값 배지·기여자·후원을 넣었다.

## 무엇이 들어 있나

| 경로 | 내용 |
| --- | --- |
| `/` | 히어로 · 설치 한 줄 · 30초 예제 · 기능 3개 · 기여자 · FAQ · CTA |
| `/docs` | 설치 → 첫 예제 → 가이드 링크 (문서 정본은 저장소에 둔다) |
| `/changelog` | DB 기반. API 로 등록 |
| `/roadmap` | DB 기반. API 로 상태 변경 |
| `/feedback` | 사용자 제보 + 좋아요 + 댓글 |
| `/admin/*` | changelog·roadmap·feedback 관리 화면 (색인 차단됨) |
| `/api/*` | 위 세 가지의 읽기/쓰기 API — **에이전트 스킬이 쓴다** |

스택: Next.js 14 (App Router) · Tailwind v4 · Neon Postgres + Drizzle · Vercel.

## 시작하기

```bash
pnpm install
cp .env.example .env.local     # DATABASE_URL, ADMIN_API_KEY 채우기
pnpm db:generate && pnpm db:migrate
pnpm dev
```

그다음 **`site.config.ts` 의 `TODO(create-opensource)` 를 전부 채운다.**
그것만 채우면 헤더·푸터·메타데이터·JSON-LD·사이트맵이 전부 따라 바뀐다.

```bash
grep -n "TODO(create-opensource)" site.config.ts
```

## 이 템플릿의 규칙

### 문구를 컴포넌트 안에 쓰지 않는다

새 섹션을 만들면 그 문구도 `site.config.ts` 로 뺀다. 이 규칙이 깨지는 순간
다음 프로젝트가 "복사해서 내용만 바꾸기"로 안 끝나고 파일을 뒤지게 된다.

### 없는 페이지를 링크하지 않는다

`nav`·`footer`·`sitemap.ts` 는 **실제로 존재하는 라우트만** 담는다.
사이트맵에 넣은 URL 이 404 면 색인기가 사이트 전체 신뢰도를 깎는다.

### 근거 없는 숫자를 넣지 않는다

원본에는 후기 3개와 `aggregateRating 4.9 / 150` JSON-LD 가 있었다. 지어낸 값이라
전부 뺐다. 신뢰의 근거는 인용문이 아니라 **GitHub 실값**(별·기여자·릴리스)이고,
그건 `lib/github.ts` 가 API 에서 직접 읽어 온다.

## 쓰기 API — 에이전트가 쓴다

릴리스가 나가면 사람이 관리 화면에 로그인해서 changelog 를 넣는 대신,
스킬이 API 로 넣는다. `.claude/skills/` 에 세 개가 들어 있다.

| 스킬 | 하는 일 |
| --- | --- |
| `site-changelog` | 릴리스 노트를 `/changelog` 에 등록·수정 |
| `site-roadmap` | 로드맵 항목 등록, 출시되면 `completed` 로 변경 |
| `site-feedback` | 들어온 제보를 읽고 이슈·로드맵으로 옮김 |

인증은 `Authorization: Bearer $ADMIN_API_KEY` 하나다.

```bash
openssl rand -hex 32          # 키 생성
vercel env add ADMIN_API_KEY  # 배포 환경에 등록
```

**DB 접속 문자열을 스킬에 주지 않는다.** 그건 마스터 권한이라 사고 범위가 테이블
전체로 커지고, 회수하려면 DB 비밀번호를 돌려야 한다. API 키는 이 엔드포인트로
범위가 제한되고 환경변수 하나만 갈면 폐기된다. 서버 쪽 검증(필수 필드·`updated_at`)도
API 를 거쳐야 걸린다.

`ADMIN_API_KEY` 를 설정하지 않은 배포는 **모든 쓰기가 401** 이다(안전한 기본값).

## 배포 (Vercel)

```bash
vercel link
vercel env add DATABASE_URL production
vercel env add ADMIN_API_KEY production
vercel --prod
```

배포 뒤 확인:

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://<도메인>/
curl -s https://<도메인>/sitemap.xml | head -5
curl -s https://<도메인>/api/changelogs | head -c 200
```

## 라이선스

MIT. `LICENSE` 의 저작권자를 본인/조직 이름으로 바꿔서 쓴다.
