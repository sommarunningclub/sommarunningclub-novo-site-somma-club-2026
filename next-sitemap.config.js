// next-sitemap.config.js
/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: 'https://sommaclub.com.br',
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/private/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
    ],
  },
  changefreq: 'weekly',
  priority: 0.7,
  exclude: ['/404', '/500', '/api/*', '/obrigado'],
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: path === '/' ? 'weekly' : 'monthly',
      priority: path === '/' ? 1.0 : path === '/check-in' ? 0.9 : 0.7,
      lastmod: new Date().toISOString(),
    }
  },
}

module.exports = config
