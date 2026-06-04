'use client'

import { QRCodeSVG } from 'qrcode.react'

interface HeroQRProps {
  /** URL que o QR aponta (a própria página, para abrir no celular) */
  url: string
  /** classes de posicionamento (ex.: absolute bottom-10 right-6) */
  className?: string
  label?: string
}

/**
 * Cartão de QR code exibido SOMENTE no desktop (hidden lg:flex).
 * O apresentador projeta; a plateia escaneia e abre a mesma página no celular
 * para acompanhar a apresentação ao vivo.
 */
export function HeroQR({ url, className = '', label = 'Aponte a câmera do celular' }: HeroQRProps) {
  return (
    <div className={`hidden flex-col items-center gap-2 rounded-2xl bg-white p-3.5 shadow-2xl ring-1 ring-black/10 lg:flex ${className}`}>
      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#FF2C03]">Acompanhe ao vivo</span>
      <QRCodeSVG value={url} size={132} level="M" bgColor="#ffffff" fgColor="#0a0a0a" />
      <p className="max-w-[140px] text-center text-[10px] font-semibold leading-tight text-neutral-500">{label}</p>
    </div>
  )
}
