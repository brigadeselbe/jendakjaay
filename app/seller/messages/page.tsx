"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Send, MessageCircle, Settings, Check } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";

interface Message {
  id: string;
  sender: "buyer" | "seller";
  content: string;
  is_auto: boolean;
  read: boolean;
  created_at: string;
}

interface Conversation {
  id: string;
  seller_name: string;
  buyer_name: string;
  buyer_phone: string;
  product_name: string;
  updated_at: string;
  unread?: number;
}

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString("fr-SN", { hour: "2-digit", minute: "2-digit" });
}

function formatDate(date: string) {
  const d = new Date(date);
  const today = new Date();
  const diff = today.getDate() - d.getDate();
  if (diff === 0) return "Aujourd'hui";
  if (diff === 1) return "Hier";
  return d.toLocaleDateString("fr-SN", { day: "numeric", month: "short" });
}

export default function SellerMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showAutoSettings, setShowAutoSettings] = useState(false);
  const [autoMessage, setAutoMessage] = useState("");
  const [autoActive, setAutoActive] = useState(true);
  const [sellerName, setSellerName] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const name = localStorage.getItem("seller_name") ?? "";
    setSellerName(name);
    if (name) loadConversations(name);
    else setLoading(false);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!selected) return;
    const channel = supabase
      .channel(`seller-conv-${selected.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${selected.id}` },
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
  }, [selected]);

  async function loadConversations(name: string) {
    setLoading(true);
    const { data } = await supabase
      .from("conversations")
      .select("*")
      .eq("seller_name", name)
      .order("updated_at", { ascending: false });
    setConversations(data ?? []);
    setLoading(false);

    // Charger la réponse auto existante
    const { data: auto } = await supabase
      .from("auto_responses")
      .select("*")
      .eq("seller_name", name)
      .single();
    if (auto) {
      setAutoMessage(auto.message);
      setAutoActive(auto.is_active);
    }
  }

  async function openConversation(conv: Conversation) {
    setSelected(conv);
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conv.id)
      .order("created_at");
    setMessages(data ?? []);
    // Marquer comme lu
    await supabase.from("messages").update({ read: true }).eq("conversation_id", conv.id).eq("sender", "buyer");
  }

  async function sendReply() {
    if (!input.trim() || !selected || sending) return;
    setSending(true);
    const content = input.trim();
    setInput("");
    try {
      await supabase.from("messages").insert([{
        conversation_id: selected.id,
        sender: "seller",
        content,
        is_auto: false,
      }]);
      await supabase.from("conversations").update({ updated_at: new Date().toISOString() }).eq("id", selected.id);
    } finally {
      setSending(false);
    }
  }

  async function saveAutoResponse() {
    if (!sellerName) return;
    const { data: existing } = await supabase
      .from("auto_responses")
      .select("id")
      .eq("seller_name", sellerName)
      .single();

    if (existing) {
      await supabase.from("auto_responses").update({ message: autoMessage, is_active: autoActive }).eq("id", existing.id);
    } else {
      await supabase.from("auto_responses").insert([{ seller_name: sellerName, message: autoMessage, is_active: autoActive }]);
    }
    setShowAutoSettings(false);
    alert("Réponse automatique sauvegardée ✅");
  }

  if (!sellerName) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="text-4xl mb-4">🔐</div>
            <h2 className="text-xl font-bold mb-2">Identifiez-vous</h2>
            <p className="text-muted-foreground text-sm mb-4">Entrez votre nom de vendeur pour accéder à vos messages</p>
            <input
              placeholder="Votre nom de vendeur"
              className="w-full max-w-xs px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring mb-3 block mx-auto"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const val = (e.target as HTMLInputElement).value.trim();
                  if (val) { localStorage.setItem("seller_name", val); setSellerName(val); loadConversations(val); }
                }
              }}
            />
            <p className="text-xs text-muted-foreground">Appuyez sur Entrée pour confirmer</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/seller/dashboard" className="p-2 rounded-lg hover:bg-accent transition">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Mes Messages</h1>
              <p className="text-sm text-muted-foreground">{conversations.length} conversation(s)</p>
            </div>
          </div>
          <button
            onClick={() => setShowAutoSettings(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border hover:bg-accent transition text-sm"
          >
            <Settings className="h-4 w-4" />
            Réponse auto
          </button>
        </div>

        {/* Modal réponse auto */}
        {showAutoSettings && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md space-y-4">
              <h3 className="font-bold text-lg">⚡ Réponse automatique</h3>
              <p className="text-sm text-muted-foreground">Ce message est envoyé automatiquement à chaque nouveau client</p>
              <textarea
                value={autoMessage}
                onChange={(e) => setAutoMessage(e.target.value)}
                placeholder="Ex: Bonjour ! Merci pour votre message. Je vous réponds dans les plus brefs délais..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={autoActive} onChange={(e) => setAutoActive(e.target.checked)} className="w-4 h-4" />
                <span className="text-sm">Activer la réponse automatique</span>
              </label>
              <div className="flex gap-3">
                <button onClick={saveAutoResponse} className="flex-1 py-2.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition" style={{ background: "oklch(0.35 0.12 145)" }}>
                  Sauvegarder
                </button>
                <button onClick={() => setShowAutoSettings(false)} className="px-4 py-2.5 rounded-xl border border-border hover:bg-accent transition text-sm">
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">

          {/* Liste conversations */}
          <div className="lg:col-span-1 border border-border rounded-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border font-semibold text-sm">Conversations</div>
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-muted-foreground text-sm">Chargement...</div>
              ) : conversations.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageCircle className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Aucune conversation</p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => openConversation(conv)}
                    className={`w-full p-4 text-left border-b border-border hover:bg-accent transition ${selected?.id === conv.id ? "bg-accent" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                        style={{ background: "oklch(0.35 0.12 145)" }}>
                        {conv.buyer_name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm truncate">{conv.buyer_name}</p>
                          <span className="text-xs text-muted-foreground">{formatDate(conv.updated_at)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">📦 {conv.product_name}</p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Fenêtre de chat */}
          <div className="lg:col-span-2 border border-border rounded-2xl flex flex-col overflow-hidden">
            {!selected ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Sélectionnez une conversation</p>
                </div>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="p-4 border-b border-border flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ background: "oklch(0.35 0.12 145)" }}>
                    {selected.buyer_name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{selected.buyer_name}</p>
                    {selected.buyer_phone && (
                      <a href={`https://wa.me/${selected.buyer_phone}`} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-green-600 hover:underline">
                        📱 {selected.buyer_phone} (WhatsApp)
                      </a>
                    )}
                  </div>
                  <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">📦 {selected.product_name}</span>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === "seller" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                        msg.sender === "seller"
                          ? "text-white rounded-br-sm"
                          : "bg-muted rounded-bl-sm"
                      }`}
                      style={msg.sender === "seller" ? { background: "oklch(0.35 0.12 145)" } : {}}>
                        {msg.content}
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-xs opacity-60">{formatTime(msg.created_at)}</span>
                          {msg.is_auto && <span className="text-xs opacity-60">· auto</span>}
                          {msg.sender === "seller" && <Check className="h-3 w-3 opacity-60" />}
                        </div>
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
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendReply()}
                    placeholder="Votre réponse..."
                    className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button
                    onClick={sendReply}
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
        </div>
      </main>
      <Footer />
    </div>
  );
}
