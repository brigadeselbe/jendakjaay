"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { Package, Phone, MapPin, Clock, X } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { YangoDeliveryCard } from "@/components/YangoWidget";
import { createClient } from "@/lib/supabase/client";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  emoji: string;
  quantity: number;
  seller: string;
}

interface Order {
  id: string;
  buyer_name: string;
  buyer_phone: string;
  buyer_address: string;
  buyer_region: string;
  items: OrderItem[];
  total_price: number;
  delivery_price: number;
  status: string;
  payment_method: string;
  notes: string;
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
    hour: "2-digit",
    minute: "2-digit",
  });
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  en_attente: { label: "En attente", color: "text-yellow-700", bg: "bg-yellow-100" },
  confirme: { label: "Confirmé", color: "text-blue-700", bg: "bg-blue-100" },
  en_livraison: { label: "En livraison", color: "text-purple-700", bg: "bg-purple-100" },
  livre: { label: "Livré", color: "text-green-700", bg: "bg-green-100" },
  annule: { label: "Annulé", color: "text-red-700", bg: "bg-red-100" },
};

// Timeline des statuts
const STATUS_STEPS = ["en_attente", "confirme", "en_livraison", "livre"];

function OrderTimeline({ status }: { status: string }) {
  if (status === "annule") {
    return (
      <div className="flex items-center gap-2 text-red-500 text-sm font-medium py-2">
        <X className="h-4 w-4" /> Commande annulée
      </div>
    );
  }
  const currentIndex = STATUS_STEPS.indexOf(status);
  const labels = ["Reçue", "Confirmée", "En livraison", "Livrée"];
  const icons = ["📥", "✅", "🚚", "🎉"];
  return (
    <div className="flex items-center gap-1 w-full py-3">
      {STATUS_STEPS.map((step, i) => {
        const done = i <= currentIndex;
        const active = i === currentIndex;
        return (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${done ? "text-white" : "bg-muted text-muted-foreground"}`}
                style={done ? { background: "oklch(0.35 0.12 145)" } : {}}>
                {icons[i]}
              </div>
              <span className={`text-xs font-medium ${active ? "text-foreground" : done ? "text-muted-foreground" : "text-muted-foreground/50"}`}>
                {labels[i]}
              </span>
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 mb-5 rounded transition-all ${i < currentIndex ? "" : "bg-muted"}`}
                style={i < currentIndex ? { background: "oklch(0.35 0.12 145)" } : {}} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("tous");
  const [selected, setSelected] = useState<Order | null>(null);
  const [trackingInput, setTrackingInput] = useState("");
  const [showTrackingInput, setShowTrackingInput] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function loadOrders() {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setOrders(data);
      setLoading(false);
    }

    loadOrders();

    // Mises à jour en temps réel
    const channel = supabase
      .channel("orders-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "orders" }, (payload) => {
        setOrders((prev) => [payload.new as Order, ...prev]);
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders" }, (payload) => {
        const updated = payload.new as Order;
        setOrders((prev) => prev.map((o) => o.id === updated.id ? updated : o));
        setSelected((prev) => prev?.id === updated.id ? updated : prev);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  async function updateStatus(orderId: string, status: string, tracking_url?: string) {
    const supabase = createClient();
    const update: Record<string, string> = { status };
    if (tracking_url) update.tracking_url = tracking_url;
    await supabase.from("orders").update(update).eq("id", orderId);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status, ...(tracking_url ? { tracking_url } : {}) } : o))
    );
    if (selected?.id === orderId) {
      setSelected((prev) => prev ? { ...prev, status, ...(tracking_url ? { tracking_url } : {}) } : null);
    }
    setShowTrackingInput(false);
    setTrackingInput("");
  }

  const filteredOrders = filter === "tous"
    ? orders
    : orders.filter((o) => o.status === filter);

  const stats = {
    total: orders.length,
    en_attente: orders.filter((o) => o.status === "en_attente").length,
    confirme: orders.filter((o) => o.status === "confirme").length,
    livre: orders.filter((o) => o.status === "livre").length,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">

        <div className="flex items-center gap-4 mb-8">
          <BackButton href="/seller/dashboard" />
          <h1 className="text-2xl font-bold">Commandes reçues</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total", value: stats.total, emoji: "📦" },
            { label: "En attente", value: stats.en_attente, emoji: "⏳" },
            { label: "Confirmées", value: stats.confirme, emoji: "✅" },
            { label: "Livrées", value: stats.livre, emoji: "🎉" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-4 text-center">
              <div className="text-2xl mb-1">{stat.emoji}</div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filtres */}
        <div className="flex gap-2 overflow-x-auto mb-6">
          {[
            { value: "tous", label: "Toutes" },
            { value: "en_attente", label: "En attente" },
            { value: "confirme", label: "Confirmées" },
            { value: "en_livraison", label: "En livraison" },
            { value: "livre", label: "Livrées" },
            { value: "annule", label: "Annulées" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className="flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition"
              style={{
                background: filter === f.value ? "oklch(0.35 0.12 145)" : "",
                color: filter === f.value ? "white" : "",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Liste commandes */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Chargement...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">📭</div>
                <p className="font-medium">Aucune commande</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => setSelected(order)}
                  className={`bg-card border rounded-xl p-4 cursor-pointer hover:shadow-md transition ${selected?.id === order.id ? "border-jaay-green" : "border-border"}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold">{order.buyer_name}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusConfig[order.status]?.bg} ${statusConfig[order.status]?.color}`}>
                      {statusConfig[order.status]?.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <MapPin className="h-3 w-3" />
                    {order.buyer_region} — {order.buyer_address}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {order.items.slice(0, 3).map((item, i) => (
                        <span key={i} className="text-xl">{item.emoji}</span>
                      ))}
                      {order.items.length > 3 && (
                        <span className="text-xs text-muted-foreground">+{order.items.length - 3}</span>
                      )}
                    </div>
                    <span className="font-bold text-jaay-green">{formatPrice(order.total_price)}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Détail commande */}
          {selected && (
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24 h-fit">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg">Détail commande</h2>
                <button onClick={() => setSelected(null)} className="p-1 hover:bg-accent rounded-lg">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Timeline statut */}
              <OrderTimeline status={selected.status} />

              {/* Infos acheteur */}
              <div className="bg-muted rounded-xl p-4 mb-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{selected.buyer_name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${selected.buyer_phone}`} className="text-jaay-green hover:underline">
                    {selected.buyer_phone}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {selected.buyer_address}, {selected.buyer_region}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  {formatDate(selected.created_at)}
                </div>
              </div>

              {/* Articles */}
              <div className="mb-4">
                <h3 className="font-semibold text-sm mb-3">Articles commandés</h3>
                <div className="space-y-2">
                  {selected.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <span className="text-2xl">{item.emoji}</span>
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-muted-foreground">x{item.quantity}</p>
                      </div>
                      <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-3 mb-4 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Livraison</span>
                  <span>{selected.delivery_price === 0 ? "Gratuite" : formatPrice(selected.delivery_price)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-jaay-green">{formatPrice(selected.total_price)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Paiement</span>
                  <span>{selected.payment_method === "wave" ? "📱 Wave" : selected.payment_method === "orange" ? "🟠 Orange Money" : "🔵 Free Money"}</span>
                </div>
              </div>

              {/* Notes */}
              {selected.notes && (
                <div className="bg-muted rounded-lg p-3 mb-4 text-sm">
                  <p className="font-medium mb-1">Notes :</p>
                  <p className="text-muted-foreground">{selected.notes}</p>
                </div>
              )}

              {/* Lien de suivi existant */}
              {selected.tracking_url && (
                <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-lg">🚗</span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-blue-700">Lien de suivi actif</p>
                      <p className="text-xs text-blue-600 truncate">{selected.tracking_url}</p>
                    </div>
                  </div>
                  <a href={selected.tracking_url} target="_blank" rel="noopener noreferrer"
                    className="flex-shrink-0 text-xs text-white px-3 py-1.5 rounded-lg font-medium"
                    style={{ background: "#1a56db" }}>
                    Ouvrir
                  </a>
                </div>
              )}

              {/* Actions statut */}
              <div>
                <p className="font-semibold text-sm mb-3">Changer le statut :</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "confirme", label: "✅ Confirmer" },
                    { value: "en_livraison", label: "🚚 En livraison" },
                    { value: "livre", label: "🎉 Livré" },
                    { value: "annule", label: "❌ Annuler" },
                  ].map((s) => (
                    <button
                      key={s.value}
                      onClick={() => {
                        if (s.value === "en_livraison") {
                          setShowTrackingInput(true);
                        } else {
                          updateStatus(selected.id, s.value);
                        }
                      }}
                      disabled={selected.status === s.value}
                      className="py-2 px-3 rounded-lg text-sm font-medium border border-border hover:bg-accent transition disabled:opacity-40"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                {/* Section Yango + lien de suivi */}
                {showTrackingInput && (
                  <div className="mt-3 space-y-3">
                    {/* Widget Yango pour réserver un chauffeur */}
                    <YangoDeliveryCard
                      buyerAddress={`${selected.buyer_address}, ${selected.buyer_region}`}
                      buyerName={selected.buyer_name}
                    />

                    {/* Champ lien de suivi */}
                    <div className="bg-muted rounded-xl p-3 space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">
                        📋 Après réservation, colle le lien de suivi ici (optionnel) :
                      </p>
                      <input
                        type="url"
                        value={trackingInput}
                        onChange={(e) => setTrackingInput(e.target.value)}
                        placeholder="https://yango.com/tracking/..."
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateStatus(selected.id, "en_livraison", trackingInput || undefined)}
                          className="flex-1 py-2 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition"
                          style={{ background: "oklch(0.35 0.12 145)" }}
                        >
                          ✅ Confirmer en livraison
                        </button>
                        <button
                          onClick={() => { setShowTrackingInput(false); setTrackingInput(""); }}
                          className="px-4 py-2 rounded-lg text-sm border border-border hover:bg-accent transition"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Contacter acheteur WhatsApp */}
              <a
                href={`https://wa.me/${selected.buyer_phone}?text=${encodeURIComponent("Bonjour " + selected.buyer_name + " ! Votre commande sur Jënd ak Jaay est confirmée. Total: " + formatPrice(selected.total_price) + ". Merci !")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white hover:opacity-90 transition"
                style={{ background: "#25D366" }}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Contacter sur WhatsApp
              </a>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}