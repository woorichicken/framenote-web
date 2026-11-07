import Link from "next/link"
import { footer, site } from "@/site.config"

function isExternal(href: string) {
  return href.startsWith("http") || href.startsWith("mailto:")
}

export default function FooterSection() {
  return (
    <div className="w-full pt-10 flex flex-col justify-start items-start">
      <div className="self-stretch h-auto flex flex-col md:flex-row justify-between items-stretch pr-0 pb-8 pt-0">
        {/* 브랜드 */}
        <div className="h-auto p-4 md:p-8 flex flex-col justify-start items-start gap-6">
          <Link href="/" className="self-stretch flex justify-start items-center gap-3">
            <img
              src={site.logo}
              alt={`${site.name} logo`}
              className="w-6 h-6 rounded-md object-cover border border-[rgba(55,50,47,0.08)]"
            />
            <span className="text-[#49423D] text-xl font-semibold leading-4 font-sans">
              {site.name}
            </span>
          </Link>
          <p className="text-[rgba(73,66,61,0.90)] text-sm font-medium leading-[18px] font-sans max-w-[280px]">
            {site.tagline}
          </p>
          <p className="text-[rgba(73,66,61,0.55)] text-xs font-sans">
            Released under the {site.license} License.
          </p>
        </div>

        {/* 링크 열 — site.config 의 footer.columns 가 정본 */}
        <div className="self-stretch p-4 md:p-8 flex flex-col sm:flex-row flex-wrap justify-start sm:justify-between items-start gap-6 md:gap-8">
          {footer.columns.map((col) => (
            <div key={col.title} className="flex flex-col justify-start items-start gap-3 flex-1 min-w-[120px]">
              <div className="text-[rgba(73,66,61,0.50)] text-sm font-medium leading-5 font-sans">
                {col.title}
              </div>
              <div className="flex flex-col justify-start items-start gap-2">
                {col.links.map((link) =>
                  isExternal(link.href) ? (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#49423D] text-sm font-normal leading-5 font-sans hover:text-[#37322F] transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-[#49423D] text-sm font-normal leading-5 font-sans hover:text-[#37322F] transition-colors"
                    >
                      {link.label}
                    </Link>
                  ),
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 패턴 — 장식 */}
      <div
        className="self-stretch h-12 relative overflow-hidden border-t border-b border-[rgba(55,50,47,0.12)]"
        aria-hidden="true"
      >
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <div className="w-full h-full relative">
            {Array.from({ length: 400 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-[300px] h-16 border border-[rgba(3,7,18,0.08)]"
                style={{
                  left: `${i * 300 - 600}px`,
                  top: "-120px",
                  transform: "rotate(-45deg)",
                  transformOrigin: "top left",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
