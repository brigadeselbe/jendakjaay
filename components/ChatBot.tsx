"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  xFrom: Math.random() * 60 - 30,
  xTo: Math.random() * 60 - 30,
  duration: 4 + Math.random() * 3,
  delay: i * 0.4,
}));

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Salamalekoum ! 👋 Je suis l'assistant de Jënd ak Jaay. Comment puis-je vous aider ?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages
            .concat({ role: "user", content: userMessage })
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await response.json();
      const assistantMessage =
        data.content?.[0]?.text || "Désolé, je n'ai pas pu répondre. Réessayez !";
      setMessages((prev) => [...prev, { role: "assistant", content: assistantMessage }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Désolé, une erreur s'est produite. Veuillez réessayer !" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      {/* Bouton flottant */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="fab"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-24 left-6 z-50 flex items-center gap-2 text-white px-4 py-3 rounded-full shadow-xl"
            style={{
              background: "linear-gradient(135deg, oklch(0.40 0.14 145), oklch(0.65 0.19 45))",
              boxShadow: "0 4px 20px oklch(0.35 0.12 145 / 0.45)",
            }}
          >
            <Sparkles className="h-5 w-5" />
            <span className="font-semibold text-sm hidden sm:block">Assistant IA</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Fenêtre chat */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chatwindow"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed bottom-24 left-6 z-50 w-80 sm:w-96 rounded-2xl overflow-hidden flex flex-col"
            style={{
              height: "500px",
              boxShadow: "0 24px 64px oklch(0.35 0.12 145 / 0.35), 0 4px 20px rgba(0,0,0,0.12)",
              border: "1px solid oklch(0.35 0.12 145 / 0.25)",
            }}
          >
            {/* ── Header animé ── */}
            <div
              className="relative flex items-center justify-between px-4 py-3 overflow-hidden flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, oklch(0.35 0.12 145) 0%, oklch(0.28 0.09 148) 60%, oklch(0.55 0.17 45) 100%)",
              }}
            >
              {/* Particules fond header */}
              {PARTICLES.map((p) => (
                <motion.div
                  key={p.id}
                  className="absolute w-1 h-1 rounded-full bg-white/15 pointer-events-none"
                  style={{ left: p.left, bottom: "-10%" }}
                  animate={{ y: ["0%", "-220%"], x: [p.xFrom, p.xTo], opacity: [0, 0.8, 0] }}
                  transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
                />
              ))}

              <div className="flex items-center gap-3 relative z-10">
                <div className="w-9 h-9 rounded-full bg-white/15 backdrop-blur flex items-center justify-center border border-white/25">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-white leading-tight">Assistant Jaay</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <p className="text-[11px] text-white/75">En ligne · Répond instantanément</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="relative z-10 p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>

            {/* ── Messages ── */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-3"
              style={{ background: "oklch(0.99 0.005 145)" }}
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white mr-2 flex-shrink-0 mt-1"
                      style={{ background: "linear-gradient(135deg, oklch(0.40 0.14 145), oklch(0.60 0.18 45))" }}
                    >
                      <Bot className="h-3 w-3" />
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      msg.role === "user"
                        ? "text-white rounded-br-sm"
                        : "bg-white text-gray-800 rounded-bl-sm border border-gray-100"
                    }`}
                    style={
                      msg.role === "user"
                        ? {
                            background:
                              "linear-gradient(135deg, oklch(0.40 0.14 145), oklch(0.32 0.11 148))",
                            boxShadow: "0 2px 12px oklch(0.35 0.12 145 / 0.30)",
                          }
                        : {}
                    }
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {/* Indicateur de frappe */}
              {loading && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white mr-2 flex-shrink-0 mt-1"
                    style={{ background: "linear-gradient(135deg, oklch(0.40 0.14 145), oklch(0.60 0.18 45))" }}
                  >
                    <Bot className="h-3 w-3" />
                  </div>
                  <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
                    <div className="flex gap-1.5 items-center">
                      {[0, 150, 300].map((delay, idx) => (
                        <motion.div
                          key={idx}
                          className="w-2 h-2 rounded-full"
                          style={{ background: "oklch(0.40 0.14 145)" }}
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: delay / 1000 }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions rapides */}
            {messages.length === 1 && (
              <div
                className="px-4 py-2 flex gap-2 overflow-x-auto border-t"
                style={{ background: "oklch(0.99 0.005 145)", borderColor: "oklch(0.90 0.02 145)" }}
              >
                {["🛍️ Trouver un boubou", "💳 Comment payer ?", "🏪 Devenir vendeur"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setInput(s.replace(/^[\S]+\s/, "").trim())}
                    className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-all hover:scale-105"
                    style={{
                      borderColor: "oklch(0.35 0.12 145 / 0.4)",
                      color: "oklch(0.35 0.12 145)",
                      background: "oklch(0.35 0.12 145 / 0.06)",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* ── Input ── */}
            <div
              className="p-3 border-t flex gap-2"
              style={{ background: "white", borderColor: "oklch(0.90 0.02 145)" }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Écrivez votre message..."
                disabled={loading}
                className="flex-1 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 transition"
                style={{
                  background: "oklch(0.97 0.005 145)",
                  border: "1.5px solid oklch(0.88 0.03 145)",
                  color: "oklch(0.22 0.05 145)",
                }}
              />
              <motion.button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="p-2.5 rounded-xl text-white transition-all disabled:opacity-40 flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, oklch(0.40 0.14 145), oklch(0.32 0.11 148))",
                  boxShadow: "0 2px 8px oklch(0.35 0.12 145 / 0.35)",
                }}
              >
                <Send className="h-4 w-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
