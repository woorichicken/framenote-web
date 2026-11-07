---
name: site-changelog
description: 이 프로젝트 홈페이지의 changelog 를 HTTP API 로 등록·수정·삭제한다. 사용자가 "체인지로그 올려줘", "릴리스 노트 사이트에 반영", "새 버전 공지", "changelog 추가/수정/삭제"라고 하거나, 릴리스를 태깅한 직후 홈페이지 반영이 필요할 때 사용한다.
---

# site-changelog — 릴리스를 홈페이지에 싣는다

`/changelog` 페이지의 데이터를 **HTTP API** 로 다룬다.

## DB 에 직접 붙지 않는다

`psql` 로 붙는 방법이 더 짧아 보이지만 쓰지 않는다:

- 접속 문자열은 **마스터 권한**이다. 오타 하나로 다른 테이블이 날아가고, 회수하려면
  DB 비밀번호를 돌려야 한다.
- API 키는 이 엔드포인트로 범위가 제한되고, 환경변수 하나만 갈면 폐기된다.
- API 를 거치면 필수 필드 검증과 `updated_at` 갱신이 서버에서 일어난다.
  psql 로 직접 INSERT 하면 그게 전부 빠진다(실제로 갈라진다).

## 설정 (한 번만)

```bash
export SITE_URL="https://<이 프로젝트 도메인>"        # TODO(create-opensource)
export SITE_ADMIN_KEY="<Vercel 의 ADMIN_API_KEY 값>"
```

키는 대화에 붙여넣지 말고 환경변수·`.env.local` 로 둔다. 값이 필요하면
`vercel env pull` 로 받는다.

## 조회 (공개, 키 불필요)

```bash
curl -s "$SITE_URL/api/changelogs" | python3 -m json.tool
```

## 등록

`version`·`date`·`title`·`description` 은 필수다. 나머지는 생략하면 빈 배열/기본값.

```bash
curl -s -X POST "$SITE_URL/api/changelogs" \
  -H "Authorization: Bearer $SITE_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "version": "v1.4.0",
    "date": "Aug 22, 2026",
    "title": "제목 한 줄",
    "description": "무엇이 달라졌는지 두세 문장.",
    "improvements": [{"text": "개선 1"}, {"text": "개선 2"}],
    "fixes": [{"text": "수정 1"}],
    "patches": [],
    "isFeatured": false,
    "youtubeUrl": null
  }'
```

- `date` 는 **표시용 문자열**이다(`"Aug 22, 2026"`). 정렬은 `created_at` 이 한다 —
  과거 릴리스를 나중에 넣으면 목록 맨 위로 온다. 그럴 땐 순서를 확인하고, 필요하면
  `date` 만 고치지 말고 등록 순서를 맞춰서 넣는다.
- `isFeatured: true` 는 한 번에 하나만. 여러 개면 화면에서 강조가 의미를 잃는다.

## 수정 / 삭제

```bash
curl -s -X PATCH "$SITE_URL/api/changelogs/<id>" \
  -H "Authorization: Bearer $SITE_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{"title": "고친 제목"}'

curl -s -X DELETE "$SITE_URL/api/changelogs/<id>" \
  -H "Authorization: Bearer $SITE_ADMIN_KEY"
```

## 릴리스 노트에서 뽑아 쓰기

GitHub 릴리스가 이미 있으면 거기서 만든다 — 같은 내용을 두 번 쓰지 않는다.

```bash
gh release view <tag> --json tagName,name,body,publishedAt
```

`body` 의 `### Added` / `### Fixed` 섹션을 각각 `improvements` / `fixes` 로 옮긴다.

## 끝내기 전에 확인

`curl` 이 201 을 줬다고 화면에 뜬 건 아니다. **`/changelog` 를 실제로 열어**
새 항목이 보이는지 확인하고 보고한다.

```bash
curl -s "$SITE_URL/api/changelogs" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d[0]['version'], d[0]['title'])"
```
