/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.printify.com" },
      { protocol: "https", hostname: "images-api.printify.com" },
      { protocol: "https", hostname: "*.cdn.printify.com" },
    ],
    // Serve images straight from Printify's CDN instead of routing them through
    // Vercel's optimizer. Printify mockups are already CDN-hosted and modestly
    // sized (~130KB), and this drops billable image transformations to ~zero —
    // which is what was breaking new product images with a 402 on the Hobby
    // plan. To re-enable optimization (e.g. after upgrading to Pro), remove
    // `unoptimized` and restore `minimumCacheTTL` / `deviceSizes` / `imageSizes`.
    unoptimized: true,
  },
};

module.exports = nextConfig;