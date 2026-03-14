"use client";

import { Search, ShoppingCart, Menu, User, Heart, Phone } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import Image from "next/image";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Jënd ak Jaay"
              width={140}
              height={50}
              className="h-10 w-auto"
              priority
            />
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
              <button className="bg-jaay-green text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90">
                Chercher
              </button>
            </div>
          </div>

          {/* Actions droite */}
          <div className="flex items-center gap-2">
            <button className="hidden md:flex p-2 rounded-lg hover:bg-accent">
              <Heart className="h-5 w-5" />
            </button>
            <Link href="/cart" className="relative p-2 rounded-lg hover:bg-accent">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-jaay-orange text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Link>
            <a href="tel:+221783854465" className="hidden lg:flex items-center gap-1 border border-border px-3 py-2 rounded-lg text-sm hover:bg-accent">
              <Phone className="h-4 w-4" />
              +221 78 385 44 65
            </a>
            <button className="hidden md:flex items-center gap-1 border border-border px-3 py-2 rounded-lg text-sm hover:bg-accent">
              <User className="h-4 w-4" />
              Connexion
            </button>
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Recherche mobile */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Rechercher..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Menu mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-3 space-y-2">
            <button className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-accent text-sm">
              <User className="h-4 w-4" /> Connexion
            </button>
            <button className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-accent text-sm">
              <Heart className="h-4 w-4" /> Favoris
            </button>
          </div>
        )}
      </div>
    </header>
  );
}