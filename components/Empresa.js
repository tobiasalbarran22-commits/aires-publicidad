import Image from "next/image";
import Reveal from "./Reveal";
import Parallax from "./Parallax";

export default function Empresa({ serviceCount }) {
  const stats = [
    { num: String(serviceCount), label: "Soluciones de cartelería y gráfica" },
    { num: "Integral", label: "Diseño, fabricación y colocación bajo un mismo equipo" },
    { num: "A medida", label: "Cada pieza se fabrica según la identidad de tu marca" },
  ];

  return (
    <section id="empresa" className="section empresa">
      <div className="container empresa-grid">
        <Reveal as="figure" variant="cinema" className="empresa-figure" style={{ margin: 0 }}>
          <Parallax>
            <Image
              src="/uploads/ig-02.jpg"
              alt="Letras corpóreas iluminadas, trabajo de Aires Publicidad"
              fill
              sizes="(max-width: 900px) 340px, (max-width: 1180px) 50vw, 548px"
            />
          </Parallax>
        </Reveal>

        <div>
          <Reveal className="section-head" style={{ marginBottom: 26 }}>
            <h2 className="h-section">Calidad, rapidez y un servicio hecho a medida.</h2>
          </Reveal>

          <Reveal>
            <p className="body-copy">
              Brindamos servicios de cartelería integral: diseño, fabricación y colocación bajo
              un mismo equipo. Escuchamos de cerca las necesidades de cada cliente para responder
              con soluciones que realmente funcionan para su marca, su local o su empresa.
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
