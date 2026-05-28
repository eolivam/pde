# Bitacora — wa-transcriber

## 2026-04-30 | Creacion inicial
- Setup completo: Node.js (whatsapp-web.js) + Python (faster-whisper)
- Flujo: detectar audio en grupo WA → descargar → transcribir localmente → enviar texto
- Modelo Whisper: medium, CPU con int8 quantization
- Integracion con notify.py para errores

## 2026-04-30 | Primera conexion y validacion
- QR escaneado exitosamente, sesion WA Web activa
- Transcripcion de audio de prueba (C. Cacho Pilar, 235s) validada por Esteban
- Envio a grupo Comunidad PDE funciona (con delay ~20 min por sync de dispositivo vinculado)
- Metodo de envio: `client.sendMessage()` (confirmado funcional en ambos grupos)
- Filtro: solo audios reenviados (forwarded), ignora notas de voz directas
- Formato: "*Transcripcion del Evangelio de hoy del P. Jorge:*" + texto
- 3 tareas en Task Scheduler: 09:00, 10:00, 11:00 diarias
- Control de idempotencia: no repite si ya transcribio hoy (last-transcription.json)

## 2026-04-30 | Movido a pde/comunidad/
- Movido de eom/scripts/wa-transcriber/ a pde/comunidad/wa-transcriber/
- Task Scheduler actualizado con nuevas rutas
- Routing actualizado en pde/CLAUDE.md y pde/comunidad/CONTEXT.md
