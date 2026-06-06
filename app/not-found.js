import Link from "next/link";
import Nav from "@/components/Nav";

export default function NotFound() {
  return (
    <div style={{ background: "var(--obsidian)", minHeight: "100vh" }}>
      <Nav />
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <p className="font-mono text-xs mb-6" style={{ color: "var(--ember)", letterSpacing: "0.35em" }}>
          404
        </p>
        <h1 className="font-display text-6xl md:text-8xl mb-6" style={{ color: "var(--silk)", letterSpacing: "0.1em" }}>
          Lost
        </h1>
        <p className="text-sm mb-12" style={{ color: "var(--muted)" }}>
          Whatever you were looking for has gone into the web.
        </p>
        <Link href="/" className="btn-primary">
          Return Home
        </Link>
      </div>
    </div>
  );
}
