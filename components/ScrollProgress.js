"use client";

import { useEffect, useRef } from "react";

/**
 * Barra de progreso de scroll, fija arriba de todo.
 *
 * El contenedor que realmente scrollea es .snap-scroll, no window (ver la
 * misma nota en SiteHeader.js) — por eso se busca ese elemento en vez de
 * escuchar el scroll de window directamente.
 */
export default function ScrollProgress() {
  const ref = useRef(null);

  useEffect(() => {
    const scroller = document.querySelector(".snap-scroll") || window;
    const bar = ref.current;
    if (!bar) return;

    let ticking = false;
    const update = () => {
      const scrollTop = scroller === window ? window.scrollY : scroller.scrollTop;
      const scrollHeight = scroller === window ? document.documentElement.scrollHeight : scroller.scrollHeight;
      const clientHeight = scroller === window ? window.innerHeight : scroller.clientHeight;
      const max = scrollHeight - clientHeight;
      bar.style.width = max > 0 ? `${(scrollTop / max) * 100}%` : "0%";
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    update();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, []);

  return <div className="scroll-progress" ref={ref} aria-hidden="true" />;
}
