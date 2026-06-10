// Helpers for dynamically generated Open Graph share cards.

// Loads a Google Font as ArrayBuffer for next/og ImageResponse.
// Requests only the glyphs in `text` to keep the payload tiny.
export async function loadGoogleFont(family, text) {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    family
  )}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(
    /src: url\((.+?)\) format\('(opentype|truetype)'\)/
  );
  if (!resource) throw new Error(`Failed to resolve font: ${family}`);
  const res = await fetch(resource[1]);
  if (!res.ok) throw new Error(`Failed to fetch font: ${family}`);
  return res.arrayBuffer();
}

// Absolute origin for same-site fetches from the edge OG routes (edge can't
// use fs or relative URLs). Honors NEXT_PUBLIC_BASE_URL or NEXT_PUBLIC_SITE_URL;
// otherwise localhost in dev and the production domain in deployed builds.
export function ogOrigin() {
  if (process.env.NODE_ENV === "development") {
    return `http://localhost:${process.env.PORT || 3000}`;
  }
  const configured =
    process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (configured && !configured.includes("localhost")) return configured;
  return "https://xuvia.co";
}

// Shared palette so the cards match the site exactly.
export const og = {
  obsidian: "#0a0a0b",
  void: "#111114",
  ash: "#1a1a1f",
  ember: "#c8a96e",
  emberDim: "#a08850",
  bone: "#d4cfc8",
  silk: "#e8e4dd",
  muted: "#7a7a86",
  border: "rgba(200, 169, 110, 0.25)",
};
