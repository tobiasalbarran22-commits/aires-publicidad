import Image from "next/image";
import Reveal from "./Reveal";

const PLACEHOLDER_COUNT = 8;

export default function Clientes({ clients }) {
  const hasClients = clients && clients.length > 0;
  const base = hasClients ? clients : Array.from({ length: PLACEHOLDER_COUNT }, (_, i) => ({ id: `ph-${i}`, empty: true }));
  const track = [...base, ...base];

  return (
    <section id="clientes" className="section clientes">
      <div className="container">
        <Reveal className="section-head">
          <h2 className="h-section">Marcas que ya confían en nosotros.</h2>
          <p className="lede">
            Cada fachada es una carta de presentación. Empresas, locales y franquicias de todo el
            país renuevan su imagen con nuestra cartelería.
          </p>
        </Reveal>

        <Reveal className="marquee">
          <div className="marquee-track">
            {track.map((c, i) =>
              c.empty ? (
                <div className="client-plaque is-empty" key={`${c.id}-${i}`}>
                  <span className="plus">+</span>
                  <span className="lbl">Tu logo aquí</span>
                </div>
              ) : (
                <div className="client-plaque" key={`${c.id}-${i}`} title={c.name}>
                  <div className="client-logo">
                    <Image src={c.logo} alt={c.name} fill sizes="232px" />
                  </div>
                </div>
              )
            )}
          </div>
        </Reveal>

        {!hasClients ? (
          <p style={{ marginTop: 24, fontSize: "0.82rem", color: "var(--fg-muted)" }}>
            Esta sección se completa desde el panel de administración a medida que se cargan los
            logos de cada cliente.
          </p>
        ) : null}
      </div>
    </section>
  );
}
