import { Metadata } from "next";
import { db, feedbacks, feedbackComments, type Feedback, type FeedbackComment } from "@/lib/db";
import { desc, eq } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";
import { PageWrapper } from "../../components/page-wrapper";
import { FeedbackClient } from "./feedback-client";

export const metadata: Metadata = {
  title: "Feedback",
  description: "Share your thoughts and suggestions anonymously.",
};

// 피드백과 댓글을 함께 가져오는 타입
type FeedbackWithComments = Feedback & {
  comments: FeedbackComment[];
};

// DB에서 피드백과 댓글 가져오기
async function getFeedbacksWithComments(): Promise<FeedbackWithComments[]> {
  noStore(); // 캐싱 비활성화
  try {
    // 모든 피드백 가져오기
    const allFeedbacks = await db
      .select()
      .from(feedbacks)
      .orderBy(desc(feedbacks.createdAt));

    // 각 피드백에 대한 댓글 가져오기
    const feedbacksWithComments = await Promise.all(
      allFeedbacks.map(async (feedback) => {
        const comments = await db
          .select()
          .from(feedbackComments)
          .where(eq(feedbackComments.feedbackId, feedback.id))
          .orderBy(desc(feedbackComments.createdAt));
        return { ...feedback, comments };
      })
    );

    return feedbacksWithComments;
  } catch (error) {
    console.error("Failed to fetch feedbacks:", error);
    return [];
  }
}

export default async function FeedbackPage() {
  const feedbacksWithComments = await getFeedbacksWithComments();

  return (
    <PageWrapper>
      <div className="w-full max-w-2xl mx-auto px-4 md:px-0">
        <div className="pt-8 pb-12 border-b border-[rgba(55,50,47,0.12)] mb-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-[#37322F] mb-4">
            Feedback
          </h1>
          <p className="text-lg text-[#605A57] font-sans">
            We'd love to hear your thoughts. Share your feedback, ideas, or just say hello.
          </p>
        </div>

        <FeedbackClient initialFeedbacks={feedbacksWithComments} /> 
      </div>
    </PageWrapper>
  );
}
