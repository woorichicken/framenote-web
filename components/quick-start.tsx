"use client"

import { useState } from "react"
import { quickStart } from "@/site.config"

/**
 * 30초 예제.
 *
 * 하이라이터 라이브러리를 넣지 않았다 — 예제 한 덩어리 때문에 번들에 수십 KB 를
 * 더하는 건 손해다. 정말 필요해지면 `shiki` 를 서버 컴포넌트에서 돌려 HTML 을
 * 미리 만들어 넘긴다(런타임 비용 0).
 */
export function QuickStart() {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(quickStart.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // 클립보드 접근 불가 환경: 코드가 화면에 그대로 있으니 직접 선택하면 된다.
    }
  }

  return (
    <div className="w-full max-w-[720px] rounded-2xl overflow-hidden border border-[rgba(55,50,47,0.12)] bg-[#2A2724] shadow-lg">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[rgba(255,255,255,0.08)]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
          <span className="ml-3 text-[rgba(255,255,255,0.4)] text-xs font-mono">
            {quickStart.language}
          </span>
        </div>
        <button
          onClick={copy}
          aria-label="Copy quick start example"
          className="text-[rgba(255,255,255,0.5)] hover:text-white transition-colors text-xs font-medium font-sans"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="px-5 py-4 overflow-x-auto">
        <code className="text-[#E8E4E0] font-mono text-[13px] leading-6 whitespace-pre">
          {quickStart.code}
        </code>
      </pre>
    </div>
  )
}
