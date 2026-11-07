import { NextRequest, NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db, feedbacks } from "@/lib/db";
import { isAdmin, unauthorized } from "@/lib/admin-auth";

/**
 * 피드백 읽기 API.
 *
 * 화면(`/feedback`)은 server action 으로 쓰기를 하지만, **읽기**는 에이전트가
 * 필요하다 — "이번 주에 뭐가 들어왔는지 보고 로드맵에 반영" 같은 작업은 목록을
 * 가져올 수 있어야 시작된다. 그래서 GET 만 연다.
 *
 * 목록은 공개다(피드백 페이지에 이미 다 보인다). 쓰기는 사람이 화면에서 한다 —
 * 에이전트가 여론을 만들어 내는 경로를 열지 않는다.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const limit = Math.min(Number(url.searchParams.get("limit") ?? 50), 200);

  try {
    const rows = await db
      .select()
      .from(feedbacks)
      .orderBy(desc(feedbacks.createdAt))
      .limit(limit);

    // 익명 제보의 이름은 공개 응답에서 지운다.
    // 화면이 안 보여준다고 API 가 흘리면 같은 데이터가 두 경로로 갈라진다.
    const safe = rows.map((r) => ({ ...r, name: r.isAnonymous ? null : r.name }));

    return NextResponse.json(safe);
  } catch (error) {
    console.error("Failed to fetch feedback:", error);
    return NextResponse.json({ error: "Failed to fetch feedback" }, { status: 500 });
  }
}

/**
 * 삭제만 관리자에게 연다 — 스팸 정리는 자동화 가치가 있다.
 * (id 는 body 로 받는다. 목록 API 와 경로를 맞추기 위해 [id] 라우트를 따로 두지 않았다.)
 */
export async function DELETE(request: NextRequest) {
  if (!isAdmin(request)) return unauthorized();

  try {
    const { id } = await request.json();
    if (typeof id !== "number") {
      return NextResponse.json({ error: "id must be a number" }, { status: 400 });
    }

    const { eq } = await import("drizzle-orm");
    const deleted = await db.delete(feedbacks).where(eq(feedbacks.id, id)).returning();

    if (deleted.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ deleted: deleted[0].id });
  } catch (error) {
    console.error("Failed to delete feedback:", error);
    return NextResponse.json({ error: "Failed to delete feedback" }, { status: 500 });
  }
}
