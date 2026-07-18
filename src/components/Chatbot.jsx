import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import "./Chatbot.css";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const { language } = useLanguage();
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat window
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, isOpen]);

  // Initial welcome message
  useEffect(() => {
    if (chat.length === 0) {
      setChat([
        {
          sender: "bot",
          text: language === 'hi' 
            ? "👋 नमस्ते! जनसहयोग एआई सहायक में आपका स्वागत है। मैं आपकी सरकारी योजनाओं, पात्रता और दस्तावेजों के प्रश्नों में मदद कर सकता हूँ। कुछ भी पूछें!"
            : "👋 Namaste! Welcome to JanSahyog AI Assistant. I can help you with government schemes, eligibility criteria, and required documents. Ask me anything!"
        }
      ]);
    }
  }, [language]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      sender: "user",
      text: message,
    };

    setChat((prev) => [...prev, userMessage]);

    setMessage("");

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.text,
        }),
      });

      const data = await response.json();

      setChat((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.reply || (language === 'hi' ? "क्षमा करें, मैं अभी उत्तर नहीं दे सका।" : "Sorry, I couldn't answer right now."),
        },
      ]);
    } catch (error) {
      setChat((prev) => [
        ...prev,
        {
          sender: "bot",
          text: language === 'hi' ? "सर्वर उपलब्ध नहीं है।" : "Server not available.",
        },
      ]);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        🤖
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot">
          <div className="chat-header">
            <span>🤖 {language === 'hi' ? 'जनसहयोग एआई' : 'JanSahyog AI'}</span>

            <button
              className="close-btn"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="chat-messages">
            {chat.map((msg, index) => (
              <div
                key={index}
                className={
                  msg.sender === "user"
                    ? "user-msg"
                    : "bot-msg"
                }
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-area">
            <input
              type="text"
              placeholder={language === 'hi' ? 'योजनाओं के बारे में पूछें...' : 'Ask about schemes...'}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  sendMessage();
                }
              }}
            />

            <button onClick={sendMessage}>
              {language === 'hi' ? 'भेजें' : 'Send'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;