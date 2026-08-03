import { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "../services/ChatbotService";

// Phrases aligned with backend ChatbotService intents so demos get accurate replies
const SUGGESTIONS = [
  "Show hot deals",
  "Find Tesla under 60000",
  "How do I book a test drive?",
  "Help with checkout",
  "How does the loan calculator work?",
  "How do I leave a review?",
];

// Mounted once in App.jsx, outside <Routes>, so it persists across every page
export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! Ask me about vehicles, hot deals, test drives, loans, or checkout. You can also tap a suggestion below.",
      vehicles: [],
    },
  ]);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  // Shared send path for typed messages and suggestion chips
  const sendMessage = async (rawText) => {
    const text = (rawText || "").trim();
    if (!text || sending) return;

    setMessages((prev) => [...prev, { sender: "user", text, vehicles: [] }]);
    setInput("");
    setSending(true);

    try {
      const data = await sendChatMessage(text);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.reply, vehicles: data.vehicles || [] },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, I'm having trouble connecting right now.",
          vehicles: [],
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleSend = () => sendMessage(input);

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-3 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gray-900 text-white px-4 py-3 flex justify-between items-center">
            <span className="font-semibold">EV Marketplace Assistant</span>
            <button
              onClick={() => setOpen(false)}
              className="text-white/80 hover:text-white"
            >
              &times;
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 max-h-96 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.sender === "user" ? "text-right" : "text-left"}
              >
                <p
                  className={`inline-block px-3 py-2 rounded-lg text-sm max-w-[85%] ${
                    m.sender === "user"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {m.text}
                </p>

                {m.vehicles && m.vehicles.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {m.vehicles.slice(0, 3).map((v) => (
                      <div
                        key={v.id}
                        className="text-xs bg-white border border-gray-200 rounded px-2 py-1 text-left"
                      >
                        {v.year} {v.make} {v.model} &middot; ${v.price}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Suggestion chips */}
          <div className="px-3 pb-2 flex flex-wrap gap-1.5 border-t border-gray-100 pt-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                disabled={sending}
                onClick={() => handleSuggestionClick(s)}
                className="
                  text-xs px-2.5 py-1 rounded-full
                  border border-gray-200 bg-gray-50
                  text-gray-700
                  hover:bg-gray-900 hover:text-white hover:border-gray-900
                  disabled:opacity-50
                  transition
                "
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="border-t p-2 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 border rounded px-3 py-2 text-sm"
              disabled={sending}
            />
            <button
              onClick={handleSend}
              disabled={sending}
              className="bg-gray-900 text-white px-3 py-2 rounded text-sm disabled:opacity-50 hover:bg-blue-600 transition"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Floating toggle */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="bg-gray-900 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-gray-700"
      >
        {open ? "×" : "💬"}
      </button>
    </div>
  );
}