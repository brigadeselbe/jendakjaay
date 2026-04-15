"use client";

import React, { useState } from "react";
import { ArrowLeft, ShoppingBag, Check } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrderNotification from "@/components/OrderNotification";
import { useCart } from "@/contexts/CartContext";
import { createClient } from "@/lib/supabase/client";

const regions = [
  "Dakar", "Thiès", "Saint-Louis", "Diourbel", "Louga",
  "Fatick", "Kaolack", "Kaffrine", "Ziguinchor", "Kolda",
  "Sédhiou", "Tambacounda", "Kédougou", "Matam"
];

function formatPrice(price: number) {
  return price.toLocaleString("fr-SN") + " FCFA";
}

// Grouper les articles du panier par vendeur
function groupBySeller(items: ReturnType<typeof useCart>["items"]) {
  const map = new Map<string, { seller: string; wave_merchant_url?: string; seller_phone?: string; items: typeof items; subtotal: number }>();
  for (const item of items) {
    const key = item.seller;
    if (!map.has(key)) {
      map.set(key, { seller: item.seller, wave_merchant_url: item.wave_merchant_url, seller_phone: item.seller_phone, items: [], subtotal: 0 });
    }
    const group = map.get(key)!;
    group.items.push(item);
    group.subtotal += item.price * item.quantity;
  }
  return Array.from(map.values());
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [waveGroups, setWaveGroups] = useState<Array<{ seller: string; wave_merchant_url?: string; subtotal: number }>>([]);
  const [form, setForm] = useState({
    buyer_name: "",
    buyer_phone: "",
    buyer_address: "",
    buyer_region: "",
    payment_method: "wave",
    notes: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const livraison = totalPrice >= 50000 ? 0 : 2500;
  const total = totalPrice + livraison;

  async function handleSubmit() {
    if (!form.buyer_name || !form.buyer_phone || !form.buyer_address || !form.buyer_region) {
      alert("Veuillez remplir tous les champs !");
      return;
    }
    setLoading(true);

    const orderPayload = {
      buyer_name: form.buyer_name,
      buyer_phone: form.buyer_phone,
      buyer_address: form.buyer_address,
      buyer_region: form.buyer_region,
      items,
      total_price: total,
      delivery_price: livraison,
      notes: form.notes,
    };

    try {
      if (form.payment_method === "wave") {
        // Sauvegarder la commande en base
        const supabase = createClient();
        const { data, error } = await supabase.from("orders").insert([{
          ...orderPayload,
          payment_method: "wave",
          status: "en_attente_paiement",
        }]).select().single();
        if (error) throw error;

        // Grouper par vendeur pour les redirections Wave
        const groups = groupBySeller(items);
        setOrderId(data.id);
        clearCart();

        if (groups.length === 1 && groups[0].wave_merchant_url) {
          // Un seul vendeur → redirection directe Wave avec montant
          const url = new URL(groups[0].wave_merchant_url);
          url.searchParams.set("amount", String(total));
          window.location.href = url.toString();
        } else {
          // Plusieurs vendeurs ou pas de lien Wave → afficher les liens
          setWaveGroups(groups.map(g => ({ seller: g.seller, wave_merchant_url: g.wave_merchant_url, subtotal: g.subtotal })));
          setSuccess(true);
        }
        return;
      }

      // Orange Money / Free Money : enregistrer la commande + afficher instructions
      const supabase = createClient();
      const { data, error } = await supabase.from("orders").insert([{
        ...orderPayload,
        payment_method: form.payment_method,
        status: "en_attente",
      }]).select().single();

      if (error) throw error;
      setOrderId(data.id);
      clearCart();
      setSuccess(true);
    } catch (err) {
      console.error("handleSubmit error", err);
      alert("Erreur lors de la commande. Réessayez !");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0 && !success) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-4">
          <div className="text-7xl">🛒</div>
          <h2 className="text-2xl font-bold">Votre panier est vide</h2>
          <Link href="/" className="text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition"
            style={{ background: "oklch(0.35 0.12 145)" }}>
            Continuer mes achats
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  if (success) {
    const isWave = form.payment_method === "wave";
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="text-center max-w-md w-full">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-white"
              style={{ background: "oklch(0.35 0.12 145)" }}>
              <Check className="h-10 w-10" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Commande enregistrée ! 🎉</h1>
            <p className="text-sm text-muted-foreground mb-6">
              N° <span className="font-mono font-medium">{orderId ? orderId.slice(0, 8).toUpperCase() : "—"}</span>
            </p>

            {/* Paiement Wave multi-vendeurs */}
            {isWave && waveGroups.length > 0 && (
              <div className="mb-6 text-left">
                <p className="text-sm font-semibold mb-3 text-center">
                  📱 Payez chaque vendeur via Wave :
                </p>
                <div className="space-y-3">
                  {waveGroups.map((group) => {
                    const url = group.wave_merchant_url
                      ? (() => { const u = new URL(group.wave_merchant_url!); u.searchParams.set("amount", String(group.subtotal)); return u.toString(); })()
                      : null;
                    return (
                      <div key={group.seller} className="bg-muted rounded-xl p-4 flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-sm">{group.seller}</p>
                          <p className="text-xs text-muted-foreground">{formatPrice(group.subtotal)}</p>
                        </div>
                        {url ? (
                          <a href={url} target="_blank" rel="noopener noreferrer"
                            className="flex-shrink-0 text-white text-xs font-bold px-4 py-2 rounded-xl hover:opacity-90 transition"
                            style={{ background: "#1bb6e8" }}>
                            📱 Payer Wave
                          </a>
                        ) : (
                          <span className="text-xs text-muted-foreground">Pas de lien Wave</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Orange / Free Money */}
            {!isWave && (
              <div className="bg-muted rounded-xl p-4 mb-6 text-sm text-left space-y-2">
                <p>📱 Vous serez contacté sur <strong>{form.buyer_phone}</strong></p>
                <p>📍 Livraison à <strong>{form.buyer_address}, {form.buyer_region}</strong></p>
                <p>💳 Paiement par <strong>{form.payment_method === "orange" ? "Orange Money" : "Free Money"}</strong></p>
              </div>
            )}

            <div className="mb-6">
              <OrderNotification
                order={{
                  buyer_name: form.buyer_name,
                  buyer_phone: form.buyer_phone,
                  buyer_region: form.buyer_region,
                  buyer_address: form.buyer_address,
                  items: [{ name: "Produit commandé", quantity: 1, price: total, emoji: "📦" }],
                  total_price: total,
                  payment_method: form.payment_method,
                }}
                sellerPhone="221783854465"
                sellerName="Jënd ak Jaay"
              />
            </div>

            <Link href="/" className="inline-block text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition"
              style={{ background: "oklch(0.35 0.12 145)" }}>
              Retour à l&apos;accueil
            </Link>
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

        <Link href="/cart" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Retour au panier
        </Link>

        <h1 className="text-2xl font-bold mb-8">Finaliser ma commande</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="font-semibold">📍 Informations de livraison</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Nom complet *</label>
                  <input name="buyer_name" value={form.buyer_name} onChange={handleChange}
                    placeholder="Ex: Amadou Diallo"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Téléphone *</label>
                  <input name="buyer_phone" value={form.buyer_phone} onChange={handleChange}
                    placeholder="77 123 45 67"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Région *</label>
                <select name="buyer_region" value={form.buyer_region} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="">Choisir votre région</option>
                  {regions.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Adresse complète *</label>
                <input name="buyer_address" value={form.buyer_address} onChange={handleChange}
                  placeholder="Ex: Médina, Rue 12, Dakar"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Notes (optionnel)</label>
                <textarea name="notes" value={form.notes} onChange={handleChange}
                  placeholder="Instructions spéciales pour la livraison..."
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="font-semibold">💳 Mode de paiement</h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "wave", label: "Wave", emoji: "📱" },
                  { value: "orange", label: "Orange Money", emoji: "🟠" },
                  { value: "free", label: "Free Money", emoji: "🔵" },
                ].map((method) => (
                  <button key={method.value}
                    type="button"
                    onClick={() => setForm({ ...form, payment_method: method.value })}
                    className="p-3 rounded-xl border-2 text-center transition"
                    style={{
                      borderColor: form.payment_method === method.value ? "oklch(0.35 0.12 145)" : "",
                      background: form.payment_method === method.value ? "oklch(0.92 0.06 145)" : "",
                    }}>
                    <div className="text-2xl mb-1">{method.emoji}</div>
                    <div className="text-xs font-medium">{method.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
              <h2 className="font-bold text-lg mb-4">Résumé</h2>

              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 text-sm">
                    <span className="text-2xl">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium">{item.name}</p>
                      <p className="text-muted-foreground">x{item.quantity}</p>
                    </div>
                    <span className="font-medium flex-shrink-0">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Livraison</span>
                  <span className={livraison === 0 ? "text-jaay-green font-medium" : ""}>
                    {livraison === 0 ? "Gratuite 🎉" : formatPrice(livraison)}
                  </span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-jaay-green text-lg">{formatPrice(total)}</span>
                </div>
              </div>

              <button onClick={handleSubmit} disabled={loading}
                className="w-full mt-6 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50"
                style={{ background: "oklch(0.35 0.12 145)" }}>
                <ShoppingBag className="h-5 w-5" />
                {loading ? "Commande en cours..." : "Confirmer la commande"}
              </button>

              <div className="mt-4 text-center">
                <p className="text-xs text-muted-foreground">Paiement sécurisé</p>
                <div className="flex justify-center gap-2 mt-1 text-xs text-muted-foreground">
                  <span>📱 Wave</span>
                  <span>🟠 Orange</span>
                  <span>🔵 Free</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}