# Handoff: wa-transcriber — Transcripcion automatica del Evangelio

Fecha: 2026-05-04
Sesion origen: conversacion donde se creo el proyecto desde cero

---

## Que es

Un sistema para transcribir automaticamente un audio del evangelio que llega todos los dias a un grupo de WhatsApp ("Comunidad PDE") y enviar la transcripcion como texto al mismo grupo.

El audio lo reenvía siempre la misma persona (C. Cacho Pilar) cada mañana. Es un audio de ~3 minutos en español con la reflexion del evangelio del dia del P. Jorge.

## Objetivo

Que el grupo reciba automaticamente la transcripcion en texto con el formato:

```
*Transcripcion del Evangelio de hoy del P. Jorge:*

[texto transcrito]
```

## Donde vive

```
pde/comunidad/wa-transcriber/
├── scheduled-transcribe.js   ← Script principal (pensado para Task Scheduler)
├── index.js                  ← Listener en tiempo real (alternativa)
├── transcribe.py             ← Wrapper de faster-whisper
├── .env                      ← Config (grupo, modelo Whisper)
├── .gitignore
├── package.json              ← Deps: whatsapp-web.js, qrcode, dotenv
├── data/                     ← Sesion WA Web + state (gitignored)
│   ├── wwebjs-auth/          ← Sesion de WhatsApp Web (Puppeteer/Chromium)
│   └── last-transcription.json ← State de idempotencia
├── CONTEXT.md
├── BITACORA.md
└── HANDOFF.md                ← Este archivo
```

## Como funciona la transcripcion (lo que SI funciona bien)

La parte de transcripcion esta validada y funciona correctamente:

1. **Descarga del audio**: whatsapp-web.js descarga el archivo .ogg del mensaje de audio
2. **Transcripcion local**: `transcribe.py` usa `faster-whisper` (modelo `medium`, CPU, int8 quantization)
   - Libreria: `faster-whisper` 1.2.1 (wrapper optimizado de Whisper de OpenAI)
   - Idioma forzado: español (`language="es"`)
   - VAD filter activado para ignorar silencios
   - Devuelve JSON por stdout: `{"text": "...", "language": "es", "language_probability": 1.0, "duration": 235.6}`
3. **Tiempo de procesamiento**: ~45-90 segundos para un audio de 3 minutos en CPU
4. **Calidad**: validada por Esteban el 30/4 con un audio real. Transcripcion precisa.

### Dependencias instaladas

- **Node.js** v24.13.0 + npm 11.6.2 (ya estaban)
- **Python** 3.11.9 + `faster-whisper` 1.2.1 (instalado en esta sesion)
- **ffmpeg** 8.1 (ya estaba)
- **npm packages**: `whatsapp-web.js` 1.34.7, `qrcode` 1.5.4, `qrcode-terminal` 0.12.0, `dotenv` 17.4.2
- **Sin GPU**: corre en CPU con quantizacion int8

## Que NO funciona: el delivery automatico

### Problema central: sesion de WhatsApp Web

El sistema usa `whatsapp-web.js` que crea una sesion de WhatsApp Web separada (como abrir web.whatsapp.com en un navegador). Esta sesion:

- Requiere escanear un QR fisicamente para autenticarse
- **Expira en dias** (en nuestro caso, expiro entre el 30/4 y el 1/5, menos de 24 horas)
- Cuando expira, el script falla silenciosamente con exit code 1
- No hay forma de re-autenticar sin intervencion humana (otro QR)

### Historial de intentos

| Dia | Que paso |
|-----|----------|
| 30/4 (jueves) | Sesion autenticada. Transcripcion manual funciono y se envio al grupo. Tasks de Task Scheduler creadas despues de las 11 AM (no podian correr ese dia) |
| 1-3/5 | Tasks probablemente corrieron pero fallaron porque la sesion ya habia expirado. No hay logs (Task Scheduler Operational log estaba deshabilitado) |
| 4/5 | Confirmado: las 3 tasks corrieron y fallaron con exit code 1. Error: "Sesion expirada" |

### Envio de mensajes al grupo

Cuando la sesion esta activa, el envio funciona pero con particularidades:

- `client.sendMessage(chatId, text)` es el metodo que funciono para "Comunidad PDE" (confirmado)
- `chat.sendMessage(text)` funciono para "Seocamp" pero no se confirmo para Comunidad PDE
- Los mensajes tienen un **delay de ~20 minutos** por ser de dispositivo vinculado
- "Seocamp" es el grupo de testing de Esteban (grupo consigo mismo)

### Filtro de audios

El script solo procesa audios que cumplan TODAS estas condiciones:
- Estan en el grupo "Comunidad PDE"
- Son de tipo `audio` o `ptt` (push-to-talk)
- Son **reenviados** (`msg.isForwarded === true`) — ignora notas de voz directas

### Idempotencia

`last-transcription.json` guarda la fecha de la ultima transcripcion. Si ya transcribio hoy, sale sin hacer nada. Las corridas de las 10 y 11 son backup por si el audio llega despues de las 9.

## Task Scheduler

3 tareas programadas en Windows Task Scheduler:
- `wa-transcriber-09` → 09:00 diario
- `wa-transcriber-10` → 10:00 diario
- `wa-transcriber-11` → 11:00 diario

Problemas conocidos:
- Modo "Solo interactivo" (requiere usuario logueado)
- `StartWhenAvailable=False` (si pierde el slot, no reintenta)
- Log operacional de Task Scheduler estaba deshabilitado

## Idea pendiente de Esteban

Esteban sugirio usar la app de WhatsApp que ya tiene corriendo en su desktop (siempre abierta) en lugar de mantener una sesion separada de whatsapp-web.js. Esto eliminaria el problema de la sesion que expira.

Posible implementacion: usar Playwright MCP o desktop automation para interactuar con WhatsApp Web/Desktop que ya esta autenticado. La sesion no expira porque es la del usuario.

## Notificaciones

Los scripts usan `notify.py` (Telegram) para reportar errores:
- Ruta: `C:/Users/seoli/Desktop/cursorgit/eom/scripts/notify/notify.py`
- Referencia: `eom/scripts/notify/CONTEXT.md`

## Para retomar

1. **Decidir mecanismo de delivery**: ¿whatsapp-web.js con re-auth periodico, o automatizar sobre la app de WA existente?
2. Si se sigue con whatsapp-web.js: re-escanear QR (`cd pde/comunidad/wa-transcriber && node index.js`), agregar health check, habilitar logs de Task Scheduler
3. Si se cambia de approach: la parte de transcripcion (`transcribe.py` + `faster-whisper`) es reutilizable independientemente del mecanismo de delivery
4. **Testing siempre en "Seocamp"** antes de enviar a "Comunidad PDE"
