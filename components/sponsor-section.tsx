import { sponsor } from "@/site.config"

/**
 * 결제 섹션 자리에 들어가는 것. `sponsor.enabled` 가 false 면 아무것도 그리지 않는다 —
 * 후원 링크가 없는 프로젝트에서 빈 껍데기가 남지 않게.
 */
export default function SponsorSection() {
  if (!sponsor.enabled) return null

  return (
    <div className="w-full border-b border-[rgba(55,50,47,0.12)] px-4 sm:px-6 md:px-24 py-12 sm:py-16 flex flex-col items-center gap-5 text-center">
      <h2 className="text-[#49423D] text-2xl sm:text-3xl md:text-4xl font-semibold font-sans tracking-tight">
        {sponsor.heading}
      </h2>
      <p className="max-w-[520px] text-[#605A57] text-sm sm:text-base leading-7 font-sans">
        {sponsor.body}
      </p>
      <a
        href={sponsor.cta.href}
        target="_blank"
        rel="noopener noreferrer"
        className="h-10 px-6 flex justify-center items-center gap-2 rounded-full border border-[rgba(55,50,47,0.2)] bg-white text-[#37322F] text-sm font-medium font-sans hover:bg-[rgba(55,50,47,0.04)] transition-colors"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="#DB61A2" aria-hidden="true">
          <path d="M12 21s-7.5-4.9-9.4-9A5.4 5.4 0 0 1 12 6.6a5.4 5.4 0 0 1 9.4 5.4C19.5 16.1 12 21 12 21z" />
        </svg>
        {sponsor.cta.label}
      </a>
    </div>
  )
}
