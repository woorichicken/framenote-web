import Link from "next/link"
import Script from "next/script"

import { PageWrapper } from "@/components/page-wrapper"
import { ContainerScroll } from "@/components/ui/container-scroll-animation"
import { MediaFrame } from "@/components/media-frame"
import { InstallCommand } from "@/components/install-command"
import { QuickStart } from "@/components/quick-start"
import { RepoBadges } from "@/components/repo-badges"
import { Contributors } from "@/components/contributors"
import SponsorSection from "@/components/sponsor-section"
import FAQSection from "@/components/faq-section"
import CTASection from "@/components/cta-section"

import {
  faq,
  features,
  featuresIntro,
  hero,
  install,
  repo,
  repoUrl,
  site,
} from "@/site.config"

/**
 * 구조화 데이터.
 *
 * 오픈소스는 `SoftwareApplication` 이 아니라 `SoftwareSourceCode` 다 — 전자는
 * 가격·평점 같은 상거래 속성을 기대하고, 없는 평점을 지어 넣으면 허위 표기가 된다.
 */
const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  name: site.name,
  description: site.description,
  codeRepository: repoUrl,
  url: site.url,
  license: `https://spdx.org/licenses/${site.license}.html`,
  programmingLanguage: install.options[0]?.label ?? "JavaScript",
  author: { "@type": "Organization", name: repo.owner },
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
}

function Badge({ text }: { text: string }) {
  return (
    <div className="px-[14px] py-[6px] bg-white shadow-[0px_0px_0px_4px_rgba(55,50,47,0.05)] rounded-[90px] flex items-center gap-[8px] border border-[rgba(2,6,23,0.08)]">
      <span className="text-[#37322F] text-xs font-medium leading-3 font-sans">{text}</span>
    </div>
  )
}

export default function LandingPage() {
  return (
    <PageWrapper>
      <Script
        id="software-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <Script
        id="faq-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="pt-0 lg:pt-[96px] pb-8 sm:pb-12 md:pb-16 flex flex-col justify-start items-center px-2 sm:px-4 md:px-8 lg:px-0 w-full sm:pl-0 sm:pr-0 pl-0 pr-0">
        {/* ── 히어로 ─────────────────────────────────────────── */}
        <div className="w-full max-w-[937px] lg:w-[937px] flex flex-col justify-center items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          <div className="self-stretch flex flex-col justify-center items-center gap-4 sm:gap-5 md:gap-6 lg:gap-8">
            {hero.badge && <Badge text={hero.badge.text} />}

            <h1 className="w-full max-w-[748px] text-center flex justify-center flex-col text-[#37322F] text-[28px] sm:text-[36px] md:text-[52px] lg:text-[76px] font-normal leading-[1.1] sm:leading-[1.15] md:leading-[1.2] font-serif px-2 sm:px-4 md:px-0">
              {hero.title.map((line, i) => (
                <span key={i}>{line}</span>
              ))}
            </h1>

            <p className="w-full max-w-[520px] text-center text-[rgba(55,50,47,0.80)] text-sm sm:text-lg md:text-xl leading-[1.5] font-sans px-2 sm:px-4 md:px-0 font-medium">
              {hero.subtitle}
            </p>

            {/* GitHub 실값 배지 — 서버에서 읽어 온다 */}
            <RepoBadges />
          </div>
        </div>

        {/* ── 설치 한 줄 ─────────────────────────────────────── */}
        <div className="w-full flex flex-col items-center gap-4 relative z-10 mt-8 sm:mt-10 lg:mt-12">
          <InstallCommand />
          <div className="flex items-center gap-3">
            <Link
              href={hero.primaryCta.href}
              className="h-10 px-6 bg-[#37322F] rounded-full flex justify-center items-center text-white text-sm font-medium font-sans hover:bg-[#2A2520] transition-colors"
            >
              {hero.primaryCta.label}
            </Link>
            <a
              href={hero.secondaryCta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 px-6 rounded-full border border-[rgba(55,50,47,0.2)] bg-white flex justify-center items-center text-[#37322F] text-sm font-medium font-sans hover:bg-[rgba(55,50,47,0.04)] transition-colors"
            >
              {hero.secondaryCta.label}
            </a>
          </div>
        </div>

        {/* 배경 패턴 — 장식 */}
        <div
          className="absolute top-[232px] sm:top-[248px] md:top-[264px] lg:top-[320px] left-1/2 -translate-x-1/2 z-0 pointer-events-none"
          aria-hidden="true"
        >
          <img
            src="/mask-group-pattern.svg"
            alt=""
            className="w-[936px] sm:w-[1404px] md:w-[2106px] lg:w-[2808px] h-auto opacity-30 sm:opacity-40 md:opacity-50 mix-blend-multiply"
            style={{ filter: "hue-rotate(15deg) saturate(0.7) brightness(1.2)" }}
          />
        </div>

        {/* ── 데모 ───────────────────────────────────────────── */}
        <div className="flex flex-col">
          <ContainerScroll titleComponent={<></>}>
            <MediaFrame
              media={hero.media}
              className="mx-auto rounded-xl h-auto w-full"
            />
          </ContainerScroll>
        </div>

        {/* ── 30초 예제 ──────────────────────────────────────── */}
        <div className="w-full border-b border-[rgba(55,50,47,0.12)] px-4 sm:px-6 md:px-12 py-12 sm:py-16 flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <Badge text="Quick start" />
            <h2 className="text-[#49423D] text-2xl sm:text-3xl md:text-4xl font-semibold font-sans tracking-tight">
              Working code in 30 seconds
            </h2>
          </div>
          <QuickStart />
        </div>

        {/* ── 기능 ───────────────────────────────────────────── */}
        <div className="w-full border-b border-[rgba(55,50,47,0.12)] flex flex-col justify-center items-center">
          <div className="self-stretch px-4 sm:px-6 md:px-24 py-8 sm:py-12 md:py-16 border-b border-[rgba(55,50,47,0.12)] flex justify-center items-center">
            <div className="w-full max-w-[586px] px-4 sm:px-6 py-4 sm:py-5 rounded-lg flex flex-col justify-start items-center gap-3 sm:gap-4">
              <Badge text={featuresIntro.badge} />
              <h2 className="w-full max-w-[472px] text-center text-[#49423D] text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight">
                {featuresIntro.heading}
              </h2>
              <p className="self-stretch text-center text-[#605A57] text-sm sm:text-base leading-6 sm:leading-7 font-sans">
                {featuresIntro.body}
              </p>
            </div>
          </div>

          <div className="self-stretch flex flex-col justify-start items-center overflow-hidden">
            {features.map((feature, i) => {
              const reversed = i % 2 === 1
              return (
                <div
                  key={feature.title}
                  className={`w-full px-4 sm:px-6 md:px-12 py-2 sm:py-4 md:py-6 flex flex-col ${
                    reversed ? "md:flex-row-reverse" : "md:flex-row"
                  } justify-between items-center gap-2 md:gap-4`}
                >
                  <div className="w-full md:w-[40%] flex flex-col justify-center items-start gap-2 md:gap-3 z-10">
                    <h3 className="text-[#37322F] text-3xl sm:text-4xl md:text-5xl font-semibold leading-[1.1] font-serif tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="text-[#605A57] text-base sm:text-lg font-normal leading-7 font-sans">
                      {feature.body}
                    </p>
                    {feature.link && (
                      <Link
                        href={feature.link.href}
                        className="text-[#37322F] hover:text-[#605A57] transition-colors text-sm font-medium mt-2 underline"
                      >
                        {feature.link.label}
                      </Link>
                    )}
                  </div>
                  <div className="w-full md:w-[60%] relative">
                    <div
                      className={`w-full bg-[#EDE8E3] rounded-2xl overflow-hidden shadow-xl border border-[rgba(55,50,47,0.08)] p-3 sm:p-5 flex items-center justify-center transition-transform duration-700 hover:scale-[1.02] ${
                        reversed ? "md:-translate-x-8" : "md:translate-x-12"
                      }`}
                    >
                      <MediaFrame media={feature.media} className="w-full h-auto rounded-lg shadow-md" zoomable />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── 기여자 · 후원 · FAQ · CTA ──────────────────────── */}
        <Contributors />
        <SponsorSection />
        <div id="faq">
          <FAQSection />
        </div>
        <CTASection />
      </div>
    </PageWrapper>
  )
}
