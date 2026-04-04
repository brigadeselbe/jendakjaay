"use client";

import { useState } from "react";

const categories = [
  "Alimentation", "Mode & Vêtements", "Électronique",
  "Artisanat", "Maison & Déco", "Beauté & Santé",
  "Agriculture", "Services",
];

const regions = [
  "Dakar", "Thiès", "Saint-Louis", "Diourbel",
  "Louga", "Kaolack", "Ziguinchor", "Kolda",
];

const sortOptions = [
  { value: "recent", label: "Par défaut" },
  { value: "price_asc", label: "Prix croissant" },
  { value: "price_desc", label: "Prix décroissant" },
  { value: "rating", label: "Mieux notés" },
];

interface FiltersProps {
  onFiltersChange: (filters: {
    category: string;
    region: string;
    minPrice: number;
    maxPrice: number;
    minRating: number;
    sortBy: string;
  }) => void;
}

export default function ProductFilters({ onFiltersChange }: FiltersProps) {
  const [category, setCategory] = useState("");
  const [region, setRegion] = useState("");
  const [maxPrice, setMaxPrice] = useState(500000);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("recent");

  function handleChange(updates: Partial<{
    category: string;
    region: string;
    maxPrice: number;
    minRating: number;
    sortBy: string;
  }>) {
    const newFilters = {
      category: updates.category ?? category,
      region: updates.region ?? region,
      minPrice: 0,
      maxPrice: updates.maxPrice ?? maxPrice,
      minRating: updates.minRating ?? minRating,
      sortBy: updates.sortBy ?? sortBy,
    };
    if (updates.category !== undefined) setCategory(updates.category);
    if (updates.region !== undefined) setRegion(updates.region);
    if (updates.maxPrice !== undefined) setMaxPrice(updates.maxPrice);
    if (updates.minRating !== undefined) setMinRating(updates.minRating);
    if (updates.sortBy !== undefined) setSortBy(updates.sortBy);
    onFiltersChange(newFilters);
  }

  function reset() {
    setCategory("");
    setRegion("");
    setMaxPrice(500000);
    setMinRating(0);
    setSortBy("recent");
    onFiltersChange({ category: "", region: "", minPrice: 0, maxPrice: 500000, minRating: 0, sortBy: "recent" });
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-5 space-y-6">

      {/* Titre */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">Filtres</h3>
        <button onClick={reset} className="text-xs text-muted-foreground hover:text-red-500 transition">
          Réinitialiser
        </button>
      </div>

      {/* Trier par */}
      <div>
        <label className="text-sm font-semibold mb-2 block">Trier par</label>
        <select
          value={sortBy}
          onChange={(e) => handleChange({ sortBy: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Prix slider */}
      <div>
        <label className="text-sm font-semibold mb-2 block">Prix (FCFA)</label>
        <input
          type="range"
          min={0}
          max={500000}
          step={5000}
          value={maxPrice}
          onChange={(e) => handleChange({ maxPrice: parseInt(e.target.value) })}
          className="w-full accent-jaay-green"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>0 FCFA</span>
          <span className="font-medium text-jaay-green">{maxPrice.toLocaleString("fr-SN")} FCFA</span>
        </div>
      </div>

      {/* Catégories */}
      <div>
        <label className="text-sm font-semibold mb-3 block">Catégories</label>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => handleChange({ category: category === cat ? "" : cat })}
                className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition"
                style={{
                  borderColor: category === cat ? "oklch(0.35 0.12 145)" : "",
                  background: category === cat ? "oklch(0.35 0.12 145)" : "",
                }}
              >
                {category === cat && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <span className="text-sm group-hover:text-primary transition-colors">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Localisation */}
      <div>
        <label className="text-sm font-semibold mb-3 block">Localisation</label>
        <div className="space-y-2">
          {regions.map((r) => (
            <label key={r} className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => handleChange({ region: region === r ? "" : r })}
                className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition"
                style={{
                  borderColor: region === r ? "oklch(0.35 0.12 145)" : "",
                  background: region === r ? "oklch(0.35 0.12 145)" : "",
                }}
              >
                {region === r && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <span className="text-sm group-hover:text-primary transition-colors">{r}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Note minimum */}
      <div>
        <label className="text-sm font-semibold mb-2 block">Note minimum</label>
        <select
          value={minRating}
          onChange={(e) => handleChange({ minRating: parseFloat(e.target.value) })}
          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value={0}>Toutes les notes</option>
          <option value={3}>⭐⭐⭐ 3 et plus</option>
          <option value={4}>⭐⭐⭐⭐ 4 et plus</option>
          <option value={4.5}>⭐⭐⭐⭐⭐ 4.5 et plus</option>
        </select>
      </div>
    </div>
  );
}