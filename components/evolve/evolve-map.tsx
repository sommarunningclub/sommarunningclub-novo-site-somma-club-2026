'use client'

import { useEffect, useRef, useState } from 'react'
import { setOptions, importLibrary } from '@googlemaps/js-api-loader'

const DF_CENTER = { lat: -15.793, lng: -47.882 }

const DARK_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#1b1b1b' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0a0a0a' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8a8a8a' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2b2b2b' }] },
  { featureType: 'road', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e2630' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#3a3a3a' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#bdbdbd' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
]

/**
 * Mapa do Distrito Federal plotando as unidades da Evolve (busca real via Google Places).
 * A ideia é mostrar a capilaridade da Evolve e como o movimento Somma alcança todas as regiões.
 */
export function EvolveMap() {
  const el = useRef<HTMLDivElement>(null)
  const [count, setCount] = useState<number | null>(null)
  const [status, setStatus] = useState<'loading' | 'ok' | 'empty' | 'error'>('loading')

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey || !el.current) { setStatus('error'); return }
    let cancelled = false
    setOptions({ key: apiKey, v: 'weekly' })

    ;(async () => {
      try {
        const { Map } = await importLibrary('maps')
        if (cancelled || !el.current) return
        const map = new Map(el.current, {
          center: DF_CENTER,
          zoom: 10,
          disableDefaultUI: true,
          zoomControl: true,
          backgroundColor: '#0a0a0a',
          styles: DARK_STYLE,
          gestureHandling: 'cooperative',
          keyboardShortcuts: false,
          clickableIcons: false,
        })

        const icon: google.maps.Symbol = {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 7,
          fillColor: '#FF2C03',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        }

        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const placesLib: any = await importLibrary('places')
          const Place = placesLib.Place
          const { places } = await Place.searchByText({
            textQuery: 'Evolve academia',
            fields: ['displayName', 'location'],
            locationBias: { center: DF_CENTER, radius: 45000 },
            maxResultCount: 20,
            region: 'BR',
          })
          if (cancelled) return

          const bounds = new google.maps.LatLngBounds()
          let n = 0
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(places || []).forEach((p: any) => {
            const name: string = (p.displayName || '').toString()
            if (!p.location || !name.toLowerCase().includes('evolve')) return
            new google.maps.Marker({ map, position: p.location, title: name, icon })
            bounds.extend(p.location)
            n++
          })

          if (n > 0) {
            map.fitBounds(bounds, 56)
            setCount(n)
            setStatus('ok')
          } else {
            setStatus('empty')
          }
        } catch {
          // Places indisponível: mantém o mapa do DF sem marcadores.
          setStatus('empty')
        }
      } catch {
        if (!cancelled) setStatus('error')
      }
    })()

    return () => { cancelled = true }
  }, [])

  return (
    <div data-anim className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]">
      <div ref={el} className="aspect-[16/10] w-full sm:aspect-[16/9]" />
      {status !== 'error' && (
        <div className="pointer-events-none absolute left-3 top-3 rounded-xl border border-white/15 bg-black/70 px-3 py-2 backdrop-blur">
          <p className="font-[family-name:var(--font-display)] text-2xl leading-none tracking-tight text-[#FF2C03] sm:text-3xl">
            {count ?? '·'}
          </p>
          <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-white/60">unidades Evolve no DF</p>
        </div>
      )}
      {status === 'error' && (
        <div className="flex aspect-[16/10] w-full items-center justify-center px-6 text-center text-sm text-white/50 sm:aspect-[16/9]">
          Mapa indisponível. Verifique a chave do Google Maps.
        </div>
      )}
      {status === 'empty' && (
        <div className="pointer-events-none absolute inset-x-3 bottom-3 rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-[11px] text-white/55 backdrop-blur">
          Para listar as unidades automaticamente, ative a Places API (New) na chave. O mapa mostra o Distrito Federal.
        </div>
      )}
    </div>
  )
}
