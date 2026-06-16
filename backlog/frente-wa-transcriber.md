---
id: wa-transcriber
frente: "wa-transcriber — transcripción del Evangelio diario"
workspace: pde
prueba:
  tipo: manual
  estado: pending
last_verified: 2026-06-01
ttl_dias: 14
---

# wa-transcriber — transcripción del Evangelio diario

**Estado al migrar (2026-06-01):** bloqueado — sesión WA expirable, pivot pendiente

**Update 2026-06-12:** el pivot quedó definido — el desbloqueo de este frente
queda supeditado al frente [[wa-funnel]] (workspace eom): embudo de WhatsApp
personal con Baileys (sin navegador, sesión persistente) que reemplaza a
whatsapp-web.js. Cuando wa-funnel esté operativo, este transcriptor pasa a ser
un consumidor más (regla sobre el grupo "Comunidad PDE" que reusa el
`transcribe.py` de este proyecto). No retomar este frente por separado.

Migrado del sistema de handoffs viejo. Detalle completo en el handoff original:
`pde/backlog/handoff-wa-transcriber-2026-05-04.md`

**Prueba de hecho:** `manual/pending` — sin verificación automatizable todavía.
Promover a invariante (`file`/`git`) cuando se identifique un artefacto medible
(log, JSON, commit). Mientras tanto se re-verifica a mano; si pasan 14 días (ttl)
sin re-verificar, el tablero lo marca `unknown` (ruidoso, no falso-verde).
