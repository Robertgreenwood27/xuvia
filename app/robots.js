export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://xuvia.co";
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
