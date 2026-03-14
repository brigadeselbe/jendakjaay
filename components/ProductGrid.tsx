"use client";

import { useState, useEffect } from "react";
import { Heart, ShoppingCart, Star } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { createClient } from "@/lib/supabase/client";

interface Product {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  rating: number;
  reviews_count: number;
  seller_name: string;
  seller_location: string;
  category: string;
  emoji: string;
  badge: string | null;
  image_url: string | null;
}

function formatPrice(price: number) {
  return price.toLocaleString("fr-SN") + " FCFA";
}

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [added, setAdded] = useState<string[]>([]);
  const { addItem } = useCart();

  useEffect(() => {
    async function loadProducts() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) {
          setErreur(error.message);
        } else if (data) {
          setProducts(data);
        }
      } catch (e) {
        setErreur("Impossible de charger les produits");
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  function toggleFavorite(id: string, e: React.MouseEvent) {
    e.preventDefault();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }

  function handleAddToCart(product: Product, e: React.MouseEvent) {
    e.preventDefault();
    addItem({
      id: Number(product.id),
      name: product.name,
      price: product.price,
      emoji: product.emoji,
      seller: product.seller_name,
    });
    setAdded((prev) => [...prev, product.id]);
    setTimeout(() => {
      setAdded((prev) => prev.filter((id) => id !== product.id));
    }, 1500);
  }

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Produits Populaires</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-muted rounded-xl h-72 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (erreur) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2">Erreur de connexion</h2>
          <p className="text-muted-foreground text-sm mb-4">{erreur}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-jaay-green text-white px-6 py-2 rounded-lg text-sm hover:opacity-90"
          >
            Réessayer
          </button>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="text-4xl mb-4">📦</div>
          <h2 className="text-xl font-bold mb-2">Aucun produit trouvé</h2>
          <p className="text-muted-foreground text-sm">Les produits arrivent bientôt !</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-1">Produits Populaires</h2>
            <p className="text-muted-foreground">Les meilleurs produits de nos vendeurs locaux</p>
          </div>
          <button className="hidden md:block border border-border px-4 py-2 rounded-lg text-sm hover:bg-accent transition-colors">
            Voir tout →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow group block"
            >
              {/* Image */}
              <div className="relative h-48 bg-muted flex items-center justify-center text-7xl overflow-hidden">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  product.emoji
                )}
                {product.badge && (
                  <span
                    className="absolute top-3 left-3 text-white text-xs font-semibold px-2 py-1 rounded-full"
                    style={{ background: "oklch(0.65 0.19 45)" }}
                  >
                    {product.badge}
                  </span>
                )}
                <button
                  onClick={(e) => toggleFavorite(product.id, e)}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow hover:scale-110 transition-transform"
                >
                  <Heart
                    className="h-4 w-4"
                    fill={favorites.includes(product.id) ? "red" : "none"}
                    stroke={favorites.includes(product.id) ? "red" : "currentColor"}
                  />
                </button>
              </div>

              {/* Contenu */}
              <div className="p-4">
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  {product.category}
                </span>
                <h3 className="font-semibold mt-2 mb-1 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-3 w-3"
                      fill={i < Math.floor(product.rating) ? "oklch(0.65 0.19 45)" : "none"}
                      stroke="oklch(0.65 0.19 45)"
                    />
                  ))}
                  <span className="text-xs text-muted-foreground">({product.reviews_count})</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg font-bold text-jaay-green">
                    {formatPrice(product.price)}
                  </span>
                  {product.original_price && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(product.original_price)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  📍 {product.seller_name} · {product.seller_location}
                </p>
                <button
                  onClick={(e) => handleAddToCart(product, e)}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all text-white"
                  style={{
                    background: "oklch(0.35 0.12 145)",
                    opacity: added.includes(product.id) ? 0.85 : 1,
                  }}
                >
                  <ShoppingCart className="h-4 w-4" />
                  {added.includes(product.id) ? "✓ Ajouté !" : "Ajouter au panier"}
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}