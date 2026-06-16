/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.printify.com" },
      { protocol: "https", hostname: "images-api.printify.com" },
      { protocol: "https", hostname: "*.cdn.printify.com" },
    ],
    // Cache each optimized image for 31 days instead of the Next 14 default of
    // 60s, so repeat visits and crawlers reuse a transformation instead of
    // regenerating (and re-billing) it.
    minimumCacheTTL: 2678400,
    // Trim the width tables to what the layouts actually request. Defaults are
    // 8 deviceSizes + 8 imageSizes = up to 16 variants per source image; this
    // cuts it to 7, roughly halving transformations per image.
    deviceSizes: [640, 828, 1080, 1920],
    imageSizes: [64, 128, 256],
  },
};

module.exports = nextConfig;