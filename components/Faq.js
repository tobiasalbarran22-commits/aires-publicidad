import Reveal from "./Reveal";

const FAQS = [
  {
    q: "¿Qué incluye el servicio de cartelería integral?",
    a: "Diseño, fabricación y colocación bajo un mismo equipo, de punta a punta: no tenés que coordinar por separado a un diseñador, un fabricante y un instalador.",
  },
  {
    q: "¿Los carteles pueden llevar iluminación LED?",
    a: "Sí. Trabajamos marquesinas, letras corpóreas y carteles backlight con iluminación LED, según lo que necesite tu marca.",
  },
  {
    q: "¿Qué materiales utilizan?",
    a: "Para interior: polyfan, MDF y acrílico. Para exterior: chapa, acero, acrílico y Alucobond. La gráfica se aplica en vinilo de corte o impreso.",
  },
  {
    q: "¿Hacen ploteo de vidrieras y vehículos?",
    a: "Sí, trabajamos vinilo de corte e impreso para vidrieras, paneles de vidrio en interiores y gráfica vehicular.",
  },
  {
    q: "¿Cómo pido un presupuesto?",
    a: "Escribinos por WhatsApp, dejanos tu consulta por email, o usá el asistente del sitio para comparar carteles y calcular un presupuesto aproximado al instante.",
  },
  {
    q: "¿Puedo ver ejemplos de trabajos anteriores?",
    a: "Sí, en la sección Carteles de esta página vas a encontrar fotos reales de proyectos que ya hicimos para distintos rubros y marcas.",
  },
];

export default function Faq() {
  return (
    <section id="faq" className="section" style={{ background: "var(--bg-sunken)" }}>
      <div className="container">
        <Reveal className="section-head">
          <h2 className="h-section">Lo que más nos preguntan.</h2>
        </Reveal>

        <Reveal as="div" stagger className="faq-list">
          {FAQS.map((f) => (
            <details className="faq-item" key={f.q}>
              <summary>
                <span>{f.q}</span>
                <span className="faq-toggle" aria-hidden="true" />
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
