import type { Metadata } from "next";
import { db, changelogs, type Changelog } from "@/lib/db";
import { desc } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";
import { PageWrapper } from "../../components/page-wrapper";
import { ChangelogClient } from "./changelog-client";
import { site, labels } from "@/site.config";

export const metadata: Metadata = {
  title: labels.changelog.title,
  description: labels.changelog.metaDescription,
  openGraph: {
    title: `${site.name} ${labels.changelog.title}`,
    description: labels.changelog.metaDescription,
    images: [{ url: site.ogImage, width: 1200, height: 630, alt: `${site.name} ${labels.changelog.title}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} ${labels.changelog.title}`,
    description: labels.changelog.metaShort,
    images: [site.ogImage],
  },
  alternates: { canonical: "/changelog" },
};

// Fetch data from server
async function getChangelogs(): Promise<Changelog[]> {
  noStore(); // Disable caching completely
  try {
    const result = await db
      .select()
      .from(changelogs)
      .orderBy(desc(changelogs.createdAt));
    return result;
  } catch (error) {
    console.error("Failed to fetch changelogs:", error);
    return [];
  }
}

// --- Main Page (Server Component) ---
export default async function ChangelogPage() {
  const data = await getChangelogs();

  return (
    <PageWrapper>
      <div className="w-full max-w-4xl mx-auto px-4 md:px-0">
        {/* Page Header */}
        <div className="pt-8 pb-12 md:pb-20 border-b border-[rgba(55,50,47,0.12)] mb-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-[#37322F] mb-4">
            {labels.changelog.heading}
          </h1>
          <p className="text-lg text-[#605A57] font-sans max-w-2xl">
            {labels.changelog.body}
          </p>
        </div>

        {/* Changelog List */}
        <div className="flex flex-col">
          <div className="flex md:hidden text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-1">
            <span className="w-1/4">{labels.changelog.version}</span>
            <span className="w-3/4 pl-8">{labels.changelog.description}</span>
          </div>

          {/* Desktop Header for columns */}
          <div className="hidden md:flex text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-1">
            <div className="w-1/4">{labels.changelog.version}</div>
            <div className="w-3/4">{labels.changelog.description}</div>
          </div>

          <div className="w-full h-[1px] bg-[rgba(55,50,47,0.08)] mb-4"></div>

          {data.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              {labels.changelog.empty}
            </div>
          ) : (
            <ChangelogClient changelogs={data} />
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
