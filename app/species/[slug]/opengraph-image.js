import { ImageResponse } from "next/og";
import { speciesList, getSpeciesBySlug } from "@/lib/species";
import { loadGoogleFont, og, ogOrigin } from "@/lib/og";

// Edge runtime: the Node build of @vercel/og crashes on Windows (broken
// bundled-font path). See the product opengraph-image for details.
export const runtime = "edge";

export const alt = "XUVIA Field Guide specimen card";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Satori can't decode webp, so only these are tried for the card.
const PHOTO_EXTENSIONS = ["jpg", "jpeg", "png"];

// Edge has no fs — probe the public folder over HTTP and inline the photo
// as a data URI so the card never ships with a broken frame.
async function loadSpeciesPhoto(slug) {
  const origin = ogOrigin();
  for (const ext of PHOTO_EXTENSIONS) {
    try {
      // no-store: Next's fetch cache persists across builds and would keep
      // serving an old photo after the file changes
      const res = await fetch(`${origin}/species/${slug}.${ext}`, {
        cache: "no-store",
      });
      const type = res.headers.get("content-type") || "";
      if (!res.ok || !type.startsWith("image/")) continue;
      const bytes = new Uint8Array(await res.arrayBuffer());
      let binary = "";
      const chunk = 8192;
      for (let i = 0; i < bytes.length; i += chunk) {
        binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
      }
      return `data:${type};base64,${btoa(binary)}`;
    } catch {
      // try next extension
    }
  }
  return null;
}

export default async function Image({ params }) {
  const s = getSpeciesBySlug(params.slug);
  const photo = s ? await loadSpeciesPhoto(s.slug) : null;

  const commonName = s?.commonName || "Field Guide";
  const species = s?.species || "";
  const abbr = s?.abbr || "";
  const group = s?.group || "";
  const range = s?.range || "";
  const index = s ? speciesList.findIndex((x) => x.slug === s.slug) : -1;
  const specimenNo = index >= 0 ? String(index + 1).padStart(3, "0") : "";

  const allText = `XUVIA${commonName}${species}${abbr}${group}${range}FIELD GUIDE · SPECIMEN ${specimenNo}FOR KEEPERS·`;

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
        <div
          style={{
            display: "flex",
            flex: 1,
            border: `1px solid ${og.border}`,
            background: og.void,
          }}
        >
          {/* Specimen photo */}
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
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photo}
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

          {/* Field guide label */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              padding: "44px 48px",
              justifyContent: "space-between",
            }}
          >
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

            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  fontSize: 16,
                  color: og.muted,
                  letterSpacing: 6,
                  marginBottom: 18,
                }}
              >
                {`FIELD GUIDE${specimenNo ? ` · SPECIMEN ${specimenNo}` : ""}`}
              </div>
              <div
                style={{
                  fontFamily: "Cinzel",
                  fontSize: commonName.length > 18 ? 44 : 56,
                  color: og.silk,
                  letterSpacing: 4,
                  lineHeight: 1.1,
                  textTransform: "uppercase",
                }}
              >
                {commonName}
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

            <div style={{ display: "flex", flexDirection: "column" }}>
              {range && (
                <div
                  style={{
                    fontSize: 18,
                    color: og.bone,
                    letterSpacing: 2,
                    marginBottom: 16,
                  }}
                >
                  {range}
                </div>
              )}
              <div style={{ fontSize: 14, color: og.muted, letterSpacing: 8 }}>
                {`FOR KEEPERS${group ? ` · ${group.toUpperCase()}` : ""}`}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, ...(fonts.length > 0 ? { fonts } : {}) }
  );
}
