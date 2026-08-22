import Image from "next/image";

const LEAD_WORDS = ["Aires,", "tu", "marca", "en"];

// No hay datos verificados de años en el mercado ni de proyectos realizados
// (a diferencia de Visione, acá no se inventan cifras sin que el cliente las
// confirme), así que el hero usa diferenciales cualitativos tomados de la
// propia bio/sitio de Aires en vez del contador animado con números.
const STATS = [
  {
    value: "Rápido",
    label: "Capacidad de respuesta y seguimiento personalizado en cada proyecto.",
  },
  {
    value: "Prolijo",
    label: "Atención al detalle en cada pieza, del diseño a la colocación.",
  },
  {
    value: "Creativo",
    label: "Creatividad y tecnologías contemporáneas en cada solución.",
  },
];

export default function Hero({ whatsappHref }) {
  let delayIndex = 0;
  return (
    <section id="top" className="hero">
      {/* El producto de Aires es luz, así que el hero no muestra un cartel: lo
          prende. La foto arranca subexpuesta y sube de exposición en el mismo
          reloj en que se encienden las palabras — un solo interruptor para toda
          la escena. Todo el encendido es CSS puro y de carga: no hay scroll
          listeners ni rAF, y por eso la regla global de prefers-reduced-motion
          (que lleva animation-duration a 0.001ms) ya deja el cartel prendido y
          legible sin que haya que apagar nada a mano desde JS. */}
      <div className="hero-media">
        <Image
          src="/hero/flow-noche.jpg"
          alt="Letras corpóreas iluminadas de Flow en una terraza de noche, fabricadas y colocadas por Aires Publicidad."
          fill
          priority
          sizes="100vw"
          className="hero-photo"
        />
        <div className="hero-scrim" aria-hidden="true" />
        <div className="hero-rake" aria-hidden="true" />
      </div>

      <div className="hero-grid" aria-hidden="true" />

      <div className="hero-inner">
        <h1 className="hero-title">
          {LEAD_WORDS.map((w) => {
            const d = 0.1 + delayIndex++ * 0.09;
            return (
              <span key={w} className="letter" style={{ animationDelay: `${d}s` }}>
                {w}&nbsp;
              </span>
            );
          })}
          {/* "grande." entra último y con el golpe de balasto: es el acento de
              la frase y el único momento en que aparece el cian de la marca. */}
          <span
            className="letter letter-accent"
            style={{ animationDelay: `${0.1 + delayIndex++ * 0.09}s` }}
          >
            <em>grande.</em>
          </span>
        </h1>

        <p className="lede">
          Diseñamos, fabricamos y colocamos carteles corpóreos, marquesinas backlight y
          frontlight, chapa y Alucobond, señalética y gráfica vehicular — con iluminación LED
          cuando el proyecto lo pide. Un proyecto, un mismo equipo, de punta a punta.
        </p>

        <div className="hero-foot">
          <a href="#contacto" className="btn btn-primary">
            Pedí tu presupuesto
          </a>
          <a href="#servicios" className="btn btn-ghost">
            Ver nuestros carteles
          </a>
        </div>

        <div className="hero-stats">
          {STATS.map((s) => (
            <div key={s.value}>
              <div className="stat-num">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="scroll-cue" aria-hidden="true">
        <span>Descubrí más</span>
        <span className="line" />
      </div>
    </section>
  );
}
