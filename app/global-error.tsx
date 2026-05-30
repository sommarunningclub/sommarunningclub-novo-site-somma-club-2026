'use client'

import { useEffect } from 'react'

// Substitui a página padrão "Application error" do Next.
// Garante um <title> e conteúdo sensatos mesmo se o root layout quebrar,
// evitando que crawlers indexem "Application error: a client-side exception...".
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[somma] erro global capturado:', error)
  }, [error])

  return (
    <html lang="pt-BR">
      <head>
        <title>SOMMA Running Club | Maior running club do Distrito Federal</title>
        <meta name="robots" content="noindex" />
      </head>
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          padding: 24,
          textAlign: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          background: '#fff',
        }}
      >
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0a0a0a' }}>
          SOMMA Running Club
        </h1>
        <p style={{ color: '#52525b', maxWidth: 420 }}>
          Estamos com uma instabilidade momentânea. Tente recarregar a página.
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
      </body>
    </html>
  )
}
