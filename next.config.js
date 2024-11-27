/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['dummyjson.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.dummyjson.com',
        pathname: '/products/**',
      },
      {
        protocol: 'https',
        hostname: 'i.dummyjson.com',
        pathname: '/data/products/**',
      },
    ],
  },
}

module.exports = nextConfig
