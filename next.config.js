/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        // Printful CDN for product mockup images
        protocol: "https",
        hostname: "files.cdn.printful.com",
      },
      {
        // Printful storage
        protocol: "https",
        hostname: "*.printful.com",
      },
    ],
  },
};

module.exports = nextConfig;
