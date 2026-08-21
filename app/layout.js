import { Fraunces, Archivo, Space_Mono } from "next/font/google";
import "./globals.css";
import JsonLd from "../components/JsonLd";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

// Dominio público del sitio. Cuando se migre a airespublicidad.com.ar basta con definir
// NEXT_PUBLIC_SITE_URL en las variables de entorno de Vercel; no hay que tocar código.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://aires-publicidad.vercel.app";

const TITLE = "Aires Publicidad — Cartelería integral en Buenos Aires";
const DESCRIPTION =
  "Carteles corpóreos, marquesinas, revestimientos en Alucobond, gráfica y señalética. Diseño, fabricación y colocación en toda Argentina.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: "/",
    siteName: "Aires Publicidad",
    locale: "es_AR",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${fraunces.variable} ${archivo.variable} ${spaceMono.variable}`}>
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
