# Site — Landing page pde.kolbelabs.com

Sitio web público de la comunidad católica de Pilar del Este. Un solo archivo HTML con directorio de iglesias, mapa interactivo y datos de contacto.

**Estado:** Live en producción — https://pde.kolbelabs.com

## Stack

- HTML/CSS/JS vanilla (un solo archivo: `site/index.html`)
- Leaflet 1.9.4 + CartoDB tiles para el mapa interactivo
- Fuentes: Inter + Playfair Display (Google Fonts)
- Sin build step, sin framework, sin dependencias de Node

## Deploy

| Qué | Detalle |
|-----|---------|
| Plataforma | Vercel |
| Proyecto | `pde-site` |
| URL pública | https://pde.kolbelabs.com |
| Trigger | Auto-deploy al pushear a `main` |
| Config Vercel | `site/.vercel/project.json` (en `.gitignore`, no visible en git) |

**Para deployar:** hacer push a `main`. Vercel detecta el cambio y despliega solo.
No hay comando de build ni CLI necesario — el HTML es estático.

## Estructura

```
site/
├── index.html          ← Todo el sitio (datos, estilos, JS)
├── CONTEXT.md          ← Este archivo
├── .gitignore          ← Excluye .vercel/
└── .vercel/            ← Config local de Vercel (no en git)
    └── project.json
```

## Tabla Load/Skip

| Tarea | Cargar | NO cargar |
|-------|--------|-----------|
| Editar contenido o UX | solo `index.html` | nada más |
| Debug de mapa | `index.html` + Leaflet docs | — |
| Deploy | push a main, Vercel hace el resto | — |

## Proceso de actualización de datos

Los datos de iglesias viven hardcodeados en el array `IGLESIAS` dentro de `index.html`.
Fuente de verdad: fichas en `research/iglesias/`. Si se actualiza una ficha de iglesia, reflejar el cambio en `index.html`.

## Que NO hacer

- No crear archivos CSS o JS separados — todo va en `index.html`
- No agregar frameworks ni dependencias npm al sitio
- No commitear la carpeta `.vercel/`
- No tocar la config de Vercel desde el repo — todo se gestiona desde el dashboard de Vercel
