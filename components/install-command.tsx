"use client"

import { useRef, useState } from "react"
import { install } from "@/site.config"

/**
 * 오픈소스 홈페이지에서 가장 많이 눌리는 요소.
 *
 * 패키지 매니저 탭 + 복사 버튼. 복사 성공을 2초 동안만 보여준다 —
 * 계속 "Copied"로 남아 있으면 다음 복사가 됐는지 알 수 없다.
 */
export function InstallCommand({ id = "install" }: { id?: string }) {
  const [active, setActive] = useState(0)
  const [copied, setCopied] = useState(false)
  /** 클립보드가 막혀서 "골라 뒀다"로 대신한 상태. */
  const [selected, setSelected] = useState(false)
  const codeRef = useRef<HTMLElement>(null)

  const current = install.options[active]

  async function copy() {
    // 클립보드가 막히는 환경이 실제로 있다 — 비-https, 구형 브라우저, 헤드리스.
    // 그때 조용히 넘어가면 **사용자는 눌렀는데 아무 일도 안 일어난 것**을 본다.
    // 그래서 실패해도 명령어를 선택 상태로 만들어 준다(⌘C 로 복사할 수 있게).
    try {
      await navigator.clipboard.writeText(current.command)
      setCopied(true)
    } catch {
      const el = codeRef.current
      if (el && typeof window !== "undefined") {
        const range = document.createRange()
        range.selectNodeContents(el)
        const sel = window.getSelection()
        sel?.removeAllRanges()
        sel?.addRange(range)
      }
      setSelected(true)
    }
    setTimeout(() => { setCopied(false); setSelected(false) }, 2000)
  }

  return (
    <div id={id} className="w-full max-w-[560px] flex flex-col gap-2">
      {install.options.length > 1 && (
        <div className="flex items-center gap-1 self-center">
          {install.options.map((opt, i) => (
            <button
              key={opt.label}
              onClick={() => setActive(i)}
              className={`px-3 py-1 rounded-full text-xs font-medium font-sans transition-colors ${
                i === active
                  ? "bg-[#37322F] text-white"
                  : "text-[rgba(55,50,47,0.65)] hover:bg-[rgba(55,50,47,0.06)]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 w-full bg-white border border-[rgba(2,6,23,0.08)] rounded-xl shadow-[0px_0px_0px_4px_rgba(55,50,47,0.05)] px-4 py-3">
        <span className="text-[rgba(55,50,47,0.4)] select-none font-mono text-sm">$</span>
        <code ref={codeRef} className="flex-1 text-[#37322F] font-mono text-sm overflow-x-auto whitespace-nowrap">
          {current.command}
        </code>
        <button
          onClick={copy}
          aria-label={`Copy ${current.label} install command`}
          className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[rgba(55,50,47,0.06)] transition-colors"
        >
          {copied || selected ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#605A57" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="14" height="14" x="8" y="8" rx="2" />
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </svg>
          )}
        </button>
      </div>

      {selected && (
        <p className="text-center text-xs text-[#C2650E] font-sans">
          클립보드가 막혀 있어 명령어를 골라 뒀습니다 — ⌘C 로 복사하세요
        </p>
      )}

      {install.verify && (
        <p className="text-center text-xs text-[rgba(55,50,47,0.6)] font-sans">
          {install.verifyLabel && <span className="mr-1.5">{install.verifyLabel}</span>}
          <code className="font-mono text-[#37322F] bg-[rgba(55,50,47,0.06)] px-1.5 py-0.5 rounded">{install.verify}</code>
        </p>
      )}
    </div>
  )
}
