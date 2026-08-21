import Reveal from "./Reveal";

const STEPS = [
  { title: "Consulta", desc: "Nos contás qué necesitás: tipo de local, medidas aproximadas y estilo de marca." },
  { title: "Diseño", desc: "Proponemos el cartel adecuado en materiales, iluminación y presupuesto." },
  { title: "Fabricación", desc: "Producimos cada pieza en taller, cuidando el detalle y los tiempos de entrega." },
  { title: "Colocación", desc: "Instalamos en tu local y coordinamos todo el proceso con vos." },
];

export default function Proceso() {
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <Reveal className="divider" />
        <Reveal as="div" stagger className="proceso-list">
          {STEPS.map((s, i) => (
            <div className="proceso-item" key={s.title}>
              <span className="num tabular">{String(i + 1).padStart(2, "0")}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
