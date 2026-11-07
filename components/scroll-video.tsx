"use client"

import { useRef, useEffect } from "react"

interface ScrollVideoProps {
  src: string
  alt: string
  className?: string
  poster?: string
  // 영상이 화면에 얼마나 보여야 재생할지 (0~1, 기본 0.5 = 50%)
  threshold?: number
}

/**
 * 스크롤하면 자동으로 재생되는 비디오 컴포넌트
 * - 화면에 보이면 자동 재생
 * - 화면에서 벗어나면 일시 정지
 * - 음소거 상태로 재생 (자동재생 정책 때문)
 */
export function ScrollVideo({ src, alt, poster, className = "", threshold = 0.5 }: ScrollVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Intersection Observer로 화면에 보이는지 감지
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 화면에 보이면 재생
            video.play().catch(() => {
              // 자동재생이 차단된 경우 무시
            })
          } else {
            // 화면에서 벗어나면 일시 정지
            video.pause()
          }
        })
      },
      {
        threshold: threshold, // 지정된 비율만큼 보여야 트리거
      }
    )

    observer.observe(video)

    // 컴포넌트 언마운트 시 observer 정리
    return () => {
      observer.disconnect()
    }
  }, [threshold])

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      className={className}
      muted // 음소거 (자동재생을 위해 필수)
      loop // 반복 재생
      playsInline // 모바일에서 전체화면 방지
      preload="metadata" // 메타데이터만 미리 로드
      aria-label={alt}
    />
  )
}
