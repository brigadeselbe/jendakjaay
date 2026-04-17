"use client";

import React, { useState } from "react";
import { Phone, MapPin } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { createClient } from "@/lib/supabase/client";

interface Order {
  id: string;
  buyer_name: string;
  buyer_phone: string;
  buyer_region: string;
  buyer_address: string;
  items: Array<{ name: string; quantity: number; price: number; emoji: string }>;
  total_price: number;
  status: string;
  payment_method: string;
  tracking_url: string | null;
  created_at: string;
}

function formatPrice(price: number) {
  return price.toLocaleString("fr-SN") + " FCFA";
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("fr-SN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const statusConfig: Record<string, { label: string; color: string; bg: string; emoji: string }> = {
  en_attente: { label: "En attente", color: "text-yellow-700", bg: "bg-yellow-100", emoji: "⏳" },
  confirme: { label: "Confirmé", color: "text-blue-700", bg: "bg-blue-100", emoji: "✅" },
  en_livraison: { label: "En livraison", color: "text-purple-700", bg: "bg-purple-100", emoji: "🚚" },
  livre: { label: "Livré", color: "text-green-700", bg: "bg-green-100", emoji: "🎉" },
  annule: { label: "Annulé", color: "text-red-700", bg: "bg-red-100", emoji: "❌" },
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState("");
  const [searchPhone, setSearchPhone] = useState("");

  async function loadOrders(phoneNumber: string) {
    const num = phoneNumber.trim();
    if (!num) return;
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("buyer_phone", num)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(Array.isArray(data) ? (data as Order[]) : []);
    } catch (err) {
      console.error("loadOrders error", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  const totalSpent = orders
    .filter((o) => o.status === "livre")
    .reduce((sum, o) => sum + o.total_price, 0);

  const tabs = [
    { id: "orders", label: "Mes commandes", emoji: "📦" },
    { id: "settings", label: "Paramètres", emoji: "⚙️" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">

        <BackButton className="mb-6" />

        {/* Header profil */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold"
              style={{ background: "linear-gradient(135deg, oklch(0.35 0.12 145), oklch(0.65 0.19 45))" }}>
              👤
            </div>
            <div>
              <h1 className="text-xl font-bold">Mon Profil</h1>
              <p className="text-muted-foreground text-sm">Gérez vos commandes et informations</p>
            </div>
          </div>

          {/* Recherche par téléphone */}
          <div className="space-y-3">
            <label className="text-sm font-medium block">
              📱 Entrez votre numéro pour voir vos commandes
            </label>
            <div className="flex gap-2">
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="77 123 45 67"
                className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                onClick={() => { setSearchPhone(phone); loadOrders(phone); }}
                className="px-4 py-3 rounded-xl text-white font-medium hover:opacity-90 transition text-sm"
                style={{ background: "oklch(0.35 0.12 145)" }}
              >
                Chercher
              </button>
            </div>
          </div>
        </div>

        {searchPhone && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: "Commandes", value: orders.length, emoji: "📦" },
                { label: "Livrées", value: orders.filter((o) => o.status === "livre").length, emoji: "🎉" },
                { label: "Total dépensé", value: formatPrice(totalSpent), emoji: "💰" },
              ].map((stat) => (
                <div key={stat.label} className="bg-card border border-border rounded-xl p-4 text-center">
                  <div className="text-2xl mb-1">{stat.emoji}</div>
                  <div className="font-bold text-sm">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition"
                  style={{
                    borderColor: activeTab === tab.id ? "oklch(0.35 0.12 145)" : "transparent",
                    color: activeTab === tab.id ? "oklch(0.35 0.12 145)" : "",
                  }}
                >
                  {tab.emoji} {tab.label}
                </button>
              ))}
            </div>

            {/* Commandes */}
            {activeTab === "orders" && (
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-12 text-muted-foreground">Chargement...</div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-3">📭</div>
                    <p className="font-medium mb-1">Aucune commande trouvée</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Vérifiez votre numéro ou commencez à acheter !
                    </p>
                    <Link href="/"
                      className="inline-block text-white px-6 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition"
                      style={{ background: "oklch(0.35 0.12 145)" }}>
                      Explorer les produits
                    </Link>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="bg-card border border-border rounded-2xl p-5">
                      {/* Header commande */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="font-semibold text-sm">
                            Commande #{order.id.slice(0, 8).toUpperCase()}
                          </p>
                          <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusConfig[order.status]?.bg} ${statusConfig[order.status]?.color}`}>
                          {statusConfig[order.status]?.emoji} {statusConfig[order.status]?.label}
                        </span>
                      </div>

                      {/* Articles */}
                      <div className="space-y-2 mb-4">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-3 text-sm">
                            <span className="text-2xl">{item.emoji}</span>
                            <div className="flex-1">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-muted-foreground text-xs">x{item.quantity}</p>
                            </div>
                            <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Infos livraison */}
                      <div className="bg-muted rounded-xl p-3 mb-4 space-y-1">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {order.buyer_address}, {order.buyer_region}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {order.buyer_phone}
                        </div>
                      </div>

                      {/* Total + paiement */}
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          {order.payment_method === "wave" ? "📱 Wave" :
                           order.payment_method === "orange" ? "🟠 Orange Money" : "🔵 Free Money"}
                        </div>
                        <div className="font-bold text-jaay-green">
                          {formatPrice(order.total_price)}
                        </div>
                      </div>

                      {/* Suivi livraison */}
                      {order.status === "en_livraison" && order.tracking_url && (
                        <a
                          href={order.tracking_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition"
                          style={{ background: "#6366f1" }}
                        >
                          🚗 Suivre ma livraison en temps réel
                        </a>
                      )}

                      {/* Contacter vendeur WhatsApp */}
                      {order.status !== "livre" && order.status !== "annule" && (
                        <a
                          href={`https://wa.me/221783854465?text=${encodeURIComponent(`Bonjour, je voudrais avoir des nouvelles de ma commande #${order.id.slice(0, 8).toUpperCase()}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl text-white text-sm font-medium hover:opacity-90 transition"
                          style={{ background: "#25D366" }}
                        >
                          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white" aria-hidden>
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                          Suivre ma commande
                        </a>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Paramètres */}
            {activeTab === "settings" && (
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                  <h2 className="font-semibold">Liens utiles</h2>
                  {[
                    { href: "/seller", label: "Devenir vendeur", emoji: "🏪" },
                    { href: "/seller/dashboard", label: "Dashboard vendeur", emoji: "📊" },
                    { href: "/auth/login", label: "Espace vendeur", emoji: "🔐" },
                    { href: "/help", label: "Centre d'aide", emoji: "❓" },
                  ].map((link) => (
                    <Link key={link.href} href={link.href}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition">
                      <span className="text-xl">{link.emoji}</span>
                      <span className="text-sm font-medium">{link.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {!searchPhone && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📱</div>
            <h2 className="text-xl font-bold mb-2">Retrouvez vos commandes</h2>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              Entrez votre numéro de téléphone utilisé lors de vos commandes pour les retrouver
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}