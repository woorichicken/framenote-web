import { NextRequest, NextResponse } from "next/server";
import { isAdmin, unauthorized } from "@/lib/admin-auth";
import { db, roadmaps } from "@/lib/db";
import { eq } from "drizzle-orm";


type Params = { params: Promise<{ id: string }> };

// GET: 단일 roadmap 조회
export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;

  try {
    const result = await db
      .select()
      .from(roadmaps)
      .where(eq(roadmaps.id, parseInt(id)));

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Roadmap not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Failed to fetch roadmap:", error);
    return NextResponse.json(
      { error: "Failed to fetch roadmap" },
      { status: 500 }
    );
  }
}

// PUT: roadmap 수정 (admin only)
export async function PUT(request: NextRequest, { params }: Params) {
  // Admin 인증 확인
  if (!isAdmin(request)) {
    return unauthorized();
  }

  const { id } = await params;

  try {
    const body = await request.json();
    // 보낸 칸만 바꾼다 — 예전엔 빠진 칸을 기본값(빈 목록·false·null·0)으로 덮어써서
    // 「제목만 고치기」가 나머지 내용을 지웠다(2026-11-09 발견). 스킬 문서의 수정 예시는 일부 칸만 보낸다.
    const ALLOWED = ["title", "description", "status", "category", "date", "order"] as const;
    const updates: Record<string, unknown> = {};
    for (const key of ALLOWED) if (key in body) updates[key] = body[key];
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No updatable fields" }, { status: 400 });
    }

    const result = await db
      .update(roadmaps)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(roadmaps.id, parseInt(id)))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Roadmap not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Failed to update roadmap:", error);
    return NextResponse.json(
      { error: "Failed to update roadmap" },
      { status: 500 }
    );
  }
}

// DELETE: roadmap 삭제 (admin only)
export async function DELETE(request: NextRequest, { params }: Params) {
  // Admin 인증 확인
  if (!isAdmin(request)) {
    return unauthorized();
  }

  const { id } = await params;

  try {
    const result = await db
      .delete(roadmaps)
      .where(eq(roadmaps.id, parseInt(id)))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Roadmap not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete roadmap:", error);
    return NextResponse.json(
      { error: "Failed to delete roadmap" },
      { status: 500 }
    );
  }
}

// 스킬 문서와 이미 복제된 사이트가 PATCH 로 부르기도 해서 같은 동작으로 받는다.
export const PATCH = PUT;
