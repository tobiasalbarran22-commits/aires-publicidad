r"""
Genera public/og.png (1200x630), la imagen que muestran WhatsApp, Facebook,
LinkedIn y X al compartir el link del sitio.

Se pre-renderiza con un script en vez de generarla en runtime con next/og porque
@vercel/og carga su fuente por defecto al inicializar el módulo y eso se rompe en
Windows (ERR_INVALID_URL sobre ".\file:\C:\...noto-sans...ttf"), antes de poder
pasarle fuentes propias. Pre-renderizar además saca el costo de runtime y hace que
el resultado sea idéntico en todas las plataformas.

Volver a correr si cambian el logo o los textos:
    python scripts/generate-og-image.py
"""
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
MARGIN = 80
CYAN, DARK, GRAY, WHITE = "#00b0f2", "#1c1c1d", "#666666", "#ffffff"

HEADLINE = "Cartelería integral para tu marca"
SUBLINES = [
    "Marquesinas, letras corpóreas, Alucobond y señalética.",
    "Diseño, fabricación y colocación.",
]
DOMAIN = "airespublicidad.com.ar"

bold = ImageFont.truetype("assets/fonts/Archivo-Bold.ttf", 62)
regular = ImageFont.truetype("assets/fonts/Archivo-Regular.ttf", 30)
bold_sm = ImageFont.truetype("assets/fonts/Archivo-Bold.ttf", 26)

img = Image.new("RGB", (W, H), WHITE)
d = ImageDraw.Draw(img)

# Logo arriba a la izquierda. El PNG ya tiene su propia píldora oscura de fondo
# (es el diseño real del logo, no hace falta limpiar nada), así que se pega
# directo con su canal alfa sobre el blanco del lienzo.
logo = Image.open("public/logo-aires.png").convert("RGBA")
logo = logo.resize((300, int(300 * logo.height / logo.width)), Image.LANCZOS)
img.paste(logo, (MARGIN, MARGIN), logo)

# Titular + bajada, bloque centrado verticalmente
y = 268
d.text((MARGIN, y), HEADLINE, font=bold, fill=DARK)
y += 96
for line in SUBLINES:
    d.text((MARGIN, y), line, font=regular, fill=GRAY)
    y += 44

# Barra celeste + dominio, abajo
bar_y = H - MARGIN - 26
d.rectangle([MARGIN, bar_y, MARGIN + 110, bar_y + 10], fill=CYAN)
d.text((MARGIN + 132, bar_y - 9), DOMAIN, font=bold_sm, fill=DARK)

img.save("public/og.png", optimize=True)
print(f"public/og.png -> {img.size}")
