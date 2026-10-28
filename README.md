# Directorio Médico Digital · Info Display Solutions

Landing page comercial de **Info Display Solutions**, empresa guatemalteca que instala directorios médicos digitales (wayfinding) en hospitales y edificios de consultorios: mapas 3D del edificio, rutas que el paciente lleva en su teléfono con un QR y pantallas con espacios publicitarios que generan ingresos para la institución.

**Sitio en producción:** https://zemogc.github.io/LandingPageWAY/

![Vista previa del sitio](assets/img/og-image.jpg)

## Qué incluye

- **Kiosco interactivo en el hero.** Simula una pantalla del directorio: el visitante elige un destino y la ruta se dibuja sobre el plano, con tiempo estimado a pie, franja publicitaria rotativa y código QR.
- **Sección de publicidad digital (DOOH).** Formatos publicitarios, perfiles de anunciantes y un simulador de ingresos en quetzales con valores ajustables (pantallas, anuncios por ciclo, tarifa, ocupación y visitantes diarios).
- **Contenido de producto.** Problema, solución en cuatro capacidades, fotos de tótems en sitio, modelo de negocio, proceso de implementación, soporte, privacidad y preguntas frecuentes.
- **Contacto** mediante formulario de Google Forms embebido.

## Stack

Sitio estático sin dependencias ni paso de compilación.

| Capa | Detalle |
| --- | --- |
| Marcado | HTML5 semántico, datos estructurados `schema.org/Organization`, Open Graph |
| Estilos | CSS propio con tokens en `:root`, Grid y Flexbox, responsive desde 360 px |
| Interacción | JavaScript sin librerías (kiosco, carrusel, simulador, menú móvil) |
| Tipografía | Ragonte (display, local), Lato (texto) y Overpass (rótulos) |
| Imágenes | WebP optimizado, carga diferida |

Accesibilidad: navegación por teclado con foco visible, enlace para saltar al contenido, textos alternativos, regiones `aria-live` en el kiosco y el simulador, y respeto de `prefers-reduced-motion`.

## Estructura

```
.
├── index.html            Página principal
├── 404.html              Página de error
├── assets/
│   ├── css/styles.css    Estilos y tokens de diseño
│   ├── js/main.js        Kiosco, carrusel, simulador y navegación
│   └── img/              Imágenes WebP, favicon e imagen Open Graph
├── fonts/                Ragonte (woff2/woff)
├── robots.txt
└── sitemap.xml
```

## Desarrollo local

No requiere instalación. Basta con servir la carpeta:

```bash
python -m http.server 8000
# abrir http://localhost:8000
```

## Despliegue

GitHub Pages publica la rama `main` desde la raíz del repositorio. Cada push a `main` actualiza el sitio. El repositorio no contiene workflows propios de GitHub Actions.

## Créditos

Diseño y desarrollo web por [ZemZysteM](https://www.instagram.com/zemzystem/).
Marca, logotipo, imágenes y contenidos comerciales © Info Display Solutions.
