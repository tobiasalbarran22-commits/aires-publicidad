import Reveal from "./Reveal";
import { IconInstagram, IconFacebook, IconYoutube, IconStar } from "./SocialIcons";

export default function Contacto({ settings }) {
  const {
    phones = [],
    whatsapp,
    whatsappDisplay,
    email,
    addressLine1,
    addressLine2,
    instagram,
    facebook,
    youtube,
  } = settings;

  const waHref = `https://api.whatsapp.com/send?phone=${whatsapp}&text=${encodeURIComponent(
    "Hola! Quiero pedir un presupuesto para un cartel."
  )}`;

  const fullAddress = `Aires Publicidad, ${[addressLine1, addressLine2].filter(Boolean).join(", ")}`;
  const mapEmbedSrc = `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`;
  const mapLinkHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

  return (
    <section id="contacto" className="section">
      <div className="container">
        <div className="contacto-grid">
          <div>
            <Reveal className="section-head" variant="right">
              <h2 className="h-section">Contanos tu proyecto.</h2>
              <p className="lede">
                Escribinos por WhatsApp para una respuesta rápida, o dejanos tu consulta y te
                contactamos a la brevedad.
              </p>
            </Reveal>

            <Reveal className="cta-stack">
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-block">
                Escribir por WhatsApp
              </a>
              <a href={`mailto:${email}`} className="btn btn-ghost btn-block">
                Enviar un email
              </a>
            </Reveal>

            <Reveal className="social-row">
              {instagram ? (
                <a className="social-chip" href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <IconInstagram />
                </a>
              ) : null}
              {facebook ? (
                <a className="social-chip" href={facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <IconFacebook />
                </a>
              ) : null}
              {youtube ? (
                <a className="social-chip" href={youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                  <IconYoutube />
                </a>
              ) : null}
            </Reveal>
          </div>

          <Reveal className="contact-card">
            <div className="contact-row">
              <span className="k">Teléfonos</span>
              <span className="v">
                {phones.map((p) => (
                  <span key={p} style={{ display: "block" }}>
                    {p}
                  </span>
                ))}
              </span>
            </div>
            <div className="contact-row">
              <span className="k">WhatsApp</span>
              <span className="v">{whatsappDisplay}</span>
            </div>
            <div className="contact-row">
              <span className="k">Email</span>
              <span className="v">{email}</span>
            </div>
            <div className="contact-row">
              <span className="k">Ubicación</span>
              <span className="v">
                {addressLine1 || addressLine2}
                {addressLine1 ? <small>{addressLine2}</small> : null}
              </span>
            </div>
          </Reveal>
        </div>

        <div className="map-reviews-grid">
          <Reveal className="map-card">
            <div className="map-frame">
              <iframe
                src={mapEmbedSrc}
                title="Ubicación de Aires Publicidad"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a href={mapLinkHref} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm map-cta">
              Abrir en Google Maps
            </a>
          </Reveal>

          {/* No hay reseñas reales cargadas todavía: se muestra un enlace directo a
              Google en vez de inventar testimonios. Cuando el cliente confirme
              reseñas reales, se pueden agregar acá con el mismo formato que usa
              Visione (ver components/Contacto.js del proyecto "visione"). */}
          <Reveal className="reviews-panel reviews-panel-empty">
            <div className="reviews-panel-head">
              <h3>Reseñas en Google</h3>
            </div>
            <div className="reviews-stars" aria-hidden="true">
              <IconStar /><IconStar /><IconStar /><IconStar /><IconStar />
            </div>
            <p className="reviews-empty-copy">
              Todavía no cargamos reseñas en el sitio. Mientras tanto, podés ver las
              opiniones reales de nuestros clientes directamente en Google.
            </p>
            <a href={mapLinkHref} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
              Ver reseñas en Google
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
