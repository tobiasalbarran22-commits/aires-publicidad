"use client";

import { useEffect, useRef } from "react";

/**
 * Traslada su contenido en Y a una fracción de la velocidad del scroll
 * (efecto cámara/profundidad). El padre debe tener overflow:hidden y darle
 * un poco de "sangrado" (inset negativo) para que el movimiento no deje huecos.
 */
export default function Parallax({ children, strength = 0.06, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const scroller = el.closest(".snap-scroll") || window;
    let ticking = false;

    const update = () => {
      ticking = false;
      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight || document.documentElement.clientHeight;
      const centerOffset = rect.top + rect.height / 2 - viewportH / 2;
      const ratio = Math.max(-1, Math.min(1, centerOffset / viewportH));
      el.style.transform = `translateY(${(ratio * rect.height * strength).toFixed(2)}px)`;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [strength]);

  return (
    <div ref={ref} className={`parallax-media ${className}`.trim()}>
      {children}
    </div>
  );
}
