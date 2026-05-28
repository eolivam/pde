# Handoff: wa-transcriber (transcripcion automatica del Evangelio)

**Fecha**: 2026-05-04 13:30
**Workspace**: pde
**Estado general**: bloqueado — pivot pendiente

## Contexto

Sistema para transcribir automaticamente un audio del Evangelio (~3 min) que C. Cacho Pilar reenvia diariamente al grupo de WhatsApp "Comunidad PDE" del P. Jorge, y enviar la transcripcion como texto al mismo grupo. Es una accion de apostolado: hacer accesible la reflexion diaria.

La parte de **transcripcion** funciona perfecto (validada por Esteban con un audio real). La parte de **delivery automatico** se rompe porque la sesion de WhatsApp Web expira en horas/dias y no hay forma de re-autenticar sin escanear QR fisicamente.

## Decisiones tomadas

1. **Stack: whatsapp-web.js + faster-whisper local en CPU**: Razon: gratis, all-local, sin API keys, modelo `medium` con int8 da calidad validada en ~45-90s para audio de 3 min. Trade-off conocido: whatsapp-web.js es contra ToS de WA y la sesion es fragil.

2. **Mover de eom/scripts/ a pde/comunidad/wa-transcriber/**: Razon: el proyecto es de apostolado de la comunidad, no es infra personal de Esteban. FA (folder architecture) actualizada en `pde/CLAUDE.md` y `pde/comunidad/CONTEXT.md`.

3. **Filtro: solo audios reenviados (`msg.isForwarded === true`)**: Razon: ignorar notas de voz directas de otros miembros. Cacho siempre reenvia.

4. **Envio con `client.sendMessage(chatId, text)` y NO `chat.sendMessage()`**: Razon: el primero fue el unico metodo confirmado funcional en el grupo Comunidad PDE. Los mensajes tienen delay de ~20 min por sync de dispositivo vinculado.

5. **Testing siempre en grupo "Seocamp"** antes de enviar a Comunidad PDE: Razon: instruccion explicita de Esteban. Seocamp es el grupo de testing personal.

6. **Task Scheduler ELIMINADO en esta sesion**: Razon: las 3 tasks (9, 10, 11 AM) abrian Chromium headless cada mañana, fallaban porque la sesion estaba expirada, y generaban "ventanas fantasma" que molestaban a Esteban. Sin solucion al problema de sesion, las tasks solo ensucian.

## Estado actual

- [x] Pipeline de transcripcion validado (faster-whisper, modelo medium, español)
- [x] Conexion a WA Web via QR funciona
- [x] Lectura de audios reenviados del grupo funciona
- [x] Envio de mensajes al grupo funciona (con delay de ~20 min)
- [x] Idempotencia diaria (last-transcription.json)
- [x] Notificaciones a Telegram via notify.py
- [x] FA actualizada en pde/
- [x] HANDOFF.md interno del proyecto creado en pde/comunidad/wa-transcriber/HANDOFF.md
- [ ] **BLOQUEADO**: la sesion de WA Web expira → ningun dia desde el 30/4 corrio exitosamente
- [ ] Task Scheduler eliminado, no hay scheduling activo

## Archivos clave

- `pde/comunidad/wa-transcriber/scheduled-transcribe.js` — Script principal pensado para Task Scheduler
- `pde/comunidad/wa-transcriber/index.js` — Listener en tiempo real, sirve para re-autenticar (QR)
- `pde/comunidad/wa-transcriber/transcribe.py` — Wrapper de faster-whisper. Devuelve JSON con texto. **Reutilizable** independiente del mecanismo de delivery.
- `pde/comunidad/wa-transcriber/HANDOFF.md` — Documentacion interna del proyecto (mas detalle que este handoff)
- `pde/comunidad/wa-transcriber/.env` — Config: WA_GROUP_NAME, WA_TARGET_GROUP, WHISPER_MODEL
- `pde/comunidad/wa-transcriber/data/wwebjs-auth/` — Sesion de WA Web (gitignored, expirada al 4/5)
- `pde/CLAUDE.md` — Routing actualizado con la fila de wa-transcriber
- `pde/comunidad/CONTEXT.md` — Estructura actualizada

## Proximos pasos

1. **Decision pendiente de Esteban**: ¿seguir con whatsapp-web.js (sesion separada) o pivotear a usar la app de WhatsApp que ya tiene corriendo en su escritorio? Esteban sugirio lo segundo. Implementacion posible: Playwright MCP automatizando Web.WhatsApp en el navegador del usuario, o desktop automation sobre la app de WA Desktop. Esto eliminaria el problema de la sesion que expira.

2. Si continua con whatsapp-web.js:
   - Re-escanear QR (`cd pde/comunidad/wa-transcriber && node index.js`)
   - Recrear las 3 tasks de Task Scheduler con `StartWhenAvailable=True`
   - Habilitar Task Scheduler Operational log: `wevtutil sl Microsoft-Windows-TaskScheduler/Operational /e:true`
   - Agregar health check diario (cuarta task) que solo verifique sesion viva y notifique por Telegram si expira
   - Cambiar `LogonType` de `InteractiveToken` a `S4U` para que corra con sesion bloqueada (requiere admin)

3. Si pivotea a app de WA existente: discutir approach (Playwright vs computer use), redisenar el script aprovechando que la sesion del usuario es persistente.

## Contexto no obvio

- **Audit del fallo dia-por-dia ya hecho**: Las tasks que existian del 30/4 al 4/5 fueron borradas y recreadas el 4/5 a las 11:36 en esta sesion (perdiendo historial). Hoy 4/5 las 3 tasks corrieron y fallaron con exit code 1 — confirmado por test manual: `ERROR: Sesion expirada`. Para 1-3/5 no hay logs (TaskScheduler Operational log estaba deshabilitado). Esteban confirmo que la PC nunca se reinicio.

- **Las "ventanas fantasma"** que veia Esteban era exactamente eso: el Chromium headless de Puppeteer abriendose y cerrandose al fallar. Eliminamos las 3 tasks. Hay otras tasks no relacionadas que tambien podrian generar ventanas: `\SoftLanding\*` (sospechoso de adware/bloatware preinstalado, no creado por nosotros) — no tocadas.

- **whatsapp-web.js es contra ToS de WhatsApp**. Para uso personal/bajo volumen el riesgo es bajo, pero existe. Solucion alternativa con la app de WA que ya esta autenticada por el usuario seria mas robusta y menos riesgosa.

- **Errores cometidos en la sesion** (para no repetir):
  - Inicialmente afirme que el sistema "estaba listo para correr hoy" sin haber validado que las tasks corrieran exitosamente ningun dia. Solo despues de presionar Esteban se hizo el audit.
  - `taskkill //F //IM chrome.exe` mata TODOS los Chrome incluido el del usuario. No usar — puppeteer tiene su propio Chromium en `~/.cache/puppeteer/`.
  - Multiples conexiones/desconexiones rapidas durante el setup pueden corromper la sesion de WA Web.

- **El plan archivado en `~/.claude/plans/humble-gathering-canyon.md`** tiene el ultimo plan de fix discutido (no ejecutado, bloqueado por la decision de approach).
