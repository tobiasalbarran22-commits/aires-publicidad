"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Reveal from "./Reveal";

export default function TrabajosCarousel({ photos }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = photos?.length || 0;

  useEffect(() => {
    if (paused || total <= 1) return;
    if (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const id = setInterval(() => setIndex((i) => (i + 1) % total), 4500);
    return () => clearInterval(id);
  }, [paused, total]);

  if (total === 0) return null;

  const go = (i) => setIndex(((i % total) + total) % total);

  return (
    <section id="trabajos" className="section trabajos">
      <div className="container">
        <Reveal className="section-head" variant="top">
          <h2 className="h-section">Trabajos destacados.</h2>
          <p className="lede">Una selección de carteles que ya diseñamos, fabricamos e instalamos.</p>
        </Reveal>

        <Reveal
          className="carousel"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="carousel-frame">
            {photos.map((p, i) => (
              <div className={`carousel-slide ${i === index ? "is-active" : ""}`} key={p.id}>
                <Image
                  src={p.url}
                  alt={p.alt}
                  fill
                  sizes="(max-width: 900px) 100vw, 820px"
                  priority={i === 0}
                />
              </div>
            ))}
            <div className="carousel-counter tabular">
              {index + 1} / {total}
            </div>
          </div>

          <div className="carousel-controls">
            <button
              type="button"
              className="carousel-arrow"
              onClick={() => go(index - 1)}
              aria-label="Foto anterior"
            >
              ‹
            </button>
            <div className="carousel-dots">
              {photos.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  className={`carousel-dot ${i === index ? "is-active" : ""}`}
                  onClick={() => go(i)}
                  aria-label={`Ver foto ${i + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              className="carousel-arrow"
              onClick={() => go(index + 1)}
              aria-label="Foto siguiente"
            >
              ›
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
