import { ImageResponse } from "next/og";
import { products as localProducts } from "@/lib/products";
import { getProduct as fetchPrintifyProduct, normalizeProduct } from "@/lib/printify";
import { loadGoogleFont, og } from "@/lib/og";

// Edge runtime: the Node build of @vercel/og crashes on Windows (broken
// bundled-font path). Product photos are fetched via /api/og-image because
// the edge sandbox's user agent is rejected by Printify's CDN.
export const runtime = "edge";

export const alt = "XUVIA specimen card";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function fetchProduct(id) {
  const local = localProducts.find((p) => p.id === id || p.printifyProductId === id);
  if (process.env.PRINTIFY_API_KEY && process.env.PRINTIFY_SHOP_ID) {
    try {
      const raw = await fetchPrintifyProduct(local?.printifyProductId || id);
      return normalizeProduct(raw, local || {});
    } catch {
      // fall through to local
    }
  }
  return local || null;
}

async function fetchImage(url) {
  try {
    const res = await fetch(url, { headers: { Accept: "image/*" } });
    if (!res.ok) return null;
    return {
      bytes: new Uint8Array(await res.arrayBuffer()),
      type: res.headers.get("content-type") || "image/jpeg",
    };
  } catch {
    return null;
  }
}

// Inline the product photo as a data URI — satori's own remote fetch is
// unreliable, and this guarantees the card never ships with an empty frame.
// Tries Printify directly first, then falls back to our same-site proxy.
async function loadProductImage(url) {
  if (!url?.startsWith("http")) return null;

  let img = await fetchImage(url);
  if (!img) {
    const origin =
      process.env.NEXT_PUBLIC_BASE_URL ||
      `http://localhost:${process.env.PORT || 3000}`;
    img = await fetchImage(`${origin}/api/og-image?u=${encodeURIComponent(url)}`);
  }
  if (!img) {
    console.error("OG image: product photo unavailable", url);
    return null;
  }

  let binary = "";
  const chunk = 8192;
  for (let i = 0; i < img.bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, img.bytes.subarray(i, i + chunk));
  }
  return `data:${img.type};base64,${btoa(binary)}`;
}

export default async function Image({ params }) {
  const product = await fetchProduct(params.id);
  const productImage = await loadProductImage(product?.image);

  const species = product?.species || "";
  const commonName = product?.commonName || product?.subtitle || "";
  const title = commonName || product?.name || "XUVIA";
  const abbr = product?.abbr || "";
  const group = product?.group || "";
  const typeLabel = (product?.productType || product?.type || "")
    .replace(/-/g, " ")
    .toUpperCase();
  const price =
    typeof product?.price === "number" ? `$${product.price.toFixed(2)}` : "";

  const allText = `XUVIA${title}${species}${abbr}${group}${typeLabel}${price}SPECIMENFOR KEEPERS·`;

  let fonts = [];
  try {
    const [cinzel, raleway] = await Promise.all([
      loadGoogleFont("Cinzel:wght@700", allText),
      loadGoogleFont("Raleway:ital@1", allText),
    ]);
    fonts = [
      { name: "Cinzel", data: cinzel, weight: 700, style: "normal" },
      { name: "Raleway", data: raleway, weight: 400, style: "italic" },
    ];
  } catch {
    // Render with default fonts if Google Fonts is unreachable
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: og.obsidian,
          padding: 24,
        }}
      >
        {/* Outer frame */}
        <div
          style={{
            display: "flex",
            flex: 1,
            border: `1px solid ${og.border}`,
            background: og.void,
          }}
        >
          {/* Product image */}
          <div
            style={{
              display: "flex",
              width: 582,
              height: "100%",
              background: og.ash,
              borderRight: `1px solid ${og.border}`,
              overflow: "hidden",
            }}
          >
            {productImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={productImage}
                alt=""
                width={582}
                height={582}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  color: og.border,
                  fontSize: 64,
                  fontFamily: "Cinzel",
                  letterSpacing: 18,
                }}
              >
                XUVIA
              </div>
            )}
          </div>

          {/* Specimen label */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              padding: "44px 48px",
              justifyContent: "space-between",
            }}
          >
            {/* Top row: brand + badge */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "Cinzel",
                  fontSize: 28,
                  color: og.ember,
                  letterSpacing: 10,
                }}
              >
                XUVIA
              </div>
              {abbr && (
                <div
                  style={{
                    display: "flex",
                    border: `1px solid ${og.border}`,
                    color: og.ember,
                    fontSize: 18,
                    letterSpacing: 6,
                    padding: "8px 16px",
                  }}
                >
                  {abbr}
                </div>
              )}
            </div>

            {/* Middle: names */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  fontSize: 16,
                  color: og.muted,
                  letterSpacing: 6,
                  marginBottom: 18,
                }}
              >
                {`SPECIMEN${group ? ` · ${group.toUpperCase()}` : ""}`}
              </div>
              <div
                style={{
                  fontFamily: "Cinzel",
                  fontSize: title.length > 18 ? 44 : 56,
                  color: og.silk,
                  letterSpacing: 4,
                  lineHeight: 1.1,
                  textTransform: "uppercase",
                }}
              >
                {title}
              </div>
              {species && (
                <div
                  style={{
                    fontFamily: "Raleway",
                    fontStyle: "italic",
                    fontSize: 26,
                    color: og.emberDim,
                    marginTop: 14,
                  }}
                >
                  {species}
                </div>
              )}
              {/* Ember divider */}
              <div
                style={{
                  display: "flex",
                  height: 1,
                  width: 320,
                  marginTop: 28,
                  background: `linear-gradient(90deg, ${og.emberDim}, rgba(160,136,80,0))`,
                }}
              />
            </div>

            {/* Bottom row: type + price + tagline */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <div style={{ fontSize: 18, color: og.bone, letterSpacing: 5 }}>
                  {typeLabel}
                </div>
                {price && (
                  <div
                    style={{
                      fontFamily: "Cinzel",
                      fontSize: 30,
                      color: og.ember,
                      letterSpacing: 2,
                    }}
                  >
                    {price}
                  </div>
                )}
              </div>
              <div style={{ fontSize: 14, color: og.muted, letterSpacing: 8 }}>
                FOR KEEPERS · MADE TO ORDER
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, ...(fonts.length > 0 ? { fonts } : {}) }
  );
}
