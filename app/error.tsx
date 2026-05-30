'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Loga o erro para observabilidade sem poluir o título da página para crawlers.
    console.error('[somma] erro de runtime capturado pelo error boundary:', error)
  }, [error])

  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        padding: 24,
        textAlign: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0a0a0a' }}>
        SOMMA Running Club
      </h1>
      <p style={{ color: '#52525b', maxWidth: 420 }}>
        Tivemos um problema ao carregar esta parte da página. Tente novamente.
      </p>
      <button
        onClick={reset}
        style={{
          padding: '12px 24px',
          borderRadius: 999,
          background: '#ff2c03',
          color: '#fff',
          fontWeight: 700,
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Recarregar
      </button>
      <a href="/" style={{ color: '#ff2c03', fontWeight: 600 }}>
        Voltar para a home
      </a>
    </div>
  )
}
