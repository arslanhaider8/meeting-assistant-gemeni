import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";

const SpeechRecognitionContext = createContext();

export const useSpeechRecognition = () => {
  const context = useContext(SpeechRecognitionContext);
  if (!context) {
    throw new Error(
      "useSpeechRecognition must be used within a SpeechRecognitionProvider"
    );
  }
  return context;
};

export const SpeechRecognitionProvider = ({ children }) => {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check if speech recognition is supported
    const isSpeechRecognitionSupported =
      "webkitSpeechRecognition" in window || "SpeechRecognition" in window;

    setIsSupported(isSpeechRecognitionSupported);

    if (isSpeechRecognitionSupported) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      recognitionRef.current = new SpeechRecognition();

      // Configure speech recognition
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      // Event handlers
      recognitionRef.current.onresult = (event) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript((prev) => prev + finalTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setError(event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onstart = () => {
        setError(null);
        setIsListening(true);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (!isSupported) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      setError("Failed to start speech recognition.");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const clearTranscript = () => {
    setTranscript("");
    setError(null);
  };

  const addToTranscript = (text) => {
    setTranscript((prev) => prev + text);
  };

  const setTranscriptText = (text) => {
    setTranscript(text);
  };

  const value = {
    transcript,
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
    toggleListening,
    clearTranscript,
    addToTranscript,
    setTranscriptText,
  };

  return (
    <SpeechRecognitionContext.Provider value={value}>
      {children}
    </SpeechRecognitionContext.Provider>
  );
};
