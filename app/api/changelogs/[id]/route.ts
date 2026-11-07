import { NextRequest, NextResponse } from "next/server";
import { isAdmin, unauthorized } from "@/lib/admin-auth";
import { db, changelogs } from "@/lib/db";
import { eq } from "drizzle-orm";


type Params = { params: Promise<{ id: string }> };

// GET: 단일 changelog 조회
export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;

  try {
    const result = await db
      .select()
      .from(changelogs)
      .where(eq(changelogs.id, parseInt(id)));

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Changelog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Failed to fetch changelog:", error);
    return NextResponse.json(
      { error: "Failed to fetch changelog" },
      { status: 500 }
    );
  }
}

// PUT: changelog 수정 (admin only)
export async function PUT(request: NextRequest, { params }: Params) {
  // Admin 인증 확인
  if (!isAdmin(request)) {
    return unauthorized();
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { version, date, title, description, improvements, fixes, patches, isFeatured, youtubeUrl } =
      body;

    const result = await db
      .update(changelogs)
      .set({
        version,
        date,
        title,
        description,
        improvements: improvements || [],
        fixes: fixes || [],
        patches: patches || [],
        isFeatured: isFeatured || false,
        youtubeUrl: youtubeUrl || null,
        updatedAt: new Date(),
      })
      .where(eq(changelogs.id, parseInt(id)))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Changelog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Failed to update changelog:", error);
    return NextResponse.json(
      { error: "Failed to update changelog" },
      { status: 500 }
    );
  }
}

// DELETE: changelog 삭제 (admin only)
export async function DELETE(request: NextRequest, { params }: Params) {
  // Admin 인증 확인
  if (!isAdmin(request)) {
    return unauthorized();
  }

  const { id } = await params;

  try {
    const result = await db
      .delete(changelogs)
      .where(eq(changelogs.id, parseInt(id)))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Changelog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete changelog:", error);
    return NextResponse.json(
      { error: "Failed to delete changelog" },
      { status: 500 }
    );
  }
}
