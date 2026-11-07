"use client";

import { motion } from "framer-motion";
import type { Roadmap } from "@/lib/db";

type Status = "in-progress" | "planned" | "completed";

interface RoadmapClientProps {
  roadmaps: Roadmap[];
}

function StatusBadge({ status }: { status: Status }) {
  const styles = {
    "in-progress": "bg-blue-100 text-blue-700 border-blue-200",
    planned: "bg-gray-100 text-gray-600 border-gray-200",
    completed: "bg-green-100 text-green-700 border-green-200",
  };

  const labels = {
    "in-progress": "In Progress",
    planned: "Planned",
    completed: "Completed",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

export function RoadmapClient({ roadmaps }: RoadmapClientProps) {
  const inProgress = roadmaps.filter((i) => i.status === "in-progress");
  const planned = roadmaps.filter((i) => i.status === "planned");
  const completed = roadmaps.filter((i) => i.status === "completed");

  return (
    <div className="space-y-12">
      {/* In Progress Section */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <h2 className="text-xl font-semibold text-[#37322F] font-serif">
            In Progress
          </h2>
        </div>
        <div className="space-y-4">
            {inProgress.map((item) => (
            <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl border border-[rgba(55,50,47,0.08)] p-5 shadow-sm hover:shadow-md transition-shadow"
            >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={item.status as Status} />
                    <span className="text-xs text-gray-400 font-sans">{item.category}</span>
                  </div>
                  {item.date && (
                    <span className="text-xs text-gray-400 font-sans font-medium">{item.date}</span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-[#37322F] font-serif mb-2">
                {item.title}
                </h3>
                <p className="text-[#605A57] text-sm leading-relaxed font-sans">
                {item.description}
                </p>
            </motion.div>
            ))}
        </div>
      </section>

      {/* Planned Section */}
      {planned.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-gray-300" />
            <h2 className="text-xl font-semibold text-[#37322F] font-serif">
              Planned
            </h2>
          </div>
          <div className="space-y-4">
            {planned.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-50/50 rounded-xl border border-[rgba(55,50,47,0.06)] p-5"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={item.status as Status} />
                    <span className="text-xs text-gray-400 font-sans">{item.category}</span>
                  </div>
                  {item.date && (
                    <span className="text-xs text-gray-400 font-sans font-medium">{item.date}</span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-[#37322F] font-serif mb-2">
                  {item.title}
                </h3>
                <p className="text-[#605A57] text-sm leading-relaxed font-sans">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Completed Section */}
      {completed.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <h2 className="text-xl font-semibold text-[#37322F] font-serif">
              Completed
            </h2>
          </div>
          <div className="space-y-4">
            {completed.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-green-50/50 rounded-xl border border-green-100 p-5"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={item.status as Status} />
                    <span className="text-xs text-gray-400 font-sans">{item.category}</span>
                  </div>
                  {item.date && (
                    <span className="text-xs text-gray-400 font-sans font-medium">{item.date}</span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-[#37322F] font-serif mb-2">
                  {item.title}
                </h3>
                <p className="text-[#605A57] text-sm leading-relaxed font-sans">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {roadmaps.length === 0 && (
        <div className="py-12 text-center text-gray-500">
          No roadmap items available yet.
        </div>
      )}
    </div>
  );
}
