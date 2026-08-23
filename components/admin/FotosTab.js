"use client";

import { useState } from "react";
import { SERVICIOS } from "../../lib/servicios";

export default function FotosTab({ initialPhotos }) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [category, setCategory] = useState(SERVICIOS[0].id);
  const [alt, setAlt] = useState("");
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) {
      setError("Elegí una imagen primero");
      return;
    }
    setBusy(true);
    setError("");
    setOk("");
    const form = new FormData();
    form.append("file", file);
    form.append("category", category);
    form.append("alt", alt);

    const res = await fetch("/api/photos", { method: "POST", body: form });
    const data = await res.json().catch(() => ({}));
    setBusy(false);

    if (!res.ok) {
      setError(data.error || "No se pudo subir la foto");
      return;
    }
    setPhotos((p) => [data, ...p]);
    setAlt("");
    setFile(null);
    e.target.reset();
    setOk("Foto agregada");
  }

  async function handleDelete(id) {
    if (!confirm("¿Eliminar esta foto?")) return;
    const res = await fetch(`/api/photos/${id}`, { method: "DELETE" });
    if (res.ok) setPhotos((p) => p.filter((x) => x.id !== id));
  }

  async function handleSetCover(photo) {
    const res = await fetch(`/api/photos/${photo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cover: true }),
    });
    if (!res.ok) return;
    setPhotos((list) =>
      list.map((x) => {
        if (x.id === photo.id) return { ...x, isCover: true };
        if (x.category === photo.category) return { ...x, isCover: false };
        return x;
      })
    );
  }

  const labelFor = (id) => SERVICIOS.find((s) => s.id === id)?.label || id;

  // Portada efectiva por categoría: la marcada explícitamente, o si
  // todavía no se eligió ninguna, la primera de esa categoría — el mismo
  // criterio que usa la sección Servicios del sitio.
  const coverIdByCategory = {};
  for (const p of photos) {
    if (coverIdByCategory[p.category] === undefined) coverIdByCategory[p.category] = p.id;
    if (p.isCover) coverIdByCategory[p.category] = p.id;
  }

  return (
    <>
      <div className="admin-card">
        <h2>Subir foto de trabajo</h2>
        <p className="hint">La foto se muestra en la galería del tipo de cartel que elijas.</p>

        {error ? <div className="alert alert-error">{error}</div> : null}
        {ok ? <div className="alert alert-ok">{ok}</div> : null}

        <form onSubmit={handleUpload}>
          <div className="field-row">
            <div className="field">
              <label htmlFor="cat">Tipo de cartel</label>
              <select id="cat" value={category} onChange={(e) => setCategory(e.target.value)}>
                {SERVICIOS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="alt">Descripción (opcional)</label>
              <input id="alt" type="text" value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Ej: Fachada local Palermo" />
            </div>
          </div>
          <div className="field">
            <label htmlFor="file">Imagen (JPG, PNG, WEBP o GIF · máx. 8MB)</label>
            <input id="file" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? "Subiendo..." : "Subir foto"}
          </button>
        </form>
      </div>

      <div className="admin-card">
        <h2>Fotos cargadas ({photos.length})</h2>
        {photos.length === 0 ? <p className="hint">Todavía no hay fotos.</p> : null}
        <div className="thumb-grid">
          {photos.map((p) => {
            const isCover = coverIdByCategory[p.category] === p.id;
            return (
              <div className="thumb" key={p.id}>
                <img src={p.url} alt={p.alt || labelFor(p.category)} />
                <div className="cat">{labelFor(p.category)}</div>
                {isCover ? <span className="badge-cover">Portada</span> : null}
                {!isCover ? (
                  <button
                    type="button"
                    className="set-cover"
                    onClick={() => handleSetCover(p)}
                    title="Usar como portada de este tipo de cartel"
                  >
                    Marcar como portada
                  </button>
                ) : null}
                <button type="button" className="del" onClick={() => handleDelete(p.id)} aria-label="Eliminar foto">
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
