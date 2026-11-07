/**
 * 이 파일 하나만 고치면 사이트 내용이 전부 바뀐다.
 *
 * 컴포넌트는 여기서 읽기만 한다 — 문구·링크·이미지를 컴포넌트 안에 직접 쓰지 않는다.
 * 그래야 다음 프로젝트가 "복사해서 내용만 바꾸기"로 끝난다.
 *
 * 채워야 할 곳은 전부 TODO(create-opensource) 로 표시해 뒀다.
 */

// ─────────────────────────────────────────────────────────────
// 정체성
// ─────────────────────────────────────────────────────────────
/**
 * 플레이스홀더는 GitHub 에 **실재하지 않는 이름**이어야 한다.
 * `your-org/your-repo` 는 실제로 존재해서, 채우기 전 미리보기에 남의 저장소
 * 별 개수가 그대로 떴다(실측). 채우기 전 상태는 배지가 비어 있는 게 맞다.
 */
export const repo = {
  owner: "your-github-org", // TODO(create-opensource)
  name: "your-repo-name", // TODO(create-opensource)
  branch: "main",
} as const;

export const repoUrl = `https://github.com/${repo.owner}/${repo.name}`;

export const site = {
  /** 제품/프로젝트 이름. 헤더·OG·JSON-LD 에 그대로 쓴다. */
  name: "YourProject", // TODO(create-opensource)
  /** 한 줄. 검색 결과와 OG 설명의 첫 문장이 된다. */
  tagline: "One line that says what this does.", // TODO(create-opensource)
  /** 두세 문장. meta description 으로 나간다(155자 안쪽 권장). */
  description:
    "A short description of what the project does and who it is for.", // TODO(create-opensource)
  /** 배포 도메인. metadataBase·sitemap·canonical 의 기준. */
  url: "https://example.com", // TODO(create-opensource)
  lang: "en",
  locale: "en_US",
  logo: "/logo.svg",
  /** OG 이미지(1200x630). 없으면 데모 이미지를 쓴다. */
  ogImage: "/demo-placeholder.jpg",
  license: "MIT",
  /** 검색 키워드. 과하게 넣지 않는다 — 5~12개. */
  keywords: ["open source", "developer tools"], // TODO(create-opensource)
} as const;

// ─────────────────────────────────────────────────────────────
// 설치 — OSS 홈페이지에서 가장 많이 복사되는 한 줄
// ─────────────────────────────────────────────────────────────
export type InstallOption = { label: string; command: string };

export const install: {
  /** 히어로 바로 아래에 기본으로 뜨는 탭 */
  options: InstallOption[];
  /** 설치 뒤 확인용 한 줄(선택). 없으면 렌더 안 함. */
  verify?: string;
  /** verify 앞에 붙는 안내(선택). 명령만 덩그러니 있으면 무엇인지 안 읽힌다. */
  verifyLabel?: string;
} = {
  options: [
    { label: "npm", command: "npm install your-package" }, // TODO(create-opensource)
    { label: "pnpm", command: "pnpm add your-package" },
    { label: "yarn", command: "yarn add your-package" },
    { label: "bun", command: "bun add your-package" },
  ],
  verify: undefined, // TODO(create-opensource)
  verifyLabel: undefined, // TODO(create-opensource)
};

/** 30초 안에 뭔가 돌아가는 최소 예제. 히어로 다음에 온다. */
export const quickStart: { language: string; code: string } = {
  language: "tsx",
  // TODO(create-opensource)
  code: `import { doThing } from "your-package";

const result = await doThing({ input: "hello" });
console.log(result);`,
};

// ─────────────────────────────────────────────────────────────
// 히어로
// ─────────────────────────────────────────────────────────────
export const hero = {
  /** 로고 옆 작은 배지. 없애려면 null. */
  badge: { text: "MIT Licensed · v0.1.0" }, // TODO(create-opensource)
  /** 배열의 각 원소가 한 줄. 2줄이 가장 안정적이다. */
  title: ["Your headline here,", "in two lines"], // TODO(create-opensource)
  subtitle:
    "One or two sentences explaining the value. Keep it concrete — say what it removes, not what it enables.", // TODO(create-opensource)
  primaryCta: { label: "Get started", href: "#install" },
  secondaryCta: { label: "GitHub", href: repoUrl },
  /** 히어로 스크롤 애니메이션 안에 들어갈 데모. mp4 또는 이미지. */
  media: {
    type: "image" as "image" | "video",
    src: "/demo-placeholder.jpg", // TODO(create-opensource)
    /** 영상이 뜨기 전·자동재생이 막혔을 때 보이는 정지 화면. 영상이면 넣는다. */
    poster: undefined as string | undefined, // TODO(create-opensource)
    alt: "Product demo",
  },
} as const;

// ─────────────────────────────────────────────────────────────
// 기능 섹션 — 좌우 번갈아 배치된다
// ─────────────────────────────────────────────────────────────
export type Feature = {
  title: string;
  body: string;
  link?: { label: string; href: string };
  media: { type: "image" | "video"; src: string; alt: string };
};

export const featuresIntro = {
  badge: "Key Features",
  heading: "What it does", // TODO(create-opensource)
  body: "One or two lines framing the features below.", // TODO(create-opensource)
};

export const features: Feature[] = [
  // TODO(create-opensource) — 3개가 기본. 2개도 4개도 된다.
  {
    title: "First capability",
    body: "What it does and why it matters, in two sentences at most.",
    link: { label: "Read the docs →", href: "/docs" },
    media: { type: "image", src: "/demo-placeholder.jpg", alt: "Feature one" },
  },
  {
    title: "Second capability",
    body: "Keep each of these about one thing. If it needs a paragraph, it is two features.",
    link: { label: "See the changelog →", href: "/changelog" },
    media: { type: "image", src: "/demo-placeholder.jpg", alt: "Feature two" },
  },
  {
    title: "Third capability",
    body: "The one that closes the sale. Usually the thing competitors do not have.",
    link: { label: "Roadmap →", href: "/roadmap" },
    media: { type: "image", src: "/demo-placeholder.jpg", alt: "Feature three" },
  },
];

// ─────────────────────────────────────────────────────────────
// FAQ — JSON-LD(FAQPage)로도 나가니 실제 질문만 쓴다
// ─────────────────────────────────────────────────────────────
export const faq: { question: string; answer: string }[] = [
  // TODO(create-opensource)
  {
    question: `What license is ${"YourProject"} under?`,
    answer:
      "MIT. You can use it commercially, modify it, and redistribute it, as long as you keep the copyright notice.",
  },
  {
    question: "How do I report a bug?",
    answer: `Open an issue at ${repoUrl}/issues. Include the version, your environment, and a minimal reproduction.`,
  },
  {
    question: "Can I contribute?",
    answer:
      "Yes. Read CONTRIBUTING.md first, then open a pull request against the main branch.",
  },
];

// ─────────────────────────────────────────────────────────────
// 후원 — 결제 대신 들어가는 자리. 안 쓰면 enabled: false
// ─────────────────────────────────────────────────────────────
export const sponsor = {
  enabled: false,
  heading: "Support the project",
  body: "This project is maintained in the open. Sponsorship funds the time it takes.",
  cta: { label: "Sponsor on GitHub", href: `https://github.com/sponsors/${repo.owner}` },
};

// ─────────────────────────────────────────────────────────────
// 마지막 CTA
// ─────────────────────────────────────────────────────────────
export const cta = {
  heading: "Start in one command", // TODO(create-opensource)
  body: "No signup. No account. Read the source before you run it.",
};

// ─────────────────────────────────────────────────────────────
// 네비게이션 — 없는 페이지를 넣지 않는다(404 로 신뢰를 깎는다)
// ─────────────────────────────────────────────────────────────
export const nav: { label: string; items: { href: string; label: string }[] }[] = [
  {
    label: "Resources",
    items: [
      { href: "/docs", label: "Docs" },
      { href: "/changelog", label: "Changelog" },
    ],
  },
  {
    label: "Community",
    items: [
      { href: "/roadmap", label: "Roadmap" },
      { href: "/feedback", label: "Feedback" },
    ],
  },
];

export const footer = {
  columns: [
    {
      title: "Project",
      links: [
        { label: "Docs", href: "/docs" },
        { label: "Changelog", href: "/changelog" },
        { label: "Roadmap", href: "/roadmap" },
      ],
    },
    {
      title: "Community",
      links: [
        { label: "GitHub", href: repoUrl },
        { label: "Issues", href: `${repoUrl}/issues` },
        { label: "Discussions", href: `${repoUrl}/discussions` },
        { label: "Feedback", href: "/feedback" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "License", href: `${repoUrl}/blob/${repo.branch}/LICENSE` },
        { label: "Contributing", href: `${repoUrl}/blob/${repo.branch}/CONTRIBUTING.md` },
        { label: "Code of Conduct", href: `${repoUrl}/blob/${repo.branch}/CODE_OF_CONDUCT.md` },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// 사이트 검증 코드 — 없으면 비워 둔다(빈 값이 들어가면 태그를 안 만든다)
// ─────────────────────────────────────────────────────────────
export const verification: Record<string, string> = {
  // "naver-site-verification": "...",
  // "google-site-verification": "...",
};

// ─────────────────────────────────────────────────────────────
// /docs 페이지 — 진짜 문서가 따로 있으면 여기서 링크만 보낸다
// ─────────────────────────────────────────────────────────────
export const docs = {
  heading: "Documentation",
  body: "Install it, run the example, then read the guides below.", // TODO(create-opensource)
  /** 외부 문서 사이트가 있으면 채운다. 없으면 null → 버튼을 그리지 않는다. */
  externalUrl: null as string | null,
  guides: [
    // TODO(create-opensource)
    {
      title: "Getting started",
      description: "Install, configure, and run your first call.",
      href: `${repoUrl}/blob/${repo.branch}/README.md`,
    },
    {
      title: "API reference",
      description: "Every exported function, with types and examples.",
      href: `${repoUrl}/blob/${repo.branch}/docs/api.md`,
    },
    {
      title: "Contributing",
      description: "How to set up the repo, run tests, and open a pull request.",
      href: `${repoUrl}/blob/${repo.branch}/CONTRIBUTING.md`,
    },
  ],
}
