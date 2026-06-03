'use client'

import { useMemo, useRef, useState } from 'react'
import { Mountain, TrendingUp } from 'lucide-react'
import type { ElevPoint } from '@/app/somma-rio-2026/route-data'

const SOMMA = '#FF2C03'
const W = 1000
const H = 260
const PAD = { top: 28, right: 16, bottom: 28, left: 16 }

interface Peak { km: number; label: string }

interface ElevationProfileProps {
  data: ElevPoint[] // [distancia_km, altitude_m]
  gain?: number // ganho de elevação (m)
  peaks?: Peak[]
  className?: string
}

export function ElevationProfile({ data, gain, peaks = [], className = '' }: ElevationProfileProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState<number | null>(null)

  const geo = useMemo(() => {
    const maxD = data[data.length - 1][0] || 1
    const elevs = data.map((p) => p[1])
    const minE = Math.min(...elevs)
    const maxE = Math.max(...elevs)
    const range = maxE - minE || 1
    const plotW = W - PAD.left - PAD.right
    const plotH = H - PAD.top - PAD.bottom
    const x = (d: number) => PAD.left + (d / maxD) * plotW
    const y = (e: number) => PAD.top + (1 - (e - minE) / range) * plotH
    const pts = data.map((p) => `${x(p[0]).toFixed(1)},${y(p[1]).toFixed(1)}`).join(' ')
    return { maxD, minE, maxE, x, y, pts }
  }, [data])

  const onMove = (clientX: number) => {
    const el = wrapRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const frac = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1)
    const km = frac * geo.maxD
    // índice mais próximo
    let idx = 0
    let best = Infinity
    data.forEach((p, i) => {
      const d = Math.abs(p[0] - km)
      if (d < best) { best = d; idx = i }
    })
    setHover(idx)
  }

  const hoverPoint = hover !== null ? data[hover] : null
  const hoverFrac = hoverPoint ? hoverPoint[0] / geo.maxD : 0

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#0e0e0e] p-5 md:p-6 ${className}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Mountain className="h-4 w-4 text-[#FF2C03]" aria-hidden />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Altimetria real</p>
        </div>
        {gain != null && (
          <span className="flex items-center gap-1.5 rounded-full border border-[#FF2C03]/30 bg-[#FF2C03]/10 px-3 py-1 text-[11px] font-bold text-[#FF2C03]">
            <TrendingUp className="h-3.5 w-3.5" aria-hidden /> +{gain} m
          </span>
        )}
      </div>

      <div
        ref={wrapRef}
        className="relative touch-none select-none"
        onMouseMove={(e) => onMove(e.clientX)}
        onMouseLeave={() => setHover(null)}
        onTouchStart={(e) => onMove(e.touches[0].clientX)}
        onTouchMove={(e) => onMove(e.touches[0].clientX)}
        onTouchEnd={() => setHover(null)}
      >
        <svg viewBox={`0 0 ${W} ${H}`} className="h-44 w-full md:h-56" role="img" aria-label="Perfil de altimetria real do percurso">
          <defs>
            <linearGradient id="elev-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={SOMMA} stopOpacity="0.38" />
              <stop offset="100%" stopColor={SOMMA} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* área + linha */}
          <polygon points={`${PAD.left},${H - PAD.bottom} ${geo.pts} ${W - PAD.right},${H - PAD.bottom}`} fill="url(#elev-fill)" />
          <polyline points={geo.pts} fill="none" stroke={SOMMA} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

          {/* picos nomeados */}
          {peaks.map((pk) => {
            const px = geo.x(pk.km)
            return (
              <g key={pk.label}>
                <line x1={px} y1={PAD.top - 6} x2={px} y2={H - PAD.bottom} stroke="#ffffff" strokeOpacity="0.1" strokeDasharray="4 4" />
                <text x={px} y={PAD.top - 12} fill="#9a9a9a" fontSize="13" fontWeight="700" textAnchor="middle">{pk.label}</text>
              </g>
            )
          })}

          {/* crosshair do hover */}
          {hoverPoint && (
            <g>
              <line x1={geo.x(hoverPoint[0])} y1={PAD.top - 6} x2={geo.x(hoverPoint[0])} y2={H - PAD.bottom} stroke={SOMMA} strokeOpacity="0.7" strokeWidth="1.5" />
              <circle cx={geo.x(hoverPoint[0])} cy={geo.y(hoverPoint[1])} r="5" fill="#fff" stroke={SOMMA} strokeWidth="2.5" />
            </g>
          )}
        </svg>

        {/* tooltip */}
        {hoverPoint && (
          <div
            className="pointer-events-none absolute top-1 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg border border-[#FF2C03]/40 bg-black/90 px-3 py-1.5 text-center shadow-lg backdrop-blur-sm"
            style={{ left: `${hoverFrac * 100}%` }}
          >
            <span className="block text-sm font-bold text-white">{hoverPoint[1].toFixed(0)} m</span>
            <span className="block text-[10px] uppercase tracking-widest text-[#FF2C03]">KM {hoverPoint[0].toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="mt-3 flex justify-between text-[10px] font-semibold uppercase tracking-wider text-[#666]">
        <span>KM 0</span><span>KM {(geo.maxD / 2).toFixed(0)}</span><span>KM {geo.maxD.toFixed(0)}</span>
      </div>
      <p className="mt-2 text-center text-[10px] uppercase tracking-widest text-[#555] md:hidden">Arraste para inspecionar o perfil</p>
    </div>
  )
}
