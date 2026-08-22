"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const PHOTOS = [
  { src: "/uploads/ig-02.jpg", alt: "Letras corpóreas iluminadas, Farmacia Igoillo" },
  { src: "/uploads/ig-05.jpg", alt: "Backlight, Suarez Negocios Inmobiliarios" },
  { src: "/uploads/ig-09.jpg", alt: "Cartel en chapa, Lama Pádel" },
];

const SPEEDS = [0.05, 0.09, 0.13];

/**
 * Montaje de flechas superpuestas con fotos reales de trabajos. Se revela en
 * cascada al entrar en pantalla (igual que Reveal.js) y, mientras se
 * scrollea, cada capa se desplaza a una velocidad ligeramente distinta —
 * la profundidad extra que Reveal.js no cubre, porque esa es una animación
 * de una sola vez y esta es continua.
 */
export default function ChevronShowcase() {
  const stageRef = useRef(null);
  const layerRefs = useRef([]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            stage.classList.add("is-visible");
            revealObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );
    revealObs.observe(stage);

    const sinMovimiento =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (sinMovimiento) return () => revealObs.disconnect();

    const scroller = document.querySelector(".snap-scroll") || window;
    const clamp01 = (n) => Math.max(0, Math.min(1, n));
    let ticking = false;

    const update = () => {
      const vh = window.innerHeight;
      const rect = stage.getBoundingClientRect();
      const progress = clamp01((vh - rect.top) / (vh + rect.height));
      layerRefs.current.forEach((el, i) => {
        if (!el) return;
        const offset = (progress - 0.5) * SPEEDS[i] * 220;
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      });
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
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      revealObs.disconnect();
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="chev-stage" ref={stageRef}>
      {PHOTOS.map((p, i) => (
        <div className="chev-depth" key={p.src} ref={(el) => (layerRefs.current[i] = el)}>
          <div className={`chev-shape chev-${i}`}>
            <Image src={p.src} alt={p.alt} fill sizes="(max-width: 900px) 160px, 280px" />
          </div>
        </div>
      ))}
    </div>
  );
}
