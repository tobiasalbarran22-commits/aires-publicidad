import { SITE_URL } from "./layout";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // El panel y sus endpoints no aportan nada a la búsqueda y exponen superficie.
        disallow: ["/admin", "/admin/", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
