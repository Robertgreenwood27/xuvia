import { Cinzel, Raleway, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import CartDrawer from "@/components/CartDrawer";
import { Analytics } from "@vercel/analytics/next";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "600", "700", "900"],
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://xuvia.co";

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "XUVIA",
    template: "%s — XUVIA",
  },
  icons: { icon: "/logo.png" },
  description:
    "Keeper-made apparel and goods inspired by exotic pets, real species, fine details, and the strange beauty of the animals themselves.",
  openGraph: {
    title: "XUVIA",
    description:
      "Keeper-made apparel and goods inspired by exotic pets, real species, fine details, and the strange beauty of the animals themselves.",
    type: "website",
    url: baseUrl,
    siteName: "XUVIA",
    images: [{ url: `${baseUrl}/OGimage.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "XUVIA",
    description:
      "Keeper-made apparel and goods inspired by exotic pets, real species, fine details, and the strange beauty of the animals themselves.",
  },
};

const orgJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "XUVIA",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description:
      "Keeper-made apparel and goods inspired by exotic pets, real species, detailed patterns, posture, color, and the animals that started the obsession.",
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "XUVIA",
    url: baseUrl,
  },
];

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${raleway.variable} ${mono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}
