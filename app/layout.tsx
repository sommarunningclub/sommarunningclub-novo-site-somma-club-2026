import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'SOMMA Running Club | Maior Clube de Corrida Democrático de Brasília',
  description: 'Junte-se ao SOMMA Running Club - comunidade com 4.300+ membros, 100% democrático e gratuito. Encontros semanais aos sábados, treinos, eventos e assessoria profissional em Brasília, DF.',
  keywords: ['corrida', 'running club', 'Brasília', 'comunidade', 'esporte', 'maratona', 'atletas', 'fitness', 'clube de corrida', 'corridas DF', 'parque da cidade'],
  generator: 'Next.js',
  referrer: 'strict-origin-when-cross-origin',
  creator: 'SOMMA Running Club',
  publisher: 'SOMMA Running Club',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://sommaclub.com.br'),
  alternates: {
    canonical: 'https://sommaclub.com.br',
    languages: {
      'pt-BR': 'https://sommaclub.com.br',
    },
  },
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
        alt: 'SOMMA Running Club - Comunidade de corredores',
        type: 'image/jpeg',
      },
      {
        url: '/og-image-square.jpg',
        width: 800,
        height: 800,
        alt: 'SOMMA Running Club',
        type: 'image/jpeg',
      },
    ],
    type: 'website',
    locale: 'pt_BR',
    countryName: 'Brazil',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SOMMA Running Club',
    description: 'Maior clube de corrida democrático de Brasília. 4.300+ membros, 100% gratuito.',
    images: ['/og-image.jpg'],
    creator: '@sommaclub',
  },
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
      {
        url: '/favicon.ico',
        sizes: '32x32',
      },
    ],
    apple: '/apple-icon.png',
    shortcut: '/favicon.ico',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SOMMA Running Club',
  },
  verification: {
    google: 'YOUR_GOOGLE_VERIFICATION_CODE', // Substitua com seu código
    other: {
      'msvalidate.01': 'YOUR_BING_VERIFICATION_CODE', // Substitua com seu código
    },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#ff2c03',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="theme-color" content="#ff2c03" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="SOMMA Club" />
        <meta name="application-name" content="SOMMA Running Club" />
        <meta name="msapplication-TileColor" content="#fb4c00" />
        <meta name="msapplication-TileImage" content="/mstile-144x144.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Preload and prefetch */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://sommaclub.com.br" />
        
        {/* JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'SOMMA Running Club',
              url: 'https://sommaclub.com.br',
              logo: 'https://sommaclub.com.br/logo.png',
              description: 'O maior clube de corrida democrático de Brasília com 4.300+ membros',
              sameAs: [
                'https://www.instagram.com/sommaclub',
                'https://www.facebook.com/sommaclub',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+55-61-99537-2477',
                contactType: 'Customer Service',
              },
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Parque da Cidade, Estacionamento 10',
                addressLocality: 'Brasília',
                addressRegion: 'DF',
                addressCountry: 'BR',
              },
            }),
          }}
        />
        
        {/* Breadcrumb Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Home',
                  item: 'https://sommaclub.com.br',
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'Check-in',
                  item: 'https://sommaclub.com.br/check-in',
                },
              ],
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
