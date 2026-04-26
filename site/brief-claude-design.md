# Brief: Landing Page — Comunidad Católica Pilar del Este

Spec completo para prototipar una landing page funcional. Incluye estructura, diseño, componentes, comportamiento y datos reales de 19 iglesias católicas del Partido de Pilar (Buenos Aires, Argentina).

---

## 1. Objetivo y audiencia

### Qué es
Directorio funcional de las iglesias católicas del Partido de Pilar. No es un blog, no es una app — es una herramienta de consulta rápida. El usuario debe poder saber en 10 segundos dónde hay misa hoy y cómo llegar.

### Audiencia
- **Primaria:** Vecinos de Pilar del Este y alrededores que buscan horarios de misa, sacramentos o contacto de su parroquia.
- **Secundaria:** Visitantes o personas que buscan un sacramento específico (bautismo, matrimonio, confesión).

### Tono
Sobrio, comunitario, respetuoso. Sin ornamentos innecesarios. La información es la protagonista.

### Nombre del sitio
**Comunidad Católica Pilar del Este**

### Identidad visual
Escudo de la Diócesis de Zárate-Campana como referencia visual (se puede obtener de obispadodezaratecampana.org). Sin logo propio por ahora.

---

## 2. Estructura / Layout

La página NO tiene hero grande. Arranca directamente con contenido útil. Orden de secciones de arriba a abajo:

### 2a. Hello Bar (franja superior fija)

- Franja fija en el top, 40-48px de alto, z-index máximo
- Fondo: color primario (violeta)
- Contenido centrado: texto + botón
- Texto sugerido: "Unite a la comunidad católica de Pilar del Este"
- Botón verde WhatsApp: "Sumate al grupo" con ícono WA
- Link del botón: `https://chat.whatsapp.com/LPnnK5KIRbq4RWM6muCFbS`
- Botón de cierre (×) a la derecha — al cerrar, se guarda en localStorage y no se muestra de nuevo
- En mobile: texto más corto, "Unite al grupo WA" + botón

### 2b. Header compacto

- Una sola línea o dos líneas máximo
- Izquierda: escudo de la diócesis (imagen pequeña, ~32px) + nombre "Comunidad Católica Pilar del Este" en tipografía serif
- Derecha: toggle de modo claro/oscuro (ícono sol/luna)
- Sin navegación, sin menú hamburguesa — es una sola página
- Fondo: color de superficie. Borde inferior sutil.

### 2c. Card destacada — "Nuestra misa en Pilar del Este"

Card especial que aparece antes del listado general. Diseño diferenciado: borde izquierdo grueso en color primario, fondo ligeramente distinto al resto. Comunica que esta es LA misa de la comunidad.

Contenido:
- Ícono de cruz o iglesia + título: "Nuestra misa en Pilar del Este"
- Nombre: Misa en Saint Mary of the Hills
- Subtítulo sugerido: "En el SUM del colegio Saint Mary of the Hills"
- Horario: Domingos 11:00 hs
- Ubicación: Ruta 25 y Caamaño, Panamericana Ramal Pilar km 46.5, Pilar del Este
- Botón: "Cómo llegar" (link a Google Maps con coordenadas -34.485060, -58.588440)
- Copy sugerido debajo: "La misa más cerca de casa. Vení a conocernos y ser parte de la comunidad."
- Íconos de redes del colegio: IG (@stmaryofthehillsschool), FB, YouTube — con nota "Colegio Saint Mary"
- Nota: los datos de contacto y redes corresponden al colegio; los de la misa/comunidad se completarán después

### 2d. Mapa de la zona

- Ancho completo, altura ~350px desktop / ~220px mobile
- Versión 1: imagen estática con pines marcados. Los pines usan 3 colores según zona (primaria, secundaria, extendida) + un pin especial para Saint Mary.
- Leyenda visual debajo del mapa:
  - Violeta: Zona Primaria (La Lonja, Zelaya, Villa Rosa)
  - Azul: Zona Secundaria (Pilar Centro y alrededores)
  - Verde: Zona Extendida (Del Viso, Manzanares, Derqui, Manuel Alberti, Lagomarsino)
  - Dorado: Misa de la comunidad (Saint Mary)
- Wrapper `<div id="map">` preparado para reemplazar la imagen con Google Maps API en una versión futura

### 2e. Selector de iglesias + Panel de detalle

Esta es la sección central del sitio.

**Filtro de zona** (arriba de la lista):
- 4 botones tipo pill: [Todas] [Zona Primaria] [Zona Secundaria] [Zona Extendida]
- Seleccionado: fondo de color de zona, texto blanco
- No seleccionado: borde 1px solid, texto del color de zona

**Layout desktop (>1024px):** 2 columnas
- Columna izquierda (~35%): lista vertical de iglesias agrupadas por zona
- Columna derecha (~65%): panel de detalle de la iglesia seleccionada

**Layout mobile (<640px):** columna única
- Filtros de zona en scroll horizontal
- Lista de iglesias full width
- Al tocar una iglesia: smooth scroll a un panel de detalle que aparece debajo de la lista (o accordion inline)

**Cada ítem de la lista muestra:**
- Nombre de la iglesia (bold)
- Tipo debajo en texto pequeño gris (parroquia / capilla / santuario / monasterio / centro de retiros)
- Localidad alineada a la derecha
- Íconos de redes sociales a la derecha del nombre: solo los que tiene esa iglesia (WA, IG, FB, Web) — íconos SVG de 16px, grises por defecto, toman color brand al hover. Los que no tiene no se muestran.
- Badge de zona (chip pequeño con color)
- Estado seleccionado: fondo acento + borde izquierdo de color de zona

**El panel de detalle muestra (en este orden de prioridad):**

1. **Nombre completo + tipo + localidad** (header del panel)
2. **Dirección** con ícono de pin + enlace "Ver en Google Maps" si tiene coordenadas GPS
3. **Horarios de misa** — tabla día/horario. Es la información MÁS prominente, con tipografía más grande. Si no hay datos: mostrar "Horarios no disponibles — contactar directamente"
4. **Sacramentos disponibles** — confesión (con horario si lo tiene), bautismo, matrimonio. Chips o lista simple. Solo mostrar los que están confirmados.
5. **Otras actividades** — adoración eucarística, catequesis, grupos, Cáritas. Lista colapsable o badges.
6. **Contacto** — teléfono (link tel:), WhatsApp (link wa.me/), email (link mailto:), web (link externo). Solo mostrar los disponibles.
7. **Redes sociales** — IG, FB, YouTube. Íconos de 24px con link externo (target="_blank").
8. **Aviso de datos incompletos** — si la iglesia tiene datos parciales, mostrar un badge amarillo sutil: "Algunos datos pendientes de verificación"

### 2f. Footer

Mínimo. Contenido:
- "Partido de Pilar · Diócesis de Zárate-Campana"
- Link al grupo de WhatsApp (repetido del hello bar)
- "Datos recolectados en abril 2026 · Para correcciones escribí al grupo"
- Sin nav, sin links innecesarios

---

## 3. Diseño visual

### Paleta de colores — Modo claro

```
--color-primary: #5C3D8F          /* violeta eclesiástico */
--color-primary-light: #7B5EA7
--color-accent: #B5862A           /* dorado sobrio */
--color-bg: #FAF9F7               /* blanco cálido */
--color-surface: #FFFFFF          /* cards y paneles */
--color-border: #E8E4E0
--color-text: #1A1614             /* casi negro */
--color-text-secondary: #6B6460   /* gris pardo */
--color-zona-primaria: #5C3D8F    /* violeta */
--color-zona-secundaria: #2563EB  /* azul */
--color-zona-extendida: #059669   /* verde */
--color-destacado: #B5862A        /* dorado — Saint Mary */
--color-whatsapp: #25D366
--color-instagram: #E1306C
--color-facebook: #1877F2
```

### Tipografía

- **Headings:** `'Playfair Display', Georgia, serif` — solemnidad sin ser recargado
- **Body:** `'Inter', -apple-system, sans-serif` — legible, moderno, funcional
- Cargar de Google Fonts con `preconnect`: Playfair Display (400, 700) + Inter (400, 500, 600)
- Tamaños base: 16px body, 14px secondary, 12px micro-labels
- Nombre del sitio en header: 1.25rem serif
- Nombre de iglesia en lista: 1rem bold sans-serif
- Título del panel de detalle: 1.5rem serif
- Tabla de horarios: 0.95rem

### Espaciado

- Sistema de 4px: 4, 8, 12, 16, 24, 32, 48, 64
- Padding interno de cards: 24px desktop / 16px mobile
- Gap entre ítems de lista: 4px
- Border-radius: 8px cards, 4px chips/badges, 20px pills

### Sombras

```
/* Card sutil */
box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)

/* Card elevada (hover/seleccionada) */
box-shadow: 0 4px 12px rgba(0,0,0,0.12)
```

---

## 4. Modo oscuro

Toggle manual con ícono sol/luna en el header. Respeta `prefers-color-scheme` por defecto pero permite override manual. Persiste elección en localStorage.

### Overrides de variables

```
--color-primary: #9B72CF          /* violeta más claro para contraste */
--color-primary-light: #B490E0
--color-accent: #D4A03A           /* dorado más brillante */
--color-bg: #0F0E0D
--color-surface: #1C1A18
--color-border: #2E2A27
--color-text: #F2EFE9
--color-text-secondary: #9C9490
--color-zona-primaria: #9B72CF
--color-zona-secundaria: #60A5FA
--color-zona-extendida: #34D399
--color-destacado: #D4A03A
```

---

## 5. Componentes UI — Especificación detallada

### Hello Bar

```
posición: fixed top 0, width 100%, z-index 1000
height: 44px
background: var(--color-primary)
display: flex, justify-content: center, align-items: center, gap: 12px
texto: color white, font-size 14px, font-family Inter
botón WA: background #25D366, color white, padding 6px 14px, border-radius 20px,
          font-size 13px, font-weight 600, ícono WA SVG 16px inline
botón ×: position absolute right 12px, color rgba(255,255,255,0.7), font-size 18px, cursor pointer
```

### Header compacto

```
height: ~56px
padding: 0 24px (16px mobile)
display: flex, justify-content: space-between, align-items: center
border-bottom: 1px solid var(--color-border)
background: var(--color-surface)

izquierda: img escudo 32px + texto "Comunidad Católica Pilar del Este" en Playfair Display 1.1rem
derecha: botón toggle dark mode (ícono 20px, sin texto, border-radius 50%, padding 8px)
```

### Card destacada Saint Mary

```
margin: 16px auto
max-width: 720px (centrada en desktop)
padding: 20px 24px (16px mobile)
background: var(--color-surface)
border-left: 4px solid var(--color-accent)
border-radius: 8px
box-shadow: card elevada

estructura interna:
  línea 1: ícono cruz + "NUESTRA MISA EN PILAR DEL ESTE" — uppercase, letter-spacing 1px,
           font-size 11px, font-weight 600, color var(--color-accent)
  línea 2: "Misa en Saint Mary of the Hills" — Playfair Display 1.25rem, color var(--color-text)
  línea 3: "En el SUM del colegio Saint Mary of the Hills" — font-size 14px, color var(--color-text-secondary)
  línea 4: "Domingos 11:00 hs" — font-size 1.1rem, font-weight 600, color var(--color-primary)
  línea 5: "Ruta 25 y Caamaño, Pilar del Este" — font-size 14px, con ícono pin
  línea 6: botón "Cómo llegar" — outline style, border color primary, font-size 13px
  línea 7: "La misa más cerca de casa. Vení a conocernos." — font-size 13px, color var(--color-text-secondary), italic
```

### Ítem de lista de iglesias

```
padding: 12px 16px
border-left: 3px solid transparent
cursor: pointer
transition: background 150ms ease

estructura interna:
  fila 1: [nombre bold 1rem] ............. [íconos redes 16px, gap 6px]
  fila 2: [tipo gris 12px] · [localidad gris 12px] ... [badge zona]

hover: background rgba(primary, 0.06)
selected: background rgba(primary, 0.1), border-left-color: color de su zona
```

### Íconos de redes (en lista)

```
SVG inline, 16px × 16px
color por defecto: var(--color-text-secondary)
hover: toma su color brand (WA verde, IG rosa, FB azul, Web gris oscuro)
sin label de texto — solo ícono
tooltip vía atributo title
links abren en target="_blank" rel="noopener"
```

### Panel de detalle

```
padding: 24px (16px mobile)
background: var(--color-surface)
border-radius: 8px (en desktop)
overflow-y: auto

Sección "Horarios de Misa":
  título: ícono + "Horarios de Misa" — font-size 15px, font-weight 600, color primary
  tabla: 2 columnas (Día | Horarios)
    - alternating row background (sutil, 2-3% opacidad)
    - padding 8px 0 cada fila
    - border-bottom 1px dashed var(--color-border)
  si no hay datos: mensaje "Horarios no disponibles — contactar directamente" en gris

Sección "Sacramentos":
  título: "Sacramentos"
  chips horizontales con wrap: "Confesión: Dom 10:30–12:15", "Bautismo", "Matrimonio"
  chips: background rgba(primary, 0.08), color primary, padding 4px 10px, border-radius 12px, font-size 13px

Sección "Actividades":
  título: "Actividades y grupos"
  lista simple con bullets, font-size 14px
  colapsable si tiene más de 3 ítems (botón "Ver más")

Sección "Contacto":
  lista compacta vertical, cada línea: ícono 16px + dato con link activo
  teléfono: link tel:, WhatsApp: link wa.me/, email: link mailto:, web: link externo

Sección "Redes":
  íconos 24px, layout horizontal, gap 12px, links externos

Badge "datos incompletos":
  background: #FEF3C7 (claro) / #44371A (oscuro)
  color: #92400E (claro) / #FCD34D (oscuro)
  font-size 11px, padding 4px 8px, border-radius 4px
  texto: "Algunos datos pendientes de verificación"
```

### Filtros de zona (pills)

```
display: flex, gap: 8px, padding: 12px 0
overflow-x: auto en mobile (scroll horizontal, no wrap)

cada pill:
  padding: 6px 14px
  border-radius: 20px
  font-size 13px, font-weight 500
  cursor: pointer
  transition: all 150ms

  no seleccionado: background transparent, border 1px solid [color zona], color [color zona]
  seleccionado: background [color zona], color white, border transparent
  "Todas": usa color primary
```

---

## 6. Comportamiento interactivo

### Selección de iglesia
- Click/tap en un ítem de la lista activa el estado `selected` (borde + fondo)
- El panel de detalle hace transición de fade-in (opacity 0→1, 150ms) con los datos de esa iglesia
- En mobile: smooth scroll automático al panel de detalle

### Estado inicial
- Al cargar la página, la primera iglesia de la zona primaria está preseleccionada (Santuario Ntra. Sra. del Cielo)
- El panel muestra sus datos

### Filtro de zona
- Al seleccionar una zona, la lista se filtra mostrando solo esas iglesias
- La primera iglesia de la zona filtrada queda seleccionada automáticamente
- "Todas" muestra las 18 iglesias agrupadas por zona con separadores visuales

### Hello bar
- Click en × → `display: none` + `localStorage.setItem('pde-hellobar', 'closed')`
- Al cargar: si el item existe en localStorage, no mostrar el banner
- El body tiene padding-top dinámico según si el banner está visible

### Toggle dark/light
- Click → toggle clase `dark` en `<html>` + `localStorage.setItem('pde-theme', 'dark'|'light')`
- Al cargar: leer localStorage; si no hay preferencia, respetar `prefers-color-scheme`

### Links externos
- Todos los links de redes, web, Google Maps: `target="_blank" rel="noopener"`
- Links de teléfono: `tel:+54...`
- Links de WhatsApp: `https://wa.me/54...`

### Interacciones sutiles
- Hover en lista: fondo sutil (solo desktop, no en mobile)
- Transición del panel: solo fade, nada decorativo
- Sin animaciones de entrada al cargar la página
- Sin librerías de animación

---

## 7. Responsive — Mobile first

### Mobile (<640px)
- Hello bar: texto "Unite al grupo WA" + botón compacto
- Header: escudo 24px + nombre en 1 línea (0.95rem), toggle dark mode
- Card Saint Mary: full width, padding 16px
- Mapa: height 200px
- Filtros de zona: scroll horizontal (overflow-x auto, flex nowrap)
- Lista: full width, padding compacto (10px 12px por ítem)
- Panel de detalle: full width debajo de la lista, padding 16px
- Chips de redes: 18px para mayor área táctil
- Tabla de horarios: font-size 14px
- Mínimo absoluto: funcional en 320px de ancho

### Tablet (640px–1024px)
- Lista: 40%, Panel: 60%
- Hello bar: texto completo visible
- Card Saint Mary: max-width 640px centrada

### Desktop (>1024px)
- Contenedor principal: max-width 1200px, centrado con margin auto
- Lista: 35%, Panel: 65%, gap 24px
- Hello bar: fixed top, texto completo
- Padding lateral del contenedor: 24px

---

## 8. Stack técnico

- **Un solo archivo HTML** (`index.html`). Sin frameworks. Sin npm. Sin dependencias externas excepto Google Fonts.
- **CSS:** Custom properties para theming. Todo en `<style>` dentro del HTML (o `<link>` a `style.css` en la misma carpeta). Grid y Flexbox nativos. Sin Bootstrap, sin Tailwind.
- **JS:** Vanilla, en `<script>` al final del body. Un array `IGLESIAS` con los datos. Funciones: `renderList()`, `renderDetail(id)`, `filterByZona(zona)`, `toggleTheme()`, `dismissHelloBar()`. Sin jQuery ni librerías.
- **Fuentes:** Google Fonts con preconnect en el `<head>`.
- **Íconos:** SVG inline para redes sociales (WhatsApp, Instagram, Facebook, Web/link, teléfono, email, pin de ubicación, cruz, sol, luna). No usar Font Awesome ni icon fonts.
- **Mapa:** `<img>` estática en V1 dentro de un `<div id="map">` wrapper. Preparado para reemplazar con Google Maps API en V2.
- **Accesibilidad básica:** `aria-label` en botones de íconos, `role="listbox"` en lista de iglesias, `tabindex` para navegación por teclado, contraste mínimo WCAG AA.
- **SEO básico:** meta tags (title, description, og:image), `<html lang="es">`.

---

## 9. Datos reales de las 19 iglesias

Estos son los datos para generar el prototipo con contenido real. Usar exactamente esta estructura en el JavaScript del prototipo.

```javascript
const IGLESIAS = [
  // ══════════════════════════════════════
  // ZONA PRIMARIA — La Lonja, Zelaya, Villa Rosa
  // ══════════════════════════════════════
  {
    id: "santuario-cielo",
    nombre: "Santuario Ntra. Sra. del Cielo",
    nombreCorto: "Ntra. Sra. del Cielo",
    tipo: "santuario",
    localidad: "La Lonja",
    zona: "primaria",
    direccion: "Pedro Pico 1686, esq. Los Naranjos, Los Tilos, La Lonja",
    gps: null,
    misas: [
      { dia: "Martes", horarios: ["19:00"] },
      { dia: "Miércoles (2do del mes)", horarios: ["19:00"] },
      { dia: "Jueves", horarios: ["19:00"] },
      { dia: "Viernes", horarios: ["15:00"] },
      { dia: "1er Viernes del mes", horarios: ["9:00"] },
      { dia: "Sábado vigilia", horarios: ["19:30"] },
      { dia: "Domingo", horarios: ["10:30", "12:15", "19:00"] }
    ],
    sacramentos: {
      confesion: "Jueves 18:00–19:00 · Domingos 10:30–12:15 y 18:00–19:00 · Al finalizar misa del 1er viernes",
      bautismo: true,
      primeracomunion: true,
      confirmacion: true,
      matrimonio: true
    },
    actividades: [
      "Adoración eucarística — Jueves 14:00–15:00",
      "Cenáculos de oración",
      "Visitas hospitalarias (~30 misioneros)",
      "Comedor comunitario (~100 chicos/semana)",
      "Iglesia Jubilar 2025"
    ],
    contacto: {
      tel: null,
      wa: null,
      email: null,
      web: "https://www.nuestrasenoradelcielo.net"
    },
    redes: {
      ig: "nuestrasenoradelcielo",
      fb: "https://www.facebook.com/p/Nuestra-Se%C3%B1ora-del-Cielo-100064862461485/",
      yt: null
    },
    datosCompletos: false
  },
  {
    id: "san-manuel-martir",
    nombre: "Parroquia San Manuel Mártir",
    nombreCorto: "San Manuel Mártir",
    tipo: "parroquia",
    localidad: "La Lonja",
    zona: "primaria",
    direccion: "Saraví 2494, La Lonja",
    gps: { lat: -34.4557238, lng: -58.8346538 },
    misas: [
      { dia: "Viernes", horarios: ["19:00"] },
      { dia: "Sábado vigilia", horarios: ["19:00"] },
      { dia: "Domingo", horarios: ["11:00", "19:00"] }
    ],
    sacramentos: {
      confesion: "30 min antes de cada misa · Miércoles 20:00",
      bautismo: true,
      primeracomunion: true,
      confirmacion: null,
      matrimonio: null
    },
    actividades: [
      "Adoración eucarística — Viernes",
      "Legión de María",
      "Cáritas parroquial",
      "Grupo San Pablo (juvenil)"
    ],
    contacto: {
      tel: "+54 230 447-2182",
      wa: "+5491160238609",
      email: "parroquiasanmanuel@gmail.com",
      web: null
    },
    redes: {
      ig: "psanmanuelmartir",
      fb: "https://www.facebook.com/parroquiasanmanuel",
      yt: null
    },
    datosCompletos: false
  },
  {
    id: "zelaya-lujan-jose",
    nombre: "Pquia. Ntra. Sra. de Luján y San José Obrero",
    nombreCorto: "Parroquia de Zelaya",
    tipo: "parroquia",
    localidad: "Zelaya",
    zona: "primaria",
    direccion: "Padre Carrión 609, Zelaya",
    gps: null,
    misas: [
      { dia: "Viernes", horarios: ["18:00"] },
      { dia: "Sábado", horarios: ["18:00"] },
      { dia: "Domingo", horarios: ["10:00"] }
    ],
    sacramentos: {
      confesion: "1 hora antes de cada misa: Vie 17:00, Sáb 17:00, Dom 9:00",
      bautismo: true,
      primeracomunion: null,
      confirmacion: null,
      matrimonio: null
    },
    actividades: [
      "Adoración eucarística — Viernes 15:00–18:00",
      "Imposición de manos a enfermos — 1er viernes 18:00"
    ],
    contacto: {
      tel: null,
      wa: null,
      email: null,
      web: null
    },
    redes: {
      ig: null,
      fb: "https://www.facebook.com/parroquiazelaya",
      yt: null
    },
    datosCompletos: false
  },
  {
    id: "capilla-milagro",
    nombre: "Capilla del Milagro de Ntra. Sra. de Luján",
    nombreCorto: "Capilla del Milagro",
    tipo: "capilla histórica",
    localidad: "Zelaya",
    zona: "primaria",
    direccion: "Almirante Brown y Fray José de la Quintana, Zelaya",
    gps: { lat: -34.385166, lng: -58.894325 },
    misas: [
      { dia: "1er Sábado del mes", horarios: ["10:00"] },
      { dia: "Domingo", horarios: ["10:00"] },
      { dia: "Enero–Febrero", horarios: ["Cerrada"] }
    ],
    sacramentos: {
      confesion: "Domingos 12:00–18:00",
      bautismo: null,
      primeracomunion: null,
      confirmacion: null,
      matrimonio: null
    },
    actividades: [
      "Lugar Histórico Nacional (1986)",
      "Iglesia Jubilar 2025",
      "Peregrinaciones — especialmente 8 de diciembre",
      "Vía Crucis"
    ],
    contacto: {
      tel: "+54 11 2548-3158",
      wa: null,
      email: null,
      web: null
    },
    redes: {
      ig: null,
      fb: null,
      yt: null
    },
    datosCompletos: false
  },
  {
    id: "santa-rosa-villa-rosa",
    nombre: "Parroquia Santa Rosa de Lima",
    nombreCorto: "Santa Rosa de Lima (Villa Rosa)",
    tipo: "parroquia",
    localidad: "Villa Rosa",
    zona: "primaria",
    direccion: "Sarmiento 2472, esq. Hipólito Yrigoyen, Villa Rosa",
    gps: null,
    misas: [
      { dia: "Lunes a Viernes", horarios: ["8:30"] },
      { dia: "Sábado", horarios: ["16:00 (niños)", "19:00"] },
      { dia: "Domingo", horarios: ["9:00", "18:00"] },
      { dia: "Domingo — Capilla Pilar del Este", horarios: ["10:30"] },
      { dia: "Domingo — Capilla Jardín del Sol", horarios: ["12:00"] },
      { dia: "Sábado — Capilla Mayling", horarios: ["20:00"] },
      { dia: "Domingo — Capilla Mayling", horarios: ["12:30"] }
    ],
    sacramentos: {
      confesion: "Consultar directamente",
      bautismo: true,
      primeracomunion: true,
      confirmacion: null,
      matrimonio: true
    },
    actividades: [
      "Cáritas parroquial",
      "Comedor Madre Teresa de Jesús (~70 niños)",
      "7+ capillas dependientes",
      "Colegio parroquial Santa Rosa de Lima"
    ],
    contacto: {
      tel: null,
      wa: null,
      email: "santarosa.pilar@gmail.com",
      web: "https://parroquiasantarosa-pilar.blogspot.com"
    },
    redes: {
      ig: "psantarosavr",
      fb: "https://www.facebook.com/parroquia.santarosa.52",
      yt: null
    },
    datosCompletos: false
  },

  // ══════════════════════════════════════
  // ZONA SECUNDARIA — Pilar Centro y alrededores
  // ══════════════════════════════════════
  {
    id: "ntra-sra-del-pilar",
    nombre: "Pquia. Nuestra Señora del Pilar",
    nombreCorto: "Ntra. Sra. del Pilar",
    tipo: "parroquia · Monumento Histórico Nacional",
    localidad: "Pilar Centro",
    zona: "secundaria",
    direccion: "Lorenzo López 624, Pilar Centro",
    gps: { lat: -34.4593, lng: -58.9134 },
    misas: [
      { dia: "Lunes a Sábado", horarios: ["8:00", "19:00"] },
      { dia: "Domingo", horarios: ["9:00", "11:00", "19:00", "20:30"] }
    ],
    sacramentos: {
      confesion: "Todos los días 30 min antes de cada misa · Mar–Vie 17:00–20:00 · Dom 19:00–20:00",
      bautismo: true,
      primeracomunion: null,
      confirmacion: true,
      matrimonio: true
    },
    actividades: [
      "Adoración eucarística — Jueves 9:00–20:00",
      "Camino Neocatecumenal",
      "Iglesia fundacional del partido (1856)",
      "Estilo colonial con elementos barrocos (reforma Vespignani 1921)"
    ],
    contacto: {
      tel: null,
      wa: null,
      email: null,
      web: "https://nsdelpilar.wordpress.com"
    },
    redes: {
      ig: "parroquiadelpilarzc",
      fb: "https://www.facebook.com/parroquiadelpilarzc",
      yt: "parroquiadelpilarzc"
    },
    datosCompletos: false
  },
  {
    id: "ntra-sra-gracias",
    nombre: "Pquia. Nuestra Señora de las Gracias",
    nombreCorto: "Ntra. Sra. de las Gracias",
    tipo: "parroquia",
    localidad: "Pilar Centro",
    zona: "secundaria",
    direccion: "Goleta Constitución 1771, barrio Peruzzotti, Pilar",
    gps: null,
    misas: [],
    sacramentos: {
      confesion: null,
      bautismo: null,
      primeracomunion: null,
      confirmacion: null,
      matrimonio: null
    },
    actividades: [
      "Crianza en Red (talleres familiares)"
    ],
    contacto: {
      tel: "(0230) 442-2879",
      wa: null,
      email: "delasgraciaspilar@gmail.com",
      web: null
    },
    redes: {
      ig: null,
      fb: "https://www.facebook.com/NuestraSenoraDeLasGraciasParroquia",
      yt: null
    },
    datosCompletos: false
  },
  {
    id: "monasterio-visitacion",
    nombre: "Monasterio de la Visitación de Santa María",
    nombreCorto: "Monasterio de la Visitación",
    tipo: "monasterio (clausura)",
    localidad: "Pilar Centro",
    zona: "secundaria",
    direccion: "Champagnat 1166, Pilar",
    gps: { lat: -34.4585, lng: -58.9097 },
    misas: [
      { dia: "Lunes", horarios: ["7:00"] },
      { dia: "Martes", horarios: ["17:00"] },
      { dia: "Miércoles", horarios: ["7:00"] },
      { dia: "Jueves", horarios: ["7:00"] },
      { dia: "Viernes", horarios: ["7:00"] },
      { dia: "Sábado", horarios: ["7:00"] },
      { dia: "Domingo", horarios: ["11:00"] }
    ],
    sacramentos: {
      confesion: "Consultar",
      bautismo: null,
      primeracomunion: null,
      confirmacion: null,
      matrimonio: null
    },
    actividades: [
      "Capilla pública abierta 7:00–18:00",
      "Guardia de Honor del Sagrado Corazón de Jesús",
      "Orden de la Visitación (San Francisco de Sales)"
    ],
    contacto: {
      tel: "11 4030-1090",
      wa: null,
      email: "pilarvisitacion@gmail.com",
      web: "https://visitacionpilar.netlify.app"
    },
    redes: {
      ig: null,
      fb: null,
      yt: null
    },
    datosCompletos: false
  },
  {
    id: "villa-marista",
    nombre: "Villa Marista — Centro de Retiros",
    nombreCorto: "Villa Marista",
    tipo: "centro de retiros",
    localidad: "Pilar",
    zona: "secundaria",
    direccion: "Av. Champagnat 1352, Pilar",
    gps: { lat: -34.4415055, lng: -58.924125 },
    misas: [
      { dia: "Domingo", horarios: ["11:30"] }
    ],
    sacramentos: {
      confesion: "Domingos 10:00–11:00",
      bautismo: null,
      primeracomunion: null,
      confirmacion: null,
      matrimonio: null
    },
    actividades: [
      "Retiros espirituales",
      "Convivencias diocesanas",
      "Campamentos juveniles",
      "Hermanos Maristas — capacidad 450 personas"
    ],
    contacto: {
      tel: "(0230) 442-8749",
      wa: null,
      email: null,
      web: "https://maristascruzdelsur.org/casas-de-encuentro/"
    },
    redes: {
      ig: null,
      fb: "https://www.facebook.com/groups/VillaMaristaPilar",
      yt: null
    },
    datosCompletos: false
  },
  {
    id: "la-paz-san-francisco",
    nombre: "Pquia. Ntra. Sra. de la Paz y San Francisco de Asís",
    nombreCorto: "La Paz y San Francisco",
    tipo: "parroquia (doble sede)",
    localidad: "Pilar",
    zona: "secundaria",
    direccion: "Sede 1: Ruta 8 km 56.5, Estancias del Pilar · Sede 2: Av. San Jorge 556, Pilar",
    gps: null,
    misas: [
      { dia: "Sede Paz — Mar a Vie", horarios: ["8:30"] },
      { dia: "Sede Paz — Sábado vigilia", horarios: ["19:00"] },
      { dia: "Sede Paz — Domingo", horarios: ["11:30", "19:00"] },
      { dia: "Sede S. Francisco — Jue y Vie", horarios: ["18:30"] },
      { dia: "Sede S. Francisco — Domingo", horarios: ["10:00"] }
    ],
    sacramentos: {
      confesion: "30 min antes de cada misa · Jueves durante adoración",
      bautismo: null,
      primeracomunion: null,
      confirmacion: null,
      matrimonio: null
    },
    actividades: [
      "Adoración eucarística — Jueves 19:00 (Santísimo expuesto)"
    ],
    contacto: {
      tel: "+54 (230) 444-0002",
      wa: "+5491137626178",
      email: "infopaquiadelapaz@gmail.com",
      web: "https://parroquiadelapaz.com.ar"
    },
    redes: {
      ig: null,
      fb: "https://www.facebook.com/lapazysanfra",
      yt: null
    },
    datosCompletos: false
  },
  {
    id: "schoenstatt-los-olmos",
    nombre: "Santuario Schoenstatt Los Olmos",
    nombreCorto: "Schoenstatt Los Olmos",
    tipo: "santuario",
    localidad: "Pilar (Los Olmos)",
    zona: "secundaria",
    direccion: "Raúl Alfonsín S/N, zona Los Olmos, Pilar",
    gps: null,
    misas: [
      { dia: "Lunes a Sábado", horarios: ["12:00", "19:00"] },
      { dia: "Domingo", horarios: ["11:30", "19:00"] }
    ],
    sacramentos: {
      confesion: "Martes a Viernes 18:00–18:30 · Domingos 11:00–11:30",
      bautismo: null,
      primeracomunion: null,
      confirmacion: null,
      matrimonio: null
    },
    actividades: [
      "Movimiento Schoenstatt",
      "Retiros mensuales",
      "Grupos juveniles",
      "Encuentros para matrimonios",
      "Transmisión online (IG + YouTube)",
      "Inaugurado 2021 — predio 4,4 hectáreas"
    ],
    contacto: {
      tel: null,
      wa: "+5491140505075",
      email: "federicojdumas@gmail.com",
      web: null
    },
    redes: {
      ig: "schoenstattlosolmos",
      fb: "https://www.facebook.com/Schoenstatt.Pilar.Los.Olmos",
      yt: null
    },
    datosCompletos: false
  },

  // ══════════════════════════════════════
  // ZONA EXTENDIDA — Resto del partido
  // ══════════════════════════════════════
  {
    id: "lourdes-del-viso",
    nombre: "Capilla Ntra. Sra. de Lourdes",
    nombreCorto: "Ntra. Sra. de Lourdes",
    tipo: "capilla",
    localidad: "Del Viso",
    zona: "extendida",
    direccion: "Del Viso (dirección exacta pendiente)",
    gps: null,
    misas: [],
    sacramentos: {
      confesion: null,
      bautismo: null,
      primeracomunion: null,
      confirmacion: null,
      matrimonio: null
    },
    actividades: [],
    contacto: { tel: null, wa: null, email: null, web: null },
    redes: { ig: null, fb: null, yt: null },
    datosCompletos: false
  },
  {
    id: "santa-teresita-lagomarsino",
    nombre: "Capilla Santa Teresita",
    nombreCorto: "Santa Teresita",
    tipo: "capilla",
    localidad: "Lagomarsino",
    zona: "extendida",
    direccion: "Bélice y Checoslovaquia, Lagomarsino",
    gps: null,
    misas: [
      { dia: "3er Sábado del mes", horarios: ["17:00"] }
    ],
    sacramentos: {
      confesion: null,
      bautismo: null,
      primeracomunion: null,
      confirmacion: null,
      matrimonio: null
    },
    actividades: [
      "Fiestas Patronales de Lagomarsino"
    ],
    contacto: { tel: null, wa: null, email: null, web: null },
    redes: { ig: null, fb: null, yt: null },
    datosCompletos: false
  },
  {
    id: "capilla-memorial",
    nombre: "Capilla Parque Memorial",
    nombreCorto: "Capilla Memorial",
    tipo: "capilla",
    localidad: "La Lonja (cementerio)",
    zona: "extendida",
    direccion: "Panamericana Ramal Pilar km 47, dentro de Cementerio Parque Memorial",
    gps: null,
    misas: [
      { dia: "Domingo", horarios: ["12:00 (dato 2020 — verificar)"] }
    ],
    sacramentos: {
      confesion: null,
      bautismo: null,
      primeracomunion: null,
      confirmacion: null,
      matrimonio: null
    },
    actividades: [],
    contacto: { tel: "0800-222-8743", wa: null, email: null, web: null },
    redes: { ig: null, fb: null, yt: null },
    datosCompletos: false
  },
  {
    id: "san-luis-gonzaga",
    nombre: "Parroquia San Luis Gonzaga",
    nombreCorto: "San Luis Gonzaga",
    tipo: "parroquia",
    localidad: "Manzanares",
    zona: "extendida",
    direccion: "Primer Tte. D. Manzotti 149, Manzanares",
    gps: null,
    misas: [
      { dia: "Martes (abr–sep)", horarios: ["18:00"] },
      { dia: "Miércoles (abr–sep)", horarios: ["18:00"] },
      { dia: "Viernes (abr–sep)", horarios: ["18:00"] },
      { dia: "Sábado vigilia", horarios: ["19:00 (abr–sep)", "20:00 (oct–mar)"] },
      { dia: "Domingo", horarios: ["11:00", "19:00 (abr–sep) / 20:00 (oct–mar)"] }
    ],
    sacramentos: {
      confesion: "30 min antes de cada misa",
      bautismo: true,
      primeracomunion: null,
      confirmacion: null,
      matrimonio: true
    },
    actividades: [
      "Cáritas parroquial",
      "Grupo Scout"
    ],
    contacto: {
      tel: "0230 436-3694",
      wa: null,
      email: null,
      web: "https://sanluisgonzaga.com.ar"
    },
    redes: {
      ig: "pquia.sanluisgonzaga",
      fb: null,
      yt: null
    },
    datosCompletos: false
  },
  {
    id: "san-antonio-derqui",
    nombre: "Parroquia San Antonio de Padua",
    nombreCorto: "San Antonio de Padua",
    tipo: "parroquia",
    localidad: "Presidente Derqui",
    zona: "extendida",
    direccion: "Raíces 250, Presidente Derqui",
    gps: null,
    misas: [],
    sacramentos: {
      confesion: null,
      bautismo: null,
      primeracomunion: null,
      confirmacion: null,
      matrimonio: null
    },
    actividades: [
      "9 capillas dependientes",
      "Comedor Barrio Toro (Mar y Sáb, ~160 raciones)"
    ],
    contacto: {
      tel: "+54 230 448-5603",
      wa: null,
      email: null,
      web: null
    },
    redes: {
      ig: null,
      fb: "https://www.facebook.com/sanantonioderqui",
      yt: null
    },
    datosCompletos: false
  },
  {
    id: "santa-rosa-manuel-alberti",
    nombre: "Parroquia Santa Rosa de Lima",
    nombreCorto: "Santa Rosa de Lima (Manuel Alberti)",
    tipo: "parroquia",
    localidad: "Manuel Alberti",
    zona: "extendida",
    direccion: "Santa Rita 1568, Manuel Alberti",
    gps: null,
    misas: [
      { dia: "Jueves", horarios: ["17:30"] },
      { dia: "Sábado", horarios: ["17:30"] },
      { dia: "Domingo", horarios: ["9:30"] }
    ],
    sacramentos: {
      confesion: "Consultar",
      bautismo: null,
      primeracomunion: null,
      confirmacion: null,
      matrimonio: null
    },
    actividades: [
      "Adoración eucarística — Jueves 18:00",
      "4 comedores (1300 personas/día)",
      "2 escuelas (2600+ alumnos)",
      "Hogar de Ancianos Santa Rosa de Lima"
    ],
    contacto: { tel: null, wa: null, email: null, web: null },
    redes: {
      ig: null,
      fb: "https://www.facebook.com/ParroquiaSantaRosadeLimaManuelAlberti",
      yt: null
    },
    datosCompletos: false
  },
  {
    id: "lujan-villa-morra",
    nombre: "Capilla Ntra. Sra. de Luján",
    nombreCorto: "Capilla Villa Morra",
    tipo: "capilla",
    localidad: "Villa Morra (Pilar Centro)",
    zona: "extendida",
    direccion: "Calle Libertad S/N, Barrio Villa Morra, Pilar",
    gps: null,
    misas: [
      { dia: "1 día por semana (variable)", horarios: ["17:00"] }
    ],
    sacramentos: {
      confesion: null,
      bautismo: null,
      primeracomunion: null,
      confirmacion: null,
      matrimonio: null
    },
    actividades: [
      "2da parada del Recorrido de las 7 Iglesias (Viernes Santo)"
    ],
    contacto: { tel: null, wa: null, email: null, web: null },
    redes: {
      ig: null,
      fb: "https://www.facebook.com/people/Capilla-Nuestra-Se%C3%B1ora-De-Luj%C3%A1n-Pilar/100064771626213/",
      yt: null
    },
    datosCompletos: false
  }
];

// ══════════════════════════════════════
// MISA DESTACADA — Saint Mary of the Hills
// ══════════════════════════════════════
const MISA_DESTACADA = {
  id: "saint-mary-hills",
  nombre: "Misa en Saint Mary of the Hills",
  subtitulo: "En el SUM del colegio Saint Mary of the Hills",
  localidad: "Pilar del Este",
  direccion: "Ruta 25 y Caamaño, Panamericana Ramal Pilar km 46.5, Pilar del Este",
  gps: { lat: -34.485060, lng: -58.588440 },
  horario: "Domingos 11:00 hs",
  copySugerido: "La misa más cerca de casa. Vení a conocernos y ser parte de la comunidad.",
  colegio: {
    nombre: "Saint Mary of the Hills School — Sede Pilar",
    fundacion: 2001,
    orientacion: "Católico — catequesis centrada en Jesús y la Virgen María",
    web: "https://www.stmary.edu.ar"
  },
  contacto: {
    tel: "0230-445-8181",
    wa: null,
    email: "stmary.sp@stmary.edu.ar",
    web: "https://www.stmary.edu.ar"
  },
  redes: {
    ig: "stmaryofthehillsschool",
    fb: "https://www.facebook.com/stmaryofthehillsschool",
    yt: "https://www.youtube.com/channel/UCSZdctPCHV-UhK8kzmoYDiw"
  },
  datosCompletos: false,
  nota: "Datos de la misa (contacto del celebrante, redes de la comunidad) próximamente. Los datos de contacto y redes corresponden al colegio."
};
```

---

## Notas de implementación

1. Las iglesias con `misas: []` deben mostrar "Horarios no disponibles — contactar directamente" en el panel de detalle.
2. Los campos `null` en contacto y redes NO se renderizan — no mostrar el ícono deshabilitado, directamente no mostrarlo.
3. `datosCompletos: false` activa el badge amarillo de aviso en el panel de detalle.
4. Las iglesias con `gps` disponible muestran "Ver en Google Maps" con link `https://maps.google.com/?q={lat},{lng}`. Las que no tienen GPS muestran solo la dirección en texto.
5. Hay 2 iglesias llamadas "Santa Rosa de Lima": una en Villa Rosa (zona primaria) y otra en Manuel Alberti (zona extendida). El `nombreCorto` las diferencia agregando la localidad entre paréntesis.
6. La parroquia "Ntra. Sra. de la Paz y San Francisco" tiene doble sede — el campo `misas` diferencia las sedes en el texto del día.
7. San Luis Gonzaga tiene horarios estacionales (abr-sep / oct-mar) — indicado en el texto del horario.
8. La card de Saint Mary of the Hills (`MISA_DESTACADA`) es un componente separado que se renderiza antes del listado general y no forma parte del array `IGLESIAS`.
9. El link al grupo de WhatsApp de la comunidad es: `https://chat.whatsapp.com/LPnnK5KIRbq4RWM6muCFbS`

---

## Copy sugerido (todos los textos son sugeridos, no definitivos)

| Ubicación | Texto |
|-----------|-------|
| Hello bar | "Unite a la comunidad católica de Pilar del Este" |
| Botón hello bar | "Sumate al grupo" |
| Card Saint Mary — overline | "NUESTRA MISA EN PILAR DEL ESTE" |
| Card Saint Mary — CTA | "Cómo llegar" |
| Card Saint Mary — bajada | "La misa más cerca de casa. Vení a conocernos y ser parte de la comunidad." |
| Filtro zona — todas | "Todas" |
| Filtro zona — primaria | "Zona Primaria" |
| Filtro zona — secundaria | "Zona Secundaria" |
| Filtro zona — extendida | "Zona Extendida" |
| Panel sin horarios | "Horarios no disponibles — contactar directamente" |
| Panel datos parciales | "Algunos datos pendientes de verificación" |
| Footer línea 1 | "Partido de Pilar · Diócesis de Zárate-Campana" |
| Footer línea 2 | "Datos recolectados en abril 2026 · Para correcciones escribí al grupo" |
| Footer — link WA | "Unite al grupo de WhatsApp" |
| Tab del navegador | "Iglesias de Pilar — Comunidad Católica PdE" |
| Meta description | "Horarios de misa, sacramentos y contacto de las 19 iglesias católicas del Partido de Pilar, Buenos Aires. Comunidad Católica Pilar del Este." |
