"use client";

import { useState, useEffect } from "react";
import { Users, Package, ShoppingBag, TrendingUp, Eye, Trash2, Check, X } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import { createClient } from "@/lib/supabase/client";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  emoji: string;
  seller_name: string;
  seller_location: string;
  in_stock: boolean;
  created_at: string;
}

interface Order {
  id: string;
  buyer_name: string;
  buyer_phone: string;
  buyer_region: string;
  total_price: number;
  status: string;
  payment_method: string;
  created_at: string;
}

interface Seller {
  id: string;
  full_name: string;
  shop_name: string;
  phone: string;
  region: string;
  category: string;
  verified: boolean;
  created_at: string;
}

function formatPrice(price: number) {
  return price.toLocaleString("fr-SN") + " FCFA";
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("fr-SN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  en_attente: { label: "En attente", color: "text-yellow-700", bg: "bg-yellow-100" },
  confirme: { label: "Confirmé", color: "text-blue-700", bg: "bg-blue-100" },
  en_livraison: { label: "En livraison", color: "text-purple-700", bg: "bg-purple-100" },
  livre: { label: "Livré", color: "text-green-700", bg: "bg-green-100" },
  annule: { label: "Annulé", color: "text-red-700", bg: "bg-red-100" },
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const supabase = createClient();
    const [p, o, s] = await Promise.all([
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
      supabase.from("sellers").select("*").order("created_at", { ascending: false }),
    ]);
    if (p.data) setProducts(p.data);
    if (o.data) setOrders(o.data);
    if (s.data) setSellers(s.data);
    setLoading(false);
  }

  async function deleteProduct(id: string) {
    if (!confirm("Supprimer ce produit ?")) return;
    const supabase = createClient();
    await supabase.from("products").delete().eq("id", id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  async function verifySeller(id: string, verified: boolean) {
    const supabase = createClient();
    await supabase.from("sellers").update({ verified }).eq("id", id);
    setSellers((prev) => prev.map((s) => s.id === id ? { ...s, verified } : s));
  }

  async function updateOrderStatus(id: string, status: string) {
    const supabase = createClient();
    await supabase.from("orders").update({ status }).eq("id", id);
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
  }

  const totalRevenue = orders
    .filter((o) => o.status === "livre")
    .reduce((sum, o) => sum + o.total_price, 0);

  const tabs = [
    { id: "overview", label: "Vue d'ensemble", emoji: "📊" },
    { id: "products", label: "Produits", emoji: "📦" },
    { id: "orders", label: "Commandes", emoji: "🛒" },
    { id: "sellers", label: "Vendeurs", emoji: "🏪" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Tableau de Bord Admin</h1>
            <p className="text-muted-foreground text-sm">Gérez tout Jënd ak Jaay</p>
          </div>
          <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full">
            ADMIN
          </span>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto mb-8 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition flex-shrink-0"
              style={{
                borderColor: activeTab === tab.id ? "oklch(0.35 0.12 145)" : "transparent",
                color: activeTab === tab.id ? "oklch(0.35 0.12 145)" : "",
              }}
            >
              {tab.emoji} {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Chargement...</div>
        ) : (
          <>
            {/* Vue d'ensemble */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Produits", value: products.length, emoji: "📦", color: "oklch(0.35 0.12 145)" },
                    { label: "Commandes", value: orders.length, emoji: "🛒", color: "oklch(0.65 0.19 45)" },
                    { label: "Vendeurs", value: sellers.length, emoji: "🏪", color: "#25D366" },
                    { label: "Revenus livrés", value: formatPrice(totalRevenue), emoji: "💰", color: "oklch(0.35 0.12 145)" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-card border border-border rounded-xl p-5">
                      <div className="text-3xl mb-2">{stat.emoji}</div>
                      <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Dernières commandes */}
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="p-4 border-b">
                    <h2 className="font-semibold">Dernières commandes</h2>
                  </div>
                  <div className="divide-y">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{order.buyer_name}</p>
                          <p className="text-xs text-muted-foreground">{order.buyer_region} • {formatDate(order.created_at)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-jaay-green text-sm">{formatPrice(order.total_price)}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${statusConfig[order.status]?.bg} ${statusConfig[order.status]?.color}`}>
                            {statusConfig[order.status]?.label}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Produits */}
            {activeTab === "products" && (
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="p-4 border-b flex items-center justify-between">
                  <h2 className="font-semibold">{products.length} produits</h2>
                  <Link href="/seller/add-product"
                    className="text-xs text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition"
                    style={{ background: "oklch(0.35 0.12 145)" }}>
                    + Ajouter
                  </Link>
                </div>
                <div className="divide-y">
                  {products.map((product) => (
                    <div key={product.id} className="p-4 flex items-center gap-4">
                      <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                        {product.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.seller_name} • {product.category}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-jaay-green text-sm">{formatPrice(product.price)}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${product.in_stock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {product.in_stock ? "En stock" : "Rupture"}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Link href={`/product/${product.id}`}
                          className="p-2 hover:bg-accent rounded-lg transition">
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button onClick={() => deleteProduct(product.id)}
                          className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg transition">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Commandes */}
            {activeTab === "orders" && (
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="p-4 border-b">
                  <h2 className="font-semibold">{orders.length} commandes</h2>
                </div>
                <div className="divide-y">
                  {orders.map((order) => (
                    <div key={order.id} className="p-4 flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{order.buyer_name}</p>
                        <p className="text-xs text-muted-foreground">
                          📞 {order.buyer_phone} • 📍 {order.buyer_region} • {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-jaay-green text-sm">{formatPrice(order.total_price)}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.payment_method === "wave" ? "Wave" : order.payment_method === "orange" ? "Orange Money" : "Free Money"}
                        </p>
                      </div>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="text-xs px-2 py-1 rounded-lg border border-border bg-background focus:outline-none"
                      >
                        <option value="en_attente">En attente</option>
                        <option value="confirme">Confirmé</option>
                        <option value="en_livraison">En livraison</option>
                        <option value="livre">Livré</option>
                        <option value="annule">Annulé</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Vendeurs */}
            {activeTab === "sellers" && (
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="p-4 border-b">
                  <h2 className="font-semibold">{sellers.length} vendeurs</h2>
                </div>
                <div className="divide-y">
                  {sellers.map((seller) => (
                    <div key={seller.id} className="p-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                        style={{ background: "oklch(0.35 0.12 145)" }}>
                        {seller.full_name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{seller.full_name}</p>
                        <p className="text-xs text-muted-foreground">
                          🏪 {seller.shop_name} • 📍 {seller.region} • 📞 {seller.phone}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${seller.verified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {seller.verified ? "✅ Vérifié" : "⏳ En attente"}
                        </span>
                        {!seller.verified ? (
                          <button onClick={() => verifySeller(seller.id, true)}
                            className="p-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition">
                            <Check className="h-4 w-4" />
                          </button>
                        ) : (
                          <button onClick={() => verifySeller(seller.id, false)}
                            className="p-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition">
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}