"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Play, Star } from "lucide-react";
import type { Changelog, ChangelogItem } from "@/lib/db";

// --- Helper Functions ---

// Extract video ID from YouTube URL
function getYoutubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// --- Components ---

// Featured Changelog YouTube card
function FeaturedChangelogCard({ changelog }: { changelog: Changelog }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = changelog.youtubeUrl ? getYoutubeVideoId(changelog.youtubeUrl) : null;
  const thumbnailUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : null;

  if (!videoId) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full mb-10 rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        padding: "2px",
      }}
    >
      <div className="bg-white rounded-[14px] overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left: Content */}
          <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                Featured Update
              </span>
              <span className="text-sm text-gray-500">{changelog.version}</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-[#37322F] mb-2 font-serif">
              {changelog.title}
            </h3>
            <p className="text-[#605A57] text-sm mb-4 line-clamp-2">
              {changelog.description}
            </p>
            <div className="text-sm text-gray-400">{changelog.date}</div>
          </div>

          {/* Right: Video Thumbnail/Player */}
          <div className="md:w-[45%] aspect-video relative">
            {!isPlaying ? (
              <div className="relative w-full h-full group cursor-pointer" onClick={() => setIsPlaying(true)}>
                <img
                  src={thumbnailUrl!}
                  alt={changelog.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play size={32} className="text-[#37322F] ml-1" fill="currentColor" />
                  </div>
                </div>
              </div>
            ) : (
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title={changelog.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ChangelogSection({
  title,
  items,
  defaultOpen = false,
}: {
  title: string;
  items: ChangelogItem[];
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const isEmpty = items.length === 0;

  return (
    <div className="w-full border-b border-[rgba(55,50,47,0.08)] last:border-0">
      <button
        onClick={() => !isEmpty && setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between py-2 text-left group ${isEmpty ? "cursor-default opacity-60" : "cursor-pointer"}`}
      >
        <span className="text-sm font-medium text-[#37322F] font-sans">
          {title} ({items.length})
        </span>
        {!isEmpty && (
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown
              size={14}
              className="text-gray-400 group-hover:text-gray-600"
            />
          </motion.div>
        )}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && !isEmpty && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-3 pl-4 pr-4">
              <ul className="list-disc space-y-1 marker:text-gray-300 ml-4">
                {items.map((item, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-[#605A57] leading-relaxed font-sans pl-1"
                  >
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChangelogRow({ entry }: { entry: Changelog }) {
  // Null check (null values can come from DB)
  const improvements = entry.improvements || [];
  const fixes = entry.fixes || [];
  const patches = entry.patches || [];

  return (
    <div className="flex flex-col md:flex-row gap-8 py-8 md:py-10 border-b border-[rgba(55,50,47,0.08)] last:border-0">
      {/* Left Column: Version & Date */}
      <div className="md:w-1/4 flex flex-col gap-1">
        <div className="text-sm font-medium text-[#37322F] font-sans">
          {entry.version}
        </div>
        <div className="text-sm text-gray-500 font-sans">{entry.date}</div>
      </div>

      {/* Right Column: Content */}
      <div className="md:w-3/4 flex flex-col gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-[#37322F] font-serif mb-2">
            {entry.title}
          </h2>
          <p className="text-[#605A57] leading-relaxed font-sans text-sm">
            {entry.description}
          </p>
        </div>

        {/* Toggles */}
        <div className="bg-white rounded-xl border border-[rgba(55,50,47,0.08)] px-4 shadow-sm mt-2">
          <ChangelogSection
            title="Improvements"
            items={improvements}
            defaultOpen={improvements.length > 0}
          />
          <ChangelogSection title="Fixes" items={fixes} />
          <ChangelogSection title="Patches" items={patches} />
        </div>
      </div>
    </div>
  );
}

// --- Exported Client Component ---
export function ChangelogClient({ changelogs }: { changelogs: Changelog[] }) {
  // Find featured changelog with YouTube URL (most recent one only)
  const featuredChangelog = changelogs.find(
    (c) => c.isFeatured && c.youtubeUrl
  );

  return (
    <>
      {/* Featured Changelog card (only when YouTube URL exists) */}
      {featuredChangelog && (
        <FeaturedChangelogCard changelog={featuredChangelog} />
      )}

      {/* Changelog list */}
      {changelogs.map((entry) => (
        <ChangelogRow key={entry.id} entry={entry} />
      ))}
    </>
  );
}
