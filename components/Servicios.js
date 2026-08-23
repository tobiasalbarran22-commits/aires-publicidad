"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import Reveal from "./Reveal";
import { SERVICIOS, GROUPS } from "../lib/servicios";

export default function Servicios({ photos }) {
  const [group, setGroup] = useState("all");
  const [openId, setOpenId] = useState(null);

  const photosByCategory = useMemo(() => {
    const map = {};
    for (const p of photos) {
      if (!map[p.category]) map[p.category] = [];
      map[p.category].push(p);
    }
    return map;
  }, [photos]);

  const filtered = SERVICIOS.filter((s) => group === "all" || s.group === group);
  const openServicio = openId ? SERVICIOS.find((s) => s.id === openId) : null;
  const openPhotos = openId
    ? [...(photosByCategory[openId] || [])].sort((a, b) => (b.isCover ? 1 : 0) - (a.isCover ? 1 : 0))
    : [];

  return (
    <section id="servicios" className="section" style={{ background: "var(--bg-sunken)" }}>
      <div className="container">
        <Reveal className="section-head">
          <h2 className="h-section">Soluciones que hacen destacar tu fachada.</h2>
          <p className="lede">
            Creatividad, rapidez, puntualidad y precios accesibles — en cada tipo de cartel que
            fabricamos.
          </p>
        </Reveal>

        <Reveal className="tab-row">
          <button
            type="button"
            className={`tab-btn ${group === "all" ? "is-active" : ""}`}
            onClick={() => setGroup("all")}
          >
            Todos
          </button>
          {GROUPS.map((g) => (
            <button
              key={g.id}
              type="button"
              className={`tab-btn ${group === g.id ? "is-active" : ""}`}
              onClick={() => setGroup(g.id)}
            >
              {g.label}
            </button>
          ))}
        </Reveal>

        <Reveal as="div" stagger className="card-grid">
          {filtered.map((s, i) => {
            const pics = photosByCategory[s.id] || [];
            const hasPics = pics.length > 0;
            const cover = pics.find((p) => p.isCover) || pics[0];
            return (
              <article
                key={s.id}
                className="svc-card"
                onClick={() => hasPics && setOpenId(s.id)}
                style={{ cursor: hasPics ? "pointer" : "default" }}
              >
                <span className="svc-index tabular">{String(i + 1).padStart(2, "0")}</span>
                {hasPics ? (
                  <div className="svc-thumb">
                    <Image
                      src={cover.url}
                      alt={s.label}
                      fill
                      sizes="(max-width: 620px) 100vw, (max-width: 980px) 50vw, 380px"
                    />
                    <span className="svc-thumb-overlay" aria-hidden="true">
                      {s.label}
                    </span>
                  </div>
                ) : null}
                <h3 className="h-card">{s.label}</h3>
                <p>{s.desc}</p>
                <span className="badge">
                  {hasPics ? `Ver galería · ${pics.length} foto${pics.length > 1 ? "s" : ""}` : "Galería próximamente"}
                </span>
              </article>
            );
          })}
        </Reveal>
      </div>

      {openServicio ? (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setOpenId(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10,10,8,0.72)",
            zIndex: 90,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--bg-elevated)",
              borderRadius: "var(--radius-lg)",
              maxWidth: 860,
              width: "100%",
              maxHeight: "84vh",
              overflowY: "auto",
              padding: 28,
              border: "1px solid var(--border)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
              <h3 className="h-card" style={{ fontSize: "1.5rem" }}>{openServicio.label}</h3>
              <button type="button" className="icon-btn" onClick={() => setOpenId(null)} aria-label="Cerrar">
                ✕
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
              {openPhotos.map((p) => (
                <div className="modal-thumb" key={p.id}>
                  <Image
                    src={p.url}
                    alt={p.alt || openServicio.label}
                    fill
                    sizes="(max-width: 620px) 50vw, 280px"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
