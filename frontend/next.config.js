/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: process.env !== 'production',
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL
  },
  images: {
    remotePatterns: [
      {
        protocol: process.env.NODE_ENV === 'production' ? 'https' : 'http',
        hostname: process.env.NEXT_PUBLIC_CDN_HOST ?? 'example.com',
        port: process.env.NODE_ENV === 'production' ? undefined : '9000'
      }
    ]
  }
}

module.exports = nextConfig
