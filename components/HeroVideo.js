/**
 * Video de fondo del hero. Reemplaza a HeroPhoto (que queda sin usar, no borrado, como
 * opción de vuelta atrás — ver components/HeroPhoto.js).
 *
 * Origen del clip: recorte de un video del Instagram de Aires (@airespublicidadygrafica)
 * mostrando el cartel de Central Carnes Boutique. Se cortó el cierre de la Historia
 * (pantalla negra con el logo de Instagram) y se re-codificó sin audio a 576px de ancho
 * (resolución nativa del original, sin upscalear) con CRF 22 — pesaba 3,8 MB en 21,5s,
 * quedó en ~2,9 MB en 17s. Sin blur ni velo pesado (a pedido): se ve nítido, pero el cartel
 * que aparece en el clip tiene su propio texto legible que puede competir un poco con el
 * título en algún punto del loop — el text-shadow de .hero-title en globals.css ayuda, pero
 * no lo resuelve del todo.
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
