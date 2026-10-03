import type { NextConfig } from 'next'

/** Адрес бэкенда на NestJS. Браузер обращается к /api на том же домене, а Next.js пересылает запрос. */
const API_URL = process.env.API_URL ?? 'http://localhost:4000'

const nextConfig: NextConfig = {
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${API_URL}/api/:path*` }]
  },
}

export default nextConfig
