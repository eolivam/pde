---
id: landing-encuesta
frente: "landing-encuesta — deck de resultados de la encuesta comunitaria"
workspace: pde
prueba:
  tipo: file
  archivo: pde/backlog/encuesta-resultados.json
  assert: 'data["deploy_ok"] and data["slides"] == 12 and data["slides_con_overflow"] == 0'
  descripcion: "Deck deployado en /encuesta · 12 slides · 0 overflow en 7 viewports"
last_verified: 2026-06-20
ttl_dias: 14
---

# landing-encuesta — deck de resultados de la encuesta comunitaria

Landing tipo presentación 16:9 con los resultados de la encuesta a la comunidad
católica de Pilar del Este (26 respuestas, junio 2026), para mostrar a los vecinos
en una reunión presencial.

**Estado (2026-06-20):** terminado y en producción → https://pde.kolbelabs.com/encuesta

- **Archivo:** `pde/site/encuesta.html` (un solo HTML estático, sin dependencias;
  hereda paleta y dark/light del sitio PdE). `pde/site/vercel.json` agrega
  `cleanUrls` para servir la ruta `/encuesta`.
- **12 slides:** portada → quiénes respondieron → perfil → interés (100% se sumaría)
  → formato → cuándo (heatmap + guardería) → panorama temático → top por categoría
  → ranking general → cómo participar → voces → cierre.
- **Navegación:** scroll-snap + flechas/teclado + rail lateral + barra de progreso.
- **Datos:** procesados con `Downloads/encuesta-pde/conteo.py` (auxiliar, fuera del
  repo) desde el Google Form de respuestas. Sin PII de contacto; testimonios con
  nombre de pila (decisión aprobada por Esteban).

**Prueba de hecho:** `file` sobre `encuesta-resultados.json` (snapshot de la
verificación con Playwright: deploy OK, 12 slides, 0 overflow en 7 resoluciones de
1920×1080 a 1280×720, claro y oscuro). Si se rehace el deck, re-correr la validación
y actualizar el JSON.
