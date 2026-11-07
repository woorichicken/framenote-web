"use client"

import { useState } from "react"

/**
 * 관리 화면 전용 미니 달력.
 *
 * `react-day-picker` 를 쓰지 않는다 — 날짜를 고르는 곳이 관리자 모달 한 곳뿐인데
 * 그것 때문에 의존성과 번들을 늘릴 이유가 없다. 필요한 API 만 같은 모양으로 맞췄다
 * (`mode="single"` · `selected` · `onSelect`).
 */
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

function sameDay(a: Date | undefined, b: Date) {
  return (
    !!a &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function Calendar({
  selected,
  onSelect,
}: {
  /** react-day-picker 호출부와 호환되게 받아만 두고 쓰지 않는다. */
  mode?: "single"
  initialFocus?: boolean
  selected?: Date
  onSelect?: (date: Date | undefined) => void
}) {
  // 선택된 날짜가 있으면 그 달을, 없으면 이번 달을 연다.
  const [view, setView] = useState(() => {
    const base = selected ?? new Date()
    return new Date(base.getFullYear(), base.getMonth(), 1)
  })

  const firstWeekday = view.getDay()
  const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate()
  const today = new Date()

  function shiftMonth(delta: number) {
    setView((v) => new Date(v.getFullYear(), v.getMonth() + delta, 1))
  }

  return (
    <div className="p-3 w-[268px] select-none">
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          aria-label="Previous month"
          className="w-7 h-7 rounded hover:bg-gray-100 flex items-center justify-center text-gray-600"
        >
          ‹
        </button>
        <span className="text-sm font-medium text-gray-900">
          {MONTHS[view.getMonth()]} {view.getFullYear()}
        </span>
        <button
          type="button"
          onClick={() => shiftMonth(1)}
          aria-label="Next month"
          className="w-7 h-7 rounded hover:bg-gray-100 flex items-center justify-center text-gray-600"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {WEEKDAYS.map((w) => (
          <div key={w} className="h-7 flex items-center justify-center text-[11px] text-gray-400">
            {w}
          </div>
        ))}

        {/* 1일이 시작하는 요일까지 빈 칸을 채운다 */}
        {Array.from({ length: firstWeekday }).map((_, i) => (
          <div key={`pad-${i}`} className="h-8" />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const date = new Date(view.getFullYear(), view.getMonth(), day)
          const isSelected = sameDay(selected, date)
          const isToday = sameDay(today, date)
          return (
            <button
              key={day}
              type="button"
              onClick={() => onSelect?.(date)}
              className={`h-8 rounded text-sm transition-colors ${
                isSelected
                  ? "bg-blue-600 text-white"
                  : isToday
                    ? "bg-gray-100 text-gray-900 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}
