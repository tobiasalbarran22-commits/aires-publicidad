"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Contador que cuenta de 0 hasta `to`.
 *
 * Arranca cuando entra en pantalla, no al montar: si el bloque está abajo de
 * todo, animarlo al cargar significa que el visitante nunca ve la animación.
 *
 * Respeta prefers-reduced-motion saltando directo al valor final. La regla
 * global del CSS no alcanza acá: esto es una animación por JS, no una
 * transition ni un @keyframes.
 */
export default function CountUp({ to, prefix = "", suffix = "", duration = 1600 }) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const sinMovimiento =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (sinMovimiento) {
      setValue(to);
      return;
    }

    let raf;
    const animar = () => {
      let start = null;
      const step = (ts) => {
        if (start === null) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * to));
        if (progress < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            obs.unobserve(entry.target);
            animar();
          }
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);

    return () => {
      obs.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [to, duration]);

  return (
    <span ref={ref} className="tabular">
      {prefix}
      {value}
      {suffix}
    </span>
  );
}
