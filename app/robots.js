export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://xuvia.co";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Keep crawlers out of the image optimizer (each fetch can bill a
      // transformation), the API, and the checkout flow. Content pages
      // still get crawled for SEO.
      disallow: ["/_next/image", "/api/", "/checkout"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
