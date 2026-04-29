'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, Pause, RotateCcw, Check } from 'lucide-react'
import { msParaDisplay } from '@/lib/wings-cronometragem/tempo'

type Props = {
  onTempoCapturado: (ms: number) => void
}

function vibrar(ms: number) {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(ms)
    } catch {
      // ignore
    }
  }
}

export default function Cronometro({ onTempoCapturado }: Props) {
  const [running, setRunning] = useState(false)
  const [ms, setMs] = useState(0)
  const startedAtRef = useRef<number | null>(null)
  const offsetRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!running) return
    const tick = () => {
      if (startedAtRef.current != null) {
        setMs(performance.now() - startedAtRef.current + offsetRef.current)
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [running])

  function start() {
    startedAtRef.current = performance.now()
    setRunning(true)
    vibrar(40)
  }

  function stop() {
    if (startedAtRef.current != null) {
      offsetRef.current += performance.now() - startedAtRef.current
      startedAtRef.current = null
    }
    setRunning(false)
    vibrar([30, 60, 30])
  }

  function reset() {
    setRunning(false)
    startedAtRef.current = null
    offsetRef.current = 0
    setMs(0)
    vibrar(20)
  }

  function capturar() {
    onTempoCapturado(Math.round(ms))
    vibrar(60)
  }

  return (
    <div className="bg-black text-white border border-white/10">
      <div className="flex items-center justify-between px-3 sm:px-4 pt-3">
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/50 font-bold">Cronômetro</span>
        <span
          className={`flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold transition-opacity ${
            running ? 'text-wfl-red opacity-100' : 'text-white/30 opacity-60'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              running ? 'bg-wfl-red animate-pulse' : 'bg-white/30'
            }`}
          />
          {running ? 'Rodando' : 'Parado'}
        </span>
      </div>

      <div
        className="font-mono font-bold text-wfl-yellow tabular-nums text-center select-none px-3 py-2 sm:py-3"
        style={{ fontSize: 'clamp(2.5rem, 12vw, 4rem)', lineHeight: 1 }}
        aria-live="off"
      >
        {msParaDisplay(ms)}
      </div>

      <div className="grid grid-cols-3 gap-px bg-white/10">
        {!running ? (
          <button
            type="button"
            onClick={start}
            className="min-h-14 inline-flex items-center justify-center gap-1.5 bg-wfl-red hover:bg-wfl-red/90 active:bg-wfl-red/80 text-white text-sm font-bold uppercase tracking-wider transition-colors"
          >
            <Play className="w-4 h-4 fill-white" /> Start
          </button>
        ) : (
          <button
            type="button"
            onClick={stop}
            className="min-h-14 inline-flex items-center justify-center gap-1.5 bg-wfl-yellow hover:bg-wfl-yellow/90 active:bg-wfl-yellow/80 text-wfl-navy text-sm font-bold uppercase tracking-wider transition-colors"
          >
            <Pause className="w-4 h-4 fill-wfl-navy" /> Stop
          </button>
        )}
        <button
          type="button"
          onClick={reset}
          className="min-h-14 inline-flex items-center justify-center gap-1.5 bg-black hover:bg-white/5 text-white text-sm font-bold uppercase tracking-wider transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
        <button
          type="button"
          onClick={capturar}
          disabled={ms <= 0}
          className="min-h-14 inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-bold uppercase tracking-wider transition-colors"
        >
          <Check className="w-4 h-4" /> Usar
        </button>
      </div>
    </div>
  )
}
