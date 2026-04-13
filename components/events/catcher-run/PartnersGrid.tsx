'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

type Partner = {
  name: string
  logo: string | null
  role: string
  tier: 'main' | 'partner' | 'soon'
  invert?: boolean
}

const mainPartners: Partner[] = [
  {
    name: 'Red Bull',
    logo: '/RED BULL_ED_MOLHADO_LATA_IR_ABERTA_ILUSTRADA (1).png',
    role: 'Patrocinador Principal',
    tier: 'main',
  },
  {
    name: 'Wings for Life World Run',
    logo: 'https://www.wingsforlifeworldrun.com/_nuxt/wflwr-logo-pos.CJlzM-_-.svg',
    role: 'Evento Oficial',
    tier: 'main',
    invert: true,
  },
  {
    name: 'Somma Running Club',
    logo: 'https://cdn.shopify.com/s/files/1/0788/1932/8253/files/HORIZONTAL_PRETA_LARANJA.png',
    role: 'Organizador',
    tier: 'main',
    invert: true,
  },
]

const otherPartners: Partner[] = [
  {
    name: 'BIG BOX',
    logo: 'https://institucional.bigbox.com.br/wp-content/uploads/2018/09/cropped-logo-1.png',
    role: 'Café da Manhã',
    tier: 'partner',
  },
  {
    name: 'Evolve',
    logo: '/evolve-logo.svg',
    role: 'FitDance',
    tier: 'partner',
  },
  {
    name: 'Em breve',
    logo: null,
    role: 'Parceiro surpresa',
    tier: 'soon',
  },
]

export default function PartnersGrid() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="bg-[#080808] py-20 sm:py-28 px-4 border-t border-zinc-900">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 sm:mb-20"
        >
          <p
            className="text-[#F26522] text-xs uppercase tracking-[0.3em] mb-3"
            style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}
          >
            Parceiros
          </p>
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase text-white leading-none"
            style={{ fontFamily: 'var(--font-barlow-condensed, sans-serif)' }}
          >
            Quem faz isso acontecer
          </h2>
        </motion.div>

        {/* Tier 1 — Destaques principais */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-zinc-800/50 mb-6">
          {mainPartners.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative bg-[#0D0D0D] flex flex-col items-center justify-center py-10 sm:py-14 px-6 cursor-default overflow-hidden"
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: 'radial-gradient(circle at 50% 50%, rgba(242,101,34,0.06) 0%, transparent 70%)' }}
              />
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F26522]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="h-16 sm:h-20 flex items-center justify-center mb-4">
                <img
                  src={p.logo!}
                  alt={p.name}
                  className={`max-h-full object-contain transition-all duration-300 ${
                    p.invert
                      ? 'max-w-[160px] sm:max-w-[200px] brightness-0 invert opacity-60 group-hover:opacity-100'
                      : 'max-w-[60px] sm:max-w-[80px] opacity-80 group-hover:opacity-100 drop-shadow-lg'
                  }`}
                />
              </div>
              <p
                className="text-white font-bold text-sm uppercase tracking-wider mb-1"
                style={{ fontFamily: 'var(--font-barlow-condensed, sans-serif)' }}
              >
                {p.name}
              </p>
              <p
                className="text-zinc-600 text-[11px] uppercase tracking-widest group-hover:text-[#F26522]/60 transition-colors duration-300"
                style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}
              >
                {p.role}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Tier 2 — Outros parceiros */}
        <div className="grid grid-cols-3 gap-px bg-zinc-800/50">
          {otherPartners.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.3 + i * 0.08 }}
              className={`group bg-[#0D0D0D] flex flex-col items-center justify-center py-6 sm:py-8 px-3 cursor-default ${
                p.tier === 'soon' ? 'opacity-30' : ''
              }`}
            >
              <div className="h-10 sm:h-12 flex items-center justify-center mb-2">
                {p.logo ? (
                  <img
                    src={p.logo}
                    alt={p.name}
                    className="max-h-full max-w-[100px] sm:max-w-[120px] object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                  />
                ) : (
                  <span
                    className="text-zinc-700 text-2xl sm:text-3xl font-black"
                    style={{ fontFamily: 'var(--font-barlow-condensed, sans-serif)' }}
                  >
                    ?
                  </span>
                )}
              </div>
              <p
                className="text-zinc-600 text-[10px] sm:text-[11px] uppercase tracking-widest text-center group-hover:text-zinc-400 transition-colors duration-300"
                style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}
              >
                {p.role}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-8 text-zinc-700 text-xs uppercase tracking-[0.3em]"
          style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}
        >
          Quer ser parceiro? Entre em contato
        </motion.p>
      </div>
    </section>
  )
}
