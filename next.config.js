
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Deze configuratie is toegevoegd om cross-origin requests
    // vanuit de ontwikkelomgeving toe te staan.
    allowedDevOrigins: [
      "https://*.cloudworkstations.dev",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.google.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
};

module.exports = nextConfig;
