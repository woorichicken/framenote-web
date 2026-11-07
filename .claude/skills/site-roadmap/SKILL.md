---
name: site-roadmap
description: 이 프로젝트 홈페이지의 로드맵 항목을 HTTP API 로 등록·상태변경·삭제한다. 사용자가 "로드맵에 추가", "이거 완료로 바꿔줘", "다음 분기 계획 올려줘", "roadmap 정리"라고 하거나, 기능이 출시돼 로드맵 상태를 갱신해야 할 때 사용한다.
---

# site-roadmap — 계획과 진척을 공개한다

`/roadmap` 페이지의 데이터를 **HTTP API** 로 다룬다. DB 에 직접 붙지 않는 이유는
`site-changelog` 스킬과 같다(마스터 권한·검증 우회).

## 설정

```bash
export SITE_URL="https://<이 프로젝트 도메인>"        # TODO(create-opensource)
export SITE_ADMIN_KEY="<Vercel 의 ADMIN_API_KEY 값>"
```

## 필드

| 필드 | 필수 | 값 |
| --- | --- | --- |
| `title` | ✅ | 항목 이름 |
| `description` | ✅ | 한두 문장 |
| `category` | ✅ | 자유 문자열 (`Feature` · `Docs` · `Performance` 등) — 화면에서 묶는 기준 |
| `status` | | `planned`(기본) · `in-progress` · `completed` |
| `date` | | 표시용 문자열 (`"Q4 2026"`, `"Dec 2026"`). 없으면 안 보임 |
| `order` | | 작을수록 위. 기본 0 |

## 조회 / 등록

```bash
curl -s "$SITE_URL/api/roadmaps" | python3 -m json.tool

curl -s -X POST "$SITE_URL/api/roadmaps" \
  -H "Authorization: Bearer $SITE_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Windows 지원",
    "description": "현재 macOS 만 지원한다. Windows 빌드와 CI 를 붙인다.",
    "category": "Platform",
    "status": "planned",
    "date": "Q4 2026",
    "order": 10
  }'
```

## 상태 변경 — 가장 자주 하는 일

기능이 나가면 `completed` 로 바꾼다. **먼저 id 를 조회해서 확인하고** 고친다.

```bash
# 1) 대상 찾기
curl -s "$SITE_URL/api/roadmaps" | python3 -c "
import json,sys
for r in json.load(sys.stdin): print(r['id'], r['status'], '|', r['title'])
"

# 2) 상태만 변경
curl -s -X PATCH "$SITE_URL/api/roadmaps/<id>" \
  -H "Authorization: Bearer $SITE_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```

## 로드맵과 changelog 는 짝이다

항목을 `completed` 로 바꿨으면 대체로 changelog 도 한 줄 필요하다.
`site-changelog` 스킬로 이어서 넣고, **둘 다 반영됐는지 화면에서 확인**하고 보고한다.

## 삭제

```bash
curl -s -X DELETE "$SITE_URL/api/roadmaps/<id>" -H "Authorization: Bearer $SITE_ADMIN_KEY"
```

취소된 계획은 지우지 말고 설명에 이유를 적는 편이 낫다 — 사라진 항목은 사용자에게
"조용히 없던 일이 됐다"로 읽힌다.
