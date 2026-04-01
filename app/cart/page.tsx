"use client";

import { Trash2, ShoppingBag, ArrowLeft, Plus, Minus } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function formatPrice(price: number) {
  return price.toLocaleString("fr-SN") + " FCFA";
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-4">
          <div className="text-7xl">🛒</div>
          <h2 className="text-2xl font-bold">Votre panier est vide</h2>
          <p className="text-muted-foreground max-w-sm">
            Découvrez nos produits et ajoutez-les à votre panier
          </p>
          <Link href="/" className="text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition"
            style={{ background: "oklch(0.35 0.12 145)" }}>
            Continuer mes achats
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const livraison = totalPrice >= 50000 ? 0 : 2500;
  const total = totalPrice + livraison;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">

        {/* Titre */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="p-2 rounded-lg hover:bg-accent transition">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold">Mon Panier</h1>
          <span
            className="text-white text-sm font-medium px-2 py-0.5 rounded-full"
            style={{ background: "oklch(0.65 0.19 45)" }}
          >
            {items.length} article{items.length > 1 ? "s" : ""}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Liste articles */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-card border border-border rounded-xl p-4 flex gap-4">
                <div className="w-20 h-20 bg-muted rounded-xl flex items-center justify-center text-4xl flex-shrink-0">
                  {item.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{item.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">Vendeur : {item.seller}</p>
                  <p className="font-bold text-jaay-green">{formatPrice(item.price)}</p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded-lg transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="flex items-center border border-border rounded-lg">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 hover:bg-accent transition">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="px-3 text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 hover:bg-accent transition">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button onClick={clearCart}
              className="text-sm text-muted-foreground hover:text-red-500 transition flex items-center gap-1">
              <Trash2 className="h-4 w-4" />
              Vider le panier
            </button>
          </div>

          {/* Résumé */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
              <h2 className="font-bold text-lg mb-4">Résumé</h2>

              <div className="space-y-3 mb-4">
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
                {livraison > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Livraison gratuite dès 50 000 FCFA
                  </p>
                )}
                <div className="border-t border-border pt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-jaay-green text-lg">{formatPrice(total)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full text-white py-3 rounded-xl font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
                style={{ background: "oklch(0.35 0.12 145)" }}
              >
                <ShoppingBag className="h-5 w-5" />
                Commander maintenant
              </Link>

              <div className="mt-4 space-y-2">
                <p className="text-xs text-center text-muted-foreground">Paiement sécurisé</p>
                <div className="flex justify-center gap-2 text-xs text-muted-foreground">
                  <span>📱 Wave</span>
                  <span>🟠 Orange Money</span>
                  <span>🔵 Free Money</span>
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