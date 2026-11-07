"use client"

import { useState } from "react"
import Link from "next/link"
import { nav, repoUrl, site } from "@/site.config"

/**
 * 헤더 메뉴는 site.config 의 `nav` 가 정본이다.
 * 여기에 링크를 직접 쓰면 다음 프로젝트가 이 파일까지 뒤져야 한다.
 */
export function SiteHeader() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)

  return (
    <>
      <div className="w-full h-12 sm:h-14 md:h-16 lg:h-[84px] absolute left-0 top-0 flex justify-center items-center z-50 px-6 sm:px-8 md:px-12 lg:px-0">
        <div className="w-full h-0 absolute left-0 top-6 sm:top-7 md:top-8 lg:top-[42px] border-t border-[rgba(55,50,47,0.12)] shadow-[0px_1px_0px_white]" />

        <div className="w-full max-w-[calc(100%-32px)] sm:max-w-[calc(100%-48px)] md:max-w-[calc(100%-64px)] lg:max-w-[780px] lg:w-[780px] h-10 sm:h-11 md:h-12 py-1.5 sm:py-2 px-3 sm:px-4 pr-2 sm:pr-3 bg-[#F7F5F3] backdrop-blur-sm shadow-[0px_0px_0px_2px_white] rounded-[50px] flex justify-between items-center relative z-30">
          {/* 모바일 햄버거 */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="sm:hidden flex flex-col justify-center items-center w-8 h-8 rounded-full hover:bg-[rgba(55,50,47,0.05)] transition-all duration-200"
            aria-label="Open menu"
          >
            <span className="block w-4 h-0.5 bg-[#2F3037]" />
            <span className="block w-4 h-0.5 bg-[#2F3037] my-1" />
            <span className="block w-4 h-0.5 bg-[#2F3037]" />
          </button>

          <div className="flex justify-center items-center sm:flex-1 sm:justify-start">
            <Link href="/" className="flex justify-start items-center gap-2 cursor-pointer">
              <img
                src={site.logo}
                alt={`${site.name} logo`}
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-md object-cover border border-[rgba(55,50,47,0.08)]"
              />
              <span className="text-[#2F3037] text-sm sm:text-base md:text-lg lg:text-xl font-medium leading-5 font-sans">
                {site.name}
              </span>
            </Link>

            {/* 데스크탑 드롭다운 */}
            <div className="pl-3 sm:pl-4 md:pl-5 hidden sm:flex flex-row gap-1 md:gap-2">
              {nav.map((menu) => (
                <div
                  key={menu.label}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(menu.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className="flex items-center gap-1 px-2 md:px-3 py-1.5 rounded-full text-[rgba(49,45,43,0.80)] text-xs md:text-[13px] font-medium font-sans hover:bg-[rgba(55,50,47,0.05)] transition-colors">
                    {menu.label}
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className={`transition-transform duration-200 ${activeDropdown === menu.label ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>

                  {activeDropdown === menu.label && (
                    <div className="absolute left-0 top-full pt-2 w-52 z-50">
                      <div className="bg-white rounded-xl shadow-lg border border-[rgba(55,50,47,0.12)] overflow-hidden py-1">
                        {menu.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="block px-4 py-2 text-sm text-[#2F3037] hover:bg-[rgba(55,50,47,0.05)] transition-colors"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* GitHub 버튼 — OSS 사이트의 기본 CTA */}
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="h-7 sm:h-8 flex justify-center items-center gap-1.5 px-3 sm:px-4 bg-[#37322F] hover:bg-[#2A2520] rounded-full transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span className="text-white text-xs sm:text-[13px] font-medium font-sans">GitHub</span>
          </a>
        </div>
      </div>

      {/* 모바일 사이드바 */}
      {isSidebarOpen && (
        <>
          <div className="sm:hidden fixed inset-0 bg-black/30 z-[60]" onClick={() => setIsSidebarOpen(false)} />
          <aside className="sm:hidden fixed left-0 top-0 bottom-0 w-72 bg-[#F7F5F3] z-[70] p-5 flex flex-col gap-4 overflow-y-auto">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2" onClick={() => setIsSidebarOpen(false)}>
                <img src={site.logo} alt="" className="w-7 h-7 rounded-md" />
                <span className="text-[#2F3037] text-lg font-medium font-sans">{site.name}</span>
              </Link>
              <button onClick={() => setIsSidebarOpen(false)} aria-label="Close menu" className="w-8 h-8 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2F3037" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {nav.map((menu) => (
              <div key={menu.label} className="flex flex-col">
                <button
                  onClick={() => setMobileExpanded(mobileExpanded === menu.label ? null : menu.label)}
                  className="flex items-center justify-between py-2 text-[#2F3037] text-sm font-medium font-sans"
                >
                  {menu.label}
                  <svg
                    width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                    className={`transition-transform ${mobileExpanded === menu.label ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                {mobileExpanded === menu.label && (
                  <div className="pl-3 flex flex-col gap-1 pb-2">
                    {menu.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsSidebarOpen(false)}
                        className="py-1.5 text-[rgba(47,48,55,0.8)] text-sm font-sans"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto h-10 flex justify-center items-center gap-2 bg-[#37322F] rounded-full text-white text-sm font-medium font-sans"
            >
              GitHub
            </a>
          </aside>
        </>
      )}
    </>
  )
}
