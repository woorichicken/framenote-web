import { repo } from "@/site.config";

/**
 * GitHub 공개 API 조회.
 *
 * 토큰 없이 부르면 IP당 시간당 60회다. 빌드/ISR 에서만 부르므로 보통 충분하지만,
 * 미리보기 배포가 잦으면 `GITHUB_TOKEN`(repo 권한 불필요, 공개 읽기용)을 넣어 5,000회로 올린다.
 *
 * 실패는 예외로 던지지 않고 null 을 돌려준다 — 별 개수를 못 읽었다고 홈페이지가
 * 500 이 되면 안 된다. 호출부가 null 을 "이 조각만 숨김"으로 처리한다.
 */
const API = "https://api.github.com";

/** ISR 주기(초). 별 개수는 1시간이면 충분히 신선하다. */
const REVALIDATE = 3600;

function headers(): HeadersInit {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

async function get<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API}${path}`, {
      headers: headers(),
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export type RepoStats = {
  stars: number;
  forks: number;
  openIssues: number;
  license: string | null;
  defaultBranch: string;
  latestVersion: string | null;
};

export async function getRepoStats(): Promise<RepoStats | null> {
  const data = await get<{
    stargazers_count: number;
    forks_count: number;
    open_issues_count: number;
    license: { spdx_id: string } | null;
    default_branch: string;
  }>(`/repos/${repo.owner}/${repo.name}`);
  if (!data) return null;

  const release = await get<{ tag_name: string }>(
    `/repos/${repo.owner}/${repo.name}/releases/latest`,
  );

  return {
    stars: data.stargazers_count,
    forks: data.forks_count,
    openIssues: data.open_issues_count,
    license: data.license?.spdx_id ?? null,
    defaultBranch: data.default_branch,
    latestVersion: release?.tag_name ?? null,
  };
}

export type Contributor = {
  login: string;
  avatarUrl: string;
  htmlUrl: string;
  contributions: number;
};

export async function getContributors(limit = 24): Promise<Contributor[]> {
  const data = await get<
    { login: string; avatar_url: string; html_url: string; contributions: number; type: string }[]
  >(`/repos/${repo.owner}/${repo.name}/contributors?per_page=100`);
  if (!data) return [];
  return data
    .filter((c) => c.type !== "Bot")
    .slice(0, limit)
    .map((c) => ({
      login: c.login,
      avatarUrl: c.avatar_url,
      htmlUrl: c.html_url,
      contributions: c.contributions,
    }));
}

/** 1200 → "1.2k". 별 개수는 자릿수가 커지면 정확한 값보다 읽히는 게 중요하다. */
export function compact(n: number): string {
  if (n < 1000) return String(n);
  if (n < 1_000_000) return `${(n / 1000).toFixed(n < 10_000 ? 1 : 0)}k`;
  return `${(n / 1_000_000).toFixed(1)}M`;
}
