/**
 * wa-transcriber — Transcriptor automático de audios de WhatsApp
 *
 * Escucha mensajes de audio en un grupo de WhatsApp específico,
 * los descarga, los transcribe con faster-whisper, y envía el
 * texto de vuelta al grupo.
 *
 * Uso:
 *   node index.js
 *
 * Variables de entorno (.env):
 *   WA_GROUP_NAME  — Nombre (parcial) del grupo a monitorear
 *   WHISPER_MODEL  — Modelo de Whisper (default: medium)
 *   PYTHON_PATH    — Ruta al ejecutable de Python (default: python)
 */

require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const qrcodeTerminal = require("qrcode-terminal");
const QRCode = require("qrcode");
const { execFile } = require("child_process");
const fs = require("fs");
const path = require("path");

// --- Config ---
const DATA_DIR = path.join(__dirname, "data");
const TRANSCRIBE_SCRIPT = path.join(__dirname, "transcribe.py");
const PYTHON_PATH = process.env.PYTHON_PATH || "python";
const WHISPER_MODEL = process.env.WHISPER_MODEL || "medium";
const WA_GROUP_NAME = process.env.WA_GROUP_NAME || "";
const NOTIFY_SCRIPT = "C:/Users/seoli/Desktop/cursorgit/eom/scripts/notify/notify.py";

// --- Helpers ---

function log(msg) {
  const ts = new Date().toLocaleTimeString("es-AR", { hour12: false });
  console.log(`[${ts}] ${msg}`);
}

function notify(msg) {
  execFile(PYTHON_PATH, [NOTIFY_SCRIPT, msg], (err) => {
    if (err) console.error("notify error:", err.message);
  });
}

function notifyError(errorMsg) {
  execFile(
    PYTHON_PATH,
    [
      NOTIFY_SCRIPT,
      "error",
      `wa-transcriber: ${errorMsg}`,
      "--script",
      "wa-transcriber/index.js",
      "--workspace",
      "eom",
      "--service",
      "WhatsApp",
      "--type",
      "Transcription",
      "--severity",
      "Warning",
    ],
    (err) => {
      if (err) console.error("notify error:", err.message);
    }
  );
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

/**
 * Transcribe un archivo de audio usando faster-whisper via Python.
 * Devuelve el texto transcrito.
 */
function transcribeAudio(audioPath) {
  return new Promise((resolve, reject) => {
    execFile(
      PYTHON_PATH,
      [TRANSCRIBE_SCRIPT, audioPath, "--model", WHISPER_MODEL],
      { timeout: 300_000 }, // 5 min max
      (err, stdout, stderr) => {
        if (err) {
          reject(new Error(`Transcription failed: ${stderr || err.message}`));
          return;
        }
        try {
          const result = JSON.parse(stdout.trim());
          if (result.error) {
            reject(new Error(result.error));
          } else {
            resolve(result);
          }
        } catch (parseErr) {
          reject(new Error(`Invalid JSON from transcriber: ${stdout}`));
        }
      }
    );
  });
}

/**
 * Verifica si el mensaje es del grupo que queremos monitorear.
 */
function isTargetGroup(chat) {
  if (!WA_GROUP_NAME) return chat.isGroup;
  return chat.isGroup && chat.name.toLowerCase().includes(WA_GROUP_NAME.toLowerCase());
}

// --- Main ---

async function main() {
  if (!WA_GROUP_NAME) {
    log("ADVERTENCIA: WA_GROUP_NAME no definido. Se escucharán TODOS los grupos.");
    log("Definí WA_GROUP_NAME en .env para filtrar a un grupo específico.");
  }

  ensureDataDir();

  const client = new Client({
    authStrategy: new LocalAuth({ dataPath: path.join(DATA_DIR, "wwebjs-auth") }),
    puppeteer: {
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
  });

  client.on("qr", async (qr) => {
    log("Escaneá este QR con WhatsApp:");
    qrcodeTerminal.generate(qr, { small: true });
    const qrPath = path.join(DATA_DIR, "qr.png");
    await QRCode.toFile(qrPath, qr, { width: 800, margin: 4 });
    log(`QR guardado en: ${qrPath}`);
  });

  client.on("ready", () => {
    log("Conectado a WhatsApp Web");
    log(`Monitoreando grupo: ${WA_GROUP_NAME || "(todos)"}`);
    notify("wa-transcriber conectado a WhatsApp Web");
  });

  client.on("auth_failure", (msg) => {
    log(`Error de autenticación: ${msg}`);
    notifyError(`Auth failure: ${msg}`);
  });

  client.on("disconnected", (reason) => {
    log(`Desconectado: ${reason}`);
    notifyError(`Desconectado: ${reason}`);
  });

  client.on("message", async (msg) => {
    try {
      const chat = await msg.getChat();

      if (!isTargetGroup(chat)) return;
      if (!msg.hasMedia) return;

      // Solo audios reenviados (forwarded), no notas de voz directas
      const isAudio = msg.type === "audio" || msg.type === "ptt";
      if (!isAudio) return;
      if (!msg.isForwarded) {
        log(`Audio directo (no reenviado) ignorado en "${chat.name}"`);
        return;
      }

      log(`Audio reenviado en "${chat.name}" de ${msg.author || msg.from}`);

      // Descargar audio
      const media = await msg.downloadMedia();
      if (!media) {
        log("No se pudo descargar el audio");
        return;
      }

      const ext = media.mimetype.includes("ogg") ? "ogg" : "mp3";
      const filename = `audio_${Date.now()}.${ext}`;
      const audioPath = path.join(DATA_DIR, filename);

      fs.writeFileSync(audioPath, Buffer.from(media.data, "base64"));
      log(`Audio guardado: ${filename}`);

      // Transcribir
      log("Transcribiendo...");
      const result = await transcribeAudio(audioPath);
      log(`Transcripción completada (${result.duration}s de audio)`);

      // Formatear y enviar
      const text = `*Transcripción del Evangelio de hoy del P. Jorge:*\n\n${result.text}`;
      await chat.sendMessage(text);
      log("Transcripción enviada al grupo");

      // Limpiar archivo de audio
      fs.unlinkSync(audioPath);
    } catch (err) {
      log(`Error procesando mensaje: ${err.message}`);
      notifyError(err.message);
    }
  });

  log("Iniciando cliente WhatsApp Web...");
  await client.initialize();
}

main().catch((err) => {
  log(`Error fatal: ${err.message}`);
  notifyError(`Fatal: ${err.message}`);
  process.exit(1);
});
