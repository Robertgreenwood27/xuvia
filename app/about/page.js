import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BrandStory from "@/components/BrandStory";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata = {
  title: "About",
  description:
    "XUVIA is a one-keeper brand: tarantula apparel, phone cases, and art prints drawn from real species by a keeper of twenty years.",
};

export default function AboutPage() {
  return (
    <div className="noise" style={{ background: "var(--obsidian)", minHeight: "100vh" }}>
      <Nav />
      <main className="max-w-3xl mx-auto px-6 pt-40 pb-24">
        <p className="font-mono text-xs mb-8" style={{ color: "var(--ember)", letterSpacing: "0.35em" }}>
          XUVIA / ABOUT
        </p>

        <BrandStory />

        <hr className="divider-ember my-14" />

        <h2 className="font-display text-xl md:text-2xl mb-6" style={{ color: "var(--silk)", letterSpacing: "0.1em" }}>
          How it&apos;s made
        </h2>
        <div className="space-y-5 text-sm" style={{ color: "var(--bone)", lineHeight: "1.85" }}>
          <p>
            I design every piece myself. Printing and shipping are handled by a
            print-on-demand production partner, so nothing is mass-produced or
            sitting in a warehouse — your order is printed after you place it.
            That keeps the catalog focused on species I actually care about
            instead of whatever sells in bulk.
          </p>
          <p>
            If something arrives damaged, misprinted, or wrong, I&apos;ll make it
            right. The details are on the{" "}
            <Link href="/shipping-returns" className="underline" style={{ color: "var(--ember)" }}>
              shipping &amp; returns page
            </Link>
            .
          </p>
        </div>

        <hr className="divider-ember my-14" />

        <h2 className="font-display text-xl md:text-2xl mb-6" style={{ color: "var(--silk)", letterSpacing: "0.1em" }}>
          Get in touch
        </h2>
        <p className="text-sm mb-8" style={{ color: "var(--bone)", lineHeight: "1.85" }}>
          Questions about an order, a species you&apos;d like to see, or just want
          to talk Ts? I read every email.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a href={`mailto:${CONTACT_EMAIL}`} className="btn-primary justify-center">
            {CONTACT_EMAIL}
          </a>
          <Link href="/shop" className="btn-ghost justify-center">
            Shop the Collection
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
