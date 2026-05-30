"use client"

import type React from "react"
import { useState, useRef, useEffect, useMemo } from "react"
import { Search } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  placeholder?: string
  value?: string
  onSearch?: (query: string) => void
  className?: string
}

/**
 * Barra de busca animada (adaptada de 21st.dev/muditgoel1512/search-bar).
 * Ajustes: tema laranja Somma, full-width para header mobile/PWA,
 * busca em tempo real (onSearch a cada tecla) e sem sugestões hardcoded.
 */
const SearchBar = ({ placeholder = "Buscar...", value, onSearch, className }: SearchBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [internal, setInternal] = useState(value ?? "")
  const query = value ?? internal

  const isUnsupportedBrowser = useMemo(() => {
    if (typeof window === "undefined") return false
    const ua = navigator.userAgent.toLowerCase()
    const isSafari = ua.includes("safari") && !ua.includes("chrome") && !ua.includes("chromium")
    const isChromeOniOS = ua.includes("crios")
    return isSafari || isChromeOniOS
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value
    if (value === undefined) setInternal(v)
    onSearch?.(v)
  }

  useEffect(() => {
    if (isFocused && inputRef.current) inputRef.current.focus()
  }, [isFocused])

  const particles = Array.from({ length: isFocused ? 12 : 0 }, (_, i) => (
    <motion.div
      key={i}
      initial={{ scale: 0 }}
      animate={{
        x: [0, (Math.random() - 0.5) * 30],
        y: [0, (Math.random() - 0.5) * 30],
        scale: [0, Math.random() * 0.7 + 0.3],
        opacity: [0, 0.6, 0],
      }}
      transition={{
        duration: Math.random() * 1.5 + 1.5,
        ease: "easeInOut",
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      }}
      className="absolute w-2.5 h-2.5 rounded-full bg-orange-400"
      style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, filter: "blur(2px)" }}
    />
  ))

  return (
    <div className={cn("relative w-full", className)}>
      <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden="true">
        <defs>
          <filter id="gooey-search">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -8" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <motion.div
        className={cn(
          "flex items-center w-full rounded-full border relative overflow-hidden",
          isFocused ? "border-orange-400 bg-white shadow-lg" : "border-zinc-300 bg-white/95",
        )}
        animate={{
          boxShadow: isFocused ? "0 8px 24px rgba(255,44,3,0.18)" : "0 0 0 rgba(0,0,0,0)",
        }}
      >
        <div
          className="absolute inset-0 overflow-hidden rounded-full pointer-events-none"
          style={{ filter: isUnsupportedBrowser ? "none" : "url(#gooey-search)" }}
        >
          {particles}
        </div>

        <div className="pl-4 py-2.5">
          <Search size={18} strokeWidth={isFocused ? 2.5 : 2} className={cn("transition-colors", isFocused ? "text-orange-600" : "text-zinc-400")} />
        </div>

        <input
          ref={inputRef}
          type="text"
          inputMode="search"
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full py-2.5 px-3 bg-transparent outline-none placeholder:text-zinc-400 text-base text-zinc-900 relative z-10"
          style={{ fontSize: '16px' }}
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              if (value === undefined) setInternal("")
              onSearch?.("")
              inputRef.current?.focus()
            }}
            className="px-4 text-zinc-400 hover:text-zinc-600 relative z-10"
            aria-label="Limpar busca"
          >
            ✕
          </button>
        )}
      </motion.div>
    </div>
  )
}

export { SearchBar }
