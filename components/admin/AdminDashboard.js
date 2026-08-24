"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FotosTab from "./FotosTab";
import ClientesTab from "./ClientesTab";
import ContactoTab from "./ContactoTab";
import PreciosTab from "./PreciosTab";

const TABS = [
  { id: "fotos", label: "Fotos" },
  { id: "clientes", label: "Clientes" },
  { id: "contacto", label: "Contacto" },
  { id: "precios", label: "Precios (chatbot)" },
];

export default function AdminDashboard({ initialSettings, initialClients, initialPhotos, initialPricing }) {
  const router = useRouter();
  const [tab, setTab] = useState("fotos");
  // Fotos y clientes viven acá y no dentro de cada pestaña: al cambiar de tab el componente
  // de la pestaña se desmonta, y si el estado viviera adentro volvería a arrancar desde los
  // datos del servidor de cuando cargó la página — o sea, lo recién borrado reaparecía.
  const [clients, setClients] = useState(initialClients);
  const [photos, setPhotos] = useState(initialPhotos);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <>
      <div className="admin-topbar">
        <span className="brand">Aires Publicidad — Panel administrador</span>
        <div className="actions">
          <a
            href="/"
            className="btn btn-ghost btn-sm"
            style={{ borderColor: "rgba(255,255,255,0.3)", color: "var(--paper)" }}
          >
            Ver sitio
          </a>
          <button type="button" className="btn btn-primary btn-sm" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="admin-shell">
        <div className="admin-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`admin-tab ${tab === t.id ? "is-active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "fotos" ? <FotosTab photos={photos} setPhotos={setPhotos} /> : null}
        {tab === "clientes" ? <ClientesTab clients={clients} setClients={setClients} /> : null}
        {tab === "contacto" ? <ContactoTab initialSettings={initialSettings} /> : null}
        {tab === "precios" ? <PreciosTab initialPricing={initialPricing} /> : null}
      </div>
    </>
  );
}
