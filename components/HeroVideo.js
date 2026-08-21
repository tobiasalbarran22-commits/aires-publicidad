/**
 * Video de fondo para el hero. PREPARADO PERO NO CONECTADO.
 *
 * Todavía no está decidido si el cliente tiene material, así que este componente
 * no se importa en ningún lado. Para activarlo:
 *
 *   1. Dejar el video en public/video/hero.mp4 y un poster en public/video/hero-poster.jpg
 *   2. En components/Hero.js, dentro de <section className="hero">, reemplazar
 *      <div className="hero-grid" /> por <HeroVideo />
 *   3. Agregar en globals.css:
 *        .hero-video { position:absolute; inset:0; width:100%; height:100%;
 *                      object-fit:cover; z-index:0; }
 *        .hero-inner { position:relative; z-index:2; }   // ya lo tiene
 *      y un velo para que el texto negro siga legible sobre el video:
 *        .hero-video-veil { position:absolute; inset:0; z-index:1;
 *                           background:rgba(255,255,255,0.72); }
 *
 * Requisitos del archivo (no negociables para no arruinar el LCP):
 *   - Comprimido a 2-3 MB COMO MÁXIMO. De referencia, el hero de Techint pesa
 *     6,9 MB y se nota.
 *   - Poster sí o sí: es la imagen que se pinta al instante mientras el video
 *     carga. Es el error que comete Techint, que no tiene poster y muestra negro.
 *   - El servidor tiene que soportar HTTP Range requests para que el video se
 *     transmita por pedazos y no bloquee la carga inicial. Vercel los soporta
 *     para archivos estáticos de public/, así que no hay que configurar nada.
 *   - preload="metadata": baja solo la cabecera, no el archivo entero.
 *
 * Accesibilidad: si el visitante pidió menos movimiento, no se reproduce nada;
 * queda el poster fijo, que es exactamente lo que corresponde.
 */
"use client";

import { useEffect, useRef } from "react";

export default function HeroVideo({
  src = "/video/hero.mp4",
  poster = "/video/hero-poster.jpg",
}) {
  const ref = useRef(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const sinMovimiento =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (sinMovimiento) {
      v.removeAttribute("autoplay");
      v.pause();
    }
  }, []);

  return (
    <>
      <video
        ref={ref}
        className="hero-video"
        poster={poster}
        preload="metadata"
        muted
        autoPlay
        loop
        playsInline
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src={src} type="video/mp4" />
      </video>
      <div className="hero-video-veil" aria-hidden="true" />
    </>
  );
}
