import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'SOMMA Running Club | Maior Clube de Corrida Democrático de Brasília',
  description: 'Junte-se ao SOMMA Running Club - comunidade com 4.300+ membros, 100% democrático e gratuito. Encontros semanais, treinos, eventos e assessoria profissional em Brasília.',
  keywords: ['corrida', 'running club', 'Brasília', 'comunidade', 'esporte', 'maratona', 'atletas', 'fitness'],
  generator: 'v0.app',
  referrer: 'strict-origin-when-cross-origin',
  creator: 'SOMMA Running Club',
  metadataBase: new URL('https://sommaclub.com.br'),
  openGraph: {
    title: 'SOMMA Running Club | Maior Clube de Corrida do DF',
    description: 'Comunidade de 4.300+ corredores. Encontros gratuitos todo sábado às 7h no Parque da Cidade. 100% democrático.',
    url: 'https://sommaclub.com.br',
    siteName: 'SOMMA Running Club',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SOMMA Running Club',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SOMMA Running Club',
    description: 'Maior clube de corrida democrático de Brasília. 4.300+ membros, 100% gratuito.',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="theme-color" content="#fb4c00" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="canonical" href="https://sommaclub.com.br" />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
