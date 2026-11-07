import { pgTable, serial, text, timestamp, jsonb, boolean, integer } from "drizzle-orm/pg-core";

// Changelog 아이템 타입 (improvements, fixes, patches에 들어가는 항목)
export type ChangelogItem = {
  text: string;
};

// changelogs 테이블 정의
export const changelogs = pgTable("changelogs", {
  id: serial("id").primaryKey(),
  version: text("version").notNull(),
  date: text("date").notNull(), // "Dec 17, 2025" 형식
  title: text("title").notNull(),
  description: text("description").notNull(),
  // JSON 배열로 저장 (각각 { text: string } 형태)
  improvements: jsonb("improvements").$type<ChangelogItem[]>().default([]),
  fixes: jsonb("fixes").$type<ChangelogItem[]>().default([]),
  patches: jsonb("patches").$type<ChangelogItem[]>().default([]),
  // 주요 changelog 여부 및 유튜브 URL (선택)
  isFeatured: boolean("is_featured").default(false).notNull(),
  youtubeUrl: text("youtube_url"),
  // 생성/수정 시간
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const feedbacks = pgTable("feedbacks", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  category: text("category").notNull().default("OTHER"), // ISSUE, IDEA, OTHER
  name: text("name"), // Optional name
  isAnonymous: boolean("is_anonymous").default(true).notNull(),
  likes: integer("likes").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const feedbackComments = pgTable("feedback_comments", {
  id: serial("id").primaryKey(),
  feedbackId: integer("feedback_id")
    .references(() => feedbacks.id, { onDelete: "cascade" })
    .notNull(),
  content: text("content").notNull(),
  name: text("name"),
  isAnonymous: boolean("is_anonymous").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// TypeScript 타입 추출
export type Feedback = typeof feedbacks.$inferSelect;
export type NewFeedback = typeof feedbacks.$inferInsert;

export type FeedbackComment = typeof feedbackComments.$inferSelect;
export type NewFeedbackComment = typeof feedbackComments.$inferInsert;

// TypeScript 타입 추출
export type Changelog = typeof changelogs.$inferSelect;
export type NewChangelog = typeof changelogs.$inferInsert;

// Roadmap 상태 타입
export type RoadmapStatus = "in-progress" | "planned" | "completed";

// roadmaps 테이블 정의
export const roadmaps = pgTable("roadmaps", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").$type<RoadmapStatus>().notNull().default("planned"),
  category: text("category").notNull(), // Feature, Backend, Admin 등
  date: text("date"), // "Q1 2026", "Dec 2025" 형식 (선택)
  order: integer("order").default(0).notNull(), // 정렬 순서
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// TypeScript 타입 추출
export type Roadmap = typeof roadmaps.$inferSelect;
export type NewRoadmap = typeof roadmaps.$inferInsert;
