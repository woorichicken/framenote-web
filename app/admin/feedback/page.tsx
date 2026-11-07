import { Metadata } from "next";
import { db, feedbacks, type Feedback } from "@/lib/db";
import { desc } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";
import FeedbackAdminClient from "./feedback-admin-client";
import { PageWrapper } from "@/components/page-wrapper";

export const metadata: Metadata = {
  title: "Feedback Admin",
  robots: { index: false, follow: false },
  description: "Manage user feedback.",
};

async function getFeedbacks(): Promise<Feedback[]> {
  noStore();
  try {
    return await db.select().from(feedbacks).orderBy(desc(feedbacks.createdAt));
  } catch (error) {
    console.error("Failed to fetch feedbacks:", error);
    return [];
  }
}

export default async function FeedbackAdminPage() {
  const allFeedbacks = await getFeedbacks();

  return (
    <PageWrapper>
      <FeedbackAdminClient feedbacks={allFeedbacks} />
    </PageWrapper>
  );
}
