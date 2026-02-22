"use client";

import { useState, useEffect, useCallback } from "react";

interface VoiceAIProps {
  studentId: string;
  enabled?: boolean;
}

interface VoiceResponse {
  text: string;
  action?: string;
  data?: any;
}

export default function VoiceAI({ studentId, enabled = true }: VoiceAIProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState<VoiceResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [speechSupported, setSpeechSupported] = useState(false);

  useEffect(() => {
    // Check browser support
    if (typeof window !== "undefined") {
      const hasSpeechRecognition = "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
      const hasSpeechSynthesis = "speechSynthesis" in window;
      setSpeechSupported(hasSpeechRecognition && hasSpeechSynthesis);
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    
    window.speechSynthesis.cancel(); // Stop any current speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    // Try to find Polish or English voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith("pl")) || 
                          voices.find(v => v.lang.startsWith("en"));
    if (preferredVoice) utterance.voice = preferredVoice;
    
    window.speechSynthesis.speak(utterance);
  }, []);

  const startListening = useCallback(() => {
    if (typeof window === "undefined") return;
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "pl-PL"; // Default to Polish
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      setResponse(null);
    };

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      handleQuery(text);
    };

    recognition.onerror = (event: any) => {
      setError(`Error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, []);

  const handleQuery = async (text: string) => {
    setLoading(true);
    
    try {
      const res = await fetch("/api/ai/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: text,
          studentId,
          language: detectLanguage(text),
        }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setResponse(data);
        speak(data.response);
      } else {
        setError(data.error || "Failed to process query");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const detectLanguage = (text: string): string => {
    // Simple detection - Polish has special chars
    const polishChars = /[ąćęłńóśźż]/i;
    return polishChars.test(text) ? "pl" : "en";
  };

  if (!enabled) return null;

  if (!speechSupported) {
    return (
      <div className="p-4 bg-gray-900 rounded-lg text-sm text-gray-500">
        Voice AI not supported in this browser
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 14.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-2v-2.07z" clipRule="evenodd" />
          </svg>
          Voice Assistant
        </h3>
        <span className="text-xs text-gray-500">Beta</span>
      </div>

      <button
        onClick={startListening}
        disabled={isListening || loading}
        className={`w-full py-4 rounded-lg font-semibold transition flex items-center justify-center gap-3 ${
          isListening
            ? "bg-red-600 animate-pulse"
            : "bg-gray-800 hover:bg-gray-700"
        }`}
      >
        {isListening ? (
          <>
            <span className="w-3 h-3 bg-white rounded-full animate-ping" />
            Listening...
          </>
        ) : loading ? (
          "Thinking..."
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            Tap to speak
          </>
        )}
      </button>

      {transcript && (
        <div className="p-3 bg-gray-800 rounded text-sm text-gray-300">
          <span className="text-gray-500">You said:</span> {transcript}
        </div>
      )}

      {response && (
        <div className="p-3 bg-red-900/30 border border-red-800 rounded">
          <p className="text-red-200">{response.text}</p>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-900/30 rounded text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="text-xs text-gray-500 space-y-1">
        <p>Try saying:</p>
        <ul className="list-disc list-inside">
          <li>"How many times did I practice last week?"</li>
          <li>"What's my current streak?"</li>
          <li>"How many DOJO tokens do I have?"</li>
          <li>"When is my next class?"</li>
        </ul>
      </div>
    </div>
  );
}
