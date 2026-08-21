"use client";

import { useState } from "react";
import { SERVICIOS, getServicio } from "../lib/servicios";

const SIZES = [
  { id: "chico", label: "Chico (hasta 1 m)" },
  { id: "mediano", label: "Mediano (1–3 m)" },
  { id: "grande", label: "Grande (más de 3 m)" },
];

const money = (n) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

function CompareTable({ a, b }) {
  const rows = [
    ["Material", a.material, b.material],
    ["Iluminación", a.iluminacion, b.iluminacion],
    ["Durabilidad", a.durabilidad, b.durabilidad],
    ["Fabricación", a.fabricacion, b.fabricacion],
    ["Ideal para", a.idealPara, b.idealPara],
  ];
  return (
    <div style={{ overflowX: "auto" }}>
      <table className="chat-compare-table">
        <thead>
          <tr>
            <th></th>
            <th>{a.label}</th>
            <th>{b.label}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([k, va, vb]) => (
            <tr key={k}>
              <th>{k}</th>
              <td>{va}</td>
              <td>{vb}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PriceCard({ label, low, high, note, waHref }) {
  return (
    <div className="chat-result">
      <div style={{ fontSize: "0.8rem", color: "var(--fg-muted)", marginBottom: 4 }}>{label}</div>
      <div className="price tabular">
        {money(low)} – {money(high)}
      </div>
      <div className="fine">Estimación orientativa, no vinculante. {note}</div>
      <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm" style={{ marginTop: 10 }}>
        Pedir cotización exacta
      </a>
    </div>
  );
}

function ContactCard({ settings }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
      <a
        className="btn btn-primary btn-sm"
        href={`https://api.whatsapp.com/send?phone=${settings.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Escribir por WhatsApp
      </a>
      <a className="btn btn-ghost btn-sm" href={`mailto:${settings.email}`}>
        {settings.email}
      </a>
      {(settings.phones || []).map((p) => (
        <span key={p} style={{ fontSize: "0.85rem", color: "var(--fg-muted)" }}>
          {p}
        </span>
      ))}
    </div>
  );
}

export default function ChatbotWidget({ pricing, settings }) {
  const [open, setOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const [log, setLog] = useState([
    {
      id: "greeting",
      from: "bot",
      content:
        "¡Hola! Soy el asistente de Aires Publicidad. Puedo ayudarte a comparar tipos de carteles o a calcular un presupuesto aproximado.",
    },
  ]);
  const [options, setOptions] = useState(null);
  let counter = 0;

  function nid() {
    counter += 1;
    return `m-${Date.now()}-${counter}`;
  }
  function addBot(content) {
    setLog((l) => [...l, { id: nid(), from: "bot", content }]);
  }
  function addUser(text) {
    setLog((l) => [...l, { id: nid(), from: "user", content: text }]);
  }

  function goMenu() {
    addBot("¿En qué te ayudo?");
    setOptions([
      {
        label: "Comparar tipos de carteles",
        onClick: () => {
          addUser("Comparar tipos de carteles");
          goCompare(1, null);
        },
      },
      {
        label: "Calcular presupuesto aproximado",
        onClick: () => {
          addUser("Calcular presupuesto aproximado");
          goBudgetTipo();
        },
      },
      {
        label: "Hablar con un asesor",
        onClick: () => {
          addUser("Hablar con un asesor");
          goAdvisor();
        },
      },
    ]);
  }

  function goCompare(which, excludeId) {
    addBot(which === 1 ? "Elegí el primer tipo de cartel:" : "Ahora elegí el segundo tipo, para comparar:");
    const opts = SERVICIOS.filter((s) => s.id !== excludeId).map((s) => ({
      label: s.label,
      onClick: () => {
        addUser(s.label);
        if (which === 1) {
          goCompare(2, s.id);
        } else {
          showComparison(excludeId, s.id);
        }
      },
    }));
    setOptions(opts);
  }

  function showComparison(aId, bId) {
    const a = getServicio(aId);
    const b = getServicio(bId);
    addBot({ table: { a, b } });
    setOptions([
      {
        label: "Comparar otros dos",
        onClick: () => {
          addUser("Comparar otros dos");
          goCompare(1, null);
        },
      },
      {
        label: "Calcular presupuesto",
        onClick: () => {
          addUser("Calcular presupuesto");
          goBudgetTipo();
        },
      },
      {
        label: "Volver al inicio",
        onClick: () => {
          addUser("Volver al inicio");
          goMenu();
        },
      },
    ]);
  }

  function goBudgetTipo() {
    addBot("¿Qué tipo de cartel te interesa?");
    setOptions(
      SERVICIOS.map((s) => ({
        label: s.label,
        onClick: () => {
          addUser(s.label);
          goBudgetTamano(s.id);
        },
      }))
    );
  }

  function goBudgetTamano(tipoId) {
    addBot("¿Aproximadamente qué tamaño tenés en mente?");
    setOptions(
      SIZES.map((sz) => ({
        label: sz.label,
        onClick: () => {
          addUser(sz.label);
          goBudgetLed(tipoId, sz.id);
        },
      }))
    );
  }

  function goBudgetLed(tipoId, tamanoId) {
    addBot("¿Lo pensás con iluminación LED?");
    setOptions([
      {
        label: "Sí, con LED",
        onClick: () => {
          addUser("Sí, con LED");
          showBudget(tipoId, tamanoId, true);
        },
      },
      {
        label: "No, sin luz",
        onClick: () => {
          addUser("No, sin luz");
          showBudget(tipoId, tamanoId, false);
        },
      },
    ]);
  }

  function showBudget(tipoId, tamanoId, led) {
    const item = (pricing.items || []).find((p) => p.id === tipoId);
    const base = item ? item.base : 0;
    const sizeMult = (pricing.sizeMultipliers || {})[tamanoId] || 1;
    const ledMult = led ? pricing.ledMultiplier || 1 : 1;
    const est = base * sizeMult * ledMult;
    const low = est * 0.85;
    const high = est * 1.2;
    const servicio = getServicio(tipoId);
    const waText = encodeURIComponent(
      `Hola! Quiero cotizar un cartel de ${servicio.label}, tamaño ${tamanoId}, ${led ? "con" : "sin"} LED.`
    );
    addBot({
      price: {
        label: servicio.label,
        low,
        high,
        note: pricing.note || "",
        waHref: `https://api.whatsapp.com/send?phone=${settings.whatsapp}&text=${waText}`,
      },
    });
    setOptions([
      {
        label: "Nueva estimación",
        onClick: () => {
          addUser("Nueva estimación");
          goBudgetTipo();
        },
      },
      {
        label: "Hablar con un asesor",
        onClick: () => {
          addUser("Hablar con un asesor");
          goAdvisor();
        },
      },
      {
        label: "Volver al inicio",
        onClick: () => {
          addUser("Volver al inicio");
          goMenu();
        },
      },
    ]);
  }

  function goAdvisor() {
    addBot({ contact: true });
    setOptions([
      {
        label: "Volver al inicio",
        onClick: () => {
          addUser("Volver al inicio");
          goMenu();
        },
      },
    ]);
  }

  function handleOpen() {
    setOpen(true);
    if (!started) {
      setStarted(true);
      goMenu();
    }
  }

  function renderContent(content) {
    if (typeof content === "string") return content;
    if (content.table) return <CompareTable a={content.table.a} b={content.table.b} />;
    if (content.price) return <PriceCard {...content.price} />;
    if (content.contact) return <ContactCard settings={settings} />;
    return null;
  }

  return (
    <>
      {!open ? (
        <button type="button" className="chat-launcher" onClick={handleOpen}>
          <span className="dot" aria-hidden="true" />
          Presupuesto
        </button>
      ) : null}

      {open ? (
        <div className="chat-panel" role="dialog" aria-label="Asistente Aires Publicidad">
          <div className="chat-head">
            <div>
              <div className="title">Asistente Aires Publicidad</div>
              <div className="sub">Comparación de carteles y presupuestos</div>
            </div>
            <button type="button" className="chat-close" onClick={() => setOpen(false)} aria-label="Cerrar chat">
              ✕
            </button>
          </div>
          <div className="chat-body">
            {log.map((entry) => {
              const rich = typeof entry.content !== "string";
              return (
                <div key={entry.id} className={rich ? "" : `chat-msg ${entry.from}`}>
                  {renderContent(entry.content)}
                </div>
              );
            })}
            {options ? (
              <div className="chat-options">
                {options.map((o) => (
                  <button key={o.label} type="button" className="chat-option" onClick={o.onClick}>
                    {o.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
