"use client";

import { useState, useEffect, useMemo } from "react";
import { Heart, ShoppingCart, Star } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
  seller_region: string;
  category: string;
  emoji: string;
  badge: string | null;
  image_url: string | null;
}

interface Filters {
  category: string;
  region: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  sortBy: string;
}

interface ProductGridProps {
  selectedCategory?: string;
  filters?: Filters;
}

function formatPrice(price: number) {
  return price.toLocaleString("fr-SN") + " FCFA";
}

export default function ProductGrid({ selectedCategory = "Tous", filters }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [added, setAdded] = useState<string[]>([]);
  const { addItem } = useCart();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") ?? "";

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
      } catch {
        setErreur("Impossible de charger les produits");
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const filtered = useMemo(() => {
    let result = [...products];

    // Filtre recherche texte (depuis la barre de recherche)
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.seller_name?.toLowerCase().includes(q) ||
        p.seller_location?.toLowerCase().includes(q)
      );
    }

    // Filtre catégorie (depuis CategoryNav)
    if (selectedCategory && selectedCategory !== "Tous") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (filters) {
      // Filtre catégorie (depuis ProductFilters sidebar)
      if (filters.category) {
        result = result.filter((p) => p.category === filters.category);
      }
      // Filtre région
      if (filters.region) {
        result = result.filter((p) =>
          p.seller_region === filters.region || p.seller_location?.includes(filters.region)
        );
      }
      // Filtre prix
      result = result.filter((p) => p.price >= filters.minPrice && p.price <= filters.maxPrice);
      // Filtre note
      if (filters.minRating > 0) {
        result = result.filter((p) => p.rating >= filters.minRating);
      }
      // Tri
      switch (filters.sortBy) {
        case "price_asc":
          result.sort((a, b) => a.price - b.price);
          break;
        case "price_desc":
          result.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          result.sort((a, b) => b.rating - a.rating);
          break;
      }
    }

    return result;
  }, [products, selectedCategory, filters, searchQuery]);

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
      <section className="py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-muted rounded-xl h-72 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (erreur) {
    return (
      <section className="py-16 text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold mb-2">Erreur de connexion</h2>
        <p className="text-muted-foreground text-sm mb-4">{erreur}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-jaay-green text-white px-6 py-2 rounded-lg text-sm hover:opacity-90"
        >
          Réessayer
        </button>
      </section>
    );
  }

  if (filtered.length === 0) {
    return (
      <section className="py-16 text-center">
        <div className="text-4xl mb-4">🔍</div>
        <h2 className="text-xl font-bold mb-2">Aucun produit trouvé</h2>
        <p className="text-muted-foreground text-sm">Essayez d&apos;autres filtres</p>
      </section>
    );
  }

  return (
    <section className="py-4">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{filtered.length}</span> produit(s) trouvé(s)
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow group block"
          >
            {/* Image */}
            <div className="relative h-48 bg-muted flex items-center justify-center text-7xl overflow-hidden">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                product.emoji
              )}
              {product.badge && (
                <span className="absolute top-3 left-3 text-white text-xs font-semibold px-2 py-1 rounded-full"
                  style={{ background: "oklch(0.65 0.19 45)" }}>
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
                  <Star key={i} className="h-3 w-3"
                    fill={i < Math.floor(product.rating) ? "oklch(0.65 0.19 45)" : "none"}
                    stroke="oklch(0.65 0.19 45)" />
                ))}
                <span className="text-xs text-muted-foreground">({product.reviews_count})</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg font-bold text-jaay-green">{formatPrice(product.price)}</span>
                {product.original_price && (
                  <span className="text-sm text-muted-foreground line-through">{formatPrice(product.original_price)}</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                📍 {product.seller_name} · {product.seller_location}
              </p>
              <button
                onClick={(e) => handleAddToCart(product, e)}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all text-white"
                style={{ background: "oklch(0.35 0.12 145)", opacity: added.includes(product.id) ? 0.85 : 1 }}
              >
                <ShoppingCart className="h-4 w-4" />
                {added.includes(product.id) ? "✓ Ajouté !" : "Ajouter au panier"}
              </button>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
