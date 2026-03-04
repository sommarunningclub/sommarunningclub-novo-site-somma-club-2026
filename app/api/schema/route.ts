import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://sommaclub.com.br',
    name: 'SOMMA Running Club',
    url: 'https://sommaclub.com.br',
    description: 'O maior clube de corrida democrático de Brasília com 4.300+ membros',
    image: 'https://sommaclub.com.br/og-image.jpg',
    sameAs: [
      'https://www.instagram.com/sommaclub',
      'https://www.facebook.com/sommaclub',
      'https://www.youtube.com/@sommaclub',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+55-61-99537-2477',
      contactType: 'Customer Service',
      areaServed: 'BR',
      availableLanguage: ['pt-BR'],
    },
    location: {
      '@type': 'Place',
      name: 'Parque da Cidade',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Brasília',
        addressRegion: 'DF',
        postalCode: '70000-000',
        addressCountry: 'BR',
      },
    },
    event: {
      '@type': 'Event',
      name: 'SOMMA Club - Corrida Comunitária',
      description: 'Corrida semanal com muita animação, café da manhã e comunidade',
      startDate: '2026-03-07T07:00:00-03:00',
      endDate: '2026-03-07T09:30:00-03:00',
      eventStatus: 'EventScheduled',
      eventAttendanceMode: 'OfflineEventAttendanceMode',
      location: {
        '@type': 'Place',
        name: 'Parque da Cidade, Estacionamento 10',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Brasília',
          addressRegion: 'DF',
          addressCountry: 'BR',
        },
      },
    },
  }

  return NextResponse.json(schema, {
    headers: {
      'Content-Type': 'application/ld+json',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
