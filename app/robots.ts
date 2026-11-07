import type { MetadataRoute } from "next"
import { site } from "@/site.config"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // 관리 화면은 색인하지 않는다. 인증은 별개로 걸려 있어야 한다 —
        // robots 는 요청이지 접근 통제가 아니다.
        disallow: ["/admin", "/admin/", "/api/"],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  }
}
