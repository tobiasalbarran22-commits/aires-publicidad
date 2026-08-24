import Reveal from "./Reveal";
import ChevronShowcase from "./ChevronShowcase";
import EmpresaVideo from "./EmpresaVideo";

export default function Empresa({ serviceCount }) {
  const stats = [
    { num: String(serviceCount), label: "Soluciones de cartelería y gráfica" },
    { num: "Integral", label: "Diseño, fabricación y colocación bajo un mismo equipo" },
    { num: "A medida", label: "Cada pieza se fabrica según la identidad de tu marca" },
  ];

  return (
    <section id="empresa" className="section empresa">
      <EmpresaVideo />
      <div className="container empresa-grid">
        <Reveal as="figure" className="empresa-figure" style={{ margin: 0 }}>
          <ChevronShowcase />
        </Reveal>

        <div>
          <Reveal className="section-head" style={{ marginBottom: 26 }}>
            <h2 className="h-section">Calidad, rapidez y un servicio hecho a medida.</h2>
          </Reveal>

          <Reveal>
            <p className="body-copy">
              Brindamos servicios de cartelería integral: letras corpóreas, marquesinas, carteles
              en chapa y Alucobond, banners y gigantografías, señalética y vinilo — diseño,
              fabricación y colocación bajo un mismo equipo. Escuchamos de cerca las necesidades
              de cada cliente para responder con soluciones que realmente funcionan para su
              marca, su local o su empresa.
            </p>
            <p className="body-copy" style={{ marginTop: 16 }}>
              Nos diferencian la creatividad, las tecnologías contemporáneas y nuestro compromiso
              con la calidad — manteniendo precios accesibles, sin resignarla.
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
