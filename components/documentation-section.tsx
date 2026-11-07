import { docs, install } from "@/site.config"
import { InstallCommand } from "./install-command"
import { QuickStart } from "./quick-start"

/**
 * /docs 페이지 본문.
 *
 * 여기서 문서를 다 쓰려 하지 않는다 — 정본은 저장소의 README/docs 다. 이 페이지는
 * "설치 → 첫 예제 → 어디로 갈지"만 책임진다. 문서를 두 곳에 쓰면 반드시 갈라진다.
 */
export default function DocumentationSection() {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      {/* 머리말 */}
      <div className="self-stretch px-6 md:px-24 py-12 md:py-16 border-b border-[rgba(55,50,47,0.12)] flex justify-center items-center">
        <div className="w-full max-w-[586px] flex flex-col justify-start items-center gap-4 text-center">
          <h1 className="text-[#49423D] text-3xl md:text-5xl font-semibold leading-tight font-sans tracking-tight">
            {docs.heading}
          </h1>
          <p className="text-[#605A57] text-sm sm:text-base leading-7 font-sans">{docs.body}</p>
          {docs.externalUrl && (
            <a
              href={docs.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 px-6 flex items-center rounded-full bg-[#37322F] text-white text-sm font-medium font-sans hover:bg-[#2A2520] transition-colors"
            >
              Full documentation →
            </a>
          )}
        </div>
      </div>

      {/* 1. 설치 */}
      <div className="self-stretch px-6 md:px-24 py-12 border-b border-[rgba(55,50,47,0.12)] flex flex-col items-center gap-5">
        <h2 className="text-[#37322F] text-xl md:text-2xl font-semibold font-sans">
          1. Install
        </h2>
        <InstallCommand id="docs-install" />
        <p className="text-[rgba(55,50,47,0.55)] text-xs font-sans">
          Requires {install.options[0]?.label ?? "a package manager"}.
        </p>
      </div>

      {/* 2. 첫 예제 */}
      <div className="self-stretch px-6 md:px-24 py-12 border-b border-[rgba(55,50,47,0.12)] flex flex-col items-center gap-5">
        <h2 className="text-[#37322F] text-xl md:text-2xl font-semibold font-sans">
          2. Run your first call
        </h2>
        <QuickStart />
      </div>

      {/* 3. 더 읽기 */}
      <div className="self-stretch px-6 md:px-24 py-12 border-b border-[rgba(55,50,47,0.12)] flex flex-col items-center gap-6">
        <h2 className="text-[#37322F] text-xl md:text-2xl font-semibold font-sans">
          3. Go deeper
        </h2>
        <div className="w-full max-w-[720px] grid grid-cols-1 sm:grid-cols-2 gap-3">
          {docs.guides.map((g) => (
            <a
              key={g.title}
              href={g.href}
              target={g.href.startsWith("http") ? "_blank" : undefined}
              rel={g.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="p-5 rounded-xl bg-white border border-[rgba(55,50,47,0.12)] hover:border-[rgba(55,50,47,0.3)] hover:shadow-md transition-all flex flex-col gap-1.5"
            >
              <span className="text-[#37322F] text-base font-medium font-sans">{g.title}</span>
              <span className="text-[#605A57] text-sm leading-6 font-sans">{g.description}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
