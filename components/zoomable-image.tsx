"use client"

import { useRef } from "react"

/**
 * 누르면 화면 가득 커지는 이미지.
 *
 * 브라우저 기본 <dialog> 를 쓴다. Esc 닫기·포커스 복귀를 그대로 받고, top layer 에 그려져서
 * 부모의 overflow-hidden·transform(기능 카드의 hover 확대)에 잘리지 않는다.
 */
export function ZoomableImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const close = () => dialogRef.current?.close()

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        aria-label={`Enlarge image: ${alt}`}
        className="block w-full cursor-zoom-in rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37322F]"
      >
        <img src={src} alt={alt} className={className} loading="lazy" />
      </button>

      {/* 어디를 눌러도 닫힌다 — 확대 화면에서 할 일은 보고 닫는 것뿐이다. */}
      <dialog
        ref={dialogRef}
        onClick={close}
        aria-label={alt}
        className="m-auto max-h-none max-w-none cursor-zoom-out overflow-visible bg-transparent p-0 backdrop:bg-black/80"
      >
        <img src={src} alt={alt} className="block h-auto max-h-[90vh] w-auto max-w-[95vw] rounded-lg" />
        <button
          type="button"
          aria-label="Close"
          className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-xl leading-none text-white hover:bg-black/80"
        >
          ×
        </button>
      </dialog>
    </>
  )
}
