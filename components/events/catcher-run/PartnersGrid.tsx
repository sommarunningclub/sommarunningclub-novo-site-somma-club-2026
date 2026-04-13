'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const partners = [
  {
    name: 'Red Bull',
    logo: '/RED BULL_ED_MOLHADO_LATA_IR_ABERTA_ILUSTRADA (1).png',
    role: 'Patrocinador Principal',
    noInvert: true,
  },
  {
    name: 'Wings for Life World Run',
    logo: 'https://www.wingsforlifeworldrun.com/_nuxt/wflwr-logo-pos.CJlzM-_-.svg',
    role: 'Evento Oficial',
  },
  {
    name: 'Somma Running Club',
    logo: 'https://cdn.shopify.com/s/files/1/0788/1932/8253/files/HORIZONTAL_PRETA_LARANJA.png',
    role: 'Organizador',
  },
  {
    name: 'BIG BOX',
    logo: null,
    initials: 'BIG BOX',
    role: 'Café da Manhã',
  },
  {
    name: 'Evolve',
    logo: null,
    initials: 'EVOLVE',
    role: 'FitDance',
  },
  {
    name: 'Em breve',
    logo: null,
    initials: '?',
    role: 'Parceiro surpresa',
    placeholder: true,
  },
]

export default function PartnersGrid() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="bg-[#080808] py-20 sm:py-28 px-4 border-t border-zinc-900">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <p
            className="text-[#F26522] text-xs uppercase tracking-[0.3em] mb-3"
            style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}
          >
            Parceiros
          </p>
          <h2
            className="text-4xl sm:text-5xl font-black uppercase text-white leading-none"
            style={{ fontFamily: 'var(--font-barlow-condensed, sans-serif)' }}
          >
            Quem faz isso acontecer
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {partners.map((partner, i) => (
            <motion.div
              key={`${partner.name}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`group relative bg-[#111111] border border-zinc-800 flex flex-col items-center justify-center py-8 px-4 gap-3 hover:border-[#F26522]/40 transition-all duration-300 cursor-default ${
                partner.placeholder ? 'opacity-40' : ''
              }`}
            >
              <div className="h-14 flex items-center justify-center">
                {partner.logo ? (
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className={`object-contain transition-opacity duration-300 ${
                      (partner as any).noInvert
                        ? 'max-h-14 max-w-[70px] opacity-90 group-hover:opacity-100 drop-shadow-md'
                        : 'max-h-10 max-w-[120px] brightness-0 invert opacity-70 group-hover:opacity-100'
                    }`}
                  />
                ) : (
                  <span
                    className="text-zinc-400 text-2xl font-black uppercase group-hover:text-white transition-colors duration-300"
                    style={{ fontFamily: 'var(--font-barlow-condensed, sans-serif)' }}
                  >
                    {partner.initials}
                  </span>
                )}
              </div>
              <p
                className="text-zinc-600 text-xs uppercase tracking-widest group-hover:text-zinc-400 transition-colors duration-300"
                style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}
              >
                {partner.role}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
