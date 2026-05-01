'use client'

import { useEffect, useState } from 'react'
import { Users, X } from 'lucide-react'

const COOKIE_JA_CADASTROU = 'wings_equipe_cadastrada'
const COOKIE_FECHOU = 'wings_cadastro_flutuante_fechado'

export default function WingsCadastroFlutuante() {
  const [visivel, setVisivel] = useState(false)
  const [escondido, setEscondido] = useState(true) // user fechou manualmente

  useEffect(() => {
    if (typeof document === 'undefined') return
    // Não mostra se já cadastrou
    if (document.cookie.includes(`${COOKIE_JA_CADASTROU}=`)) return
    // Não mostra se user fechou na sessão atual
    if (sessionStorage.getItem(COOKIE_FECHOU) === '1') return
    setEscondido(false)

    function onScroll() {
      const scrolled = window.scrollY
      const total = document.documentElement.scrollHeight - window.innerHeight
      if (total <= 0) return
      const ratio = scrolled / total
      // Aparece após 12% de scroll, some quando chega na seção de cadastro (id=wings-cadastro-equipe)
      const sec = document.getElementById('wings-cadastro-equipe')
      let dentroDaSecao = false
      if (sec) {
        const rect = sec.getBoundingClientRect()
        dentroDaSecao = rect.top < window.innerHeight * 0.7 && rect.bottom > 0
      }
      setVisivel(ratio >= 0.12 && !dentroDaSecao)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function fechar(e: React.MouseEvent) {
    e.stopPropagation()
    e.preventDefault()
    sessionStorage.setItem(COOKIE_FECHOU, '1')
    setEscondido(true)
  }

  function rolarParaCadastro() {
    document.getElementById('wings-cadastro-equipe')?.scrollIntoView({ behavior: 'smooth' })
  }

  if (escondido) return null

  return (
    <button
      type="button"
      onClick={rolarParaCadastro}
      aria-label="Cadastrar equipe competidora"
      className={`fixed z-40 bottom-3 right-3 sm:bottom-8 sm:right-8 group transition-all duration-500 max-w-[calc(100vw-1.5rem)] ${
        visivel
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <span className="relative flex items-center gap-2 sm:gap-3 bg-[#ff2c03] hover:bg-[#e62800] text-white pl-3 pr-3 py-2.5 sm:pl-4 sm:pr-5 sm:py-3.5 shadow-2xl shadow-[#ff2c03]/40 border-2 border-white/15">
        {/* Pulse ring */}
        <span
          aria-hidden="true"
          className="absolute -inset-1 rounded-sm border-2 border-[#ff2c03] animate-ping opacity-40"
        />
        <span className="relative flex items-center gap-2 sm:gap-3">
          <span className="bg-wfl-yellow text-wfl-navy p-1.5 sm:p-2 flex items-center justify-center flex-shrink-0">
            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
          </span>
          <span
            className="font-bold tracking-wider uppercase text-[10px] sm:text-xs leading-tight text-left"
            style={{ fontFamily: 'var(--font-dm-sans-wfl), sans-serif' }}
          >
            <span className="block text-wfl-yellow">Sua atlética competindo?</span>
            <span className="block">Cadastrar equipe →</span>
          </span>
        </span>
        <span
          role="button"
          tabIndex={0}
          aria-label="Fechar"
          onClick={fechar}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              fechar(e as unknown as React.MouseEvent)
            }
          }}
          className="ml-1 sm:ml-2 w-7 h-7 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/20 transition-colors flex-shrink-0 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </span>
      </span>
    </button>
  )
}
