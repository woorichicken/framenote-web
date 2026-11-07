import { NextRequest, NextResponse } from "next/server";

/**
 * 쓰기 API 의 인증.
 *
 * 왜 API 키인가 — 이 사이트의 쓰기 주체는 사람이 아니라 **에이전트 스킬**이다
 * (릴리스가 나가면 changelog 를 자동으로 넣는 식). 세션 로그인은 그 흐름에 못 쓴다.
 *
 * 왜 DB 접속 문자열을 스킬에 직접 주지 않는가 — 그건 마스터 권한이라 실수 한 번에
 * 테이블이 날아가고, 회수하려면 DB 비밀번호를 돌려야 한다. API 키는 이 엔드포인트
 * 범위로 제한되고 환경변수 하나만 갈면 폐기된다.
 */
export function isAdmin(request: NextRequest): boolean {
  const expected = process.env.ADMIN_API_KEY;

  // 키를 설정하지 않은 배포에서는 쓰기를 전부 막는다.
  // (빈 문자열 비교로 "헤더 없음 == 키 없음" 이 통과되는 사고를 막는다)
  if (!expected) return false;

  const header = request.headers.get("authorization");
  if (!header) return false;

  const token = header.startsWith("Bearer ") ? header.slice(7) : header;
  return timingSafeEqual(token, expected);
}

/**
 * 길이가 다르면 즉시 false, 같으면 전 바이트를 비교한다.
 * 앞자리부터 순차 비교하면 응답 시간으로 키를 한 글자씩 맞출 수 있다.
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** 인증 실패 응답. 무엇이 틀렸는지 알려주지 않는다(키 존재 여부도 정보다). */
export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
