"use client";

import { useState } from "react";

export default function ContactoTab({ initialSettings }) {
  const [form, setForm] = useState({
    phonesText: (initialSettings.phones || []).join("\n"),
    whatsapp: initialSettings.whatsapp || "",
    whatsappDisplay: initialSettings.whatsappDisplay || "",
    email: initialSettings.email || "",
    addressLine1: initialSettings.addressLine1 || "",
    addressLine2: initialSettings.addressLine2 || "",
    instagram: initialSettings.instagram || "",
    facebook: initialSettings.facebook || "",
    youtube: initialSettings.youtube || "",
  });
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState("");
  const [error, setError] = useState("");

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setOk("");
    setError("");

    const body = {
      ...form,
      phones: form.phonesText.split("\n").map((s) => s.trim()).filter(Boolean),
    };
    delete body.phonesText;

    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setBusy(false);

    if (!res.ok) {
      setError("No se pudo guardar");
      return;
    }
    setOk("Datos de contacto actualizados");
  }

  return (
    <div className="admin-card">
      <h2>Medios de contacto</h2>
      <p className="hint">Estos datos se usan en la sección de contacto, el chatbot y el botón de WhatsApp del sitio.</p>

      {ok ? <div className="alert alert-ok">{ok}</div> : null}
      {error ? <div className="alert alert-error">{error}</div> : null}

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="phones">Teléfonos (uno por línea)</label>
          <textarea id="phones" value={form.phonesText} onChange={(e) => set("phonesText", e.target.value)} />
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="wa">WhatsApp (solo números, con código de país)</label>
            <input id="wa" type="tel" value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="5491148897180" />
          </div>
          <div className="field">
            <label htmlFor="wad">WhatsApp (texto a mostrar)</label>
            <input id="wad" type="text" value={form.whatsappDisplay} onChange={(e) => set("whatsappDisplay", e.target.value)} placeholder="+54 9 11 4889-7180" />
          </div>
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="addr1">Dirección</label>
            <input id="addr1" type="text" value={form.addressLine1} onChange={(e) => set("addressLine1", e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="addr2">Ciudad / País</label>
            <input id="addr2" type="text" value={form.addressLine2} onChange={(e) => set("addressLine2", e.target.value)} />
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="ig">Instagram (URL)</label>
            <input id="ig" type="url" value={form.instagram} onChange={(e) => set("instagram", e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="fb">Facebook (URL)</label>
            <input id="fb" type="url" value={form.facebook} onChange={(e) => set("facebook", e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="yt">YouTube (URL)</label>
            <input id="yt" type="url" value={form.youtube} onChange={(e) => set("youtube", e.target.value)} />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}
