import { NextRequest, NextResponse } from "next/server";
import { isAdmin, unauthorized } from "@/lib/admin-auth";
import { db, changelogs } from "@/lib/db";
import { desc, eq } from "drizzle-orm";


// GET: 전체 changelog 목록 조회 (public)
export async function GET() {
  try {
    const result = await db
      .select()
      .from(changelogs)
      .orderBy(desc(changelogs.createdAt));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch changelogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch changelogs" },
      { status: 500 }
    );
  }
}

// POST: 새 changelog 생성 (admin only)
export async function POST(request: NextRequest) {
  // Admin 인증 확인
  if (!isAdmin(request)) {
    return unauthorized();
  }

  try {
    const body = await request.json();
    const { version, date, title, description, improvements, fixes, patches, isFeatured, youtubeUrl } =
      body;

    // 필수 필드 검증
    if (!version || !date || !title || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await db
      .insert(changelogs)
      .values({
        version,
        date,
        title,
        description,
        improvements: improvements || [],
        fixes: fixes || [],
        patches: patches || [],
        isFeatured: isFeatured || false,
        youtubeUrl: youtubeUrl || null,
      })
      .returning();

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Failed to create changelog:", error);
    return NextResponse.json(
      { error: "Failed to create changelog" },
      { status: 500 }
    );
  }
}
