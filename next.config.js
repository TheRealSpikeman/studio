/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { 
    ignoreBuildErrors: true 
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  // Remove 'output: export' for server-side rendering
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
