"""
Wrapper de faster-whisper para transcribir archivos de audio.
Uso: python transcribe.py <ruta_audio> [--model medium]
Devuelve el texto transcrito por stdout.
"""
import sys
import json
import subprocess
import traceback
from pathlib import Path

NOTIFY = [sys.executable, str(Path("C:/Users/seoli/Desktop/cursorgit/eom/scripts/notify/notify.py"))]
SCRIPT_NAME = Path(__file__).name
WORKSPACE = "eom"

DEFAULT_MODEL = "medium"


def report_error(e, error_type="Transcription"):
    subprocess.run(NOTIFY + [
        "error", f"{SCRIPT_NAME}: {e}",
        "--script", SCRIPT_NAME,
        "--workspace", WORKSPACE,
        "--service", "Whisper",
        "--type", error_type,
        "--severity", "Critical",
    ], check=False)


def transcribe(audio_path, model_size=DEFAULT_MODEL):
    from faster_whisper import WhisperModel

    model = WhisperModel(model_size, device="cpu", compute_type="int8")
    segments, info = model.transcribe(
        audio_path,
        language="es",
        beam_size=5,
        vad_filter=True,
    )

    text_parts = []
    for segment in segments:
        text_parts.append(segment.text.strip())

    full_text = " ".join(text_parts)
    return full_text, info


if __name__ == "__main__":
    try:
        if len(sys.argv) < 2:
            print("Uso: python transcribe.py <ruta_audio> [--model medium]", file=sys.stderr)
            sys.exit(1)

        audio_path = sys.argv[1]
        model_size = DEFAULT_MODEL

        if "--model" in sys.argv:
            idx = sys.argv.index("--model")
            if idx + 1 < len(sys.argv):
                model_size = sys.argv[idx + 1]

        if not Path(audio_path).exists():
            print(f"Archivo no encontrado: {audio_path}", file=sys.stderr)
            sys.exit(1)

        text, info = transcribe(audio_path, model_size)

        result = {
            "text": text,
            "language": info.language,
            "language_probability": round(info.language_probability, 3),
            "duration": round(info.duration, 1),
        }
        print(json.dumps(result, ensure_ascii=False))

    except Exception as e:
        report_error(e)
        print(json.dumps({"error": str(e)}, ensure_ascii=False), file=sys.stderr)
        sys.exit(1)
