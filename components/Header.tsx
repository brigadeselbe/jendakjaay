"use client";

import { Search, ShoppingCart, Menu, Heart, Phone, X, Camera } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import ImageSearch from "@/components/ImageSearch";
import Logo from "@/components/Logo";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [imageSearchOpen, setImageSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { totalItems } = useCart();
  const { totalFavorites } = useFavorites();
  const router = useRouter();

  function handleSearch(e?: React.FormEvent) {
    e?.preventDefault();
    const q = searchQuery.trim();
    if (q) router.push(`/?q=${encodeURIComponent(q)}`);
    else router.push("/");
    setMobileMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* Logo */}
          <Logo />

          {/* Barre de recherche unifiée — desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl">
            <div className="relative w-full flex items-center">
              {/* Icône loupe à gauche */}
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />

              {/* Champ de texte */}
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher des produits, marques..."
                className="w-full pl-10 pr-24 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
              />

              {/* Bouton appareil photo intégré */}
              <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setImageSearchOpen(true)}
                  className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-primary"
                  title="Rechercher par photo"
                  aria-label="Recherche par image"
                >
                  <Camera className="h-4 w-4" />
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm px-3 text-xs"
                >
                  Chercher
                </button>
              </div>
            </div>
          </form>

          {/* Actions droite */}
          <div className="flex items-center gap-1.5">

            {/* Favoris */}
            <Link href="/favorites" className="relative p-2.5 rounded-xl hover:bg-accent transition-colors hidden md:flex items-center">
              <Heart className="h-5 w-5" />
              {totalFavorites > 0 && (
                <span className="absolute -top-0.5 -right-0.5 text-white font-bold w-4 h-4 rounded-full flex items-center justify-center text-[10px]"
                  style={{ background: "red" }}>
                  {totalFavorites}
                </span>
              )}
            </Link>

            {/* Panier */}
            <Link href="/cart" className="relative p-2.5 rounded-xl hover:bg-accent transition-colors flex items-center">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: "oklch(0.65 0.19 45)" }}>
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Link>

            <a href="tel:+221783854465"
              className="hidden lg:flex items-center gap-1.5 btn btn-ghost btn-sm text-xs">
              <Phone className="h-3.5 w-3.5" />
              +221 78 385 44 65
            </a>

            <Link href="/auth/login"
              className="hidden md:flex btn btn-outline btn-sm">
              Connexion
            </Link>

            <Link href="/seller"
              className="hidden md:flex btn btn-secondary btn-sm">
              🏪 Vendre
            </Link>

            <button
              className="md:hidden p-2.5 rounded-xl hover:bg-accent transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Barre de recherche unifiée — mobile */}
        <div className="pb-3 md:hidden">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher..."
              className="w-full pl-10 pr-20 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => setImageSearchOpen(true)}
                className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-primary"
                aria-label="Recherche par image"
              >
                <Camera className="h-4 w-4" />
              </button>
              <button type="submit" className="btn btn-primary btn-sm px-2.5">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Menu mobile déroulant */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-3 space-y-1 animate-fade-in-up">
            <Link href="/profile" onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-accent text-sm font-medium transition-colors">
              👤 Mon profil
            </Link>
            <Link href="/favorites" onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-accent text-sm font-medium transition-colors">
              <Heart className="h-4 w-4" />
              Favoris {totalFavorites > 0 && `(${totalFavorites})`}
            </Link>
            <Link href="/orders" onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-accent text-sm font-medium transition-colors">
              📦 Mes commandes
            </Link>
            <Link href="/help" onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-accent text-sm font-medium transition-colors">
              ❓ Aide
            </Link>
            <div className="pt-2 flex flex-col gap-2">
              <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}
                className="btn btn-outline btn-full">
                🔐 Connexion
              </Link>
              <Link href="/seller" onClick={() => setMobileMenuOpen(false)}
                className="btn btn-secondary btn-full">
                🏪 Devenir vendeur
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Modal recherche par image — controllée depuis le header */}
      <ImageSearch
        open={imageSearchOpen}
        onClose={() => setImageSearchOpen(false)}
      />
    </header>
  );
}
