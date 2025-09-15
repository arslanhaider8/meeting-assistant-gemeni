import React, { useState } from "react";
import "./App.css";
import {
  SpeechRecognitionProvider,
  useSpeechRecognition,
} from "./SpeechRecognitionProvider";
import { GoogleGenAI } from "@google/genai";

// Main App component wrapped with provider
function App() {
  return (
    <SpeechRecognitionProvider>
      <AppContent />
    </SpeechRecognitionProvider>
  );
}

// App content component that uses the speech recognition hook
function AppContent() {
  const [summary, setSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);

  const {
    transcript,
    isListening,
    isSupported,
    error,
    toggleListening,
    clearTranscript,
    setTranscriptText,
  } = useSpeechRecognition();

  const handleSummarize = async () => {
    if (!transcript.trim()) {
      alert("Please add some transcript content first.");
      return;
    }

    setIsSummarizing(true);

    try {
      // const apiKey= "AIzaSyABl2kLcUymFdpJsMRIYgQKQO3NXkt1zoc";
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("REACT_APP_GEMINI_API_KEY is not defined in environment variables");
      }

      console.log("API Key:", apiKey);

      // Initialize the new Google GenAI SDK
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `Please analyze this meeting transcript and provide:
1. A concise summary of the main points discussed
2. A list of specific action items 

Transcript: ${transcript}

Please format the response as:
Summary:
• [main point 1]
• [main point 2]
• [main point 3]

Action Items:
• [action item 1]
• [action item 2]
• [action item 3]`;

      // Use the new SDK approach
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: prompt,
      });

      const aiSummary = response.text;
      console.log("Gemini API Response:", aiSummary);

      if (aiSummary) {
        console.log("AI Summary generated:", aiSummary);
        setSummary(aiSummary);
      } else {
        throw new Error("No response from Gemini API");
      }
    } catch (error) {
      console.error("Error summarizing:", error);

      // Fallback to basic summarization if Gemini fails
      if (
        error.message.includes("API key") ||
        error.message.includes("Gemini API Error")
      ) {
        setSummary(
          `Error: ${error.message}\n\nFalling back to basic summarization...`
        );

        // Enhanced fallback logic
        const sentences = transcript
          .split(/[.!?]+/)
          .filter((s) => s.trim().length > 0);

        // Get key points (first few sentences or sentences with important keywords)
        const importantWords = [
          "important",
          "key",
          "main",
          "primary",
          "critical",
          "essential",
        ];
        const keyPoints = sentences
          .filter(
            (sentence) =>
              importantWords.some((word) =>
                sentence.toLowerCase().includes(word)
              ) || sentence.length > 50 // Longer sentences are often more important
          )
          .slice(0, 3);

        // If no important sentences found, take first 3
        if (keyPoints.length === 0) {
          keyPoints.push(...sentences.slice(0, 3));
        }

        // Enhanced action item detection
        const actionWords = [
          "need",
          "should",
          "must",
          "will",
          "going to",
          "plan to",
          "decide",
          "review",
          "discuss",
          "meet",
          "call",
          "email",
          "send",
          "create",
          "update",
          "prepare",
          "submit",
          "finish",
          "complete",
          "schedule",
          "organize",
          "arrange",
          "contact",
        ];

        const actionItems = sentences
          .filter((sentence) => {
            const lower = sentence.toLowerCase();
            const isActionable =
              actionWords.some((word) => lower.includes(word)) ||
              lower.match(
                /\b(assign(ed)?|follow up|due|by|responsible|task|to do)\b/
              );
            const isInstruction =
              lower.includes("should") || lower.includes("must");
            return (isActionable || isInstruction) && sentence.length > 15;
          })
          .map((item) => `• ${item.trim()}`)
          .slice(0, 5);

        const fallbackSummary = `Summary:\n${keyPoints
          .map((point) => `• ${point.trim()}`)
          .join("\n")}`;

        const actionItemsText =
          actionItems.length > 0
            ? `\n\nAction Items:\n${actionItems.join("\n")}`
            : "\n\nNo specific action items identified.";

        setSummary(fallbackSummary + actionItemsText);
      } else {
        setSummary(
          `Error: ${error.message}\n\nPlease check your internet connection and try again.`
        );
      }
    } finally {
      setIsSummarizing(false);
    }
  };

  const clearAll = () => {
    clearTranscript();
    setSummary("");
  };

  if (!isSupported) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Meeting Assistant</h1>
          <p>Speech Recognition & Summarization Tool</p>
        </header>
        <main className="App-main">
          <div className="error-message">
            <h2>Browser Not Supported</h2>
            <p>
              Speech recognition is not supported in this browser. Please use
              Chrome, Edge, or Safari.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Meeting Assistant</h1>
        <p>Speech Recognition & Summarization Tool</p>
      </header>

      <main className="App-main">
        {error && (
          <div className="error-banner">
            <p>Error: {error}</p>
          </div>
        )}

        <div className="controls">
          <button
            onClick={toggleListening}
            className={`listen-btn ${isListening ? "listening" : ""}`}
          >
            {isListening ? "🛑 Stop Recording" : "🎤 Start Recording"}
          </button>

          <button onClick={clearAll} className="clear-btn">
            🗑️ Clear All
          </button>
        </div>

        <div className="content-area">
          <div className="transcript-section">
            <h2>Transcript</h2>
            <textarea
              value={transcript}
              onChange={(e) => setTranscriptText(e.target.value)}
              placeholder="Your speech will appear here, or you can type manually..."
              className="transcript-area"
              rows="10"
            />
          </div>

          <div className="action-section">
            <button
              onClick={handleSummarize}
              disabled={isSummarizing || !transcript.trim()}
              className="summarize-btn"
            >
              {isSummarizing ? "Summarizing..." : "📝 Summarise"}
            </button>
          </div>

          <div className="summary-section">
            <h2>Summary & Action Items</h2>
            <div className="summary-area">
              {summary ? (
                <pre>{summary}</pre>
              ) : (
                <p className="placeholder">
                  Summary and action items will appear here after clicking
                  "Summarise"
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
