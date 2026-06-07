import { Cinzel, Raleway, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import CartDrawer from "@/components/CartDrawer";

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

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://xuvia.com";

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "XUVIA — Wearable Arachnology",
    template: "%s — XUVIA",
  },
  description:
    "Limited run apparel for those who understand what lives in the dark. Full sublimation. No compromises.",
  openGraph: {
    title: "XUVIA — Wearable Arachnology",
    description:
      "Limited run apparel for those who understand what lives in the dark. Full sublimation. No compromises.",
    type: "website",
    url: baseUrl,
    siteName: "XUVIA",
  },
  twitter: {
    card: "summary_large_image",
    title: "XUVIA — Wearable Arachnology",
    description:
      "Limited run apparel for those who understand what lives in the dark. Full sublimation. No compromises.",
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "XUVIA",
  url: baseUrl,
  description: "Limited run sublimation apparel for arachnid enthusiasts.",
};

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
      </body>
    </html>
  );
}
