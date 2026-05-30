import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

const SITE_URL = 'https://sommaclub.com.br'
const SITE_NAME = 'SOMMA Running Club'
const TITLE = 'SOMMA Club: o maior running club do Distrito Federal'
const DESCRIPTION =
  'O Somma Club é o maior running club do Distrito Federal, com mais de 5 mil membros cadastrados. Comunidade gratuita, democrática e aberta a iniciantes em Brasília. Corrida, wellness e amizade todo sábado às 7h no Parque da Cidade.'

export const metadata: Metadata = {
  title: {
    default: TITLE,
    template: '%s | SOMMA Running Club',
  },
  description: DESCRIPTION,
  keywords: [
    'somma club',
    'somma running club',
    'maior running club do DF',
    'maior running club do Distrito Federal',
    'running club Brasília',
    'grupo de corrida Brasília',
    'grupo de corrida gratuito Brasília',
    'corrida gratuita Brasília',
    'corrida em Brasília',
    'onde correr em Brasília',
    'comunidade de corrida Brasília',
    'clube de corrida Brasília',
    'corrida para iniciantes Brasília',
    'lugar para conhecer pessoas em Brasília',
    'lugar para fazer amigos em Brasília',
    'experiência social em Brasília',
    'wellness Brasília',
    'lazer ao ar livre Brasília',
    'evento gratuito Brasília',
    'Parque da Cidade Brasília',
  ],
  generator: 'Next.js',
  referrer: 'strict-origin-when-cross-origin',
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: { email: false, address: false, telephone: false },
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
    languages: { 'pt-BR': SITE_URL },
  },
  openGraph: {
    title: TITLE,
    description:
      'Mais de 5 mil membros cadastrados. Maior running club do Distrito Federal. Gratuito, democrático e aberto a iniciantes. Encontros todo sábado às 7h no Parque da Cidade.',
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      { url: '/og-image.jpg', width: 1200, height: 630, alt: 'SOMMA Running Club, comunidade de corrida em Brasília', type: 'image/jpeg' },
      { url: '/og-image-square.jpg', width: 800, height: 800, alt: 'SOMMA Running Club', type: 'image/jpeg' },
    ],
    type: 'website',
    locale: 'pt_BR',
    countryName: 'Brazil',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SOMMA Running Club: o maior running club do DF',
    description: 'Comunidade de 5 mil membros. Gratuita, democrática e aberta a iniciantes. Sábado, 7h, Parque da Cidade.',
    images: ['/og-image.jpg'],
    creator: '@sommaclub',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    apple: '/apple-icon.png',
    shortcut: '/favicon.ico',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SOMMA Running Club',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  category: 'sports',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#ff2c03',
}

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'SportsOrganization', 'LocalBusiness'],
  '@id': `${SITE_URL}#organization`,
  name: SITE_NAME,
  alternateName: ['Somma Club', 'Somma Running Club', 'SOMMA Club'],
  url: SITE_URL,
  logo: `${SITE_URL}/Logo_Nova_Somma_Branca_Laranja.svg`,
  image: `${SITE_URL}/og-image.jpg`,
  description:
    'Somma Club, o maior running club do Distrito Federal, com mais de 5 mil membros cadastrados. Comunidade gratuita, democrática e aberta a iniciantes para correr, fazer amigos e viver Brasília de forma mais ativa.',
  slogan: 'Se é pra correr, que seja com vibe boa.',
  foundingLocation: { '@type': 'Place', name: 'Brasília, Distrito Federal, Brasil' },
  areaServed: [
    { '@type': 'City', name: 'Brasília' },
    { '@type': 'AdministrativeArea', name: 'Distrito Federal' },
  ],
  sport: ['Running', 'Corrida de rua'],
  memberOf: { '@type': 'Organization', name: 'Comunidade de corrida do Distrito Federal' },
  numberOfEmployees: { '@type': 'QuantitativeValue', value: 5000, unitText: 'membros cadastrados' },
  knowsAbout: ['corrida de rua', 'running', 'wellness', 'comunidade esportiva', 'eventos em Brasília'],
  telephone: '+55-61-99537-2477',
  sameAs: [
    'https://www.instagram.com/somma.club/',
    'https://www.strava.com/clubs/sommaclub',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+55-61-99537-2477',
    contactType: 'Customer Service',
    areaServed: 'BR',
    availableLanguage: ['Portuguese'],
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Parque da Cidade Sarah Kubitschek, Estacionamento 10',
    addressLocality: 'Brasília',
    addressRegion: 'DF',
    postalCode: '70297-400',
    addressCountry: 'BR',
  },
  geo: { '@type': 'GeoCoordinates', latitude: -15.7942, longitude: -47.9036 },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '07:00',
      closes: '09:00',
    },
  ],
  priceRange: 'Gratuito',
  isAccessibleForFree: true,
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}#website`,
  url: SITE_URL,
  name: SITE_NAME,
  inLanguage: 'pt-BR',
  publisher: { '@id': `${SITE_URL}#organization` },
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
}

const sportsActivityLocationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SportsActivityLocation',
  '@id': `${SITE_URL}#sportslocation`,
  name: 'Encontros do Somma Club no Parque da Cidade',
  url: SITE_URL,
  image: `${SITE_URL}/og-image.jpg`,
  telephone: '+55-61-99537-2477',
  priceRange: 'Gratuito',
  parentOrganization: { '@id': `${SITE_URL}#organization` },
  sport: 'Running',
  isAccessibleForFree: true,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Parque da Cidade Sarah Kubitschek, Estacionamento 10',
    addressLocality: 'Brasília',
    addressRegion: 'DF',
    postalCode: '70297-400',
    addressCountry: 'BR',
  },
  geo: { '@type': 'GeoCoordinates', latitude: -15.7942, longitude: -47.9036 },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'O que é o Somma Club?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'O Somma Club é um running club gratuito de Brasília, considerado o maior do Distrito Federal, com mais de 5 mil membros cadastrados. Reúne pessoas interessadas em corrida, wellness, amizade, networking e experiências sociais saudáveis na capital.',
      },
    },
    {
      '@type': 'Question',
      name: 'O Somma Club é gratuito?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sim. O Somma Club é 100% gratuito. Todos os encontros, treinos coletivos e eventos da comunidade são abertos a qualquer pessoa, sem nenhum custo de participação.',
      },
    },
    {
      '@type': 'Question',
      name: 'O Somma Club é o maior running club do Distrito Federal?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sim. Com mais de 5 mil membros cadastrados, o Somma Club é o maior running club do Distrito Federal e a maior comunidade de corrida de Brasília.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quantos membros o Somma Club tem?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'O Somma Club já ultrapassa 5 mil membros cadastrados em Brasília e no Distrito Federal.',
      },
    },
    {
      '@type': 'Question',
      name: 'Preciso ser corredor experiente para participar?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Não. O Somma Club é democrático e aberto a todos os níveis. Iniciantes são muito bem vindos e formam boa parte da comunidade.',
      },
    },
    {
      '@type': 'Question',
      name: 'Onde acontecem os encontros do Somma Club?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Os encontros oficiais do Somma Club acontecem todo sábado às 7h no Parque da Cidade Sarah Kubitschek, Estacionamento 10, em Brasília, Distrito Federal.',
      },
    },
    {
      '@type': 'Question',
      name: 'Como faço para participar do Somma Club?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Basta acessar sommaclub.com.br, preencher o cadastro gratuito e aparecer no próximo encontro de sábado, às 7h, no Parque da Cidade.',
      },
    },
    {
      '@type': 'Question',
      name: 'O Somma é apenas um grupo de corrida?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Não. Além dos treinos, o Somma Club é uma comunidade de wellness, lifestyle, eventos sociais, networking e experiências urbanas em Brasília. A corrida é o ponto de partida para conexões reais.',
      },
    },
    {
      '@type': 'Question',
      name: 'O Somma Club é um bom lugar para conhecer pessoas em Brasília?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sim. O Somma é uma das principais comunidades de Brasília para fazer amigos, ampliar o círculo social e participar de experiências saudáveis na cidade.',
      },
    },
    {
      '@type': 'Question',
      name: 'O Somma Club é uma opção de lazer ao ar livre em Brasília?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sim. Os encontros acontecem no Parque da Cidade, ao ar livre, e são uma ótima opção de lazer gratuito em Brasília, com corrida, convivência e wellness.',
      },
    },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Check-in', item: `${SITE_URL}/check-in` },
  ],
}

const schemas = [orgSchema, websiteSchema, sportsActivityLocationSchema, faqSchema, breadcrumbSchema]

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="theme-color" content="#ff2c03" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="SOMMA Club" />
        <meta name="application-name" content="SOMMA Running Club" />
        <meta name="geo.region" content="BR-DF" />
        <meta name="geo.placename" content="Brasília" />
        <meta name="geo.position" content="-15.7942;-47.9036" />
        <meta name="ICBM" content="-15.7942, -47.9036" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.shopify.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        {schemas.map((s, i) => (
          <script
            key={`ld-${i}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
          />
        ))}
      </head>
      <body className="font-sans antialiased">
        <Script
          id="gtm-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-W98N7DC4');`,
          }}
        />
        <div
          dangerouslySetInnerHTML={{
            __html: `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-W98N7DC4" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`,
          }}
        />
        {children}
        <Analytics />
        <Script src="/popup-sdk.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
