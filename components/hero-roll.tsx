"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function HeroRoll() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const img = imgRef.current
    const overlay = overlayRef.current
    const text = textRef.current
    if (!section || !img || !overlay || !text) return

    // A imagem "enrola" para cima — scale + translateY + clip-path collapse
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=100%",
        scrub: 1.2,
        pin: true,
        anticipatePin: 1,
      },
    })

    tl.to(
      img,
      {
        yPercent: -8,
        scale: 0.9,
        borderRadius: "24px",
        ease: "none",
      },
      0,
    )
      .to(
        overlay,
        {
          opacity: 0.8,
          ease: "none",
        },
        0,
      )
      .to(
        text,
        {
          yPercent: -30,
          opacity: 0,
          ease: "none",
        },
        0,
      )

    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section) st.kill()
      })
    }
  }, [])

  return (
    <div ref={sectionRef} className="relative h-screen w-full overflow-hidden">
      {/* Imagem fullscreen */}
      <div ref={imgRef} className="absolute inset-0 w-full h-full origin-top">
        <img
          src="https://cdn.shopify.com/s/files/1/0788/1932/8253/files/IMG_0888_JPG.jpg?v=1772326001"
          alt="Somma Club"
          className="w-full h-full object-cover object-center"
        />
        {/* Overlay escuro */}
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-black/40"
        />
      </div>

      {/* Conteúdo centralizado */}
      <div
        ref={textRef}
        className="relative z-10 flex h-full flex-col items-center justify-center text-center px-6"
      >
        <h1 className="text-4xl sm:text-6xl md:text-7xl xl:text-[5.25rem] font-semibold leading-tight text-white drop-shadow-lg">
          Somma Club
        </h1>
      </div>
    </div>
  )
}
