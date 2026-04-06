"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface FavoritesContextType {
  favorites: string[];
  phone: string;
  setPhone: (phone: string) => void;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  totalFavorites: number;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [phone, setPhoneState] = useState("");

  useEffect(() => {
    const savedPhone = localStorage.getItem("jaay-phone");
    if (savedPhone) {
      setPhoneState(savedPhone);
      loadFavorites(savedPhone);
    }
  }, []);

  async function loadFavorites(phoneNumber: string) {
    if (!phoneNumber) return;
    const supabase = createClient();
    const { data } = await supabase
      .from("favorites")
      .select("product_id")
      .eq("phone", phoneNumber);
    if (data) setFavorites(data.map((f) => f.product_id));
  }

  function setPhone(phoneNumber: string) {
    setPhoneState(phoneNumber);
    localStorage.setItem("jaay-phone", phoneNumber);
    loadFavorites(phoneNumber);
  }

  async function toggleFavorite(productId: string) {
    if (!phone) {
      const userPhone = prompt("Entrez votre numéro pour sauvegarder vos favoris :");
      if (!userPhone) return;
      setPhone(userPhone);
      return;
    }

    const supabase = createClient();
    const isFav = favorites.includes(productId);

    if (isFav) {
      await supabase.from("favorites").delete()
        .eq("phone", phone)
        .eq("product_id", productId);
      setFavorites((prev) => prev.filter((id) => id !== productId));
    } else {
      await supabase.from("favorites").insert([{ phone, product_id: productId }]);
      setFavorites((prev) => [...prev, productId]);
    }
  }

  function isFavorite(productId: string) {
    return favorites.includes(productId);
  }

  return (
    <FavoritesContext.Provider value={{
      favorites,
      phone,
      setPhone,
      toggleFavorite,
      isFavorite,
      totalFavorites: favorites.length,
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside FavoritesProvider");
  return ctx;
}