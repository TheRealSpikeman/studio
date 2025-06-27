/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      }
    ],
  },
  webpack: (config) => {
    // Tell webpack to ignore watching the 'tools' directory
    // This prevents the dev server from restarting in a loop when we generate tool components
    config.watchOptions.ignored = [
        ...(config.watchOptions.ignored || []),
        path.resolve(__dirname, 'src/components/tools'),
    ];
    return config;
  },
};

module.exports = nextConfig;
