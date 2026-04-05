"use client";

import React, { useState, useEffect } from "react";
import { Plus, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  emoji: string;
  badge: string | null;
  in_stock: boolean;
  created_at: string;
}

function formatPrice(price: number) {
  return price.toLocaleString("fr-SN") + " FCFA";
}

export default function SellerDashboard(): JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchProducts() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from<Product>("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (!mounted) return;
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("loadProducts error", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchProducts();
    return () => {
      mounted = false;
    };
  }, []);

  async function deleteProduct(id: string) {
    if (!confirm("Supprimer ce produit ?")) return;
    try {
      const supabase = createClient();
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("deleteProduct error", err);
      alert("Impossible de supprimer le produit. Réessayez.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">

        {/* Header dashboard */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">Mon Tableau de Bord</h1>
            <p className="text-muted-foreground text-sm">Gérez vos produits et ventes</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/seller/orders"
              className="flex items-center gap-2 border border-border px-4 py-2 rounded-xl font-medium hover:bg-accent transition text-sm"
            >
              📦 Voir les commandes
            </Link>
            <Link
              href="/seller/add-product"
              className="flex items-center gap-2 text-white px-4 py-2 rounded-xl font-medium hover:opacity-90 transition text-sm"
              style={{ background: "oklch(0.35 0.12 145)" }}
            >
              <Plus className="h-5 w-5" />
              Ajouter un produit
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Produits", value: products.length, emoji: "📦" },
            { label: "En stock", value: products.filter((p) => p.in_stock).length, emoji: "✅" },
            { label: "Vues", value: "—", emoji: "👁️" },
            { label: "Commandes", value: "—", emoji: "🛒" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-4 text-center">
              <div className="text-2xl mb-1">{stat.emoji}</div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Liens rapides */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Link href="/seller/add-product"
            className="flex items-center gap-3 bg-card border border-border rounded-xl p-4 hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xl"
              style={{ background: "oklch(0.35 0.12 145)" }}>
              ➕
            </div>
            <div>
              <p className="font-semibold text-sm">Ajouter un produit</p>
              <p className="text-xs text-muted-foreground">Publier avec IA</p>
            </div>
          </Link>
          <Link href="/seller/orders"
            className="flex items-center gap-3 bg-card border border-border rounded-xl p-4 hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xl"
              style={{ background: "oklch(0.65 0.19 45)" }}>
              📦
            </div>
            <div>
              <p className="font-semibold text-sm">Commandes reçues</p>
              <p className="text-xs text-muted-foreground">Gérer les commandes</p>
            </div>
          </Link>
          <Link href="/seller"
            className="flex items-center gap-3 bg-card border border-border rounded-xl p-4 hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xl"
              style={{ background: "#25D366" }}>
              💬
            </div>
            <div>
              <p className="font-semibold text-sm">Mon profil vendeur</p>
              <p className="text-xs text-muted-foreground">Modifier ma boutique</p>
            </div>
          </Link>
        </div>

        {/* Liste produits */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="font-semibold">Mes Produits</h2>
            <span className="text-sm text-muted-foreground">{products.length} produits</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Chargement...</div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-4xl mb-3">📦</div>
              <p className="font-medium mb-2">Aucun produit</p>
              <p className="text-sm text-muted-foreground mb-4">Ajoutez votre premier produit !</p>
              <Link
                href="/seller/add-product"
                className="inline-flex items-center gap-2 text-white px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition"
                style={{ background: "oklch(0.35 0.12 145)" }}
              >
                <Plus className="h-4 w-4" />
                Ajouter un produit
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {products.map((product) => (
                <div key={product.id} className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    {product.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-jaay-green">{formatPrice(product.price)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${product.in_stock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {product.in_stock ? "En stock" : "Rupture"}
                    </span>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Link href={`/product/${product.id}`} className="p-2 hover:bg-accent rounded-lg transition">
                      <Eye className="h-4 w-4" />
                    </Link>
                    <button onClick={() => deleteProduct(product.id)} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg transition">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}