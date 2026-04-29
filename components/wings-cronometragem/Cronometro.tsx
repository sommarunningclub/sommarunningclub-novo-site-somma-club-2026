'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, Pause, RotateCcw, Check } from 'lucide-react'
import { msParaDisplay } from '@/lib/wings-cronometragem/tempo'

type Props = {
  onTempoCapturado: (ms: number) => void
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
  }

  function stop() {
    if (startedAtRef.current != null) {
      offsetRef.current += performance.now() - startedAtRef.current
      startedAtRef.current = null
    }
    setRunning(false)
  }

  function reset() {
    setRunning(false)
    startedAtRef.current = null
    offsetRef.current = 0
    setMs(0)
  }

  function capturar() {
    onTempoCapturado(Math.round(ms))
  }

  return (
    <div className="bg-black text-white p-4 sm:p-5 rounded-lg border border-white/10">
      <div className="flex items-baseline justify-between mb-4">
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/50">Cronômetro</span>
        {running && (
          <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-wfl-red font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-wfl-red animate-pulse" /> Rodando
          </span>
        )}
      </div>
      <div
        className="font-mono text-4xl sm:text-5xl font-bold text-wfl-yellow tabular-nums text-center select-none"
        aria-live="polite"
      >
        {msParaDisplay(ms)}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {!running ? (
          <button
            type="button"
            onClick={start}
            className="col-span-1 inline-flex items-center justify-center gap-1.5 bg-wfl-red hover:bg-wfl-red/90 text-white py-3 text-sm font-bold uppercase tracking-wider transition-colors"
          >
            <Play className="w-4 h-4" /> Start
          </button>
        ) : (
          <button
            type="button"
            onClick={stop}
            className="col-span-1 inline-flex items-center justify-center gap-1.5 bg-wfl-yellow hover:bg-wfl-yellow/90 text-wfl-navy py-3 text-sm font-bold uppercase tracking-wider transition-colors"
          >
            <Pause className="w-4 h-4" /> Stop
          </button>
        )}
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 text-white py-3 text-sm font-bold uppercase tracking-wider transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
        <button
          type="button"
          onClick={capturar}
          disabled={ms <= 0}
          className="inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white py-3 text-sm font-bold uppercase tracking-wider transition-colors"
        >
          <Check className="w-4 h-4" /> Usar
        </button>
      </div>
    </div>
  )
}
