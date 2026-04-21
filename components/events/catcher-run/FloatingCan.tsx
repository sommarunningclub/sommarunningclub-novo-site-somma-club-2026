'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function FloatingCan() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToForm = () => {
    document.getElementById('inscricao')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 80 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed right-4 sm:right-6 bottom-6 z-50 flex flex-col items-center gap-2 cursor-pointer group"
          onClick={scrollToForm}
        >
          {/* Badge vagas limitadas */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-1.5 bg-black/80 border border-red-700/60 text-red-400 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-sm whitespace-nowrap"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse flex-shrink-0" />
            Vagas limitadas
          </motion.div>

          {/* Lata flutuante */}
          <div
            style={{ animation: 'floatCan 3s ease-in-out infinite' }}
            className="relative"
          >
            <img
              src="https://cdn.shopify.com/s/files/1/0788/1932/8253/files/RED_BULL_ED_MOLHADO_LATA_IR_ABERTA_ILUSTRADA_1.png?v=1776108610"
              alt="Red Bull"
              className="h-20 sm:h-24 w-auto object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-300"
              style={{ filter: 'drop-shadow(0 8px 24px rgba(204,0,0,0.4))' }}
            />
          </div>

          {/* CTA label */}
          <span
            className="text-white/60 text-[10px] uppercase tracking-widest group-hover:text-white transition-colors duration-200"
            style={{ fontFamily: 'var(--font-dm-sans, sans-serif)' }}
          >
            Garantir vaga
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
