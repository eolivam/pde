# PdE — Comunidad Catolica Pilar del Este

Proyecto que nuclea informacion, publicacion y organizacion de la comunidad catolica en la zona de Pilar del Este (partido de Pilar, Buenos Aires). Incluye todas las iglesias, parroquias, capillas, monasterios y santuarios catolicos del partido.

## Estructura

```
pde/
├── research/       ← Relevamiento e investigacion
│   ├── iglesias/   ← 1 archivo por iglesia (template estandar)
│   └── referencia-zona.md ← Geografia y contexto de la zona
├── site/           ← Landing page / sitio web
└── comunidad/      ← Acciones, eventos, organizacion comunitaria
```

## Routing

| Tarea | Ir a | Leer |
|-------|------|------|
| Investigar/relevar iglesias | research/ | CONTEXT.md, referencia-zona.md |
| Publicar landing o sitio | site/ | CONTEXT.md |
| Organizar acciones comunitarias | comunidad/ | CONTEXT.md |

## Naming

- Iglesias: `[localidad]-[nombre-corto].md` (ej: `zelaya-ntra-sra-lujan.md`)
- Localidades en kebab-case: `la-lonja`, `pilar-centro`, `villa-rosa`, `zelaya`
- Template: `research/TEMPLATE-IGLESIA.md`

## Reglas

- Solo congregaciones catolicas
- Diocesis: Zarate-Campana (NO Buenos Aires, NO San Isidro)
- NO confundir con Basilica del Pilar de Recoleta (CABA)
- Datos con fuente inline y nivel de confianza (`[verificado]` / `[fuente secundaria]` / `[PENDIENTE]`)
