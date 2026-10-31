/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.img',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/drxxvp2ef/image/upload/**',
      },
    ],
    formats: ['image/webp'],
  },
};

module.exports = nextConfig;
