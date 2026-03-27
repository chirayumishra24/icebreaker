/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'login.skillizee.io',
      },
    ],
  },
  transpilePackages: ['three'],
};

export default nextConfig;
