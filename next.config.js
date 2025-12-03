/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  // GitHub Pages base path (matches repository name)
  basePath: '/RealEstateDashboard',
  assetPrefix: '/RealEstateDashboard',
}

module.exports = nextConfig

