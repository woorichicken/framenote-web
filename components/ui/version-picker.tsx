"use client"

/**
 * semver 스테퍼.
 *
 * 자유 입력으로 두면 `v1.2`·`1.2.0-beta`·`ver 1.2.0` 이 섞여서 목록 정렬과
 * 릴리스 대조가 깨진다. major/minor/patch 를 각각 올리게 해서 형태를 강제한다.
 *
 * 입력값이 semver 가 아니면 0.0.0 으로 읽는다 — 기존 데이터를 고칠 때
 * 화면이 NaN 으로 깨지지 않게 하기 위해서다.
 */
function parse(value: string): [number, number, number] {
  const m = /^v?(\d+)\.(\d+)\.(\d+)/.exec(value.trim())
  if (!m) return [0, 0, 0]
  return [Number(m[1]), Number(m[2]), Number(m[3])]
}

export function VersionPicker({
  value,
  onChange,
}: {
  value: string
  onChange: (version: string) => void
}) {
  const parts = parse(value)
  const labels = ["major", "minor", "patch"] as const

  function bump(index: 0 | 1 | 2, delta: 1 | -1) {
    const next: [number, number, number] = [...parts]
    next[index] = Math.max(0, next[index] + delta)
    // major/minor 를 올리면 아래 자리는 0 으로 — semver 규칙이다.
    if (delta === 1) {
      if (index === 0) { next[1] = 0; next[2] = 0 }
      if (index === 1) { next[2] = 0 }
    }
    onChange(`v${next[0]}.${next[1]}.${next[2]}`)
  }

  return (
    <div className="flex items-center gap-2">
      {labels.map((label, i) => (
        <div key={label} className="flex-1 flex flex-col items-center">
          <button
            type="button"
            onClick={() => bump(i as 0 | 1 | 2, 1)}
            aria-label={`Increase ${label}`}
            className="w-full h-5 text-xs text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-t"
          >
            ▲
          </button>
          <div className="w-full h-9 border-x border-gray-300 flex items-center justify-center text-sm font-mono text-gray-900 bg-white">
            {parts[i]}
          </div>
          <button
            type="button"
            onClick={() => bump(i as 0 | 1 | 2, -1)}
            aria-label={`Decrease ${label}`}
            className="w-full h-5 text-xs text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-b"
          >
            ▼
          </button>
          <span className="text-[10px] text-gray-400 mt-0.5">{label}</span>
        </div>
      ))}
      <span className="text-sm font-mono text-gray-500 pb-4 whitespace-nowrap">
        v{parts.join(".")}
      </span>
    </div>
  )
}
