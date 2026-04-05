"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Heart, ShoppingCart, Star, ArrowLeft, Share2, Shield, Truck, RotateCcw } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import WhatsAppButton from "@/components/WhatsAppButton";
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
  description: string | null;
}

interface Review {
  id: string;
  buyer_name: string;
  rating: number;
  comment: string;
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

export default function ProductDetail() {
  const params = useParams();
  const productId = params?.id ?? null;
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [favorite, setFavorite] = useState(false);
  const [added, setAdded] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [newReview, setNewReview] = useState({
    buyer_name: "",
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    if (!productId) return;
    loadProduct();
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  async function loadProduct() {
    if (!productId) return;
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from<Product>("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (error) throw error;
      if (data) setProduct(data);
    } catch (err) {
      console.error("loadProduct error", err);
    } finally {
      setLoading(false);
    }
  }

  async function loadReviews() {
    if (!productId) return;
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from<Review>("reviews")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) setReviews(data);
    } catch (err) {
      console.error("loadReviews error", err);
    }
  }

  async function submitReview() {
    if (!productId) return;
    if (!newReview.buyer_name || !newReview.comment) {
      alert("Veuillez remplir tous les champs !");
      return;
    }
    setReviewLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("reviews").insert([{
        product_id: productId,
        buyer_name: newReview.buyer_name,
        rating: newReview.rating,
        comment: newReview.comment,
      }]);

      if (error) throw error;
      setNewReview({ buyer_name: "", rating: 5, comment: "" });
      setShowReviewForm(false);
      await loadReviews();
    } catch (err) {
      console.error("submitReview error", err);
      alert("Erreur lors de l'envoi. Réessayez !");
    } finally {
      setReviewLoading(false);
    }
  }

  function handleAddToCart() {
    if (!product) return;
    addItem({
      id: product.id, // keep id as string to avoid NaN issues
      name: product.name,
      price: product.price,
      emoji: product.emoji,
      seller: product.seller_name,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-muted rounded-2xl h-80 animate-pulse" />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-muted rounded-xl h-10 animate-pulse" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">😕</div>
            <h2 className="text-xl font-bold mb-2">Produit introuvable</h2>
            <Link href="/" className="text-jaay-green hover:underline">Retour à l&apos;accueil</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : product.rating;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">

        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Retour aux produits
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">

          {/* Image */}
          <div className="relative bg-muted rounded-2xl flex items-center justify-center h-80 md:h-full min-h-[320px] overflow-hidden">
            {product.image_url ? (
              // use plain img; Next/Image could be used instead if configured
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-9xl">{product.emoji}</span>
            )}
            {product.badge && (
              <span className="absolute top-4 left-4 text-white text-sm font-semibold px-3 py-1 rounded-full"
                style={{ background: "oklch(0.65 0.19 45)" }}>
                {product.badge}
              </span>
            )}
            {discount && (
              <span className="absolute top-4 right-4 bg-red-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                -{discount}%
              </span>
            )}
          </div>

          {/* Infos */}
          <div>
            <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
              {product.category}
            </span>

            <h1 className="text-3xl font-bold mt-3 mb-2">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4"
                    fill={i < Math.floor(avgRating) ? "oklch(0.65 0.19 45)" : "none"}
                    stroke="oklch(0.65 0.19 45)" />
                ))}
              </div>
              <span className="text-sm font-medium">{avgRating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">({reviews.length} avis)</span>
            </div>

            {/* Prix */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-jaay-green">{formatPrice(product.price)}</span>
              {product.original_price && (
                <span className="text-lg text-muted-foreground line-through">{formatPrice(product.original_price)}</span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-muted-foreground mb-6 leading-relaxed">{product.description}</p>
            )}

            {/* Vendeur */}
            <div className="flex items-center gap-3 p-4 bg-muted rounded-xl mb-6">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                style={{ background: "oklch(0.35 0.12 145)" }}>
                {product.seller_name[0]}
              </div>
              <div>
                <p className="font-medium text-sm">{product.seller_name}</p>
                <p className="text-xs text-muted-foreground">📍 {product.seller_location}</p>
              </div>
            </div>

            {/* Quantité */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium">Quantité :</span>
              <div className="flex items-center border border-border rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-accent transition-colors">−</button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-accent transition-colors">+</button>
              </div>
            </div>

            {/* Boutons */}
            <div className="flex gap-3 mb-4">
              <button onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white transition-all"
                style={{ background: "oklch(0.35 0.12 145)", opacity: added ? 0.85 : 1 }}>
                <ShoppingCart className="h-5 w-5" />
                {added ? "✓ Ajouté !" : "Ajouter au panier"}
              </button>
              <button onClick={() => setFavorite(!favorite)}
                className="p-3 border border-border rounded-xl hover:bg-accent transition-colors">
                <Heart className="h-5 w-5"
                  fill={favorite ? "red" : "none"}
                  stroke={favorite ? "red" : "currentColor"} />
              </button>
              <button className="p-3 border border-border rounded-xl hover:bg-accent transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>

            {/* WhatsApp */}
            <div className="mb-6">
              <WhatsAppButton productName={product.name} price={product.price} phone="221783854465" />
            </div>

            {/* Garanties */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <Shield className="h-4 w-4" />, text: "Paiement sécurisé" },
                { icon: <Truck className="h-4 w-4" />, text: "Livraison rapide" },
                { icon: <RotateCcw className="h-4 w-4" />, text: "Retour facile" },
              ].map((item) => (
                <div key={item.text} className="flex flex-col items-center gap-1 p-3 bg-muted rounded-xl text-center">
                  <span className="text-jaay-green">{item.icon}</span>
                  <span className="text-xs text-muted-foreground">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section Avis */}
        <div className="border-t pt-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-1">Avis clients</h2>
              <p className="text-muted-foreground text-sm">{reviews.length} avis pour ce produit</p>
            </div>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="flex items-center gap-2 text-white px-4 py-2 rounded-xl font-medium hover:opacity-90 transition text-sm"
              style={{ background: "oklch(0.35 0.12 145)" }}
            >
              ✍️ Laisser un avis
            </button>
          </div>

          {/* Formulaire avis */}
          {showReviewForm && (
            <div className="bg-card border border-border rounded-2xl p-6 mb-8 space-y-4">
              <h3 className="font-semibold">Votre avis</h3>

              <div>
                <label className="text-sm font-medium mb-1 block">Votre nom *</label>
                <input
                  value={newReview.buyer_name}
                  onChange={(e) => setNewReview({ ...newReview, buyer_name: e.target.value })}
                  placeholder="Ex: Aminata D."
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Note *</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="text-3xl transition-transform hover:scale-110"
                      type="button"
                    >
                      <Star
                        className="h-8 w-8"
                        fill={star <= newReview.rating ? "oklch(0.65 0.19 45)" : "none"}
                        stroke="oklch(0.65 0.19 45)"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Commentaire *</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Partagez votre expérience avec ce produit..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={submitReview}
                  disabled={reviewLoading}
                  className="flex-1 py-3 rounded-xl font-semibold text-white hover:opacity-90 transition disabled:opacity-50"
                  style={{ background: "oklch(0.35 0.12 145)" }}
                >
                  {reviewLoading ? "Envoi..." : "Publier mon avis 🚀"}
                </button>
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="px-6 py-3 rounded-xl border border-border hover:bg-accent transition"
                  type="button"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}

          {/* Liste avis */}
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">💬</div>
              <p className="font-medium mb-1">Aucun avis pour le moment</p>
              <p className="text-sm text-muted-foreground">Soyez le premier à laisser un avis !</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                        style={{ background: "oklch(0.35 0.12 145)" }}>
                        {review.buyer_name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{review.buyer_name}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(review.created_at)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4"
                          fill={i < review.rating ? "oklch(0.65 0.19 45)" : "none"}
                          stroke="oklch(0.65 0.19 45)" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
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