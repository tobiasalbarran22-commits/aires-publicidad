import Reveal from "./Reveal";
import ChevronShowcase from "./ChevronShowcase";

export default function Empresa({ serviceCount }) {
  const stats = [
    { num: String(serviceCount), label: "Soluciones de cartelería y gráfica" },
    { num: "Integral", label: "Diseño, fabricación y colocación bajo un mismo equipo" },
    { num: "A medida", label: "Cada pieza se fabrica según la identidad de tu marca" },
  ];

  return (
    <section id="empresa" className="section empresa">
      <div className="container empresa-grid">
        <Reveal as="figure" className="empresa-figure" style={{ margin: 0 }}>
          <ChevronShowcase />
        </Reveal>

        <div>
          <Reveal className="section-head" style={{ marginBottom: 26 }}>
            <h2 className="h-section">Quiénes somos.</h2>
          </Reveal>

          <Reveal>
            <p className="body-copy">
              Somos un equipo de cartelería integral con base en Buenos Aires: diseñamos,
              fabricamos y colocamos cada pieza nosotros mismos, sin subcontratar el proceso.
              Letras corpóreas, marquesinas, chapa y Alucobond, banners y gigantografías,
              señalética y vinilo — todo bajo un mismo techo, de punta a punta.
            </p>
            <p className="body-copy" style={{ marginTop: 16 }}>
              Nos define la atención al detalle en cada pieza, la rapidez para responder y la
              capacidad de adaptarnos a lo que cada proyecto necesita — con tecnologías
              contemporáneas y precios accesibles, sin resignar calidad.
            </p>
          </Reveal>

          <Reveal as="div" stagger className="stat-row">
            {stats.map((s) => (
              <div className="stat-card" key={s.label}>
                <div className="stat-num tabular">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
