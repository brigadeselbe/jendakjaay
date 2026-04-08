"use client";

import { useState, useEffect, useRef } from "react";
import { X, Send, MessageCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Message {
  id: string;
  sender: "buyer" | "seller";
  content: string;
  is_auto: boolean;
  created_at: string;
}

interface ChatWindowProps {
  sellerName: string;
  sellerPhone: string;
  productName: string;
  productId: string;
  onClose: () => void;
}

export default function ChatWindow({ sellerName, sellerPhone, productName, productId, onClose }: ChatWindowProps) {
  const [step, setStep] = useState<"form" | "chat">("form");
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`conv-${conversationId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => {
            if (prev.find((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [conversationId]);

  async function startChat() {
    if (!buyerName.trim()) return;
    try {
      const { data: conv, error } = await supabase
        .from("conversations")
        .insert([{
          seller_name: sellerName,
          seller_phone: sellerPhone,
          buyer_name: buyerName,
          buyer_phone: buyerPhone,
          product_id: productId,
          product_name: productName,
        }])
        .select()
        .single();

      if (error) throw error;
      setConversationId(conv.id);

      // Réponse automatique du vendeur
      const { data: autoResp } = await supabase
        .from("auto_responses")
        .select("message")
        .eq("seller_name", sellerName)
        .eq("is_active", true)
        .limit(1)
        .single();

      const autoMessage = autoResp?.message ??
        `Bonjour ${buyerName} ! Merci pour votre intérêt pour "${productName}". Je vous réponds dès que possible. 🙏`;

      await supabase.from("messages").insert([{
        conversation_id: conv.id,
        sender: "seller",
        content: autoMessage,
        is_auto: true,
      }]);

      const { data: msgs } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conv.id)
        .order("created_at");

      setMessages(msgs ?? []);
      setStep("chat");
    } catch (e) {
      alert("Erreur lors de l'ouverture du chat. Réessayez !");
    }
  }

  async function sendMessage() {
    if (!input.trim() || !conversationId || sending) return;
    setSending(true);
    const content = input.trim();
    setInput("");
    try {
      await supabase.from("messages").insert([{
        conversation_id: conversationId,
        sender: "buyer",
        content,
        is_auto: false,
      }]);
      // Mettre à jour updated_at de la conversation
      await supabase.from("conversations").update({ updated_at: new Date().toISOString() }).eq("id", conversationId);
    } catch {
      alert("Erreur d'envoi. Réessayez !");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[360px] max-w-[95vw] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 text-white" style={{ background: "oklch(0.35 0.12 145)" }}>
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
          {sellerName[0]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{sellerName}</p>
          <p className="text-xs opacity-75 truncate">À propos de : {productName}</p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition">
          <X className="h-4 w-4" />
        </button>
      </div>

      {step === "form" ? (
        <div className="p-4 space-y-3">
          <p className="text-sm text-muted-foreground">Entrez vos informations pour contacter le vendeur</p>
          <input
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            placeholder="Votre nom *"
            className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            value={buyerPhone}
            onChange={(e) => setBuyerPhone(e.target.value)}
            placeholder="Votre téléphone (optionnel)"
            className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            onClick={startChat}
            disabled={!buyerName.trim()}
            className="w-full py-2.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition disabled:opacity-50"
            style={{ background: "oklch(0.35 0.12 145)" }}
          >
            Commencer la discussion 💬
          </button>
        </div>
      ) : (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-72">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "buyer" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                  msg.sender === "buyer"
                    ? "text-white rounded-br-sm"
                    : "bg-muted rounded-bl-sm"
                }`}
                style={msg.sender === "buyer" ? { background: "oklch(0.35 0.12 145)" } : {}}>
                  {msg.content}
                  {msg.is_auto && (
                    <span className="block text-xs opacity-60 mt-1">⚡ Réponse automatique</span>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="Votre message..."
              className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || sending}
              className="p-2 rounded-xl text-white hover:opacity-90 transition disabled:opacity-50"
              style={{ background: "oklch(0.35 0.12 145)" }}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export function ChatButton({ sellerName, sellerPhone, productName, productId }: Omit<ChatWindowProps, "onClose">) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 w-full py-3 rounded-xl font-semibold border border-border hover:bg-accent transition text-sm justify-center"
      >
        <MessageCircle className="h-4 w-4" />
        Contacter le vendeur
      </button>
      {open && (
        <ChatWindow
          sellerName={sellerName}
          sellerPhone={sellerPhone}
          productName={productName}
          productId={productId}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
