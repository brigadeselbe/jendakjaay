"use client";

import { useState, useRef } from "react";
import { Camera, X, Search, Loader } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  emoji: string;
  image_url: string | null;
}

function formatPrice(price: number) {
  return price.toLocaleString("fr-SN") + " FCFA";
}

export default function ImageSearch() {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [detected, setDetected] = useState<string | null>(null);
  const [results, setResults] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      setImage(base64);
      setDetected(null);
      setResults([]);
      setError(null);
    };
    reader.readAsDataURL(file);
  }

  async function searchByImage() {
    if (!image) return;
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data: products } = await supabase
        .from("products")
        .select("id, name, category, price, emoji, image_url");

      const response = await fetch("/api/search-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, products }),
      });

      const result = await response.json();
      if (result.error) throw new Error(result.error);

      setDetected(result.detected);

      const matched = (products || []).filter((p: Product) =>
        result.matches?.includes(p.id)
      );
      setResults(matched);
    } catch {
      setError("Impossible d'analyser l'image. Réessayez !");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setImage(null);
    setDetected(null);
    setResults([]);
    setError(null);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border hover:bg-accent transition text-sm font-medium"
        title="Rechercher par image"
      >
        <Camera className="h-4 w-4" />
        <span className="hidden sm:block">Photo</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl">

            <div className="flex items-center justify-between p-5 border-b">
              <div>
                <h2 className="font-bold text-lg">🔍 Recherche par image</h2>
                <p className="text-sm text-muted-foreground">Prenez une photo et trouvez des produits similaires</p>
              </div>
              <button onClick={() => { setOpen(false); reset(); }}
                className="p-2 hover:bg-accent rounded-xl transition">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">

              {!image ? (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-2xl cursor-pointer hover:bg-muted transition-colors">
                  <Camera className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="font-medium text-sm">Cliquez pour ajouter une image</p>
                  <p className="text-xs text-muted-foreground mt-1">ou prenez une photo</p>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative">
                  <img
                    src={`data:image/jpeg;base64,${image}`}
                    alt="Image recherche"
                    className="w-full h-48 object-cover rounded-2xl"
                  />
                  <button onClick={reset}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {image && !loading && results.length === 0 && !detected && (
                <button onClick={searchByImage}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white hover:opacity-90 transition"
                  style={{ background: "oklch(0.35 0.12 145)" }}>
                  <Search className="h-5 w-5" />
                  Analyser avec l&apos;IA ✨
                </button>
              )}

              {loading && (
                <div className="flex flex-col items-center justify-center py-8 gap-3">
                  <Loader className="h-8 w-8 animate-spin text-jaay-green" />
                  <p className="text-sm text-muted-foreground">L&apos;IA analyse votre image...</p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              {detected && (
                <div className="bg-muted rounded-xl p-3 text-sm">
                  <span className="text-muted-foreground">Objet détecté : </span>
                  <span className="font-semibold">{detected}</span>
                </div>
              )}

              {results.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Produits similaires :</h3>
                  <div className="space-y-3">
                    {results.map((product) => (
                      <Link key={product.id} href={`/product/${product.id}`}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 p-3 bg-muted rounded-xl hover:bg-accent transition">
                        <div className="w-12 h-12 bg-background rounded-xl flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                          ) : product.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.category}</p>
                        </div>
                        <span className="font-bold text-jaay-green text-sm flex-shrink-0">
                          {formatPrice(product.price)}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {results.length === 0 && detected && !loading && (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">Aucun produit similaire trouvé</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}