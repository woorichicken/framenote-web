/**
 * 이 파일 하나만 고치면 사이트 내용이 전부 바뀐다.
 *
 * 컴포넌트는 여기서 읽기만 한다 — 문구·링크·이미지를 컴포넌트 안에 직접 쓰지 않는다.
 * framenote 사이트의 내용. 언어는 framenote README 를 따라 한국어다.
 */

// ─────────────────────────────────────────────────────────────
// 정체성
// ─────────────────────────────────────────────────────────────
export const repo = {
  owner: "woorichicken",
  name: "framenote",
  branch: "main",
} as const;

export const repoUrl = `https://github.com/${repo.owner}/${repo.name}`;

export const site = {
  /** 제품/프로젝트 이름. 헤더·OG·JSON-LD 에 그대로 쓴다. */
  name: "framenote",
  /** 한 줄. 검색 결과와 OG 설명의 첫 문장이 된다. */
  tagline: "렌더된 영상에 프레임 단위로 메모를 남기고, 그 메모를 코딩 에이전트가 바로 받는다.",
  /** 두세 문장. meta description 으로 나간다(155자 안쪽 권장). */
  description:
    "영상 위를 끌면 프레임 구간·좌표·렌더본이 메모에 자동으로 붙습니다. 보내면 에이전트가 신호를 받고, 다시 렌더하면 같은 창에서 새 영상으로 바뀝니다. 나가는 요청 0건, npm 의존성 0.",
  /** 배포 도메인. metadataBase·sitemap·canonical 의 기준. */
  url: "https://framenote.solhun.com",
  lang: "ko",
  locale: "ko_KR",
  logo: "/logo.svg",
  /** OG 이미지(1200x630). 없으면 데모 이미지를 쓴다. */
  ogImage: "/og.png",
  license: "MIT",
  /** 검색 키워드. 과하게 넣지 않는다 — 5~12개. */
  keywords: ["영상 리뷰", "프레임 단위 피드백", "코딩 에이전트", "video review", "frame accurate", "remotion", "open source", "npx"],
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
  // 셋 다 2026-11-07 에 framenote 0.3.0 으로 직접 돌려 봤다.
  options: [
    { label: "npx", command: "npx framenote out/final.mp4" },
    { label: "pnpm", command: "pnpm dlx framenote out/final.mp4" },
    { label: "bun", command: "bunx framenote out/final.mp4" },
  ],
  verify: "npx framenote --help",
  verifyLabel: "Node 22 이상과 ffmpeg·ffprobe 가 필요합니다. 옵션 보기:",
};

/** 30초 안에 뭔가 돌아가는 최소 예제. 히어로 다음에 온다. */
export const quickStart: { language: string; code: string } = {
  language: "bash",
  code: `# 리뷰 창을 연다
npx framenote out/final.mp4

# 에이전트는 여기서 주소를 찾는다
cat .framenote/server.json

# 신호는 /feed 로 오고, 메모 전문은 여기서 읽는다
curl "http://127.0.0.1:<port>/api/notes?batch=<id>"

# 서버 없이 파일 한 장으로 내보낸다
npx framenote out/final.mp4 --static`,
};

// ─────────────────────────────────────────────────────────────
// 히어로
// ─────────────────────────────────────────────────────────────
export const hero = {
  /** 로고 옆 작은 배지. 없애려면 null. */
  badge: { text: "MIT · npm 의존성 0" },
  /** 배열의 각 원소가 한 줄. 2줄이 가장 안정적이다. */
  title: ["프레임에 남기면", "에이전트가 받는다"],
  subtitle:
    "「저 부분이 좀 어색해」 대신 몇 번째 프레임 · 화면 어디 · 어느 렌더본인지가 메모에 저절로 붙습니다. 사람은 무엇이 이상한지만 적습니다.",
  primaryCta: { label: "시작하기", href: "#install" },
  secondaryCta: { label: "GitHub", href: repoUrl },
  /** 히어로 스크롤 애니메이션 안에 들어갈 데모. mp4 또는 이미지. */
  media: {
    type: "video" as "image" | "video",
    src: "/demo.mp4",
    /** 영상이 뜨기 전·자동재생이 막혔을 때 보이는 정지 화면. */
    poster: "/demo-poster.png" as string | undefined,
    alt: "샘플 영상의 잘린 자막에 네모를 치고 메모를 보내면, 다시 렌더된 영상이 같은 창에서 바뀌고 보던 프레임이 유지된다",
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
  badge: "주요 기능",
  heading: "사람은 지적만, 위치는 도구가",
  body: "채우는 칸은 「무엇이」와 「어떻게」 둘뿐이고 「어떻게」는 비워도 됩니다. 왜 이상한지 모르겠다는 말도 정당한 지적입니다.",
};

export const features: Feature[] = [
  {
    title: "끌면 위치가 저절로 붙는다",
    body: "스크러버를 끌면 구간, 영상 위를 끌면 네모가 잡히고 프레임·좌표·렌더본이 메모에 실립니다. 좌표는 0~1 비율이라 창 크기가 바뀌어도 같은 자리를 가리킵니다.",
    link: { label: "README 읽기 →", href: `${repoUrl}#readme` },
    media: { type: "video", src: "/feature-note.mp4", alt: "스크러버로 프레임 구간을 잡고 자막 위에 네모를 쳐 메모를 쓰는 화면" },
  },
  {
    title: "보내면 받고, 같은 창에서 바뀐다",
    body: "보내기를 누르면 통로로 신호가 가고, 에이전트가 새 영상 경로와 함께 상태를 바꾸면 새 창 없이 영상이 교체됩니다. 영상 속 에이전트 자리는 같은 통로에 붙인 짧은 스크립트이고, 재렌더는 실제로 돌렸습니다.",
    link: { label: "에이전트가 붙는 곳 →", href: `${repoUrl}#에이전트가-붙는-곳` },
    media: { type: "video", src: "/feature-agent.mp4", alt: "메모를 보낸 뒤 자막이 올라간 새 렌더본으로 같은 창의 영상이 바뀌는 화면" },
  },
  {
    title: "틀린 프레임보다 잠긴 창이 낫다",
    body: "프레임 레이트는 영상 파일에서 읽고, 표시 중인 프레임은 브라우저가 실제로 그린 프레임에서 확정합니다. 확정할 수 없는 브라우저에서는 메모 작성을 잠급니다. 영상은 프레임마다 번호를 태운 검증용 눈금입니다.",
    link: { label: "프레임이 맞다는 것 →", href: `${repoUrl}#프레임이-맞다는-것` },
    media: { type: "video", src: "/feature-ruler.mp4", alt: "화살표 키로 한 프레임씩 옮기면 화면의 프레임 번호와 영상 속 숫자가 함께 바뀌는 눈금 영상" },
  },
  {
    title: "서버 없이 파일 한 장으로",
    body: "--static 은 띄워 둘 프로세스 없이 HTML 한 장을 만듭니다. 메모는 그 파일을 연 브라우저에 쌓이고, 「메모 파일로 내보내기」로 notes.jsonl 과 같은 줄을 꺼냅니다. 재렌더 후 같은 창이 바뀌는 왕복은 서버 모드에만 있습니다.",
    link: { label: "두 방식 비교 →", href: `${repoUrl}#서버-없이--파일-한-장으로` },
    media: { type: "video", src: "/feature-static.mp4", alt: "내보낸 HTML 파일을 브라우저로 열어 메모를 쓰고 파일로 꺼내는 화면" },
  },
];

// ─────────────────────────────────────────────────────────────
// FAQ — JSON-LD(FAQPage)로도 나가니 실제 질문만 쓴다
// ─────────────────────────────────────────────────────────────
export const faq: { question: string; answer: string }[] = [
  {
    question: "어떤 에이전트를 붙일 수 있나요?",
    answer:
      "특정 에이전트 전용 연동은 없습니다. 파일을 읽거나 HTTP·WebSocket 을 쓸 수 있으면 됩니다. .framenote/server.json 으로 주소를 찾고, /feed 로 신호를 받고, /api/notes 로 전문을 읽고, /api/status 로 메모 단위 상태를 바꿉니다. 서버가 꺼져 있어도 notes.jsonl 파일만 읽어 일할 수 있습니다.",
  },
  {
    question: "영상이나 메모가 밖으로 나가나요?",
    answer:
      "나가는 요청이 없습니다. 서버는 127.0.0.1 에만 바인딩하고 메모와 첨부 이미지는 이 기기의 파일로 남습니다.",
  },
  {
    question: "무엇이 필요한가요?",
    answer:
      "Node 22 이상과 시스템의 ffmpeg·ffprobe 입니다. npm 의존성은 0 입니다. 영상 파일을 지정하지 않으면 현재 폴더와 하위에서 가장 최근에 수정된 mp4·webm·mov·mkv 를 고릅니다.",
  },
  {
    question: "메모 작성이 잠겼다고 나옵니다.",
    answer:
      "브라우저가 실제로 그린 프레임을 확정할 수 없거나 영상 규격을 읽지 못한 경우입니다. 틀린 프레임이 붙은 메모를 만드는 것보다 못 만드는 쪽을 택했습니다. Chromium 계열 브라우저와 ffprobe 설치 여부를 확인해 주세요.",
  },
  {
    question: "코드 위치까지 알려주나요?",
    answer:
      "아직 아닙니다. 메모에 담기는 것은 프레임·좌표·이미지까지이고, 화면에서 코드를 찾아가는 것은 에이전트 몫입니다. 근거와 착수 조건은 저장소의 docs/backlog.md 에 있습니다.",
  },
  {
    question: "라이선스는 무엇인가요?",
    answer: "MIT 입니다. 저작권 표시를 유지하면 상업적으로 쓰고 고치고 다시 배포할 수 있습니다.",
  },
  {
    question: "버그는 어디에 알리나요?",
    answer: `${repoUrl}/issues 에 버전·환경·재현 방법을 적어 주세요. 이 사이트 오른쪽 아래 제보 버튼도 됩니다.`,
  },
];

// ─────────────────────────────────────────────────────────────
// 후원 — 결제 대신 들어가는 자리. 안 쓰면 enabled: false
// ─────────────────────────────────────────────────────────────
export const sponsor = {
  enabled: false,
  heading: "프로젝트 후원",
  body: "이 프로젝트는 공개로 유지됩니다.",
  cta: { label: "GitHub 에서 후원", href: `https://github.com/sponsors/${repo.owner}` },
};

// ─────────────────────────────────────────────────────────────
// 마지막 CTA
// ─────────────────────────────────────────────────────────────
export const cta = {
  heading: "명령 하나로 시작합니다",
  body: "가입도 계정도 없습니다. 영상은 이 기기를 떠나지 않습니다. 돌리기 전에 소스를 읽어 보세요.",
};

// ─────────────────────────────────────────────────────────────
// 네비게이션 — 없는 페이지를 넣지 않는다(404 로 신뢰를 깎는다)
// ─────────────────────────────────────────────────────────────
export const nav: { label: string; items: { href: string; label: string }[] }[] = [
  {
    label: "자료",
    items: [
      { href: "/docs", label: "문서" },
      { href: "/changelog", label: "변경 기록" },
    ],
  },
  {
    label: "함께",
    items: [
      { href: "/roadmap", label: "로드맵" },
      { href: "/feedback", label: "의견" },
    ],
  },
];

export const footer = {
  columns: [
    {
      title: "프로젝트",
      links: [
        { label: "문서", href: "/docs" },
        { label: "변경 기록", href: "/changelog" },
        { label: "로드맵", href: "/roadmap" },
      ],
    },
    {
      title: "함께",
      links: [
        { label: "GitHub", href: repoUrl },
        { label: "이슈", href: `${repoUrl}/issues` },
        { label: "의견", href: "/feedback" },
      ],
    },
    {
      title: "법적 고지",
      links: [
        { label: "라이선스", href: `${repoUrl}/blob/${repo.branch}/LICENSE` },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// 화면 라벨 — 컴포넌트에 글자를 쓰지 않기 위해 여기 모은다
// ─────────────────────────────────────────────────────────────
export const labels = {
  dateLocale: "ko-KR",
  common: { copy: "복사", copied: "복사됨", openMenu: "메뉴 열기", closeMenu: "메뉴 닫기", close: "닫기", logoAlt: `${site.name} 로고`, enlargeImage: "크게 보기" },
  home: { quickStartBadge: "빠른 시작", quickStartHeading: "30초면 돌아갑니다", faqHeading: "자주 묻는 질문", ctaSource: "GitHub 에서 소스 보기", copyQuickStart: "예제 복사", copyInstall: (name: string) => `${name} 명령 복사` },
  footer: { licensed: `${site.license} 라이선스로 공개합니다.` },
  badges: { stars: "별", version: "버전", openIssues: "열린 이슈", license: "라이선스" },
  contributors: { heading: (count: number) => `기여자 ${count}명 이상`, body: "아래 모두 이 프로젝트에 코드를 머지했습니다.", commits: (n: number) => `커밋 ${n}개`, seeAll: "기여자 전체 보기 →" },
  docs: { fullDocs: "전체 문서 →", step1: "1. 실행", step2: "2. 에이전트 붙이기", step3: "3. 더 읽기", requires: "Node 22 이상과 ffmpeg·ffprobe 가 필요합니다." },
  changelog: {
    title: "변경 기록",
    metaDescription: `${site.name} 의 모든 릴리스 — 새 기능, 수정, 호환이 깨지는 변경.`,
    metaShort: `${site.name} 의 모든 릴리스.`,
    heading: "변경 기록",
    body: `${site.name} 에서 무엇이 왜 바뀌었는지 적습니다.`,
    version: "버전",
    description: "내용",
    empty: "아직 기록이 없습니다.",
    featured: "주요 업데이트",
    improvements: "개선",
    fixes: "수정",
    patches: "패치",
    features: "새 기능",
  },
  roadmap: {
    title: "로드맵",
    metaDescription: `${site.name} 에서 다음에 무엇을 검토하는지.`,
    heading: "로드맵",
    body: "지금 무엇을 하고 있고 다음에 무엇을 검토하는지 적습니다.",
    inProgress: "진행 중",
    planned: "검토 중",
    completed: "완료",
    empty: "아직 항목이 없습니다.",
  },
  feedback: {
    title: "의견",
    metaDescription: "의견과 제안을 익명으로 남겨 주세요.",
    heading: "의견",
    body: "써 보며 든 생각, 아이디어, 불편한 점을 남겨 주세요.",
    all: "전체",
    idea: "기능 제안",
    issue: "버그 제보",
    other: "기타",
    placeholder: "어떤 생각이 드셨나요?",
    anonymous: "익명",
    anonymousUser: "익명 사용자",
    namePlaceholder: "이름",
    posting: "올리는 중...",
    post: "의견 올리기",
    empty: "이 분류에는 아직 의견이 없습니다.",
    commentPlaceholder: "댓글을 적어 주세요...",
    commentPost: "올리기",
    errors: {
      contentRequired: "내용을 적어 주세요.",
      createFailed: "의견을 올리지 못했습니다.",
      notFound: "의견을 찾지 못했습니다.",
      likeFailed: "좋아요를 반영하지 못했습니다.",
      commentRequired: "댓글 내용이 필요합니다.",
      commentFailed: "댓글을 올리지 못했습니다.",
      deleteFailed: "의견을 지우지 못했습니다.",
    },
  },
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
  heading: "문서",
  body: "README 가 전체 설명서입니다. 여기서는 실행과 에이전트 연결까지만 짚고, 많이 찾는 절로 보냅니다.",
  /** 외부 문서 사이트가 있으면 채운다. 없으면 null → 버튼을 그리지 않는다. */
  externalUrl: null as string | null,
  guides: [
    {
      title: "README",
      description: "무엇을 하는 도구이고 왜 만들었는지, 요구사항과 지키는 것.",
      href: `${repoUrl}#readme`,
    },
    {
      title: "에이전트가 붙는 곳",
      description: "server.json · /feed · /api/notes · /api/status 표.",
      href: `${repoUrl}#에이전트가-붙는-곳`,
    },
    {
      title: "서버 없이 — 파일 한 장으로",
      description: "--static 과 서버 모드의 차이, 메모를 꺼내 넘기는 법.",
      href: `${repoUrl}#서버-없이--파일-한-장으로`,
    },
    {
      title: "프레임이 맞다는 것",
      description: "프레임을 어떻게 확정하고, 눈금 영상으로 어떻게 검증하는지.",
      href: `${repoUrl}#프레임이-맞다는-것`,
    },
    {
      title: "저장 형식",
      description: "notes.jsonl 한 줄의 모양과 메모의 일곱 상태 — src/types.ts 가 정본입니다.",
      href: `${repoUrl}/blob/${repo.branch}/src/types.ts`,
    },
    {
      title: "아직 없는 것",
      description: "코드 위치 추적, 문구 즉시 수정 — 왜 미뤘고 언제 착수하는지.",
      href: `${repoUrl}/blob/${repo.branch}/docs/backlog.md`,
    },
  ],
}
