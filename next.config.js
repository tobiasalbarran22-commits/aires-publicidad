/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },

  images: {
    // AVIF/WebP: las fotos de trabajos son JPG y pesan ~627 KB en la home.
    formats: ["image/avif", "image/webp"],
  },

  async headers() {
    return [
      {
        // Vercel sirve todo lo de public/ con max-age=0, must-revalidate, así que
        // cada visita revalidaba las 28 imágenes. Casi todo pasa ahora por
        // /_next/image (que cachea solo), pero el optimizador igual va a buscar
        // el archivo origen acá, y estos assets son inmutables: el panel admin
        // escribe siempre con un nombre nuevo (crypto.randomUUID) y nunca pisa uno existente.
        source: "/uploads/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
