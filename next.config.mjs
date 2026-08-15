/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'maps.googleapis.com',
        pathname: '/maps/api/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
    deviceSizes: [375, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
    ]
  },

  async redirects() {
    return [
      // www → non-www canonical domain
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.locksmith-dubai.com' }],
        destination: 'https://locksmith-dubai.com/:path*',
        permanent: true,
      },
      // /en → / (English is the default locale, no prefix needed)
      {
        source: '/en',
        destination: '/',
        permanent: true,
      },
      // /en/* → /* (strip /en prefix from all English URLs)
      {
        source: '/en/:path*',
        destination: '/:path*',
        permanent: true,
      },
      // Legacy singular URL patterns
      {
        source: '/service/:slug',
        destination: '/services/:slug',
        permanent: true,
      },
      {
        source: '/location/:slug',
        destination: '/locations/:slug',
        permanent: true,
      },
    ]
  },

  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? { exclude: ['error', 'warn'] }
        : false,
  },

  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  poweredByHeader: false,
  compress: true,

  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development',
    },
  },
}

export default nextConfig
