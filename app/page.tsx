"use client";

import { Suspense, useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoryNav from "@/components/CategoryNav";
import ProductGrid from "@/components/ProductGrid";
import ProductFilters from "@/components/ProductFilters";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

interface Filters {
  category: string;
  region: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  sortBy: string;
}

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [filters, setFilters] = useState<Filters>({
    category: "",
    region: "",
    minPrice: 0,
    maxPrice: 500000,
    minRating: 0,
    sortBy: "recent",
  });

  function handleCategorySelect(cat: string) {
    setSelectedCategory(cat);
  }

  function handleFiltersChange(newFilters: Filters) {
    setFilters(newFilters);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CategoryNav selected={selectedCategory} onSelect={handleCategorySelect} />
      <main className="flex-1">
        <Hero />
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex gap-8">
              {/* Filtres sidebar desktop */}
              <div className="hidden lg:block w-72 flex-shrink-0">
                <ProductFilters onFiltersChange={handleFiltersChange} />
              </div>
              {/* Produits */}
              <div className="flex-1 min-w-0">
                <Suspense fallback={<div className="text-center py-12 text-muted-foreground">Chargement...</div>}>
                  <ProductGrid selectedCategory={selectedCategory} filters={filters} />
                </Suspense>
              </div>
            </div>
          </div>
        </section>
        <Features />
      </main>
      <Footer />
    </div>
  );
}