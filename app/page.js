import SiteHeader from "../components/SiteHeader";
import Hero from "../components/Hero";
import Empresa from "../components/Empresa";
import Servicios from "../components/Servicios";
import Clientes from "../components/Clientes";
import Proceso from "../components/Proceso";
import Faq from "../components/Faq";
import Contacto from "../components/Contacto";
import SiteFooter from "../components/SiteFooter";
import ChatbotWidget from "../components/ChatbotWidget";
import { getSettings, getClients, getPhotos, getPricing } from "../lib/data";
import { SERVICIOS } from "../lib/servicios";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, clients, photos, pricing] = await Promise.all([
    getSettings(),
    getClients(),
    getPhotos(),
    getPricing(),
  ]);

  const waHref = `https://api.whatsapp.com/send?phone=${settings.whatsapp}&text=${encodeURIComponent(
    "Hola! Quiero pedir un presupuesto para un cartel."
  )}`;

  return (
    <>
      <SiteHeader
        whatsappHref={waHref}
        phone={settings.phones?.[0]}
        telHref={settings.whatsapp ? `tel:+${settings.whatsapp}` : undefined}
      />
      <div className="snap-scroll">
        <Hero whatsappHref={waHref} />
        <Empresa serviceCount={SERVICIOS.length} />
        <Servicios photos={photos} />
        <Clientes clients={clients} />
        <Proceso />
        <Faq />
        <Contacto settings={settings} />
        <SiteFooter />
      </div>
      <ChatbotWidget pricing={pricing} settings={settings} />
    </>
  );
}
