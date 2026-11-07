---
name: site-feedback
description: 이 프로젝트 홈페이지에 들어온 사용자 피드백을 읽고 분류해서 로드맵·이슈로 옮긴다. 사용자가 "피드백 뭐 들어왔어", "제보 정리해줘", "피드백 보고 로드맵 반영", "스팸 지워줘"라고 하거나, 주기적으로 사용자 요청을 훑을 때 사용한다.
---

# site-feedback — 들어온 제보를 읽고 다음 일로 옮긴다

`/feedback` 페이지에 쌓인 제보를 다룬다.

## 쓰기는 열려 있지 않다

읽기(GET)와 삭제(DELETE)만 API 로 연다. **에이전트가 피드백을 등록하는 경로는 없다** —
여론을 만들어 낼 수 있는 API 를 여는 건 이 페이지의 존재 이유를 무너뜨린다.
제보는 사람이 화면에서 남긴다.

## 설정

```bash
export SITE_URL="https://<이 프로젝트 도메인>"        # TODO(create-opensource)
export SITE_ADMIN_KEY="<Vercel 의 ADMIN_API_KEY 값>"   # 삭제할 때만 필요
```

## 읽기 (공개)

```bash
curl -s "$SITE_URL/api/feedback?limit=50" | python3 -c "
import json,sys
rows = json.load(sys.stdin)
for r in rows:
    who = r['name'] or 'anonymous'
    print(f\"[{r['id']:>4}] {r['category']:<6} ♥{r['likes']:<3} {who:<12} {r['content'][:70]}\")
"
```

`category` 는 `ISSUE` · `IDEA` · `OTHER` 세 가지다.
익명 제보는 `name` 이 `null` 로 온다(API 가 지운다).

## 분류 절차

한 건씩 판단해서 **다음 행선지를 정한다**. 읽고 끝내면 이 스킬을 쓴 의미가 없다.

| 유형 | 어디로 |
| --- | --- |
| 재현 가능한 버그 | `gh issue create` — 재현 경로와 원문 인용을 함께 |
| 여러 명이 요청한 기능 (`♥` 높음) | `site-roadmap` 으로 `planned` 등록 |
| 이미 고쳐진 것 | 답이 되는 changelog 버전을 찾아 알려줄 준비를 한다 |
| 질문 | 문서 구멍이다 — `docs.guides` 에 넣을지 검토 |
| 스팸·중복 | 삭제 (아래) |

**♥ 개수를 근거로 쓸 때 주의한다.** 좋아요는 로그인 없이 눌리므로 중복이 가능하다.
"3명이 원한다"가 아니라 "3표가 눌렸다"로 읽는다.

## 삭제 (스팸만)

```bash
curl -s -X DELETE "$SITE_URL/api/feedback" \
  -H "Authorization: Bearer $SITE_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{"id": 42}'
```

**비판이라는 이유로 지우지 않는다.** 공개 피드백 페이지에서 불리한 글이 사라지면
그게 발견되는 순간 페이지 전체의 신뢰가 없어진다. 지우는 건 광고·욕설·중복뿐이다.

## 끝에 보고할 것

- 몇 건을 읽었는지
- 이슈/로드맵으로 옮긴 것 (링크와 함께)
- 판단이 갈려서 사람에게 남긴 것
