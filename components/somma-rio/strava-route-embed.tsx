'use client'

import { useState } from 'react'
import { Loader2, ExternalLink, AlertCircle } from 'lucide-react'

export interface StravaRouteEmbedProps {
  src: string
  title: string
  /** altura base (desktop) em px — o componente ajusta tablet/mobile via clamp responsivo */
  height?: number
  className?: string
  /** texto do link de fallback / botão externo */
  fallbackLabel?: string
}

/**
 * Embed interativo de rota do Strava, integrado à identidade Somma (preto/laranja).
 * Permite zoom, arraste, hover na altimetria e navegação pelo percurso.
 * Responsivo: alturas confortáveis em mobile/tablet/desktop, com loading e fallback.
 */
export function StravaRouteEmbed({
  src,
  title,
  height = 700,
  className = '',
  fallbackLabel = 'Abrir percurso no Strava',
}: StravaRouteEmbedProps) {
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)

  // alturas confortáveis e responsivas: mobile < tablet < desktop (até a altura informada)
  const desktop = Math.min(Math.max(height, 620), 760)
  const tablet = Math.round(Math.min(Math.max(height * 0.82, 520), 640))
  const mobile = Math.round(Math.min(Math.max(height * 0.66, 420), 540))

  const hostClass = `strava-embed-host-${desktop}-${tablet}-${mobile}`

  return (
    <div
      className={`${hostClass} relative w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0e0e0e] shadow-[0_18px_50px_-20px_rgba(0,0,0,0.8)] ${className}`}
    >
      {/* alturas responsivas por breakpoint (a var é definida e usada no mesmo elemento) */}
      <style>{`
        .${hostClass} { height: ${mobile}px; }
        @media (min-width: 640px) { .${hostClass} { height: ${tablet}px; } }
        @media (min-width: 1024px) { .${hostClass} { height: ${desktop}px; } }
      `}</style>

      {/* loading */}
      {!loaded && !errored && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#0e0e0e] text-[#A1A1A1]">
          <Loader2 className="h-7 w-7 animate-spin text-[#FF2C03]" aria-hidden />
          <p className="text-xs font-semibold uppercase tracking-[0.2em]">Carregando mapa…</p>
        </div>
      )}

      {/* fallback (erro ao carregar) */}
      {errored ? (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-[#0e0e0e] px-6 text-center">
          <AlertCircle className="h-8 w-8 text-[#FF2C03]" aria-hidden />
          <p className="max-w-xs text-sm text-[#A1A1A1]">Não foi possível carregar o mapa interativo aqui.</p>
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-md bg-[#FF2C03] px-6 py-3 text-sm font-bold tracking-wider text-white transition hover:bg-[#ff4d35]"
          >
            {fallbackLabel}
            <ExternalLink className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
          </a>
        </div>
      ) : (
        <iframe
          src={src}
          title={title}
          className="absolute inset-0 h-full w-full"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
        />
      )}

      {/* link externo sempre disponível (não cobre a interação do mapa) */}
      {!errored && (
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white/80 backdrop-blur-sm transition hover:border-[#FF2C03] hover:text-[#FF2C03]"
        >
          <ExternalLink className="h-3.5 w-3.5" aria-hidden /> Strava
        </a>
      )}
    </div>
  )
}
