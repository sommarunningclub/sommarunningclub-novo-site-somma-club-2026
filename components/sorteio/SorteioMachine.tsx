// components/sorteio/SorteioMachine.tsx
'use client'

import { useRef, useEffect, useCallback } from 'react'

type SorteioMachineProps = {
  nomes: string[]
  onComplete: () => void
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÀÁÂÃÉÊÍÓÔÕÚÇ 0123456789'.split('')

function criarCharMap() {
  const map: Record<string, number> = {}
  CHARS.forEach((c, i) => { map[c] = i })
  return map
}

const CHAR_MAP = criarCharMap()

function tocarSomJackpot() {
  try {
    const ctx = new AudioContext()
    const agora = ctx.currentTime

    // Sequência de notas ascendentes (fanfarra de vitória)
    const notas = [523, 659, 784, 1047, 1319, 1568] // C5, E5, G5, C6, E6, G6
    notas.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'square'
      osc.frequency.setValueAtTime(freq, agora + i * 0.12)
      gain.gain.setValueAtTime(0, agora)
      gain.gain.linearRampToValueAtTime(0.12, agora + i * 0.12)
      gain.gain.linearRampToValueAtTime(0.08, agora + i * 0.12 + 0.1)
      gain.gain.linearRampToValueAtTime(0, agora + i * 0.12 + 0.3)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(agora + i * 0.12)
      osc.stop(agora + i * 0.12 + 0.35)
    })

    // Acorde final sustentado (C major)
    const acordeInicio = agora + notas.length * 0.12 + 0.1
    ;[523, 659, 784, 1047].forEach(freq => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, acordeInicio)
      gain.gain.setValueAtTime(0, acordeInicio)
      gain.gain.linearRampToValueAtTime(0.06, acordeInicio + 0.05)
      gain.gain.linearRampToValueAtTime(0, acordeInicio + 1.2)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(acordeInicio)
      osc.stop(acordeInicio + 1.3)
    })
  } catch { /* sem áudio */ }
}

function criarSomRoleta(): OscillatorNode | null {
  try {
    const audioCtx = new AudioContext()
    const oscillator = audioCtx.createOscillator()
    const gainNode = audioCtx.createGain()

    oscillator.type = 'square'
    oscillator.frequency.setValueAtTime(180, audioCtx.currentTime)

    // Modulação de frequência para simular roleta mecânica
    const lfo = audioCtx.createOscillator()
    const lfoGain = audioCtx.createGain()
    lfo.frequency.setValueAtTime(12, audioCtx.currentTime)
    lfoGain.gain.setValueAtTime(80, audioCtx.currentTime)
    lfo.connect(lfoGain)
    lfoGain.connect(oscillator.frequency)
    lfo.start()

    gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime)
    oscillator.connect(gainNode)
    gainNode.connect(audioCtx.destination)
    oscillator.start()

    return oscillator
  } catch {
    return null
  }
}

export default function SorteioMachine({ nomes, onComplete }: SorteioMachineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nomeAtualRef = useRef(0)
  const animationRef = useRef<number>(0)
  const somRef = useRef<OscillatorNode | null>(null)

  const animarNome = useCallback((nome: string, aoTerminar: () => void) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const text = nome.toUpperCase().split('')
    const scale = Math.min(50, (canvas.width * 0.85) / Math.max(text.length, 1))
    const breaks = 0.003
    const endSpeed = 0.05
    const firstLetter = 180
    const delay = 30

    const offset: number[] = []
    const offsetV: number[] = []

    for (let i = 0; i < text.length; i++) {
      const f = firstLetter + delay * i
      offsetV[i] = endSpeed + breaks * f
      offset[i] = -(1 + f) * (breaks * f + 2 * endSpeed) / 2
    }

    let terminados = 0

    function loop() {
      if (!canvas || !ctx) return

      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Faixa de destaque laranja Somma
      ctx.globalAlpha = 1
      ctx.fillStyle = 'rgba(255, 44, 3, 0.15)'
      ctx.fillRect(0, (canvas.height - scale) / 2, canvas.width, scale)

      terminados = 0

      for (let i = 0; i < text.length; i++) {
        ctx.fillStyle = '#ffffff'
        ctx.textBaseline = 'middle'
        ctx.textAlign = 'center'
        ctx.setTransform(
          1, 0, 0, 1,
          Math.floor((canvas.width - scale * (text.length - 1)) / 2),
          Math.floor(canvas.height / 2)
        )

        let o = offset[i]
        while (o < 0) o++
        o %= 1

        const h = Math.ceil(canvas.height / 2 / scale)

        for (let j = -h; j < h; j++) {
          let c = (CHAR_MAP[text[i]] ?? 0) + j - Math.floor(offset[i])
          while (c < 0) c += CHARS.length
          c %= CHARS.length

          const s = 1 - Math.abs(j + o) / (canvas.height / 2 / scale + 1)
          ctx.globalAlpha = s
          ctx.font = `bold ${scale * s}px monospace`
          ctx.fillText(CHARS[c], scale * i, (j + o) * scale)
        }

        offset[i] += offsetV[i]
        offsetV[i] -= breaks

        if (offsetV[i] < endSpeed) {
          offset[i] = 0
          offsetV[i] = 0
          terminados++
        }
      }

      if (terminados >= text.length) {
        // Renderizar o frame final com o nome completo
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.globalAlpha = 1
        ctx.fillStyle = 'rgba(255, 44, 3, 0.15)'
        ctx.fillRect(0, (canvas.height - scale) / 2, canvas.width, scale)

        for (let i = 0; i < text.length; i++) {
          ctx.fillStyle = '#ffffff'
          ctx.textBaseline = 'middle'
          ctx.textAlign = 'center'
          ctx.setTransform(
            1, 0, 0, 1,
            Math.floor((canvas.width - scale * (text.length - 1)) / 2),
            Math.floor(canvas.height / 2)
          )
          ctx.globalAlpha = 1
          ctx.font = `bold ${scale}px monospace`
          ctx.fillText(text[i], scale * i, 0)
        }

        // Parar som de roleta e tocar jackpot
        if (somRef.current) {
          try { somRef.current.stop() } catch { /* já parou */ }
          somRef.current = null
        }
        tocarSomJackpot()

        setTimeout(aoTerminar, 1500)
        return
      }

      animationRef.current = requestAnimationFrame(loop)
    }

    animationRef.current = requestAnimationFrame(loop)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = canvas.clientWidth * 2
    canvas.height = canvas.clientHeight * 2
    const ctx = canvas.getContext('2d')
    if (ctx) ctx.scale(2, 2)

    function avancar() {
      if (nomeAtualRef.current >= nomes.length) {
        if (somRef.current) {
          try { somRef.current.stop() } catch { /* já parou */ }
          somRef.current = null
        }
        onComplete()
        return
      }
      // Reiniciar som de roleta para cada nome
      if (!somRef.current) {
        somRef.current = criarSomRoleta()
      }
      animarNome(nomes[nomeAtualRef.current], () => {
        nomeAtualRef.current++
        avancar()
      })
    }

    // Iniciar som de roleta
    somRef.current = criarSomRoleta()

    avancar()

    return () => {
      cancelAnimationFrame(animationRef.current)
      if (somRef.current) {
        try { somRef.current.stop() } catch { /* já parou */ }
        somRef.current = null
      }
    }
  }, [nomes, onComplete, animarNome])

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center">
      <div className="w-full max-w-3xl mx-4">
        <p className="text-center text-zinc-500 text-sm mb-4 uppercase tracking-widest">
          Sorteando {nomeAtualRef.current + 1} de {nomes.length}
        </p>
        <canvas
          ref={canvasRef}
          className="w-full rounded-2xl"
          style={{ height: '200px', background: '#111' }}
        />
        <p className="text-center text-[#ff2c03] text-xs mt-4 uppercase tracking-widest animate-pulse">
          Sorteio em andamento...
        </p>
      </div>
    </div>
  )
}
