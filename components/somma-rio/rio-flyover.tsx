'use client'

import { useEffect, useRef, useState } from 'react'
import { setOptions, importLibrary } from '@googlemaps/js-api-loader'
import { Play, Pause, Maximize2, MapPin, X } from 'lucide-react'
import type { LatLng } from '@/app/somma-rio-2026/route-data'

const SOMMA = '#FF2C03'
export type PoiTone = 'green' | 'yellow' | 'red' | 'orange'
const TONE_HEX: Record<PoiTone, string> = { green: '#10b981', yellow: '#f59e0b', red: '#ef4444', orange: SOMMA }
const TONE_RING: Record<PoiTone, string> = {
  green: 'border-emerald-500/50', yellow: 'border-amber-500/50', red: 'border-red-500/50', orange: 'border-[#FF2C03]/50',
}
const TONE_TXT: Record<PoiTone, string> = {
  green: 'text-emerald-400', yellow: 'text-amber-400', red: 'text-red-400', orange: 'text-[#FF2C03]',
}

export interface CircuitPoi { km: number; tone: PoiTone; title: string; note?: string }
export interface HydrationPoint { km: number; type: 'agua' | 'eletro' }
const AGUA = '#38bdf8'
const ELETRO = '#a78bfa'

interface RioFlyoverProps {
  points: LatLng[]
  pois?: CircuitPoi[]
  hydration?: HydrationPoint[]
  label: string
  distanceLabel: string
  className?: string
  /** quando definido, auto-sobrevoa ao virar true (ex.: slide ativo) e pausa ao virar false */
  autoActive?: boolean
}

// presets de velocidade do sobrevoo (duração total da volta, em ms)
const SPEEDS = [
  { label: 'Lento', dur: 78000 },
  { label: 'Normal', dur: 46000 },
  { label: 'Rápido', dur: 26000 },
]
const FOLLOW_ZOOM = 16

export function RioFlyover({ points, pois = [], hydration = [], label, distanceLabel, className = '', autoActive }: RioFlyoverProps) {
  const mapEl = useRef<HTMLDivElement>(null)
  const [error, setError] = useState(false)
  const [ready, setReady] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [activePoi, setActivePoi] = useState<number | null>(null)
  const [totalKm, setTotalKm] = useState(0)
  const [speedIdx, setSpeedIdx] = useState(0) // padrão: Lento
  const speedRef = useRef(0)

  // refs imperativos
  const mapRef = useRef<google.maps.Map | null>(null)
  const pathRef = useRef<google.maps.LatLngLiteral[]>([])
  const cumRef = useRef<number[]>([])
  const totalRef = useRef(0)
  const activeLineRef = useRef<google.maps.Polyline | null>(null)
  const glowLineRef = useRef<google.maps.Polyline | null>(null)
  const headRef = useRef<google.maps.Marker | null>(null)
  const boundsRef = useRef<google.maps.LatLngBounds | null>(null)
  const poiFracRef = useRef<number[]>([])
  const progressRef = useRef(0)
  const playingRef = useRef(false)
  const followRef = useRef(false)
  const rafRef = useRef(0)
  const activePoiRef = useRef<number | null>(null)

  // ── posição interpolada ao longo do trajeto ──
  const interpAt = (target: number) => {
    const path = pathRef.current
    const cum = cumRef.current
    const sph = google.maps.geometry.spherical
    for (let i = 1; i < path.length; i++) {
      if (cum[i] >= target) {
        const segStart = cum[i - 1]
        const segLen = cum[i] - segStart || 1
        const r = (target - segStart) / segLen
        const pt = sph.interpolate(path[i - 1], path[i], Math.min(Math.max(r, 0), 1))
        return { idx: i, point: { lat: pt.lat(), lng: pt.lng() } }
      }
    }
    return { idx: path.length - 1, point: path[path.length - 1] }
  }

  const apply = (p: number, follow: boolean) => {
    const total = totalRef.current
    if (!total || !activeLineRef.current) return
    const { idx, point } = interpAt(p * total)
    const drawn = pathRef.current.slice(0, idx).concat([point])
    activeLineRef.current.setPath(drawn)
    glowLineRef.current?.setPath(drawn)
    headRef.current?.setPosition(point)
    if (follow && mapRef.current) mapRef.current.moveCamera({ center: point, zoom: FOLLOW_ZOOM })

    // destaca POI mais próximo (durante o sobrevoo)
    if (poiFracRef.current.length) {
      let near = -1, best = 0.02 // ~2% do trajeto
      poiFracRef.current.forEach((f, i) => {
        const d = Math.abs(f - p)
        if (d < best) { best = d; near = i }
      })
      if (near !== -1 && near !== activePoiRef.current) {
        activePoiRef.current = near
        setActivePoi(near)
      }
    }
  }

  const stopFly = () => {
    playingRef.current = false
    setPlaying(false)
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
  }

  const play = () => {
    if (!ready) return
    followRef.current = true
    playingRef.current = true
    setPlaying(true)
    if (progressRef.current >= 0.999) { progressRef.current = 0; setProgress(0) }
    let last: number | null = null
    const tick = (ts: number) => {
      if (!playingRef.current) return
      if (last === null) last = ts
      const dt = ts - last; last = ts
      let p = progressRef.current + dt / SPEEDS[speedRef.current].dur
      if (p >= 1) { p = 1 }
      progressRef.current = p
      apply(p, true)
      setProgress(p)
      if (p >= 1) { stopFly(); return }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  const scrub = (v: number) => {
    stopFly()
    followRef.current = true
    const p = v / 1000
    progressRef.current = p
    setProgress(p)
    apply(p, true)
  }

  const jumpToPoi = (i: number) => {
    stopFly()
    followRef.current = true
    const p = poiFracRef.current[i] ?? 0
    progressRef.current = p
    setProgress(p)
    activePoiRef.current = i
    setActivePoi(i)
    apply(p, true)
  }

  const seeAll = () => {
    stopFly()
    followRef.current = false
    if (mapRef.current && boundsRef.current) mapRef.current.fitBounds(boundsRef.current, { top: 48, right: 40, bottom: 40, left: 40 })
  }

  // ── init mapa satélite ──
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey || !mapEl.current || points.length < 2) { setError(true); return }
    let cancelled = false
    setOptions({ key: apiKey, v: 'weekly' })

    Promise.all([importLibrary('maps'), importLibrary('geometry')])
      .then(([{ Map, Polyline }]) => {
        if (cancelled || !mapEl.current) return
        const path = points.map(([lat, lng]) => ({ lat, lng }))
        pathRef.current = path

        const map = new Map(mapEl.current, {
          mapTypeId: 'hybrid',
          tilt: 0,
          disableDefaultUI: true,
          gestureHandling: 'none',
          keyboardShortcuts: false,
          clickableIcons: false,
          backgroundColor: '#0a0a0a',
          isFractionalZoomEnabled: true,
        })
        mapRef.current = map

        const bounds = new google.maps.LatLngBounds()
        path.forEach((p) => bounds.extend(p))
        boundsRef.current = bounds
        map.fitBounds(bounds, { top: 48, right: 40, bottom: 40, left: 40 })

        const sph = google.maps.geometry.spherical
        const cum: number[] = [0]
        let total = 0
        for (let i = 1; i < path.length; i++) { total += sph.computeDistanceBetween(path[i - 1], path[i]); cum.push(total) }
        cumRef.current = cum; totalRef.current = total
        setTotalKm(total / 1000)

        // contorno escuro + traçado completo (contraste no satélite)
        new Polyline({ map, path, strokeColor: '#000', strokeOpacity: 0.45, strokeWeight: 8 })
        new Polyline({ map, path, strokeColor: SOMMA, strokeOpacity: 0.55, strokeWeight: 3 })
        // traçado ativo
        glowLineRef.current = new Polyline({ map, path: [], strokeColor: SOMMA, strokeOpacity: 0.3, strokeWeight: 11 })
        activeLineRef.current = new Polyline({ map, path: [], strokeColor: SOMMA, strokeOpacity: 1, strokeWeight: 5 })

        // largada / chegada
        const dot = (p: google.maps.LatLngLiteral, color: string, scale = 6) =>
          new google.maps.Marker({ map, position: p, zIndex: 6, icon: { path: google.maps.SymbolPath.CIRCLE, scale, fillColor: color, fillOpacity: 1, strokeColor: '#000', strokeWeight: 2 } })
        dot(path[0], '#ffffff')
        dot(path[path.length - 1], SOMMA)

        // hidratação (água / eletrólitos)
        hydration.forEach((h) => {
          const frac = Math.min(Math.max((h.km * 1000) / total, 0), 1)
          const { point } = interpAt(frac * total)
          new google.maps.Marker({
            map, position: point, zIndex: 4,
            icon: { path: google.maps.SymbolPath.CIRCLE, scale: 4, fillColor: h.type === 'agua' ? AGUA : ELETRO, fillOpacity: 1, strokeColor: '#0a0a0a', strokeWeight: 1.5 },
            title: `${h.type === 'agua' ? 'Água' : 'Eletrólitos'} · km ${h.km}`,
          })
        })

        // pontos de atenção
        poiFracRef.current = pois.map((poi) => Math.min(Math.max((poi.km * 1000) / total, 0), 1))
        pois.forEach((poi, i) => {
          const frac = poiFracRef.current[i]
          const { point } = interpAt(frac * total)
          const m = new google.maps.Marker({
            map, position: point, zIndex: 8,
            icon: { path: google.maps.SymbolPath.CIRCLE, scale: 7, fillColor: TONE_HEX[poi.tone], fillOpacity: 1, strokeColor: '#0a0a0a', strokeWeight: 2.5 },
            title: poi.title,
          })
          m.addListener('click', () => jumpToPoi(i))
        })

        // cabeça (corredor)
        headRef.current = new google.maps.Marker({
          map, position: path[0], zIndex: 10,
          icon: { path: google.maps.SymbolPath.CIRCLE, scale: 6.5, fillColor: '#fff', fillOpacity: 1, strokeColor: SOMMA, strokeWeight: 3.5 },
        })

        setReady(true)
      })
      .catch(() => setError(true))

    return () => { cancelled = true; if (rafRef.current) cancelAnimationFrame(rafRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points])

  // auto-sobrevoo controlado externamente (ex.: slide ativo na apresentação)
  useEffect(() => {
    if (autoActive === undefined || !ready) return
    if (autoActive) { progressRef.current = 0; setProgress(0); play() }
    else stopFly()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoActive, ready])

  if (error) {
    return (
      <div className={`flex min-h-[20rem] w-full items-center justify-center rounded-2xl border border-white/10 bg-[#0a0a0a] text-center ${className}`}>
        <div className="px-6">
          <p className="font-[family-name:var(--font-display)] text-2xl uppercase text-white">{label}</p>
          <p className="mt-2 text-sm text-[#A1A1A1]">{distanceLabel}</p>
        </div>
      </div>
    )
  }

  const poi = activePoi !== null ? pois[activePoi] : null

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
      {/* MAPA */}
      <div className={`relative w-full ${className}`}>
        <div ref={mapEl} className="absolute inset-0 h-full w-full" aria-label={`Sobrevoo do circuito ${label}`} />

        {/* HUD */}
        <div className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`} aria-hidden>
          {['left-3 top-3 border-l-2 border-t-2', 'right-3 top-3 border-r-2 border-t-2', 'left-3 bottom-3 border-l-2 border-b-2', 'right-3 bottom-3 border-r-2 border-b-2'].map((pos) => (
            <span key={pos} className={`absolute h-5 w-5 border-[#FF2C03]/70 ${pos}`} />
          ))}
          <div className="absolute left-3 top-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#FF2C03] sm:text-xs">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#FF2C03]" /> Sobrevoo · {label}
          </div>
          <div className="absolute right-3 top-3 rounded bg-black/60 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-white/85 backdrop-blur-sm sm:text-xs">
            KM {(progress * totalKm).toFixed(1)} / {totalKm.toFixed(1)}
          </div>
        </div>

        {/* botão Ver tudo */}
        <button onClick={seeAll} className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white/85 backdrop-blur-sm transition hover:border-[#FF2C03] hover:text-[#FF2C03]">
          <Maximize2 className="h-3.5 w-3.5" /> Ver tudo
        </button>

        {/* callout do ponto de atenção */}
        {poi && (
          <div className={`absolute bottom-3 left-3 right-16 z-10 rounded-xl border bg-black/85 p-3 backdrop-blur-sm sm:max-w-sm ${TONE_RING[poi.tone]}`}>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className={`text-[10px] font-bold uppercase tracking-widest ${TONE_TXT[poi.tone]}`}>KM {poi.km.toString().replace('.', ',')} · ponto de atenção</p>
                <p className="mt-0.5 text-sm font-bold uppercase leading-tight text-white">{poi.title}</p>
                {poi.note && <p className="mt-1 text-xs text-[#A1A1A1]">{poi.note}</p>}
              </div>
              <button onClick={() => { setActivePoi(null); activePoiRef.current = null }} aria-label="Fechar" className="shrink-0 text-[#888] hover:text-white"><X className="h-4 w-4" /></button>
            </div>
          </div>
        )}

        {!ready && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#0a0a0a] text-xs font-semibold uppercase tracking-[0.2em] text-[#A1A1A1]">Carregando satélite…</div>
        )}
      </div>

      {/* CONTROLES */}
      <div className="border-t border-white/10 bg-[#0a0a0a] px-4 py-3.5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => (playing ? stopFly() : play())}
            disabled={!ready}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FF2C03] text-white transition hover:bg-[#ff4d35] disabled:opacity-40"
            aria-label={playing ? 'Pausar sobrevoo' : 'Sobrevoar circuito'}
          >
            {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 translate-x-0.5" />}
          </button>
          <input
            type="range" min={0} max={1000} value={Math.round(progress * 1000)} onChange={(e) => scrub(Number(e.target.value))}
            disabled={!ready}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[#2a2a2a] accent-[#FF2C03] [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#FF2C03]"
            aria-label="Avançar pelo circuito"
          />
        </div>

        {/* controle de velocidade + legenda de hidratação */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Velocidade</span>
            <div className="flex gap-0.5 rounded-full border border-[#2a2a2a] p-0.5">
              {SPEEDS.map((s, i) => (
                <button
                  key={s.label}
                  onClick={() => { speedRef.current = i; setSpeedIdx(i) }}
                  className={`rounded-full px-3 py-1 text-[11px] font-bold transition ${speedIdx === i ? 'bg-[#FF2C03] text-white' : 'text-white/55 hover:text-white'}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          {hydration.length > 0 && (
            <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-wider text-white/55 sm:ml-auto">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: AGUA }} /> Água</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: ELETRO }} /> Eletrólitos</span>
            </div>
          )}
        </div>

        {/* chips dos pontos de atenção */}
        {pois.length > 0 && (
          <div className="mt-3 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {pois.map((p, i) => (
              <button
                key={p.title}
                onClick={() => jumpToPoi(i)}
                className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-[11px] font-semibold transition ${activePoi === i ? `${TONE_RING[p.tone]} bg-white/5 ${TONE_TXT[p.tone]}` : 'border-[#2a2a2a] text-white/70 hover:border-white/30'}`}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: TONE_HEX[p.tone] }} />
                <MapPin className="h-3 w-3 opacity-60" /> {p.title}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
