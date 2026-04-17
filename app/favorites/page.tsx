"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useCart } from "@/contexts/CartContext";
import { createClient } from "@/lib/supabase/client";

interface Product {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  category: string;
  emoji: string;
  image_url: string | null;
  seller_name: string;
  seller_location: string;
}

function formatPrice(price: number) {
  return price.toLocaleString("fr-SN") + " FCFA";
}

export default function FavoritesPage() {
  const { favorites, toggleFavorite, isFavorite, phone, setPhone } = useFavorites();
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [phoneInput, setPhoneInput] = useState("");

  useEffect(() => {
    if (favorites.length > 0) loadProducts();
    else setLoading(false);
  }, [favorites]);

  async function loadProducts() {
    const supabase = createClient();
    const { data } = await supabase
      .from("products")
      .select("*")
      .in("id", favorites);
    if (data) setProducts(data);
    setLoading(false);
  }

  if (!phone) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">❤️</div>
            <h2 className="text-2xl font-bold mb-2">Mes Favoris</h2>
            <p className="text-muted-foreground mb-6">
              Entrez votre numéro pour accéder à vos favoris sauvegardés
            </p>
            <div className="flex gap-2">
              <input
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="77 123 45 67"
                className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                onClick={() => setPhone(phoneInput)}
                className="px-4 py-3 rounded-xl text-white font-medium hover:opacity-90 transition"
                style={{ background: "oklch(0.35 0.12 145)" }}
              >
                Accéder
              </button>
            </div>
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

        <div className="flex items-center gap-4 mb-8">
          <BackButton />
          <div>
            <h1 className="text-2xl font-bold">Mes Favoris</h1>
            <p className="text-muted-foreground text-sm">{favorites.length} produit{favorites.length > 1 ? "s" : ""} sauvegardé{favorites.length > 1 ? "s" : ""}</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-muted rounded-xl h-72 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💔</div>
            <h2 className="text-xl font-bold mb-2">Aucun favori</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Ajoutez des produits à vos favoris en cliquant sur ❤️
            </p>
            <Link href="/"
              className="inline-block text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition"
              style={{ background: "oklch(0.35 0.12 145)" }}>
              Explorer les produits
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow group">
                <Link href={`/product/${product.id}`}>
                  <div className="relative h-48 bg-muted flex items-center justify-center text-7xl overflow-hidden">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                    ) : product.emoji}
                    <button
                      onClick={(e) => { e.preventDefault(); toggleFavorite(product.id); }}
                      className="absolute top-3 right-3 p-2 bg-white rounded-full shadow hover:scale-110 transition-transform"
                    >
                      <Heart className="h-4 w-4"
                        fill={isFavorite(product.id) ? "red" : "none"}
                        stroke={isFavorite(product.id) ? "red" : "currentColor"} />
                    </button>
                  </div>
                  <div className="p-4">
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                    <h3 className="font-semibold mt-2 mb-1 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-bold text-jaay-green">{formatPrice(product.price)}</span>
                      {product.original_price && (
                        <span className="text-sm text-muted-foreground line-through">{formatPrice(product.original_price)}</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-4">
                      📍 {product.seller_name} · {product.seller_location}
                    </p>
                  </div>
                </Link>
                <div className="px-4 pb-4">
                  <button
                    onClick={() => addItem({ id: Number(product.id), name: product.name, price: product.price, emoji: product.emoji, seller: product.seller_name })}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition"
                    style={{ background: "oklch(0.35 0.12 145)" }}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Ajouter au panier
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}