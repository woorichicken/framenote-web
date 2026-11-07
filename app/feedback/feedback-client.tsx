"use client";

import { useState } from "react";
import { MessageSquare, Heart, Send, User, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createFeedback, likeFeedback, createComment } from "./actions";

// Types
type Comment = {
  id: number;
  content: string;
  name: string | null;
  isAnonymous: boolean;
  createdAt: Date;
};

type FeedbackCategory = "ISSUE" | "IDEA" | "OTHER";

type Feedback = {
  id: number;
  content: string;
  category: string;
  name: string | null;
  isAnonymous: boolean;
  likes: number;
  createdAt: Date;
  comments: Comment[];
};

export function FeedbackClient({ initialFeedbacks }: { initialFeedbacks: Feedback[] }) {
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<FeedbackCategory>("IDEA");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [filter, setFilter] = useState<FeedbackCategory | "ALL">("ALL");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("content", content);
    formData.append("category", category);
    formData.append("isAnonymous", String(isAnonymous));
    if (!isAnonymous) formData.append("name", name);

    await createFeedback(formData);
    setContent("");
    setCategory("IDEA");
    setIsSubmitting(false);
  }

  const filteredFeedbacks = initialFeedbacks.filter(
    (item) => filter === "ALL" || item.category === filter
  );

  return (
    <div>
      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 mb-8 border-b border-[rgba(55,50,47,0.08)] pb-1">
        <button
            onClick={() => setFilter("ALL")}
            className={`pb-3 px-1 text-sm font-medium transition-colors relative ${filter === "ALL" ? "text-[#37322F]" : "text-gray-400 hover:text-gray-600"}`}
        >
            All
            {filter === "ALL" && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#37322F]" />
            )}
        </button>
        <button
            onClick={() => setFilter("IDEA")}
            className={`pb-3 px-1 text-sm font-medium transition-colors relative ${filter === "IDEA" ? "text-[#37322F]" : "text-gray-400 hover:text-gray-600"}`}
        >
            Feature Request
            {filter === "IDEA" && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#37322F]" />
            )}
        </button>
        <button
            onClick={() => setFilter("ISSUE")}
            className={`pb-3 px-1 text-sm font-medium transition-colors relative ${filter === "ISSUE" ? "text-[#37322F]" : "text-gray-400 hover:text-gray-600"}`}
        >
            Bug Report
            {filter === "ISSUE" && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#37322F]" />
            )}
        </button>
         <button
            onClick={() => setFilter("OTHER")}
            className={`pb-3 px-1 text-sm font-medium transition-colors relative ${filter === "OTHER" ? "text-[#37322F]" : "text-gray-400 hover:text-gray-600"}`}
        >
            Other
            {filter === "OTHER" && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#37322F]" />
            )}
        </button>
      </div>
      {/* Post Form */}
      <div className="mb-12 bg-white rounded-2xl border border-[rgba(55,50,47,0.08)] p-6 shadow-sm">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2 mb-4">
             <button
                type="button"
                onClick={() => setCategory("IDEA")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors ${category === "IDEA" ? "bg-[#37322F] text-white border-[#37322F]" : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"}`}
             >
                Feature Request
             </button>
             <button
                type="button"
                onClick={() => setCategory("ISSUE")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors ${category === "ISSUE" ? "bg-[#37322F] text-white border-[#37322F]" : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"}`}
             >
                Bug Report
             </button>
             <button
                type="button"
                onClick={() => setCategory("OTHER")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors ${category === "OTHER" ? "bg-[#37322F] text-white border-[#37322F]" : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"}`}
             >
                Other
             </button>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full min-h-[100px] bg-transparent border-0 resize-none focus:ring-0 text-[#37322F] placeholder:text-gray-400 text-lg mb-4 font-sans"
            required
          />
          
          <div className="flex items-center justify-between pt-4 border-t border-[rgba(55,50,47,0.08)]">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${isAnonymous ? 'bg-[#37322F] border-[#37322F]' : 'border-gray-300'}`}>
                  {isAnonymous && <Check size={12} className="text-white" />}
                </div>
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="hidden"
                />
                <span className="text-sm text-[#605A57] font-medium group-hover:text-[#37322F] transition-colors">
                  Anonymous
                </span>
              </label>

              {!isAnonymous && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-[#37322F] w-40"
                    required={!isAnonymous}
                  />
                </motion.div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="px-6 py-2 bg-[#37322F] text-white rounded-full text-sm font-medium hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? "Posting..." : "Post Feedback"}
              <Send size={14} />
            </button>
          </div>
        </form>
      </div>

      {/* Feedback List */}
      <div className="space-y-6">
        {filteredFeedbacks.map((item) => (
          <FeedbackItem key={item.id} item={item} />
        ))}
        {filteredFeedbacks.length === 0 && (
            <div className="text-center text-gray-400 py-10">
                No feedback found for this category.
            </div>
        )}
      </div>
    </div>
  );
}

function CategoryBadge({ category }: { category: string }) {
    switch (category) {
        case "ISSUE":
            return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-transparent text-gray-500 border border-gray-200 uppercase tracking-wider">Bug Report</span>;
        case "IDEA":
            return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-transparent text-gray-500 border border-gray-200 uppercase tracking-wider">Feature Request</span>;
        default:
            return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-transparent text-gray-500 border border-gray-200 uppercase tracking-wider">Other</span>;
    }
}

function FeedbackItem({ item }: { item: Feedback }) {
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [cmtName, setCmtName] = useState("");
  const [cmtAnonymous, setCmtAnonymous] = useState(true);
  const [isSubmittingCmt, setIsSubmittingCmt] = useState(false);

  // 좋아요 수를 클라이언트 상태로 관리 (스크롤 위치 유지를 위해)
  const [likes, setLikes] = useState(item.likes);
  const [isLiking, setIsLiking] = useState(false);

  async function handleLike() {
    if (isLiking) return;

    // 낙관적 업데이트: 즉시 UI 반영
    setIsLiking(true);
    setLikes((prev) => prev + 1);

    try {
      await likeFeedback(item.id);
    } catch {
      // 실패 시 롤백
      setLikes((prev) => prev - 1);
    } finally {
      setIsLiking(false);
    }
  }

  async function handleCommentSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!commentContent.trim()) return;

    setIsSubmittingCmt(true);
    const formData = new FormData();
    formData.append("feedbackId", item.id.toString());
    formData.append("content", commentContent);
    formData.append("isAnonymous", String(cmtAnonymous));
    if (!cmtAnonymous) formData.append("name", cmtName);

    await createComment(formData);
    setCommentContent("");
    setIsSubmittingCmt(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-[rgba(55,50,47,0.08)] p-6 sm:p-8"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            {item.isAnonymous ? (
              <User size={16} className="text-gray-400" />
            ) : (
                <span className="text-xs font-bold text-[#37322F]">
                    {item.name ? item.name.charAt(0).toUpperCase() : "U"}
                </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
                <div className="text-sm font-semibold text-[#37322F] font-sans">
                  {item.isAnonymous ? "Anonymous User" : item.name}
                </div>
                <CategoryBadge category={item.category} />
            </div>
            <div className="text-xs text-gray-400">
              {new Date(item.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
            </div>
          </div>
        </div>
      </div>

      <div className="text-[#37322F] text-base leading-relaxed mb-6 whitespace-pre-wrap font-sans">
        {item.content}
      </div>

      <div className="flex items-center gap-6 border-t border-[rgba(55,50,47,0.08)] pt-4">
        <button
          onClick={handleLike}
          disabled={isLiking}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-red-500 transition-colors group disabled:opacity-50"
        >
          <Heart size={18} className={likes > 0 ? "fill-red-500 text-red-500" : "group-hover:text-red-500"} />
          <span>{likes}</span>
        </button>
        <button
          onClick={() => setIsCommenting(!isCommenting)}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#37322F] transition-colors"
        >
          <MessageSquare size={18} />
          <span>{item.comments.length}</span>
        </button>
      </div>

      <AnimatePresence>
        {isCommenting && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-6 mt-4 border-t border-[rgba(55,50,47,0.08)] bg-gray-50/50 -mx-6 -mb-6 px-6 pb-6 sm:-mx-8 sm:px-8">
              {/* Comment List */}
              <div className="space-y-4 mb-6">
                {item.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="mt-1 w-6 h-6 rounded-full bg-white border border-gray-100 flex items-center justify-center flex-shrink-0">
                         {comment.isAnonymous ? (
                             <User size={12} className="text-gray-400" />
                         ) : (
                             <span className="text-[10px] font-bold text-[#37322F]">
                                 {comment.name ? comment.name.charAt(0).toUpperCase() : "U"}
                             </span>
                         )}
                    </div>
                    <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 text-sm shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-[#37322F] text-xs">
                           {comment.isAnonymous ? "Anonymous" : comment.name}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(comment.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                        </span>
                      </div>
                      <p className="text-[#605A57]">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comment Form */}
              <form onSubmit={handleCommentSubmit} className="flex flex-col gap-3">
                 <textarea
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#37322F] resize-none"
                    rows={2}
                    required
                  />
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                         <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={cmtAnonymous}
                              onChange={(e) => setCmtAnonymous(e.target.checked)}
                              className="w-3 h-3 accent-[#37322F]"
                            />
                            <span className="text-xs text-gray-500 font-medium">Anonymous</span>
                         </label>
                         {!cmtAnonymous && (
                             <input 
                                type="text" 
                                value={cmtName}
                                onChange={(e) => setCmtName(e.target.value)}
                                placeholder="Name"
                                className="bg-white border border-gray-200 rounded-md px-2 py-1 text-xs w-24"
                                required
                             />
                         )}
                     </div>
                     <button
                        type="submit"
                        disabled={isSubmittingCmt || !commentContent.trim()}
                        className="text-xs font-semibold text-[#37322F] hover:underline disabled:opacity-50 disabled:no-underline"
                     >
                        Post
                     </button>
                  </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
