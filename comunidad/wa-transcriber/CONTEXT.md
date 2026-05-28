# wa-transcriber — Transcripcion del Evangelio

Transcriptor automatico del audio del evangelio diario que C. Cacho Pilar reenvía al grupo "Comunidad PDE" de WhatsApp. Accion de apostolado: hacer accesible la reflexion diaria en formato texto.

## Stack

- **Node.js** + `whatsapp-web.js` — conexion a WhatsApp Web, lectura y envio de mensajes
- **Python** + `faster-whisper` — transcripcion local con modelo Whisper (CPU, int8)
- **notify.py** (eom/) — notificaciones de error a Telegram
- **Task Scheduler de Windows** — ejecucion diaria a las 9, 10 y 11 AM

## Archivos

| Archivo | Que hace |
|---------|----------|
| `scheduled-transcribe.js` | Script principal. Busca audio de hoy, transcribe, envia al grupo. Corre via Task Scheduler |
| `index.js` | Listener en tiempo real (backup/alternativa al scheduler) |
| `transcribe.py` | Wrapper de faster-whisper. Recibe path de audio, devuelve JSON con texto |
| `.env` | Config: nombre del grupo, modelo Whisper |
| `data/` | Sesion de WA Web (auth), state de ultima transcripcion |

## Flujo diario

1. Task Scheduler ejecuta `scheduled-transcribe.js` a las 9:00
2. Se conecta a WA Web (sesion persistida en data/)
3. Busca el ultimo audio **reenviado** de hoy en "Comunidad PDE"
4. Si no hay audio o ya transcribio hoy → sale sin hacer nada
5. Descarga audio → transcribe con Whisper → envia texto al grupo
6. Marca como transcrito (no repite a las 10 ni 11)
7. Si la sesion WA expiro → notifica por Telegram para re-escanear QR

## Re-autenticacion (cuando expira la sesion)

```bash
cd pde/comunidad/wa-transcriber
node index.js
# Escanear QR con WhatsApp → Ctrl+C cuando diga "Conectado"
```

## Tabla Load/Skip

| Tarea | Cargar | NO cargar |
|-------|--------|-----------|
| Mantener/debuggear el script | Este CONTEXT.md, BITACORA.md | research/, site/ |
| Re-autenticar sesion WA | Solo este CONTEXT.md (seccion re-auth) | Todo lo demas |

## Que NO hacer

- No commitear `data/` — contiene sesion de WA Web (credenciales)
- No commitear `.env`
- El formato del mensaje ("Transcripcion del Evangelio de hoy del P. Jorge:") fue aprobado por Esteban — no cambiar sin consultar
