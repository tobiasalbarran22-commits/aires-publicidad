/**
 * Video de fondo para la sección Empresa. Mismo criterio que HeroVideo.js
 * (ver ese archivo para el detalle de por qué cada requisito):
 *   - poster obligatorio, para no mostrar negro mientras carga.
 *   - preload="metadata": solo la cabecera, no el archivo entero.
 *   - si el visitante pidió menos movimiento, no se reproduce; queda el poster.
 *
 * Origen del clip: recorte de un video del Instagram de Aires
 * (@airespublicidadygrafica) mostrando el cartel de Central Carnes Boutique.
 * Se cortó el cierre de la historia (pantalla negra con el logo de Instagram)
 * y se re-codificó sin audio a 480px de ancho — pesaba 3,8 MB en 21,5s
 * originalmente, quedó en ~0,85 MB en 17s.
 */
"use client";

import { useEffect, useRef } from "react";

export default function EmpresaVideo({
  src = "/video/empresa.mp4",
  poster = "/video/empresa-poster.jpg",
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
        className="empresa-video"
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
      <div className="empresa-video-veil" aria-hidden="true" />
    </>
  );
}
