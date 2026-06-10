// Image proxy for the OG specimen card.
//
// The edge runtime (where the card is rendered) sends a "Next.js Middleware"
// user agent in local dev, which Printify's CDN rejects with 403. This Node
// route fetches the mockup image with a normal UA and streams it back.
// Locked to Printify hosts so it can't be used as an open proxy.

const ALLOWED_HOST = /(^|\.)printify\.com$/;

export async function GET(request) {
  const u = new URL(request.url).searchParams.get("u");
  if (!u) return new Response("Missing url", { status: 400 });

  let target;
  try {
    target = new URL(u);
  } catch {
    return new Response("Bad url", { status: 400 });
  }
  if (target.protocol !== "https:" || !ALLOWED_HOST.test(target.hostname)) {
    return new Response("Forbidden", { status: 403 });
  }

  const res = await fetch(target, {
    headers: { "User-Agent": "XuviaWebsite/1.0", Accept: "image/*" },
    next: { revalidate: 3600 },
  });
  if (!res.ok) return new Response("Upstream error", { status: 502 });

  return new Response(res.body, {
    headers: {
      "Content-Type": res.headers.get("content-type") || "image/jpeg",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
