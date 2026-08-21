import { getSettings } from "../lib/data";
import { SITE_URL } from "../app/layout";

/**
 * Datos estructurados LocalBusiness: es lo que Google usa para el panel lateral
 * y para búsquedas del tipo "carteles cerca mío".
 *
 * Solo se emite información confirmada. No se encontró una dirección física
 * publicada (ni en Instagram ni en airespublicidad.com.ar), así que streetAddress
 * y addressLocality quedan afuera hasta que el cliente la confirme. Estos campos
 * mejorarían bastante el resultado pero NO se inventan:
 *
 *   streetAddress / addressLocality -> dirección del local o taller
 *   openingHoursSpecification       -> días y horarios de atención
 *   geo (latitude / longitude)      -> coordenadas exactas
 *   foundingDate                    -> año de fundación
 *   priceRange                      -> rango orientativo, ej. "$$"
 *   areaServed                      -> zona real de cobertura (CABA, GBA, todo el país...)
 */
export default async function JsonLd() {
  const s = await getSettings();

  const sameAs = [s.instagram, s.facebook, s.youtube].filter(Boolean);
  const whatsapp = s.whatsapp ? `+${String(s.whatsapp).replace(/\D/g, "")}` : null;

  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Aires Publicidad",
    description:
      "Cartelería integral: marquesinas, letras corpóreas, carteles en chapa y Alucobond, backlight, frontlight, señalética y vinilo.",
    url: SITE_URL,
    logo: `${SITE_URL}/logo-aires.png`,
    image: `${SITE_URL}/og.png`,
    email: s.email || undefined,
    telephone: whatsapp || undefined,
    address: { "@type": "PostalAddress", addressCountry: "AR" },
    ...(sameAs.length ? { sameAs } : {}),
  };

  return (
    <script
      type="application/ld+json"
      // El contenido sale de data/settings.json (lo edita el panel admin), no de
      // entrada del visitante. Se escapa "<" igual, por si alguien pega HTML en un campo.
      dangerouslySetInnerHTML={{
        // String.fromCharCode(92, 117, 48, 48, 51, 99) construye la secuencia de
        // escape < a partir de sus códigos de carácter, sin escribir una
        // barra invertida literal en el código fuente (evita líos de escaping
        // con las herramientas de edición).
        __html: JSON.stringify(data).replace(/</g, String.fromCharCode(92, 117, 48, 48, 51, 99)),
      }}
    />
  );
}
