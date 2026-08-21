# Aires Publicidad — sitio web

Maqueta del sitio de Aires Publicidad (cartelería integral), construida sobre la misma
estructura de código que el sitio de Visione: Next.js con panel de administración,
chatbot de presupuestos y despliegue en Vercel.

## Cómo correrlo

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

## Panel de administrador

URL: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

La contraseña se define en `.env.local`, variable `ADMIN_PASSWORD` (y en las Environment
Variables del proyecto en Vercel para producción). Cambiala antes de compartir el link.

## Contenido que falta confirmar con el cliente

Este sitio se armó a partir de lo público en Instagram (@airespublicidadygrafica) y en
airespublicidad.com.ar. Quedó **sin inventar** lo que no se pudo confirmar:

- **Dirección física** del local o taller — no está publicada en ningún lado. El mapa de
  la sección Contacto busca "Aires Publicidad" + la ciudad hasta que se cargue una
  dirección real en el panel admin (pestaña Contacto).
- **Reseñas de Google** — no hay ninguna cargada (a diferencia del sitio de Visione, acá
  no había reseñas para transcribir). La sección muestra un link directo a Google en
  vez de inventar testimonios.
- **Años en el mercado / proyectos realizados** — el hero de Visione tiene estos
  contadores animados; el de Aires no, porque no hay una cifra real para mostrar.
- **Clientes** — la sección Clientes arranca vacía (`data/clients.json`). Se completa
  desde el panel admin.
- **Precios del chatbot** (`data/pricing.json`) — son valores de ejemplo, hay que
  actualizarlos con precios reales antes de publicar.

## Imágenes

Las fotos de `public/uploads/ig-*.jpg` son del feed público de Instagram de la empresa,
descargadas para esta maqueta. El logo (`public/logo-aires.png`) sale de
airespublicidad.com.ar. Antes de publicar, confirmar con el cliente que puede usar esas
fotos y ese logo en el sitio.

## Imagen para compartir (Open Graph)

`public/og.png` la genera un script, no se edita a mano:

```bash
python scripts/generate-og-image.py
```

## Dónde vive el contenido

- `data/settings.json` — contacto y redes.
- `data/clients.json` — clientes y logos (vacío).
- `data/photos.json` — fotos de la galería.
- `data/pricing.json` — precios del chatbot.
- `public/uploads/` — archivos de imagen subidos desde el panel.
