"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { ArrowLeft, TrendingUp, Eye, ShoppingBag, Star, Package } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import { createClient } from "@/lib/supabase/client";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  emoji: string;
  rating: number;
  reviews_count: number;
  in_stock: boolean;
}

interface Order {
  id: string;
  total_price: number;
  status: string;
  created_at: string;
  items: Array<{ name: string; quantity: number; price: number }>;
}

function formatPrice(price: number) {
  return price.toLocaleString("fr-SN") + " FCFA";
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("fr-SN", {
    day: "numeric",
    month: "short",
  });
}

export default function SellerStatsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30");

  useEffect(() => {
    loadData();
  }, [period]);

  async function loadData() {
    const supabase = createClient();
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - parseInt(period));

    const [p, o] = await Promise.all([
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      supabase.from("orders").select("*")
        .gte("created_at", dateLimit.toISOString())
        .order("created_at", { ascending: true }),
    ]);

    if (p.data) setProducts(p.data);
    if (o.data) setOrders(o.data);
    setLoading(false);
  }

  // Calculs statistiques
  const totalRevenue = orders
    .filter((o) => o.status === "livre")
    .reduce((sum, o) => sum + o.total_price, 0);

  const totalOrders = orders.length;
  const deliveredOrders = orders.filter((o) => o.status === "livre").length;
  const pendingOrders = orders.filter((o) => o.status === "en_attente").length;
  const conversionRate = totalOrders > 0 ? Math.round((deliveredOrders / totalOrders) * 100) : 0;

  // Commandes par jour
  const ordersByDay = orders.reduce((acc, order) => {
    const day = formatDate(order.created_at);
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(ordersByDay).slice(-7);
  const maxOrders = Math.max(...chartData.map(([, v]) => v), 1);

  // Top produits
  const productSales = orders.flatMap((o) => o.items || []).reduce((acc, item) => {
    acc[item.name] = (acc[item.name] || 0) + item.quantity;
    return acc;
  }, {} as Record<string, number>);

  const topProducts = Object.entries(productSales)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Revenus par catégorie
  const revenueByCategory = products.reduce((acc, product) => {
    const productOrders = orders.filter((o) =>
      o.items?.some((item) => item.name === product.name)
    );
    const revenue = productOrders.reduce((sum, o) => sum + o.total_price, 0);
    if (revenue > 0) acc[product.category] = (acc[product.category] || 0) + revenue;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/seller/dashboard" className="p-2 rounded-lg hover:bg-accent transition">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Statistiques</h1>
              <p className="text-muted-foreground text-sm">Analysez vos performances</p>
            </div>
          </div>

          {/* Période */}
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none"
          >
            <option value="7">7 derniers jours</option>
            <option value="30">30 derniers jours</option>
            <option value="90">3 derniers mois</option>
            <option value="365">Cette année</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Chargement...</div>
        ) : (
          <div className="space-y-8">

            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Revenus", value: formatPrice(totalRevenue), emoji: "💰", trend: "+12%", color: "oklch(0.35 0.12 145)" },
                { label: "Commandes", value: totalOrders, emoji: "📦", trend: `${pendingOrders} en attente`, color: "oklch(0.65 0.19 45)" },
                { label: "Taux livraison", value: `${conversionRate}%`, emoji: "✅", trend: `${deliveredOrders} livrées`, color: "oklch(0.35 0.12 145)" },
                { label: "Produits", value: products.length, emoji: "🏪", trend: `${products.filter(p => p.in_stock).length} en stock`, color: "oklch(0.65 0.19 45)" },
              ].map((kpi) => (
                <div key={kpi.label} className="bg-card border border-border rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{kpi.emoji}</span>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                      {kpi.trend}
                    </span>
                  </div>
                  <div className="text-2xl font-bold mb-1" style={{ color: kpi.color }}>
                    {kpi.value}
                  </div>
                  <div className="text-xs text-muted-foreground">{kpi.label}</div>
                </div>
              ))}
            </div>

            {/* Graphique commandes */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-jaay-green" />
                Commandes par jour
              </h2>
              {chartData.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  Aucune commande sur cette période
                </div>
              ) : (
                <div className="flex items-end gap-3 h-40">
                  {chartData.map(([day, count]) => (
                    <div key={day} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">{count}</span>
                      <div
                        className="w-full rounded-t-lg transition-all"
                        style={{
                          height: `${(count / maxOrders) * 100}px`,
                          background: "linear-gradient(to top, oklch(0.35 0.12 145), oklch(0.55 0.17 145))",
                          minHeight: "8px",
                        }}
                      />
                      <span className="text-xs text-muted-foreground">{day}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Top produits */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <Star className="h-5 w-5 text-jaay-orange" />
                  Top produits vendus
                </h2>
                {topProducts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    Aucune vente sur cette période
                  </div>
                ) : (
                  <div className="space-y-4">
                    {topProducts.map(([name, qty], i) => {
                      const product = products.find((p) => p.name === name);
                      const maxQty = topProducts[0][1];
                      return (
                        <div key={name}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{product?.emoji || "📦"}</span>
                              <span className="text-sm font-medium truncate max-w-[150px]">{name}</span>
                            </div>
                            <span className="text-sm font-bold text-jaay-green">{qty} vendus</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="h-2 rounded-full"
                              style={{
                                width: `${(qty / maxQty) * 100}%`,
                                background: i === 0 ? "oklch(0.65 0.19 45)" : "oklch(0.35 0.12 145)",
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Revenus par catégorie */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <Package className="h-5 w-5 text-jaay-green" />
                  Revenus par catégorie
                </h2>
                {Object.keys(revenueByCategory).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    Aucun revenu sur cette période
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(revenueByCategory)
                      .sort(([, a], [, b]) => b - a)
                      .map(([category, revenue]) => {
                        const maxRevenue = Math.max(...Object.values(revenueByCategory));
                        return (
                          <div key={category}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">{category}</span>
                              <span className="text-sm font-bold text-jaay-green">{formatPrice(revenue)}</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className="h-2 rounded-full"
                                style={{
                                  width: `${(revenue / maxRevenue) * 100}%`,
                                  background: "oklch(0.35 0.12 145)",
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>

            {/* Statut commandes */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-jaay-green" />
                Répartition des commandes
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { status: "en_attente", label: "En attente", emoji: "⏳", color: "bg-yellow-100 text-yellow-700" },
                  { status: "confirme", label: "Confirmées", emoji: "✅", color: "bg-blue-100 text-blue-700" },
                  { status: "en_livraison", label: "En livraison", emoji: "🚚", color: "bg-purple-100 text-purple-700" },
                  { status: "livre", label: "Livrées", emoji: "🎉", color: "bg-green-100 text-green-700" },
                  { status: "annule", label: "Annulées", emoji: "❌", color: "bg-red-100 text-red-700" },
                ].map((s) => {
                  const count = orders.filter((o) => o.status === s.status).length;
                  const percent = totalOrders > 0 ? Math.round((count / totalOrders) * 100) : 0;
                  return (
                    <div key={s.status} className={`rounded-xl p-4 text-center ${s.color}`}>
                      <div className="text-2xl mb-1">{s.emoji}</div>
                      <div className="text-2xl font-bold">{count}</div>
                      <div className="text-xs font-medium">{s.label}</div>
                      <div className="text-xs opacity-70">{percent}%</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions rapides */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link href="/seller/add-product"
                className="flex items-center gap-3 bg-card border border-border rounded-xl p-4 hover:shadow-md transition">
                <span className="text-2xl">➕</span>
                <div>
                  <p className="font-semibold text-sm">Ajouter produit</p>
                  <p className="text-xs text-muted-foreground">Publier avec IA</p>
                </div>
              </Link>
              <Link href="/seller/orders"
                className="flex items-center gap-3 bg-card border border-border rounded-xl p-4 hover:shadow-md transition">
                <span className="text-2xl">📦</span>
                <div>
                  <p className="font-semibold text-sm">Voir commandes</p>
                  <p className="text-xs text-muted-foreground">{pendingOrders} en attente</p>
                </div>
              </Link>
              <Link href="/seller/dashboard"
                className="flex items-center gap-3 bg-card border border-border rounded-xl p-4 hover:shadow-md transition">
                <span className="text-2xl">📊</span>
                <div>
                  <p className="font-semibold text-sm">Dashboard</p>
                  <p className="text-xs text-muted-foreground">Vue d&apos;ensemble</p>
                </div>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}