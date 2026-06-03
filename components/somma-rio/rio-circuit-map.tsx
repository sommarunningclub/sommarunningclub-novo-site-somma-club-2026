'use client'

import { useEffect, useRef, useState } from 'react'
import { setOptions, importLibrary } from '@googlemaps/js-api-loader'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { LatLng } from '@/app/somma-rio-2026/route-data'

const SOMMA = '#FF2C03'

// Estilo dark "palantir" — detalhes em laranja Somma
const DARK_MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#0a0a0a' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0a0a0a' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#7a7a7a' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#2a2a2a' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#121212' }] },
  { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#0f130e' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1b1b1b' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#211711' }] },
  { featureType: 'road', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#2e1a12' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#181818' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#050505' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#4a2c24' }] },
]

interface RioCircuitMapProps {
  points: LatLng[]
  label: string
  distanceLabel: string
  className?: string
  /** liga o efeito GSAP: ao rolar, inclina (3D) e dá zoom no circuito */
  scroll3d?: boolean
}

export function RioCircuitMap({ points, label, distanceLabel, className = '', scroll3d = false }: RioCircuitMapProps) {
  const ref = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const tiltRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState(false)
  const [ready, setReady] = useState(false)
  const inViewRef = useRef(true)
  const mapRef = useRef<google.maps.Map | null>(null)
  const camRef = useRef<{ center: google.maps.LatLngLiteral; baseZoom: number } | null>(null)

  // ── inicializa mapa + animação do traçado ──
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey || !ref.current || points.length < 2) {
      setError(true)
      return
    }

    let raf = 0
    let cancelled = false
    setOptions({ key: apiKey, v: 'weekly' })

    const io = new IntersectionObserver(
      (entries) => { inViewRef.current = entries[0]?.isIntersecting ?? true },
      { threshold: 0.05 }
    )
    if (wrapRef.current) io.observe(wrapRef.current)

    Promise.all([importLibrary('maps'), importLibrary('geometry')])
      .then(([{ Map, Polyline }]) => {
        if (cancelled || !ref.current) return

        const path = points.map(([lat, lng]) => ({ lat, lng }))

        const map = new Map(ref.current, {
          mapTypeId: 'roadmap',
          styles: DARK_MAP_STYLES,
          disableDefaultUI: true,
          gestureHandling: 'none',
          keyboardShortcuts: false,
          draggable: false,
          clickableIcons: false,
          backgroundColor: '#0a0a0a',
          tilt: 0,
          isFractionalZoomEnabled: true,
        })
        mapRef.current = map

        const bounds = new google.maps.LatLngBounds()
        path.forEach((p) => bounds.extend(p))
        map.fitBounds(bounds, { top: 56, right: 48, bottom: 56, left: 48 })

        // guarda centro + zoom base para o scroll-zoom 3D
        google.maps.event.addListenerOnce(map, 'idle', () => {
          const c = bounds.getCenter()
          camRef.current = { center: { lat: c.lat(), lng: c.lng() }, baseZoom: map.getZoom() ?? 13 }
        })

        const sph = google.maps.geometry.spherical
        const cumulative: number[] = [0]
        let total = 0
        for (let i = 1; i < path.length; i++) {
          total += sph.computeDistanceBetween(path[i - 1], path[i])
          cumulative.push(total)
        }

        new Polyline({ map, path, strokeColor: SOMMA, strokeOpacity: 0.16, strokeWeight: 2 })
        const active = new Polyline({ map, path: [], strokeColor: SOMMA, strokeOpacity: 0.95, strokeWeight: 4 })
        const glow = new Polyline({ map, path: [], strokeColor: SOMMA, strokeOpacity: 0.25, strokeWeight: 10 })

        const dot = (p: google.maps.LatLngLiteral, color: string) =>
          new google.maps.Marker({
            map, position: p,
            icon: { path: google.maps.SymbolPath.CIRCLE, scale: 5, fillColor: color, fillOpacity: 1, strokeColor: '#0a0a0a', strokeWeight: 2 },
            zIndex: 5,
          })
        dot(path[0], '#ffffff')
        dot(path[path.length - 1], SOMMA)

        const head = new google.maps.Marker({
          map, position: path[0], zIndex: 10,
          icon: { path: google.maps.SymbolPath.CIRCLE, scale: 6, fillColor: '#fff', fillOpacity: 1, strokeColor: SOMMA, strokeWeight: 3 },
        })

        setReady(true)

        const DRAW = 9000
        const HOLD = 1400
        const CYCLE = DRAW + HOLD
        const ease = (t: number) => 1 - Math.pow(1 - t, 2)
        let startTs: number | null = null

        const interpAt = (target: number) => {
          for (let i = 1; i < path.length; i++) {
            if (cumulative[i] >= target) {
              const segStart = cumulative[i - 1]
              const segLen = cumulative[i] - segStart || 1
              const r = (target - segStart) / segLen
              const pt = sph.interpolate(path[i - 1], path[i], Math.min(Math.max(r, 0), 1))
              return { idx: i, point: { lat: pt.lat(), lng: pt.lng() } }
            }
          }
          return { idx: path.length - 1, point: path[path.length - 1] }
        }

        const loop = (ts: number) => {
          if (cancelled) return
          if (!inViewRef.current) { raf = requestAnimationFrame(loop); return }
          if (startTs === null) startTs = ts
          const phase = (ts - startTs) % CYCLE
          const t = Math.min(phase / DRAW, 1)
          const dist = ease(t) * total
          const { idx, point } = interpAt(dist)
          const drawn = path.slice(0, idx).concat([point])
          active.setPath(drawn)
          glow.setPath(drawn)
          head.setPosition(point)
          raf = requestAnimationFrame(loop)
        }
        raf = requestAnimationFrame(loop)
      })
      .catch(() => setError(true))

    return () => {
      cancelled = true
      if (raf) cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [points])

  // ── efeito 3D dirigido por scroll (GSAP ScrollTrigger) ──
  useEffect(() => {
    if (!scroll3d || !wrapRef.current || !tiltRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    gsap.registerPlugin(ScrollTrigger)
    const tilt = tiltRef.current

    // estado inicial (deitado + levemente afastado)
    const applyTilt = (p: number) => {
      const rot = (1 - p) * 20 // 20° → 0°
      const sc = 1 + (1 - p) * 0.14 // cobre a folga da inclinação
      tilt.style.transform = `rotateX(${rot}deg) scale(${sc})`
      tilt.style.opacity = String(0.55 + p * 0.45)
      const cam = camRef.current
      if (cam && mapRef.current) {
        const z = cam.baseZoom - 1.1 + p * 2.2 // aberto → fechado (zoom no circuito)
        mapRef.current.moveCamera({ center: cam.center, zoom: z })
      }
    }
    applyTilt(0)

    const st = ScrollTrigger.create({
      trigger: wrapRef.current,
      start: 'top 82%',
      end: 'top 26%',
      scrub: true,
      onUpdate: (self) => applyTilt(self.progress),
    })

    return () => st.kill()
  }, [scroll3d])

  if (error) {
    return (
      <div className={`flex min-h-[18rem] w-full items-center justify-center rounded-2xl border border-white/10 bg-[#0a0a0a] text-center ${className}`}>
        <div className="px-6">
          <p className="font-[family-name:var(--font-display)] text-2xl uppercase text-white">{label}</p>
          <p className="mt-2 text-sm text-[#A1A1A1]">{distanceLabel}</p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={wrapRef}
      style={scroll3d ? { perspective: '1200px' } : undefined}
      className={`relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black ${className}`}
    >
      {/* plano do mapa (recebe a inclinação 3D) */}
      <div ref={tiltRef} className="absolute inset-0 origin-center [transform-style:preserve-3d] will-change-transform">
        <div ref={ref} className="absolute inset-0 h-full w-full" aria-label={`Circuito animado ${label}`} />
      </div>

      {/* HUD palantir (sempre plano, emoldura o card) */}
      <div className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`} aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_55%,rgba(0,0,0,0.5)_100%)]" />
        {['left-4 top-4 border-l-2 border-t-2', 'right-4 top-4 border-r-2 border-t-2', 'left-4 bottom-4 border-l-2 border-b-2', 'right-4 bottom-4 border-r-2 border-b-2'].map((pos) => (
          <span key={pos} className={`absolute h-6 w-6 border-[#FF2C03]/70 ${pos}`} />
        ))}
        <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FF2C03] to-transparent [animation:rio-scan_4.2s_linear_infinite]" />
        <div className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#FF2C03] sm:text-xs">
          <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-[#FF2C03] align-middle" />
          Traçando circuito…
        </div>
        <div className="absolute bottom-4 left-4 right-4 font-mono text-[10px] uppercase tracking-widest text-white/80 sm:text-xs">
          <p className="text-[#FF2C03]">● {label}</p>
          <p className="mt-1 text-white/60">{distanceLabel} · MARATONA DO RIO 2026</p>
        </div>
      </div>

      <style>{`@keyframes rio-scan { 0% { top: 0 } 100% { top: 100% } }`}</style>
    </div>
  )
}
