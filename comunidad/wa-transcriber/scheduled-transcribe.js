/**
 * scheduled-transcribe.js — Corre vía Task Scheduler.
 * Busca el último audio reenviado en "Comunidad PDE" del día de hoy,
 * lo transcribe, y envía el texto. Si ya transcribió hoy, no repite.
 */

require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const { Client, LocalAuth } = require("whatsapp-web.js");
const { execFile } = require("child_process");
const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "data");
const TRANSCRIBE_SCRIPT = path.join(__dirname, "transcribe.py");
const PYTHON_PATH = process.env.PYTHON_PATH || "python";
const WHISPER_MODEL = process.env.WHISPER_MODEL || "medium";
const NOTIFY_SCRIPT = "C:/Users/seoli/Desktop/cursorgit/eom/scripts/notify/notify.py";
const STATE_FILE = path.join(DATA_DIR, "last-transcription.json");

// Grupo donde llega el audio
const SOURCE_GROUP = process.env.WA_GROUP_NAME || "Comunidad PDE";
// Grupo donde enviar la transcripción (vacío = mismo grupo fuente)
const TARGET_GROUP = process.env.WA_TARGET_GROUP || "Seocamp";

function log(msg) {
  const ts = new Date().toLocaleTimeString("es-AR", { hour12: false });
  console.log(`[${ts}] ${msg}`);
}

function notify(msg) {
  execFile(PYTHON_PATH, [NOTIFY_SCRIPT, msg], (err) => {
    if (err) console.error("notify error:", err.message);
  });
}

function notifyDone(msg) {
  execFile(PYTHON_PATH, [NOTIFY_SCRIPT, "done", msg], (err) => {
    if (err) console.error("notify error:", err.message);
  });
}

function notifyError(errorMsg) {
  execFile(
    PYTHON_PATH,
    [
      NOTIFY_SCRIPT, "error", `wa-transcriber: ${errorMsg}`,
      "--script", "scheduled-transcribe.js",
      "--workspace", "eom",
      "--service", "WhatsApp",
      "--type", "Transcription",
      "--severity", "Warning",
    ],
    (err) => {
      if (err) console.error("notify error:", err.message);
    }
  );
}

function transcribeAudio(audioPath) {
  return new Promise((resolve, reject) => {
    execFile(
      PYTHON_PATH,
      [TRANSCRIBE_SCRIPT, audioPath, "--model", WHISPER_MODEL],
      { timeout: 600_000 },
      (err, stdout, stderr) => {
        if (err) {
          reject(new Error(`Transcription failed: ${stderr || err.message}`));
          return;
        }
        try {
          const result = JSON.parse(stdout.trim());
          if (result.error) reject(new Error(result.error));
          else resolve(result);
        } catch (parseErr) {
          reject(new Error(`Invalid JSON: ${stdout}`));
        }
      }
    );
  });
}

function alreadyTranscribedToday() {
  try {
    if (!fs.existsSync(STATE_FILE)) return false;
    const state = JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
    const today = new Date().toISOString().split("T")[0];
    return state.date === today;
  } catch {
    return false;
  }
}

function markTranscribed(audioTimestamp) {
  const today = new Date().toISOString().split("T")[0];
  fs.writeFileSync(STATE_FILE, JSON.stringify({ date: today, timestamp: audioTimestamp }));
}

function isToday(timestamp) {
  const msgDate = new Date(timestamp * 1000);
  const now = new Date();
  return (
    msgDate.getFullYear() === now.getFullYear() &&
    msgDate.getMonth() === now.getMonth() &&
    msgDate.getDate() === now.getDate()
  );
}

async function main() {
  if (alreadyTranscribedToday()) {
    log("Ya se transcribió hoy. Saliendo.");
    process.exit(0);
  }

  log("Conectando a WhatsApp Web...");

  const client = new Client({
    authStrategy: new LocalAuth({ dataPath: path.join(DATA_DIR, "wwebjs-auth") }),
    puppeteer: {
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
  });

  client.on("qr", () => {
    log("ERROR: Sesión expirada. Necesita re-escanear QR.");
    notifyError("Sesión WA expirada — re-escanear QR con: cd eom/scripts/wa-transcriber && node index.js");
    process.exit(1);
  });

  client.on("ready", async () => {
    try {
      log("Conectado. Buscando grupo fuente...");

      const chats = await client.getChats();
      const sourceChat = chats.find(
        (c) => c.isGroup && c.name.toLowerCase().includes(SOURCE_GROUP.toLowerCase())
      );

      if (!sourceChat) {
        log(`ERROR: No se encontró "${SOURCE_GROUP}"`);
        notifyError(`Grupo "${SOURCE_GROUP}" no encontrado`);
        await client.destroy();
        process.exit(1);
      }

      log(`Grupo fuente: "${sourceChat.name}". Buscando audio de hoy...`);

      const messages = await sourceChat.fetchMessages({ limit: 30 });
      const audioMsg = [...messages]
        .reverse()
        .find((m) => {
          const isAudio = m.type === "audio" || m.type === "ptt";
          const isTodayMsg = isToday(m.timestamp);
          const isForwarded = m.isForwarded;
          return isAudio && isTodayMsg && isForwarded;
        });

      if (!audioMsg) {
        log("No hay audio reenviado de hoy todavía. Saliendo.");
        await client.destroy();
        process.exit(0);
      }

      log("Audio de hoy encontrado. Descargando...");

      const media = await audioMsg.downloadMedia();
      if (!media) {
        log("No se pudo descargar el audio.");
        notifyError("No se pudo descargar audio");
        await client.destroy();
        process.exit(1);
      }

      const ext = media.mimetype.includes("ogg") ? "ogg" : "mp3";
      const audioPath = path.join(DATA_DIR, `scheduled_audio.${ext}`);
      fs.writeFileSync(audioPath, Buffer.from(media.data, "base64"));
      log("Audio descargado. Transcribiendo...");

      const result = await transcribeAudio(audioPath);
      log(`Transcripción completada (${result.duration}s)`);

      const text = `*Transcripción del Evangelio de hoy del P. Jorge:*\n\n${result.text}`;

      // Enviar al mismo grupo donde llegó el audio (client.sendMessage es más confiable)
      await client.sendMessage(sourceChat.id._serialized, text);
      log(`Transcripción enviada a "${sourceChat.name}"`);

      markTranscribed(audioMsg.timestamp);
      notifyDone(`Evangelio transcrito y enviado (${result.duration}s de audio)`);

      fs.unlinkSync(audioPath);
      await client.destroy();
      process.exit(0);
    } catch (err) {
      log(`Error: ${err.message}`);
      notifyError(err.message);
      await client.destroy();
      process.exit(1);
    }
  });

  await client.initialize();
}

main().catch((err) => {
  log(`Fatal: ${err.message}`);
  notifyError(`Fatal: ${err.message}`);
  process.exit(1);
});
