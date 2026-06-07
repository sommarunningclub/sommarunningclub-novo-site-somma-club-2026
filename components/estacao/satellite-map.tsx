'use client'

import { useEffect, useRef, useState } from 'react'
import { setOptions, importLibrary } from '@googlemaps/js-api-loader'

interface SatelliteMapProps {
  lat: number
  lng: number
  zoom?: number
  label?: string
}

/** Mapa de satélite do Google Maps centrado na localização da Estação Somma. */
export function SatelliteMap({ lat, lng, zoom = 18, label = 'Estação Somma' }: SatelliteMapProps) {
  const el = useRef<HTMLDivElement>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey || !el.current) { setError(true); return }
    let cancelled = false
    setOptions({ key: apiKey, v: 'weekly' })

    importLibrary('maps')
      .then(({ Map }) => {
        if (cancelled || !el.current) return
        const center = { lat, lng }
        const map = new Map(el.current, {
          center,
          zoom,
          mapTypeId: 'hybrid',
          tilt: 0,
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: 'cooperative',
          keyboardShortcuts: false,
          clickableIcons: false,
          backgroundColor: '#0a0a0a',
        })
        new google.maps.Marker({
          map,
          position: center,
          title: label,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 9,
            fillColor: '#FF2C03',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
        })
      })
      .catch(() => { if (!cancelled) setError(true) })

    return () => { cancelled = true }
  }, [lat, lng, zoom, label])

  if (error) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-center text-sm text-white/50">
        Mapa indisponível — verifique a chave do Google Maps.
      </div>
    )
  }

  return <div ref={el} className="aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a]" />
}
