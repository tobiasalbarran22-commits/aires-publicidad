import { SITE_URL } from "./layout";

// El sitio es una sola página con secciones ancladas, así que el sitemap tiene
// una sola URL. Las anclas (#empresa, #servicios, ...) no se listan: Google no
// las trata como documentos separados.
export default function sitemap() {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
