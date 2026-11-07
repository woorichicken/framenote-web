import { compact, getRepoStats } from "@/lib/github"
import { repoUrl, site } from "@/site.config"

/**
 * 별·포크·이슈·버전을 GitHub API 에서 실값으로 읽어 보여준다.
 *
 * shields.io 이미지를 쓰지 않는 이유: 외부 이미지라 LCP 를 늦추고, 다크/라이트와
 * 폰트가 사이트와 따로 논다. 서버 컴포넌트로 값만 받아 직접 그리면 둘 다 해결된다.
 *
 * API 가 실패하면(레이트리밋·비공개 저장소) 통계 없이 라이선스만 보여준다 —
 * "★ 0" 을 그리면 프로젝트가 죽은 것처럼 보이므로 아예 숨긴다.
 */
export async function RepoBadges() {
  const stats = await getRepoStats()

  const items: { label: string; value: string; icon: React.ReactNode }[] = []

  if (stats) {
    // 0 은 "죽은 프로젝트"로 읽힌다 — 값이 없을 때와 같이 숨긴다.
    if (stats.stars > 0) items.push({
      label: "stars",
      value: compact(stats.stars),
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z" />
        </svg>
      ),
    })
    if (stats.latestVersion) {
      items.push({
        label: "version",
        value: stats.latestVersion,
        icon: (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2l8 4.5v9L12 20l-8-4.5v-9z" />
          </svg>
        ),
      })
    }
    if (stats.openIssues > 0) items.push({
      label: "open issues",
      value: compact(stats.openIssues),
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
        </svg>
      ),
    })
  }

  items.push({
    label: "license",
    value: stats?.license ?? site.license,
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M12 3v18M5 7h14M7 7l-3 7a3 3 0 0 0 6 0zM17 7l-3 7a3 3 0 0 0 6 0z" />
      </svg>
    ),
  })

  return (
    <a
      href={repoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2"
    >
      {items.map((it) => (
        <span
          key={it.label}
          title={it.label}
          className="flex items-center gap-1.5 text-[rgba(55,50,47,0.65)] hover:text-[#37322F] transition-colors text-xs font-medium font-sans"
        >
          {it.icon}
          {it.value}
        </span>
      ))}
    </a>
  )
}
