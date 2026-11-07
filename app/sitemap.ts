import type { MetadataRoute } from "next"
import { site } from "@/site.config"

/**
 * 실제로 존재하는 라우트만 넣는다. 없는 URL 을 사이트맵에 넣으면 색인기가 404 를
 * 받아 사이트 전체 신뢰도를 깎는다 — 페이지를 지우면 여기서도 지운다.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/docs", priority: 0.9, changeFrequency: "weekly" },
    { path: "/changelog", priority: 0.8, changeFrequency: "weekly" },
    { path: "/roadmap", priority: 0.7, changeFrequency: "weekly" },
    { path: "/feedback", priority: 0.6, changeFrequency: "weekly" },
  ]

  return routes.map((r) => ({
    url: `${site.url}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))
}
