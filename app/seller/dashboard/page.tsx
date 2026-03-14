"use client";

import { useState, useEffect } from "react";
import { Plus, Package, Eye, Trash2, Store } from "lucide-react";
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

export default function SellerDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const supabase = createClient();
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setProducts(data);
    setLoading(false);
  }

  async function deleteProduct(id: string) {
    if (!confirm("Supprimer ce produit ?")) return;
    const supabase = createClient();
    await supabase.from("products").delete().eq("id", id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">

        {/* Header dashboard */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Mon Tableau de Bord</h1>
            <p className="text-muted-foreground text-sm">Gérez vos produits et ventes</p>
          </div>
          <Link
            href="/seller/add-product"
            className="flex items-center gap-2 text-white px-4 py-2 rounded-xl font-medium hover:opacity-90 transition"
            style={{ background: "oklch(0.35 0.12 145)" }}
          >
            <Plus className="h-5 w-5" />
            Ajouter un produit
          </Link>
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