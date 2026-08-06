import type { MetadataRoute } from 'next'

const BASE = 'https://sommaclub.com.br'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  const routes: Array<{ path: string; priority: number; changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' }> = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/check-in', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/evolve', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/seja-parceiro', priority: 0.7, changeFrequency: 'monthly' },
  ]

  return routes.map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))
}
