# Research — Relevamiento de iglesias

Workspace de investigacion y relevamiento de todas las iglesias, parroquias, capillas, monasterios y santuarios catolicos del partido de Pilar.

Historial de decisiones y cambios: ver `../BITACORA.md`

## Proceso

1. Leer `referencia-zona.md` antes de cualquier busqueda (evita confusiones geograficas)
2. Usar `TEMPLATE-IGLESIA.md` para cada ficha nueva
3. Buscar en: web oficial de la iglesia, redes sociales, horariodemisas.com.ar, obispadodezaratecampana.org, Google Maps
4. Marcar nivel de confianza en cada dato
5. Al terminar una ficha, actualizar `fuentes.md`

## Tabla Load/Skip

| Tarea | Cargar | NO cargar |
|-------|--------|-----------|
| Relevar una iglesia | referencia-zona.md, TEMPLATE-IGLESIA.md | Otras fichas de iglesias (salvo referencia cruzada) |
| Verificar datos | La ficha especifica + fuentes.md | Resto |
| Agregar iglesia nueva | referencia-zona.md, TEMPLATE-IGLESIA.md, listado en CLAUDE.md | Resto |

## Prioridad de campos

**P1 (landing page):** nombre, tipo, direccion, coordenadas GPS, horarios de misa, confesion, telefono/WhatsApp, web/redes
**P2 (ficha completa):** sacramentos, parroco, capillas dependientes, vida parroquial
**P3 (enriquecimiento):** infraestructura, historia detallada, fotos, Google place_id

## Que NO hacer

- No usar datos de la Basilica del Pilar de Recoleta (CABA) — es otra parroquia
- No asumir horarios sin fuente — marcar `[PENDIENTE]`
- No mezclar datos de distintas iglesias en un mismo archivo
