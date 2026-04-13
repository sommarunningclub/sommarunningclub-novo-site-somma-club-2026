'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Zap, User, BarChart2, Gift } from 'lucide-react'

const cards = [
  {
    icon: Zap,
    label: 'Largada',
    time: '08h30',
    text: 'Todo mundo larga junto no mesmo instante, assim como no WFL oficial.',
  },
  {
    icon: User,
    label: 'O Catcher Car Humano',
    time: '08h50',
    text: 'Alexandre Alves — nosso Catcher Car humano — sai correndo atrás de todos. Quando ele te tocar: acabou.',
    highlight: true,
  },
  {
    icon: BarChart2,
    label: 'Seu Resultado',
    time: 'Ao fim',
    text: 'A distância que você correu antes de ser tocado é o seu resultado. Ranking completo de todos os participantes.',
  },
  {
    icon: Gift,
    label: 'Muito Mais',
    time: 'Todo dia',
    text: 'Café da manhã com BIG BOX · Red Bull para todos · Parceiros surpresa.',
    extra: true,
  },
]

export default function EventSimulationSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="bg-[#080808] py-20 sm:py-28 px-4 border-t border-zinc-900">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: text */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p
              className="text-[#F26522] text-xs uppercase tracking-[0.3em] mb-3"
              style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}
            >
              Nosso evento
            </p>
            <h2
              className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase text-white leading-tight mb-6"
              style={{ fontFamily: 'var(--font-barlow-condensed, sans-serif)' }}
            >
              No dia 25 de abril,<br />
              Brasília vai simular<br />
              <span className="text-[#CC0000]">o Wings for Life.</span>
            </h2>
            <p
              className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-5"
              style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}
            >
              O Somma Running Club e a Red Bull trazem para o Parque da Cidade
              a experiência completa do maior evento de corrida do mundo —
              15 dias antes da corrida oficial.
            </p>
            <p
              className="text-zinc-300 text-sm sm:text-base leading-relaxed"
              style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}
            >
              Largada simultânea. Sem app. Sem tecnologia.<br />
              <strong className="text-white">100% presencial, 100% na raça.</strong>
            </p>

            {/* Photo */}
            <div className="relative mt-8 overflow-hidden">
              <img
                src="https://cdn.shopify.com/s/files/1/0788/1932/8253/files/PDCSK21FEV-1794.jpg"
                alt="Parque da Cidade com corredores"
                className="w-full h-48 sm:h-56 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/60 to-transparent" />
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#F26522] to-[#CC0000]"
              />
            </div>
          </motion.div>

          {/* Right: cards */}
          <div className="flex flex-col gap-4">
            {cards.map((card, i) => {
              const Icon = card.icon
              return (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, x: 32 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className={`bg-[#1A1A1A] border-l-2 p-4 sm:p-5 ${
                    card.highlight ? 'border-[#CC0000]' : 'border-[#F26522]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${card.highlight ? 'text-[#CC0000]' : 'text-[#F26522]'}`} />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-white font-black text-sm uppercase"
                          style={{ fontFamily: 'var(--font-barlow-condensed, sans-serif)' }}
                        >
                          {card.label}
                        </span>
                        <span
                          className={`text-xs font-mono px-1.5 py-0.5 ${
                            card.highlight ? 'bg-[#CC0000]/20 text-[#CC0000]' : 'bg-[#F26522]/10 text-[#F26522]'
                          }`}
                        >
                          {card.time}
                        </span>
                      </div>
                      <p
                        className="text-zinc-400 text-sm leading-relaxed"
                        style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}
                      >
                        {card.text}
                      </p>
                      {(card as any).extra && (
                        <div className="mt-3 flex items-center gap-2.5 bg-[#0D0D0D] border border-zinc-800 px-3 py-2.5 w-fit">
                          <span className="text-zinc-500 text-xs whitespace-nowrap" style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}>
                            FitDance com
                          </span>
                          <div className="w-px h-3 bg-zinc-700 flex-shrink-0" />
                          <img
                            src="https://cdn.shopify.com/s/files/1/0788/1932/8253/files/logo_evolve.svg?v=1776102826"
                            alt="Evolve"
                            className="h-5 object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
