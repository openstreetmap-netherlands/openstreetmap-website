/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  // images: { unoptimized: true }
  rewrites: async () => [
    {
      source: '/history',
      destination: '/',
    },
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.openstreetmap.org',
      },
      {
        protocol: 'https',
        hostname: '**.gravatar.com',
      },
      {
        protocol: 'https',
        hostname: 'weeklyosm.eu',
      },
      {
        protocol: 'https',
        hostname: '**.ibb.co',
      },
    ],
  },
}

module.exports = nextConfig
