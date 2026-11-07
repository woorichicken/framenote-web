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
    const { title, description, status, category, date, order } = body;

    const result = await db
      .update(roadmaps)
      .set({
        title,
        description,
        status: status || "planned",
        category,
        date: date || null,
        order: order || 0,
        updatedAt: new Date(),
      })
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
