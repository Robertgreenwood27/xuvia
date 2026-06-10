export const metadata = {
  title: "Shop",
  description:
    "Shop the full XUVIA collection. Limited run, all-over sublimation apparel for arachnid enthusiasts. Every piece made to order.",
  openGraph: {
    title: "Shop the Collection — XUVIA",
    description:
      "Limited run sublimation apparel for those who understand what lives in the dark. Every piece made to order.",
    type: "website",
    images: [{ url: "/OGimage.png", width: 1200, height: 630 }],
  },
};

export default function ShopLayout({ children }) {
  return children;
}
