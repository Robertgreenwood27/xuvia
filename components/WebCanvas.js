"use client";

import { useEffect, useRef } from "react";

// Cursor-reactive web threads for the hero. Strands anchor at the corners
// and drift gently; threads near the pointer pull toward it and brighten,
// like silk catching light. Falls back to a static render when the user
// prefers reduced motion.
export default function WebCanvas() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let w = 0;
    let h = 0;
    let t = 0;
    let threads = [];
    const pointer = { x: -9999, y: -9999 };

    function build() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      threads = [];
      const corners = [
        [0, 0],
        [w, 0],
        [0, h],
        [w, h],
      ];
      corners.forEach(([ax, ay], ci) => {
        const count = ci < 2 ? 8 : 4; // denser at the top, like the old SVG
        for (let i = 0; i < count; i++) {
          const tx = w * 0.5 + (Math.random() - 0.5) * w * 0.7;
          const ty = h * 0.45 + (Math.random() - 0.5) * h * 0.5;
          const reach = 0.3 + Math.random() * 0.45;
          threads.push({
            ax,
            ay,
            bx: ax + (tx - ax) * reach,
            by: ay + (ty - ay) * reach,
            phase: Math.random() * Math.PI * 2,
            speed: 0.25 + Math.random() * 0.5,
            sway: 6 + Math.random() * 10,
            dashed: Math.random() > 0.35,
            // spring state for the control point offset + glow
            ox: 0,
            oy: 0,
            vx: 0,
            vy: 0,
            glow: 0,
          });
        }
      });
    }

    function draw(animate) {
      ctx.clearRect(0, 0, w, h);

      for (const th of threads) {
        const mx = (th.ax + th.bx) / 2;
        const my = (th.ay + th.by) / 2;

        // perpendicular idle sway
        const dx = th.bx - th.ax;
        const dy = th.by - th.ay;
        const len = Math.hypot(dx, dy) || 1;
        const px = -dy / len;
        const py = dx / len;
        const sway = animate ? Math.sin(t * th.speed + th.phase) * th.sway : 0;

        let targetX = px * sway;
        let targetY = py * sway;
        let targetGlow = 0;

        if (animate) {
          const dist = Math.hypot(pointer.x - mx, pointer.y - my);
          const radius = 220;
          if (dist < radius) {
            const pull = (1 - dist / radius) * 0.5;
            targetX += (pointer.x - mx) * pull;
            targetY += (pointer.y - my) * pull;
            targetGlow = 1 - dist / radius;
          }
        }

        // spring toward target
        th.vx += (targetX - th.ox) * 0.06;
        th.vy += (targetY - th.oy) * 0.06;
        th.vx *= 0.88;
        th.vy *= 0.88;
        th.ox += th.vx;
        th.oy += th.vy;
        th.glow += (targetGlow - th.glow) * 0.08;

        ctx.beginPath();
        ctx.moveTo(th.ax, th.ay);
        ctx.quadraticCurveTo(mx + th.ox, my + th.oy, th.bx, th.by);
        ctx.strokeStyle = `rgba(200, 169, 110, ${0.06 + th.glow * 0.3})`;
        ctx.lineWidth = 0.6 + th.glow * 0.5;
        ctx.setLineDash(th.dashed ? [4, 8] : []);
        ctx.stroke();
      }
    }

    function loop() {
      t += 0.016;
      draw(true);
      raf = requestAnimationFrame(loop);
    }

    function onPointerMove(e) {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    }

    function onPointerLeave() {
      pointer.x = -9999;
      pointer.y = -9999;
    }

    function onResize() {
      build();
      if (reduced) draw(false);
    }

    build();

    if (reduced) {
      draw(false);
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", onResize);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
