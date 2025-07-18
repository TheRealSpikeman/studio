
/** @type {import('next').NextConfig} */
const nextConfig = {
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
  experimental: {
    // Deze optie is verplaatst en hoort hier niet meer.
    // We laten de experimental-key leeg of verwijderen deze.
  },
  // De correcte plek voor `allowedDevOrigins` in nieuwere Next.js versies.
  // We staan de specifieke cloud dev origin toe.
  allowedDevOrigins: ['https://6000-firebase-studio-1746800952268.cluster-oayqgyglpfgseqclbygurw4xd4.cloudworkstations.dev'],
};

module.exports = nextConfig;
