
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
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
  experimental: {
    allowedDevOrigins: ["https://6000-firebase-studio-1746800952268.cluster-oayqgyglpfgseqclbygurw4xd4.cloudworkstations.dev"],
  },
  webpack: (config) => {
    config.watchOptions = {
      poll: 300, // Check for changes every 300ms
      aggregateTimeout: 300, // delay before rebuilding
    };
    return config;
  },
};

export default nextConfig;
