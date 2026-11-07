"use server";

import { labels } from "@/site.config"
import { db, feedbacks, feedbackComments } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

// Create Feedback
export async function createFeedback(formData: FormData) {
  const content = formData.get("content") as string;
  const category = formData.get("category") as string || "OTHER";
  const name = formData.get("name") as string;
  const isAnonymous = formData.get("isAnonymous") === "true";

  if (!content) return { error: labels.feedback.errors.contentRequired };

  try {
    await db.insert(feedbacks).values({
      content,
      category,
      name: name || null,
      isAnonymous,
      likes: 0,
    });
    revalidatePath("/feedback");
    return { success: true };
  } catch (error) {
    console.error("Failed to create feedback:", error);
    return { error: labels.feedback.errors.createFailed };
  }
}

// Like Feedback
export async function likeFeedback(id: number) {
  try {
    // Increment likes atomically (simple approach for now)
    // Drizzle doesn't have simple 'increment' helper in all versions, updating with query
    const feedback = await db.query.feedbacks.findFirst({
        where: eq(feedbacks.id, id)
    });

    if (!feedback) return { error: labels.feedback.errors.notFound };

    await db.update(feedbacks)
        .set({ likes: feedback.likes + 1 })
        .where(eq(feedbacks.id, id));

    // 좋아요는 클라이언트 상태로 관리되므로 revalidatePath 호출하지 않음
    // 페이지 새로고침 없이 스크롤 위치 유지
    return { success: true };
  } catch (error) {
    console.error("Failed to like feedback:", error);
    return { error: labels.feedback.errors.likeFailed };
  }
}

// Create Comment
export async function createComment(formData: FormData) {
  const feedbackId = Number(formData.get("feedbackId"));
  const content = formData.get("content") as string;
  const name = formData.get("name") as string;
  const isAnonymous = formData.get("isAnonymous") === "true";

  if (!content || !feedbackId) return { error: labels.feedback.errors.commentRequired };

  try {
    await db.insert(feedbackComments).values({
      feedbackId,
      content,
      name: name || null,
      isAnonymous,
    });
    revalidatePath("/feedback");
    return { success: true };
  } catch (error) {
    console.error("Failed to create comment:", error);
    return { error: labels.feedback.errors.commentFailed };
  }
}

// Delete Feedback (Admin)
export async function deleteFeedback(id: number) {
    try {
        await db.delete(feedbacks).where(eq(feedbacks.id, id));
        revalidatePath("/feedback");
        revalidatePath("/admin/feedback");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete feedback:", error);
        return { error: labels.feedback.errors.deleteFailed };
    }
}
