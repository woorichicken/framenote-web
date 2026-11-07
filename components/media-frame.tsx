"use client"

import { ScrollVideo } from "./scroll-video"
import { ZoomableImage } from "./zoomable-image"

type Media = { type: "image" | "video"; src: string; alt: string; poster?: string }

/**
 * 설정의 media 를 받아 이미지든 영상이든 같은 틀로 그린다.
 *
 * 이게 없으면 페이지마다 `media.type === "video" ? <ScrollVideo/> : <img/>` 삼항이
 * 흩어지고, 새 미디어 종류(gif·iframe)를 넣을 때 전수로 고쳐야 한다.
 */
export function MediaFrame({
  media,
  className = "",
  zoomable = false,
}: {
  media: Media
  className?: string
  /** 이미지를 눌러 크게 본다. 작은 칸에 든 터미널 캡처는 글자가 안 읽힌다. */
  zoomable?: boolean
}) {
  if (media.type === "video") {
    return <ScrollVideo src={media.src} alt={media.alt} poster={media.poster} className={className} />
  }
  if (zoomable) {
    return <ZoomableImage src={media.src} alt={media.alt} className={className} />
  }
  return <img src={media.src} alt={media.alt} className={className} loading="lazy" />
}
