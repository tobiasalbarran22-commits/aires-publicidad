"use client";

import { useState } from "react";

export default function ClientesTab({ clients, setClients }) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleAdd(e) {
    e.preventDefault();
    if (!name.trim() || !file) {
      setError("Falta el nombre o el logo");
      return;
    }
    setBusy(true);
    setError("");
    const form = new FormData();
    form.append("name", name.trim());
    form.append("url", url.trim());
    form.append("file", file);

    const res = await fetch("/api/clients", { method: "POST", body: form });
    const data = await res.json().catch(() => ({}));
    setBusy(false);

    if (!res.ok) {
      setError(data.error || "No se pudo agregar el cliente");
      return;
    }
    setClients((c) => [...c, data]);
    setName("");
    setUrl("");
    setFile(null);
    e.target.reset();
  }

  async function handleDelete(id) {
    if (!confirm("¿Eliminar este cliente?")) return;
    setError("");
    const res = await fetch(`/api/clients/${id}`, { method: "DELETE" }).catch(() => null);
    if (!res) {
      setError("No se pudo conectar con el servidor. Revisá la conexión e intentá de nuevo.");
      return;
    }
    // 404 = ya no existe en el servidor, así que también hay que sacarlo de la lista.
    if (!res.ok && res.status !== 404) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "No se pudo eliminar el cliente");
      return;
    }
    setClients((c) => c.filter((x) => x.id !== id));
  }

  async function handleRename(id, field, value) {
    setClients((c) => c.map((x) => (x.id === id ? { ...x, [field]: value } : x)));
  }

  async function handleSave(client) {
    const res = await fetch(`/api/clients/${client.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: client.name, url: client.url }),
    }).catch(() => null);
    if (!res || !res.ok) setError(`No se pudieron guardar los cambios de "${client.name}"`);
  }

  return (
    <>
      <div className="admin-card">
        <h2>Agregar cliente</h2>
        <p className="hint">El logo se muestra en la sección "Clientes" del sitio.</p>
        {error ? <div className="alert alert-error">{error}</div> : null}
        <form onSubmit={handleAdd}>
          <div className="field-row">
            <div className="field">
              <label htmlFor="cname">Nombre</label>
              <input id="cname" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="curl">Sitio web (opcional)</label>
              <input id="curl" type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
            </div>
          </div>
          <div className="field">
            <label htmlFor="clogo">Logo (JPG, PNG, WEBP o GIF · máx. 4MB)</label>
            <input id="clogo" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? "Agregando..." : "Agregar cliente"}
          </button>
        </form>
      </div>

      <div className="admin-card">
        <h2>Clientes cargados ({clients.length})</h2>
        {clients.length === 0 ? <p className="hint">Todavía no hay clientes cargados — el sitio muestra espacios de ejemplo.</p> : null}
        {clients.map((c) => (
          <div className="client-row" key={c.id}>
            <img src={c.logo} alt={c.name} />
            <div className="meta">
              <input type="text" value={c.name} onChange={(e) => handleRename(c.id, "name", e.target.value)} onBlur={() => handleSave(c)} />
              <input
                type="text"
                value={c.url || ""}
                placeholder="Sitio web (opcional)"
                onChange={(e) => handleRename(c.id, "url", e.target.value)}
                onBlur={() => handleSave(c)}
              />
            </div>
            <button type="button" className="pill-btn danger" onClick={() => handleDelete(c.id)}>
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
