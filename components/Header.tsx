"use client";

import { Search, ShoppingCart, Menu, Heart, Phone } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import ImageSearch from "@/components/ImageSearch";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { totalFavorites } = useFavorites();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="Jënd ak Jaay" className="h-10 w-auto" />
          </Link>

          {/* Barre de recherche desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full flex gap-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Rechercher des produits..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                className="text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90"
                style={{ background: "oklch(0.35 0.12 145)" }}
              >
                Chercher
              </button>
            </div>
          </div>

          {/* Actions droite */}
          <div className="flex items-center gap-2">

            {/* Recherche par image */}
            <div className="hidden md:block">
              <ImageSearch />
            </div>

            {/* Favoris */}
            <Link href="/favorites" className="hidden md:flex relative p-2 rounded-lg hover:bg-accent">
              <Heart className="h-5 w-5" />
              {totalFavorites > 0 && (
                <span
                  className="absolute -top-1 -right-1 text-white font-bold w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: "red", fontSize: "10px" }}
                >
                  {totalFavorites}
                </span>
              )}
            </Link>

            {/* Panier */}
            <Link href="/cart" className="relative p-2 rounded-lg hover:bg-accent">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span
                  className="absolute -top-1 -right-1 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: "oklch(0.65 0.19 45)" }}
                >
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Link>

            <a href="tel:+221783854465" className="hidden lg:flex items-center gap-1 border border-border px-3 py-2 rounded-lg text-sm hover:bg-accent">
              <Phone className="h-4 w-4" />
              +221 78 385 44 65
            </a>

            <Link href="/profile"
              className="hidden md:flex items-center gap-1 border border-border px-3 py-2 rounded-lg text-sm hover:bg-accent">
              👤 Mon profil
            </Link>

            <Link href="/auth/login"
              className="hidden md:flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition"
              style={{ background: "oklch(0.35 0.12 145)" }}>
              Connexion
            </Link>

            <Link href="/seller"
              className="hidden md:flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition"
              style={{ background: "oklch(0.65 0.19 45)" }}>
              🏪 Vendre
            </Link>

            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Recherche mobile */}
        <div className="pb-3 md:hidden">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none"
              />
            </div>
            <ImageSearch />
          </div>
        </div>

        {/* Menu mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-3 space-y-2">
            <Link href="/profile" className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-accent text-sm">
              👤 Mon profil
            </Link>
            <Link href="/favorites" className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-accent text-sm">
              <Heart className="h-4 w-4" /> Favoris {totalFavorites > 0 && `(${totalFavorites})`}
            </Link>
            <Link href="/auth/login" className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-accent text-sm">
              🔐 Connexion vendeur
            </Link>
            <Link href="/seller" className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-accent text-sm">
              🏪 Devenir vendeur
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}