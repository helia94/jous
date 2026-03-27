import os
from openai import OpenAI

DEFAULT_TRANSCRIPTION_MODEL = os.environ.get("OPENAI_TRANSCRIPTION_MODEL", "gpt-4o-mini-transcribe")


class AudioTranscriptionClient:
    def __init__(self):
        self.client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

    def transcribe(self, file_storage, language=None):
        kwargs = {
            "model": DEFAULT_TRANSCRIPTION_MODEL,
            "file": file_storage,
        }

        if language:
            kwargs["language"] = language

        response = self.client.audio.transcriptions.create(**kwargs)
        return getattr(response, "text", "")


audio_transcription_client = AudioTranscriptionClient()
