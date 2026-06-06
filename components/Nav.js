"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { count, setOpen } = useCart();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? "rgba(10,10,11,0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled
            ? "1px solid rgba(200,169,110,0.1)"
            : "1px solid transparent",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div
              className="relative w-48 h-14 opacity-90 hover:opacity-100 transition-opacity"
              style={{ filter: "brightness(0.95)" }}
            >
              <Image src="/logo.png" alt="XUVIA" fill style={{ objectFit: "contain", objectPosition: "left" }} />
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-10">
            <Link href="/shop" className="nav-link">Shop</Link>
            <Link href="/#about" className="nav-link">About</Link>
            <Link href="/#contact" className="nav-link">Contact</Link>
          </div>

          {/* Right: cart + mobile toggle */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setOpen(true)}
              className="nav-link relative flex items-center gap-2"
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
              title="Cart"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {count > 0 && (
                <span
                  className="absolute -top-2 -right-2 w-4 h-4 flex items-center justify-center font-mono text-xs rounded-full"
                  style={{ background: "var(--ember)", color: "var(--obsidian)", fontSize: "0.55rem" }}
                >
                  {count}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex flex-col gap-1.5 p-1"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              <span
                className="block w-5 h-px transition-all duration-300"
                style={{
                  background: "var(--ember)",
                  transform: menuOpen ? "rotate(45deg) translate(3px,3px)" : "",
                }}
              />
              <span
                className="block w-5 h-px transition-all duration-300"
                style={{ background: "var(--ember)", opacity: menuOpen ? 0 : 1 }}
              />
              <span
                className="block w-5 h-px transition-all duration-300"
                style={{
                  background: "var(--ember)",
                  transform: menuOpen ? "rotate(-45deg) translate(3px,-3px)" : "",
                }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-10"
          style={{ background: "rgba(10,10,11,0.98)" }}
        >
          {[
            { label: "Shop", href: "/shop" },
            { label: "About", href: "/#about" },
            { label: "Contact", href: "/#contact" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="font-display text-3xl tracking-widest"
              style={{ color: "var(--bone)" }}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
