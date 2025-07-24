/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { 
    ignoreBuildErrors: true 
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Force App Router only, disable Pages Router
  experimental: {
    appDir: true
  }
}

module.exports = nextConfig
