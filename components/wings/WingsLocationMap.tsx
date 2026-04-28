'use client'

import { useEffect, useRef, useState } from 'react'
import { importLibrary, setOptions } from '@googlemaps/js-api-loader'
import { AlertCircle } from 'lucide-react'

const CO_UNB = { lat: -15.7639, lng: -47.8694 }

// Dark map style — adaptado de palantir-for-family-trips/src/CommandMap.jsx,
// recolorido para o sistema Wings for Life (navy/red/yellow).
const WFL_MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#022755' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#022755' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#9aa6bd' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#0d3a78' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#03306a' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#063b6f' }] },
  { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#F6E331' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#0a3c75' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#022755' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#0f4a8a' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#E30D3F' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#0a3460' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#01193a' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#7fb3ff' }] },
]

declare global {
  interface Window {
    __wflMapsConfigured?: boolean
  }
}

type Props = {
  height?: string
}

export default function WingsLocationMap({ height = '420px' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAP_ID

    if (!apiKey) {
      setError('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY não configurada')
      setLoading(false)
      return
    }

    async function init() {
      try {
        if (!window.__wflMapsConfigured) {
          setOptions({
            key: apiKey!,
            version: 'weekly',
            mapIds: mapId ? [mapId] : undefined,
          })
          window.__wflMapsConfigured = true
        }

        await importLibrary('maps')
        await importLibrary('marker')

        if (cancelled || !containerRef.current) return

        const google = window.google

        const map = new google.maps.Map(containerRef.current, {
          center: CO_UNB,
          zoom: 15,
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: 'cooperative',
          backgroundColor: '#022755',
          mapId: mapId || undefined,
          styles: mapId ? undefined : WFL_MAP_STYLES,
        })

        // Marker custom — pino vermelho WFL com pulse
        const pinElement = document.createElement('div')
        pinElement.innerHTML = `
          <div style="position: relative; width: 56px; height: 56px;">
            <div style="
              position: absolute; inset: 0; border-radius: 9999px;
              background: #E30D3F; opacity: 0.25;
              animation: wflPulse 2s ease-out infinite;
            "></div>
            <div style="
              position: absolute; top: 50%; left: 50%;
              transform: translate(-50%, -50%);
              width: 28px; height: 28px; border-radius: 9999px;
              background: #E30D3F; border: 3px solid #F6E331;
              box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            "></div>
          </div>
          <style>
            @keyframes wflPulse {
              0%   { transform: scale(0.6); opacity: 0.6; }
              100% { transform: scale(1.6); opacity: 0; }
            }
          </style>
        `

        // Usa AdvancedMarkerElement se disponível (requer mapId), senão fallback
        const AdvancedMarker = (google.maps as unknown as {
          marker?: { AdvancedMarkerElement?: new (opts: object) => google.maps.marker.AdvancedMarkerElement }
        }).marker?.AdvancedMarkerElement

        if (mapId && AdvancedMarker) {
          new AdvancedMarker({
            map,
            position: CO_UNB,
            content: pinElement,
            title: 'Centro Olímpico — CO UnB',
          })
        } else {
          new google.maps.Marker({
            map,
            position: CO_UNB,
            title: 'Centro Olímpico — CO UnB',
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 12,
              fillColor: '#E30D3F',
              fillOpacity: 1,
              strokeColor: '#F6E331',
              strokeWeight: 3,
            },
          })
        }

        setLoading(false)
      } catch (e) {
        console.error('[wings/map]', e)
        if (!cancelled) {
          setError((e as Error).message || 'Erro ao carregar mapa')
          setLoading(false)
        }
      }
    }

    init()
    return () => {
      cancelled = true
    }
  }, [])

  if (error) {
    return (
      <div
        className="bg-wfl-navy/95 border border-wfl-border/30 flex items-center justify-center text-white/80 px-6 text-center"
        style={{ height }}
      >
        <div className="flex items-center gap-2 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="relative" style={{ height }}>
      <div ref={containerRef} className="absolute inset-0 bg-wfl-navy" />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-wfl-navy/80 text-white/70 text-sm tracking-wider uppercase">
          Carregando mapa…
        </div>
      )}
    </div>
  )
}
