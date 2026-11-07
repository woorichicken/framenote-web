import { getContributors } from "@/lib/github"
import { repoUrl } from "@/site.config"

/**
 * 기여자 아바타 그리드.
 *
 * 후기(testimonial) 자리를 대체한다 — 오픈소스에서 신뢰의 근거는 지어낸 인용문이
 * 아니라 "실제로 누가 커밋했는가"다. GitHub 이 답을 이미 갖고 있으므로 그걸 쓴다.
 *
 * 기여자가 1명뿐이면 섹션을 통째로 숨긴다(혼자 만든 프로젝트에서 "Contributors"
 * 아래 자기 얼굴 하나만 뜨는 건 역효과다).
 */
export async function Contributors() {
  const people = await getContributors(24)
  if (people.length < 2) return null

  return (
    <div className="w-full border-b border-[rgba(55,50,47,0.12)] px-4 sm:px-6 md:px-12 py-12 sm:py-16 flex flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-[#49423D] text-2xl sm:text-3xl md:text-4xl font-semibold font-sans tracking-tight">
          Built by {people.length}+ contributors
        </h2>
        <p className="text-[#605A57] text-sm sm:text-base font-sans">
          Every avatar below has merged code into this project.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 max-w-[720px]">
        {people.map((p) => (
          <a
            key={p.login}
            href={p.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={`${p.login} · ${p.contributions} commits`}
            className="block w-11 h-11 rounded-full overflow-hidden border border-[rgba(55,50,47,0.12)] hover:scale-110 transition-transform duration-200"
          >
            {/* next/image 를 쓰지 않는다 — 아바타 24개를 전부 최적화 요청으로 돌리면
                Vercel 이미지 변환 쿼터만 태우고 얻는 게 없다(이미 44px). */}
            <img
              src={`${p.avatarUrl}&s=88`}
              alt={p.login}
              width={44}
              height={44}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </a>
        ))}
      </div>

      <a
        href={`${repoUrl}/graphs/contributors`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#37322F] hover:text-[#605A57] transition-colors text-sm font-medium font-sans underline"
      >
        See all contributors →
      </a>
    </div>
  )
}
