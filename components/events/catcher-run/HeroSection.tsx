'use client'

import { motion } from 'framer-motion'
import { MapPin, Calendar, Clock, ChevronDown } from 'lucide-react'
import CountdownTimer from './CountdownTimer'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
})

export default function HeroSection() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-[#080808]">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://cdn.shopify.com/s/files/1/0788/1932/8253/files/PDCSK21FEV-1794.jpg"
          alt="Corredores Somma Running Club"
          className="w-full h-full object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/75 to-[#080808]/30" />
        {/* Grain texture */}
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 512 512\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")', backgroundSize: '200px 200px' }}
        />
      </div>

      {/* Top brand bar */}
      <div className="absolute top-0 left-0 right-0 z-20 pt-5 px-4 sm:px-8 flex justify-center">
        <div
          className="flex items-center justify-center gap-4 sm:gap-8 flex-wrap"
          style={{
            /* Liquid Glass — camadas múltiplas */
            background: 'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 40%, rgba(255,255,255,0.07) 100%)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderTop: '1px solid rgba(255,255,255,0.22)',
            borderRadius: '999px',
            padding: '10px 32px 14px',
            boxShadow: [
              '0 8px 32px rgba(0,0,0,0.45)',
              '0 2px 8px rgba(0,0,0,0.3)',
              'inset 0 1px 0 rgba(255,255,255,0.18)',
              'inset 0 -1px 0 rgba(0,0,0,0.2)',
            ].join(', '),
          }}
        >
          {/* Somma logo */}
          <motion.img
            src="https://cdn.shopify.com/s/files/1/0788/1932/8253/files/HORIZONTAL_PRETA_LARANJA.png"
            alt="Somma Running Club"
            className="h-5 sm:h-7 object-contain brightness-0 invert"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ filter: 'brightness(0) invert(1) drop-shadow(0 0 8px rgba(242,101,34,0.4))' }}
          />

          <motion.span
            className="text-zinc-500 text-base font-thin select-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            ×
          </motion.span>

          {/* Red Bull can */}
          <motion.img
            src="/RED BULL_ED_LATA_FL_BRANCO_ABERTA.png"
            alt="Red Bull"
            className="object-contain"
            style={{
              height: 'clamp(52px, 9vw, 80px)',
              filter: 'drop-shadow(0 0 12px rgba(204,0,0,0.5)) drop-shadow(0 4px 16px rgba(0,0,0,0.6))',
            }}
            initial={{ opacity: 0, y: -10, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          />

          <motion.span
            className="text-zinc-500 text-base font-thin select-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.35 }}
          >
            ×
          </motion.span>

          {/* WFL logo */}
          <motion.img
            src="https://www.wingsforlifeworldrun.com/_nuxt/wflwr-logo-pos.CJlzM-_-.svg"
            alt="Wings for Life World Run"
            className="h-6 sm:h-8 object-contain brightness-0 invert"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ filter: 'brightness(0) invert(1) drop-shadow(0 0 8px rgba(204,0,0,0.35))' }}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 pt-36 pb-20">
        <motion.p
          {...fadeUp(0.1)}
          className="text-[#F26522] text-xs sm:text-sm uppercase tracking-[0.3em] mb-4 sm:mb-6"
          style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}
        >
          Somma × Red Bull Apresentam
        </motion.p>

        <motion.h1
          {...fadeUp(0.25)}
          className="text-[3.5rem] sm:text-7xl lg:text-[7.5rem] xl:text-[9rem] font-black leading-[0.88] uppercase text-white mb-4 sm:mb-6"
          style={{ fontFamily: 'var(--font-barlow-condensed, sans-serif)', letterSpacing: '-0.02em' }}
        >
          <span className="block">Você consegue</span>
          <span className="block text-[#F26522]">fugir do</span>
          <span className="block italic">Catcher Car?</span>
        </motion.h1>

        <motion.p
          {...fadeUp(0.4)}
          className="text-zinc-300 text-sm sm:text-base max-w-md mx-auto leading-relaxed mb-6 sm:mb-8"
          style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}
        >
          Brasília vive pela primeira vez a simulação do maior evento de corrida do mundo.
          Venha correr, ou tente não ser pego.
        </motion.p>

        {/* Event details */}
        <motion.div
          {...fadeUp(0.5)}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-8 sm:mb-10"
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
        <motion.div {...fadeUp(0.6)} className="mb-8 sm:mb-10">
          <CountdownTimer />
        </motion.div>

        {/* CTAs */}
        <motion.div {...fadeUp(0.75)} className="flex flex-col sm:flex-row gap-3 w-full max-w-sm sm:max-w-none sm:justify-center">
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

        {/* Inscrição gratuita tag */}
        <motion.p
          {...fadeUp(0.85)}
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

      {/* Bottom fade to page bg */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#080808] to-transparent z-10 pointer-events-none" />
    </section>
  )
}
