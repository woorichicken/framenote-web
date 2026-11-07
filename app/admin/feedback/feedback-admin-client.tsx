"use client";

import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { deleteFeedback } from "@/app/feedback/actions";
import type { Feedback } from "@/lib/db";

// 카테고리 뱃지
function CategoryBadge({ category }: { category: string }) {
  const styles: Record<string, string> = {
    ISSUE: "bg-red-100 text-red-700",
    IDEA: "bg-blue-100 text-blue-700",
    OTHER: "bg-gray-100 text-gray-700",
  };
  const labels: Record<string, string> = {
    ISSUE: "Bug Report",
    IDEA: "Feature Request",
    OTHER: "Other",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[category] || styles.OTHER}`}>
      {labels[category] || "Other"}
    </span>
  );
}

export default function FeedbackAdminClient({ feedbacks }: { feedbacks: Feedback[] }) {
  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this feedback?")) {
      await deleteFeedback(id);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold text-[#37322F]">Feedback Management</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[rgba(55,50,47,0.08)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-[rgba(55,50,47,0.08)]">
              <tr>
                <th className="px-6 py-4 font-medium text-gray-500">ID</th>
                <th className="px-6 py-4 font-medium text-gray-500">Category</th>
                <th className="px-6 py-4 font-medium text-gray-500">User</th>
                <th className="px-6 py-4 font-medium text-gray-500 w-1/3">Content</th>
                <th className="px-6 py-4 font-medium text-gray-500">Likes</th>
                <th className="px-6 py-4 font-medium text-gray-500">Date</th>
                <th className="px-6 py-4 font-medium text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(55,50,47,0.08)]">
              {feedbacks.map((fb) => (
                <tr key={fb.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-gray-400">#{fb.id}</td>
                  <td className="px-6 py-4">
                    <CategoryBadge category={fb.category} />
                  </td>
                  <td className="px-6 py-4 font-medium text-[#37322F]">
                    {fb.isAnonymous ? (
                      <span className="text-gray-400 italic">Anonymous</span>
                    ) : (
                      fb.name
                    )}
                  </td>
                  <td className="px-6 py-4 text-[#605A57] truncate max-w-xs" title={fb.content}>
                    {fb.content}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{fb.likes}</td>
                  <td className="px-6 py-4 text-[#605A57]">
                    {new Date(fb.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(fb.id)}
                      className="text-gray-400 hover:text-red-500 p-1 hover:bg-red-50 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {feedbacks.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    No feedback items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
