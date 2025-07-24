module.exports = {
  typescript: { 
    ignoreBuildErrors: true 
  },
  output: 'export',
  distDir: '.next',
  trailingSlash: true,
  generateStaticParams: false,
  experimental: {
    appDir: true,
    esmExternals: false
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'next/document': 'commonjs next/document'
      });
    }
    return config;
  }
}
