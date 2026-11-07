"use client"

import { useState } from "react"
import { faq } from "@/site.config"

/**
 * FAQ. 항목은 site.config 의 `faq` 가 정본이고, 같은 배열이 JSON-LD(FAQPage)로도
 * 나간다 — 화면과 구조화 데이터가 갈라지지 않게 하기 위해서다.
 */
function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

export default function FAQSection() {
  // 항목마다 따로 연다. 하나만 열리게 하면 위 항목이 닫히는 만큼 방금 누른 질문이
  // 커서 밑에서 밀려 올라가, 화면이 통째로 바뀐 것처럼 보인다.
  const [openItems, setOpenItems] = useState<ReadonlySet<number>>(() => new Set([0]))

  function toggle(index: number) {
    setOpenItems((current) => {
      const next = new Set(current)
      if (!next.delete(index)) next.add(index)
      return next
    })
  }

  return (
    <div className="w-full border-b border-[rgba(55,50,47,0.12)] flex flex-col justify-center items-center">
      <div className="self-stretch px-4 sm:px-6 md:px-24 py-12 sm:py-16 flex flex-col justify-center items-center gap-8">
        <h2 className="text-center text-[#49423D] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight font-sans tracking-tight">
          Frequently asked questions
        </h2>

        <div className="w-full max-w-[720px] flex flex-col">
          {faq.map((item, i) => {
            const open = openItems.has(i)
            return (
              <div key={item.question} className="border-b border-[rgba(55,50,47,0.12)]">
                <button
                  onClick={() => toggle(i)}
                  aria-expanded={open}
                  className="w-full py-5 flex justify-between items-center gap-4 text-left group"
                >
                  <span className="text-[#37322F] text-base sm:text-lg font-medium font-sans">
                    {item.question}
                  </span>
                  <ChevronDownIcon
                    className={`shrink-0 text-[rgba(55,50,47,0.5)] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                  />
                </button>
                {/* 0fr↔1fr 는 답변 높이를 몰라도 움직인다. invisible 은 닫힌 답변을 보조기기에서 뺀다. */}
                <div
                  className={`grid transition-[grid-template-rows,visibility] duration-200 ease-out motion-reduce:transition-none ${
                    open ? "grid-rows-[1fr] visible" : "grid-rows-[0fr] invisible"
                  }`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <p className="pb-5 pr-8 text-[#605A57] text-sm sm:text-base leading-7 font-sans">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
