"use client";

import { useState } from "react";
import { SERVICIOS } from "../../lib/servicios";

export default function PreciosTab({ initialPricing }) {
  const [note, setNote] = useState(initialPricing.note || "");
  const [chico, setChico] = useState(initialPricing.sizeMultipliers?.chico ?? 1);
  const [mediano, setMediano] = useState(initialPricing.sizeMultipliers?.mediano ?? 1.6);
  const [grande, setGrande] = useState(initialPricing.sizeMultipliers?.grande ?? 2.4);
  const [led, setLed] = useState(initialPricing.ledMultiplier ?? 1.35);
  const [items, setItems] = useState(
    SERVICIOS.map((s) => {
      const found = (initialPricing.items || []).find((i) => i.id === s.id);
      return { id: s.id, label: s.label, base: found?.base ?? 0 };
    })
  );
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState("");

  function updateItem(id, value) {
    setItems((list) => list.map((i) => (i.id === id ? { ...i, base: value } : i)));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setOk("");

    const body = {
      note,
      sizeMultipliers: { chico: Number(chico), mediano: Number(mediano), grande: Number(grande) },
      ledMultiplier: Number(led),
      items: items.map((i) => ({ id: i.id, base: Number(i.base) })),
    };

    const res = await fetch("/api/pricing", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setBusy(false);
    if (res.ok) setOk("Precios del chatbot actualizados");
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="admin-card">
        <h2>Precios base del chatbot</h2>
        <p className="hint">
          Estos valores alimentan la calculadora de presupuesto aproximado del chatbot. Son estimaciones: revisalos
          antes de publicar el sitio.
        </p>

        {ok ? <div className="alert alert-ok">{ok}</div> : null}

        <div className="field">
          <label htmlFor="note">Aclaración que ve el visitante</label>
          <textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} />
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="mchico">Multiplicador — Chico</label>
            <input id="mchico" type="number" step="0.05" min="0" value={chico} onChange={(e) => setChico(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="mmediano">Multiplicador — Mediano</label>
            <input id="mmediano" type="number" step="0.05" min="0" value={mediano} onChange={(e) => setMediano(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="mgrande">Multiplicador — Grande</label>
            <input id="mgrande" type="number" step="0.05" min="0" value={grande} onChange={(e) => setGrande(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="mled">Multiplicador — con LED</label>
            <input id="mled" type="number" step="0.05" min="0" value={led} onChange={(e) => setLed(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h2>Precio base por tipo de cartel (ARS)</h2>
        <p className="hint">Precio de referencia para tamaño chico y sin LED. El chatbot aplica los multiplicadores de arriba.</p>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Tipo de cartel</th>
                <th style={{ width: 160 }}>Precio base</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.id}>
                  <td>{i.label}</td>
                  <td>
                    <input type="number" min="0" step="1000" value={i.base} onChange={(e) => updateItem(i.id, e.target.value)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button type="submit" className="btn btn-primary" disabled={busy} style={{ marginTop: 18 }}>
          {busy ? "Guardando..." : "Guardar precios"}
        </button>
      </div>
    </form>
  );
}
