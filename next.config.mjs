/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [],
    formats: ['image/webp', 'image/avif'],
  },
  turbopack: {},
}

export default nextConfig
