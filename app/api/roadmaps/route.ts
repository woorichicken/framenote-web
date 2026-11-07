import { NextRequest, NextResponse } from "next/server";
import { isAdmin, unauthorized } from "@/lib/admin-auth";
import { db, roadmaps } from "@/lib/db";
import { asc } from "drizzle-orm";


// GET: 전체 roadmap 목록 조회 (public)
export async function GET() {
  try {
    const result = await db
      .select()
      .from(roadmaps)
      .orderBy(asc(roadmaps.order), asc(roadmaps.createdAt));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch roadmaps:", error);
    return NextResponse.json(
      { error: "Failed to fetch roadmaps" },
      { status: 500 }
    );
  }
}

// POST: 새 roadmap 생성 (admin only)
export async function POST(request: NextRequest) {
  // Admin 인증 확인
  if (!isAdmin(request)) {
    return unauthorized();
  }

  try {
    const body = await request.json();
    const { title, description, status, category, date, order } = body;

    // 필수 필드 검증
    if (!title || !description || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await db
      .insert(roadmaps)
      .values({
        title,
        description,
        status: status || "planned",
        category,
        date: date || null,
        order: order || 0,
      })
      .returning();

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Failed to create roadmap:", error);
    return NextResponse.json(
      { error: "Failed to create roadmap" },
      { status: 500 }
    );
  }
}
