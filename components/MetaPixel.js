"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackPageView } from "@/lib/meta-pixel.mjs";

export default function MetaPixel() {
  const pathname = usePathname();
  useEffect(() => {
    // The success page first captures and removes Stripe's redirect params.
    if (pathname !== "/checkout/success") trackPageView();
  }, [pathname]);
  return null;
}
