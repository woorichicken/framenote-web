import type React from "react"
import type { Metadata } from "next"
import { Inter, Instrument_Serif, Noto_Sans_KR, Noto_Serif_KR } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { GoogleAnalytics } from "@/components/google-analytics"
import FeedbackWidget from "@/components/feedback/FeedbackWidget"
import { repo, repoUrl, site, verification } from "@/site.config"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
})

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  weight: ["400"],
  display: "swap",
  preload: true,
})

// Inter·Instrument Serif 에는 한글이 없다. 그대로 두면 제목이 OS 기본 명조로 떨어져 기기마다 달라진다.
// 한글 글꼴은 조각이 많아 미리 받지 않는다(preload: false) — 첫 화면 무게를 늘리지 않기 위해서다.
const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: false,
})

const notoSerifKr = Noto_Serif_KR({
  variable: "--font-noto-serif-kr",
  weight: ["500", "700"],
  display: "swap",
  preload: false,
})

/**
 * 메타데이터는 전부 site.config 에서 온다.
 * 여기에 문자열을 직접 쓰면 다음 프로젝트가 이 파일도 고쳐야 한다.
 */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [...site.keywords],
  authors: [{ name: repo.owner, url: `https://github.com/${repo.owner}` }],
  creator: repo.owner,
  publisher: repo.owner,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: site.url,
    images: [{ url: site.ogImage, width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: [site.ogImage],
  },
  alternates: { canonical: "/" },
  // 값이 없으면 키 자체를 넣지 않는다 — 빈 verification 태그는 검증 실패로 잡힌다.
  ...(Object.keys(verification).length > 0 ? { verification: { other: verification } } : {}),
  category: "Developer Tools",
  other: { "github:repository": repoUrl },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={site.lang}
      className={`${inter.variable} ${instrumentSerif.variable} ${notoSansKr.variable} ${notoSerifKr.variable} antialiased`}
    >
      <body className="font-sans antialiased">
        {children}
        <Analytics />
        <GoogleAnalytics />
        <FeedbackWidget />
      </body>
    </html>
  )
}
