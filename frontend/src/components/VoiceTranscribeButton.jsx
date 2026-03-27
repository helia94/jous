import React, { useMemo, useRef, useState } from "react";
import Axios from "axios";

const MIME_CANDIDATES = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/mp4;codecs=mp4a.40.2",
  "audio/mp4",
  "audio/mpeg",
  "audio/wav"
];

const EXTENSION_BY_MIME = {
  "audio/webm;codecs=opus": "webm",
  "audio/webm": "webm",
  "audio/mp4;codecs=mp4a.40.2": "mp4",
  "audio/mp4": "mp4",
  "audio/mpeg": "mp3",
  "audio/wav": "wav"
};

function getBestMimeType() {
  if (typeof window === "undefined" || !window.MediaRecorder) {
    return "";
  }

  return (
    MIME_CANDIDATES.find((mimeType) => {
      try {
        return window.MediaRecorder.isTypeSupported(mimeType);
      } catch (_) {
        return false;
      }
    }) || ""
  );
}

function VoiceTranscribeButton({ onTranscription, placeholder = "Tap and speak" }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  const mimeType = useMemo(getBestMimeType, []);

  const stopTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const uploadRecording = async () => {
    const rawMimeType = (recorderRef.current && recorderRef.current.mimeType) || mimeType || "audio/webm";
    const stableMimeType = rawMimeType.split(";")[0];
    const extension = EXTENSION_BY_MIME[rawMimeType] || EXTENSION_BY_MIME[stableMimeType] || "webm";

    const audioBlob = new Blob(chunksRef.current, { type: stableMimeType });
    chunksRef.current = [];

    if (!audioBlob.size) {
      setError("No audio captured. Please try again.");
      return;
    }

    const formData = new FormData();
    formData.append("audio", audioBlob, `recording.${extension}`);

    try {
      setIsLoading(true);
      setError("");
      const response = await Axios.post("/api/audio/transcribe", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      const transcript = response?.data?.transcript || "";
      if (!transcript.trim()) {
        setError("Could not transcribe audio. Please try speaking more clearly.");
        return;
      }
      onTranscription(transcript);
    } catch (uploadError) {
      const message = uploadError?.response?.data?.error || "Transcription failed. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    if (isLoading) {
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) {
      setError("Voice input is not supported in this browser.");
      return;
    }

    try {
      setError("");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const options = mimeType ? { mimeType } : undefined;
      const recorder = new window.MediaRecorder(stream, options);

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        stopTracks();
        uploadRecording();
      };

      recorder.onerror = () => {
        stopTracks();
        setError("Audio recorder error. Please try again.");
        setIsRecording(false);
      };

      chunksRef.current = [];
      recorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch (recordError) {
      stopTracks();
      const permissionError = recordError?.name === "NotAllowedError";
      setError(permissionError ? "Microphone permission denied." : "Could not start voice recording.");
    }
  };

  const stopRecording = () => {
    if (!recorderRef.current || recorderRef.current.state === "inactive") {
      return;
    }

    setIsRecording(false);
    recorderRef.current.stop();
  };

  return (
    <div style={{ marginBottom: "0.5rem" }}>
      <button
        type="button"
        className="c-button"
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isLoading}
        style={{ marginRight: "0.5rem" }}
      >
        <i className={`microphone icon ${isRecording ? "red" : ""}`}></i>
        {isRecording ? " Stop recording" : " Voice input"}
      </button>
      <span style={{ opacity: 0.7, fontSize: "0.9rem" }}>
        {isLoading ? "Transcribing..." : placeholder}
      </span>
      {error && (
        <div className="c-form-error" style={{ marginTop: "0.4rem" }}>
          {error}
        </div>
      )}
    </div>
  );
}

export default VoiceTranscribeButton;
