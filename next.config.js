/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  // If deploying to a subdirectory, uncomment and set your repo name:
  // basePath: '/real-estate-dashboard',
  // assetPrefix: '/real-estate-dashboard',
}

module.exports = nextConfig

