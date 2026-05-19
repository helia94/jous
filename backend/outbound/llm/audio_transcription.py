import os
from openai import OpenAI

DEFAULT_TRANSCRIPTION_MODEL = os.environ.get("OPENAI_TRANSCRIPTION_MODEL", "whisper-1")


class AudioTranscriptionClient:
    def __init__(self):
        self.client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

    def transcribe(self, file_obj, filename, mimetype=None, language=None):
        kwargs = {
            "model": DEFAULT_TRANSCRIPTION_MODEL,
            "file": (filename, file_obj, mimetype) if mimetype else (filename, file_obj),
        }

        if language:
            kwargs["language"] = language

        response = self.client.audio.transcriptions.create(**kwargs)
        return getattr(response, "text", "")


audio_transcription_client = AudioTranscriptionClient()
