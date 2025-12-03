/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  // GitHub Pages base path - MUST match repository name exactly
  // Repository name: RealEstateDashboard
  // GitHub Pages URL: https://cdtalley.github.io/RealEstateDashboard/
  basePath: '/RealEstateDashboard',
  assetPrefix: '/RealEstateDashboard',
  trailingSlash: true,
}

module.exports = nextConfig

