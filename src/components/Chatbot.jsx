
import { useState, useEffect, useRef } from "react";
import "./Chatbot.css";

const CHAT_URL = "http://localhost:5000/chat";;

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hello! 👋 Welcome to Cosmo Roots. How can I help you today?",
    },
  ]);

  const messagesEndRef = useRef(null);

  // Maintain one session for this browser tab
  const [sessionId] = useState(() => {
    let id = sessionStorage.getItem("cosmo_chat_session");

    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem("cosmo_chat_session", id);
    }

    return id;
  });

  // Automatically scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const sendMessage = async (e) => {
    e.preventDefault();

    const userMessage = message.trim();

    if (!userMessage || loading) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", text: userMessage },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatInput: userMessage,
          sessionId: sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      // Extract the AI response
      const botReply =
        data.output ||
        data.text ||
        data.response ||
        data.message ||
        "Sorry, I couldn't generate a response.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: typeof botReply === "string"
            ? botReply
            : JSON.stringify(botReply),
        },
      ]);
    } catch (error) {
      console.error("Chatbot error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry! Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-container">

      {/* Floating Chat Button */}
      <button
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open shopping assistant"
      >
        {isOpen ? "✕" : "💬"}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">

          {/* Header */}
          <div className="chatbot-header">
            <div>
              <h3>Cosmo Roots</h3>
              <span>AI Shopping Assistant 🌿</span>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${msg.role}`}
              >
                {msg.text}
              </div>
            ))}

            {loading && (
              <div className="chat-message assistant typing">
                Thinking...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            className="chatbot-input"
            onSubmit={sendMessage}
          >
            <input
              type="text"
              placeholder="Ask about our products..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading || !message.trim()}
            >
              ➤
            </button>
          </form>

        </div>
      )}
    </div>
  );
}

export default Chatbot;
