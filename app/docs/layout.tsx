import type { Metadata } from "next"
import { docs, site } from "@/site.config"

export const metadata: Metadata = {
  title: docs.heading,
  description: docs.body,
  openGraph: {
    title: `${site.name} ${docs.heading}`,
    description: docs.body,
    images: [{ url: site.ogImage, width: 1200, height: 630, alt: `${site.name} ${docs.heading}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} ${docs.heading}`,
    description: docs.body,
    images: [site.ogImage],
  },
  alternates: { canonical: "/docs" },
}

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
