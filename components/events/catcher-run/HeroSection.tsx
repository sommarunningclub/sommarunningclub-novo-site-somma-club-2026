'use client'

import { useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Calendar, Clock, ChevronDown } from 'lucide-react'
import gsap from 'gsap'
import CountdownTimer from './CountdownTimer'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay: delay + 1.8, ease: [0.22, 1, 0.36, 1] },
})

const titleWords = [
  { text: 'VOCÊ CONSEGUE', offsetX: 80 },
  { text: 'FUGIR DO', offsetX: -120 },
  { text: 'CATCHER CAR?', offsetX: 60 },
]

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const blobRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const allowRotation = useRef(true)

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const titleSlideIn = useCallback(() => {
    if (!titleRef.current) return
    const words = titleRef.current.querySelectorAll('.hero-word')
    words.forEach((word, wordIdx) => {
      const chars = word.querySelectorAll('.hero-char')
      chars.forEach((char, charIdx) => {
        gsap.fromTo(
          char,
          { opacity: 0, x: 0 },
          {
            opacity: 1,
            x: -300,
            ease: 'elastic.out(1.1, 0.7)',
            duration: 1.2,
            delay: wordIdx * 0.2 + charIdx * 0.03,
          }
        )
      })
    })
  }, [])

  const videoPopIn = useCallback(() => {
    allowRotation.current = false
    gsap.fromTo(
      videoRef.current,
      { scale: 0 },
      {
        scale: 1,
        ease: 'elastic.out(1, 0.8)',
        duration: 0.8,
        delay: 0.4,
        onComplete: () => { allowRotation.current = true },
      }
    )
  }, [])

  useEffect(() => {
    const blob = blobRef.current
    const section = sectionRef.current
    const video = videoRef.current
    if (!blob || !section) return

    // Blob infinite rotation
    const rotationTl = gsap.timeline({ repeat: -1, ease: 'none' })
    rotationTl
      .to(blob, { rotation: 180, scaleX: 1.6, duration: 8.5 })
      .to(blob, { rotation: 360, scaleX: 1, duration: 8.5 })

    // Mouse interactions
    const handleMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect()
      if (e.clientY > rect.bottom || e.clientY < rect.top) return

      // Blob follow
      gsap.to(blob, {
        left: e.clientX,
        top: e.clientY - rect.top,
        duration: 2,
        ease: 'power2.out',
      })

      // 3D video rotation
      if (video && allowRotation.current) {
        const vRect = video.getBoundingClientRect()
        const centerX = vRect.left + vRect.width / 2
        const centerY = vRect.top + vRect.height / 2
        const distanceX = (e.clientX - centerX) / vRect.width
        const distanceY = (e.clientY - centerY) / vRect.height
        gsap.to(video, {
          rotateX: -20 * distanceY,
          rotateY: 20 * distanceX,
          duration: 0.5,
          ease: 'power1.out',
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)

    // Initial animations
    titleSlideIn()
    videoPopIn()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      rotationTl.kill()
    }
  }, [titleSlideIn, videoPopIn])

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col overflow-hidden bg-[#1d1d1f]">
      {/* === BLOB + BLUR BACKGROUND === */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          ref={blobRef}
          className="absolute"
          style={{
            height: '36vmax',
            aspectRatio: '1',
            background: 'linear-gradient(to right, #7a3300, #CC0000, #F26522)',
            borderRadius: '50%',
            opacity: 0.8,
            left: '50%',
            top: '50%',
            translate: '-50% -50%',
            willChange: 'transform, left, top',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: 'blur(8vmax)',
            WebkitBackdropFilter: 'blur(8vmax)',
          }}
        />
      </div>

      {/* Grain overlay */}
      <div
        className="absolute inset-0 z-[1] opacity-[0.04] mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 512 512\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")', backgroundSize: '200px 200px' }}
      />

      {/* Top brand bar */}
      <div className="absolute top-0 left-0 right-0 z-20 pt-5 px-4 sm:px-8 flex justify-center">
        <div
          className="flex items-center justify-center gap-4 sm:gap-8 flex-wrap"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 40%, rgba(255,255,255,0.07) 100%)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderTop: '1px solid rgba(255,255,255,0.22)',
            borderRadius: '999px',
            padding: '10px 32px 14px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.2)',
          }}
        >
          <motion.img
            src="https://cdn.shopify.com/s/files/1/0788/1932/8253/files/HORIZONTAL_PRETA_LARANJA.png"
            alt="Somma Running Club"
            className="h-5 sm:h-7 object-contain"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ filter: 'brightness(0) invert(1) drop-shadow(0 0 8px rgba(242,101,34,0.4))' }}
          />
          <motion.span className="text-zinc-500 text-base font-thin select-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.25 }}>×</motion.span>
          <motion.img
            src="/RED BULL_ED_LATA_FL_BRANCO_ABERTA.png"
            alt="Red Bull"
            className="object-contain"
            style={{ height: 'clamp(52px, 9vw, 80px)', filter: 'drop-shadow(0 0 12px rgba(204,0,0,0.5)) drop-shadow(0 4px 16px rgba(0,0,0,0.6))' }}
            initial={{ opacity: 0, y: -10, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.span className="text-zinc-500 text-base font-thin select-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.35 }}>×</motion.span>
          <motion.img
            src="/wfl-logo.svg"
            alt="Wings for Life World Run"
            className="h-6 sm:h-8 object-contain"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ filter: 'brightness(0) invert(1) drop-shadow(0 0 8px rgba(204,0,0,0.35))' }}
          />
        </div>
      </div>

      {/* === MAIN CONTENT (perspective container) === */}
      <div className="relative z-10 flex-1 flex items-center justify-center select-none" style={{ perspective: '2000px' }}>

        {/* 3D Video/Image container */}
        <div
          ref={videoRef}
          className="relative overflow-hidden pointer-events-none hidden sm:block"
          style={{
            width: 'min(500px, 45vw)',
            height: 'min(440px, 40vw)',
            borderRadius: '40px',
            transformStyle: 'preserve-3d',
            scale: '0',
          }}
        >
          <iframe
            src="https://www.youtube.com/embed/M2N4KFg6G0Y?autoplay=1&mute=1&loop=1&playlist=M2N4KFg6G0Y&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1"
            title="Wings for Life World Run"
            allow="autoplay; encrypted-media"
            className="absolute border-0"
            style={{ width: '130%', height: '130%', top: '-15%', left: '-15%', objectFit: 'cover' }}
          />
          {/* Overlay gradient on video edges */}
          <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 60px 30px rgba(29,29,31,0.5)' }} />
        </div>

        {/* Title with per-character GSAP animation */}
        <div
          ref={titleRef}
          className="absolute flex flex-col items-center sm:items-start justify-center pointer-events-none"
          style={{ transform: 'translate3d(min(300px, 20vw), 0, 0)' }}
        >
          {titleWords.map((word, wi) => (
            <span
              key={wi}
              className="hero-word relative flex items-center"
              style={{
                fontFamily: 'var(--font-barlow-condensed, sans-serif)',
                color: wi === 1 ? '#F26522' : '#fafaf5',
                fontSize: 'clamp(3rem, 10vw, 120px)',
                fontWeight: 900,
                lineHeight: '0.9',
                letterSpacing: '-0.04em',
                fontStyle: wi === 2 ? 'italic' : 'normal',
                transform: `translateX(${word.offsetX}px)`,
              }}
            >
              {word.text.split('').map((char, ci) => (
                <span key={ci} className="hero-char" style={{ opacity: 0, display: char === ' ' ? 'inline' : 'inline-block', width: char === ' ' ? '0.3em' : 'auto' }}>
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 pb-20">
        <motion.p
          {...fadeUp(0)}
          className="text-[#F26522] text-xs sm:text-sm uppercase tracking-[0.3em] mb-4"
          style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}
        >
          Somma × Red Bull Apresentam
        </motion.p>

        <motion.p
          {...fadeUp(0.1)}
          className="text-zinc-300 text-sm sm:text-base max-w-md mx-auto leading-relaxed mb-6"
          style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}
        >
          Brasília vive pela primeira vez a simulação do maior evento de corrida do mundo. Venha correr, ou tente não ser pego.
        </motion.p>

        {/* Event details */}
        <motion.div
          {...fadeUp(0.2)}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-6"
        >
          {[
            { icon: Calendar, text: '25 de Abril de 2026' },
            { icon: Clock, text: '07h00 às 12h00' },
            { icon: MapPin, text: 'Parque da Cidade — Est. 9, BSB' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-1.5 text-zinc-300 text-xs sm:text-sm" style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
              <Icon className="w-3.5 h-3.5 text-[#F26522] flex-shrink-0" />
              {text}
            </div>
          ))}
        </motion.div>

        {/* Countdown */}
        <motion.div {...fadeUp(0.3)} className="mb-6">
          <CountdownTimer />
        </motion.div>

        {/* CTAs */}
        <motion.div {...fadeUp(0.4)} className="flex flex-col sm:flex-row gap-3 w-full max-w-sm sm:max-w-none sm:justify-center">
          <button
            onClick={() => scrollTo('inscricao')}
            className="bg-[#F26522] text-white font-black text-base sm:text-lg px-8 py-4 uppercase tracking-wider hover:bg-[#CC0000] transition-colors duration-200 cursor-pointer"
            style={{ fontFamily: 'var(--font-barlow-condensed, sans-serif)' }}
          >
            Quero Participar →
          </button>
          <button
            onClick={() => scrollTo('como-funciona')}
            className="border-2 border-white text-white font-black text-base sm:text-lg px-8 py-4 uppercase tracking-wider hover:bg-white hover:text-black transition-colors duration-200 cursor-pointer"
            style={{ fontFamily: 'var(--font-barlow-condensed, sans-serif)' }}
          >
            Entenda o Evento ↓
          </button>
        </motion.div>

        <motion.p
          {...fadeUp(0.5)}
          className="mt-4 text-zinc-500 text-xs uppercase tracking-widest"
          style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}
        >
          Inscrição gratuita · Vagas limitadas
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center z-10">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-6 h-6 text-white/30" />
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#080808] to-transparent z-10 pointer-events-none" />
    </section>
  )
}
