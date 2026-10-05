import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { CONTACT_EMAIL, PRODUCTION_DAYS, CLAIM_WINDOW_DAYS } from "@/lib/site";

export const metadata = {
  title: "Shipping, Returns & FAQ",
  description:
    "How XUVIA orders are made, shipped, and made right if something goes wrong — plus answers to common questions.",
};

const FAQ = [
  {
    q: "How much is shipping?",
    a: "Shipping depends on where you are and what you order. At checkout you'll see the exact cost as soon as you enter your address — before you enter any payment details.",
  },
  {
    q: "Where do you ship?",
    a: "United States, Canada, the United Kingdom, Australia, Germany, France, the Netherlands, Sweden, Norway, and Denmark. If you're somewhere else, email me and I'll see what's possible.",
  },
  {
    q: "How do sizes fit?",
    a: "Shirts are standard unisex sizing. If you're between sizes, size up for a relaxed fit. Not sure? Email me before you order and I'll help.",
  },
  {
    q: "Can I change or cancel my order?",
    a: "Orders go to print quickly, so email me as soon as possible. If it hasn't been printed yet, I can change or cancel it.",
  },
  {
    q: "Is checkout secure?",
    a: "Yes. Payments are handled by Stripe, one of the largest payment processors in the world. Your card number goes straight to Stripe and is never stored on this site.",
  },
  {
    q: "Will the colors match what I see on screen?",
    a: "Very closely, but every screen is a little different and printed colors can vary slightly from the mockups.",
  },
];

function Section({ id, label, title, children }) {
  return (
    <section id={id} className="scroll-mt-32">
      <p className="font-mono text-xs mb-3" style={{ color: "var(--ember)", letterSpacing: "0.3em" }}>
        {label}
      </p>
      <h2 className="font-display text-xl md:text-2xl mb-6" style={{ color: "var(--silk)", letterSpacing: "0.1em" }}>
        {title}
      </h2>
      <div className="space-y-4 text-sm" style={{ color: "var(--bone)", lineHeight: "1.85" }}>
        {children}
      </div>
    </section>
  );
}

export default function ShippingReturnsPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <div className="noise" style={{ background: "var(--obsidian)", minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Nav />
      <main className="max-w-3xl mx-auto px-6 pt-40 pb-24">
        <p className="font-mono text-xs mb-4" style={{ color: "var(--ember)", letterSpacing: "0.35em" }}>
          XUVIA / HELP
        </p>
        <h1
          className="font-display mb-14"
          style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "var(--silk)", letterSpacing: "0.1em", lineHeight: 1.1 }}
        >
          Shipping, Returns &amp; FAQ
        </h1>

        <div className="space-y-16">
          <Section id="shipping" label="SHIPPING" title="How your order gets to you">
            <p>
              Every piece is made to order. Once you check out, your order is
              printed by my production partner and shipped directly to you.
              Printing plus delivery usually takes {PRODUCTION_DAYS} within the
              US; international orders can take longer.
            </p>
            <p>
              You&apos;ll get a confirmation email from Stripe when you pay, and a
              shipping confirmation once your order leaves the print facility.
            </p>
            <p>
              Shipping cost is calculated from your address and shown at
              checkout before you enter any payment details.
            </p>
          </Section>

          <Section id="returns" label="RETURNS" title="If something isn't right">
            <p>
              <strong style={{ color: "var(--silk)", fontWeight: 500 }}>
                Damaged, defective, misprinted, or wrong item:
              </strong>{" "}
              email{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="underline" style={{ color: "var(--ember)" }}>
                {CONTACT_EMAIL}
              </a>{" "}
              within {CLAIM_WINDOW_DAYS} days of delivery with your order email
              and a photo of the problem. I&apos;ll send a free replacement or a
              full refund — your choice. You don&apos;t need to send the item back.
            </p>
            <p>
              <strong style={{ color: "var(--silk)", fontWeight: 500 }}>
                Lost package:
              </strong>{" "}
              if your tracking hasn&apos;t moved or your order hasn&apos;t arrived,
              email me and I&apos;ll chase it down and reship if it&apos;s lost.
            </p>
            <p>
              <strong style={{ color: "var(--silk)", fontWeight: 500 }}>
                Wrong size or changed your mind:
              </strong>{" "}
              because each piece is printed just for you, I can&apos;t accept
              returns for size or preference. Email me anyway — I review these
              case by case and will do what I can.
            </p>
          </Section>

          <Section id="faq" label="FAQ" title="Common questions">
            <dl className="space-y-8">
              {FAQ.map(({ q, a }) => (
                <div key={q}>
                  <dt className="font-display text-xs mb-2" style={{ color: "var(--ember)", letterSpacing: "0.15em" }}>
                    {q}
                  </dt>
                  <dd>{a}</dd>
                </div>
              ))}
            </dl>
          </Section>

          <Section id="contact" label="CONTACT" title="Still have a question?">
            <p>I&apos;m one person, and I read and answer every email myself.</p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a href={`mailto:${CONTACT_EMAIL}`} className="btn-primary justify-center">
                {CONTACT_EMAIL}
              </a>
              <Link href="/shop" className="btn-ghost justify-center">
                Back to the Shop
              </Link>
            </div>
          </Section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
