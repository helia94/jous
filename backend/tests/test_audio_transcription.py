from io import BytesIO

from backend.outbound.llm.audio_transcription import AudioTranscriptionClient, DEFAULT_TRANSCRIPTION_MODEL


class FakeTranscriptions:
    def __init__(self):
        self.kwargs = None

    def create(self, **kwargs):
        self.kwargs = kwargs
        return type("Response", (), {"text": "hello world"})()


class FakeAudio:
    def __init__(self):
        self.transcriptions = FakeTranscriptions()


class FakeOpenAIClient:
    def __init__(self):
        self.audio = FakeAudio()


def test_transcribe_passes_filename_stream_and_mimetype_to_openai():
    openai_client = FakeOpenAIClient()
    client = AudioTranscriptionClient.__new__(AudioTranscriptionClient)
    client.client = openai_client
    audio_stream = BytesIO(b"audio")

    transcript = client.transcribe(
        audio_stream,
        filename="recording.webm",
        mimetype="audio/webm",
        language="en",
    )

    assert transcript == "hello world"
    assert openai_client.audio.transcriptions.kwargs == {
        "model": DEFAULT_TRANSCRIPTION_MODEL,
        "file": ("recording.webm", audio_stream, "audio/webm"),
        "language": "en",
    }
