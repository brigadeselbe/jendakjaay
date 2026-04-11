"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Camera, X, Search, Loader, ImageIcon, ZoomIn } from "lucide-react";
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

interface ImageSearchProps {
  open?: boolean;
  onClose?: () => void;
}

function formatPrice(price: number) {
  return price.toLocaleString("fr-SN") + " FCFA";
}

export default function ImageSearch({ open: controlledOpen, onClose }: ImageSearchProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  useEffect(() => { setMounted(true); }, []);

  const [image, setImage] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<string>("image/jpeg");
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [detected, setDetected] = useState<string | null>(null);
  const [results, setResults] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Camera state
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  function close() {
    if (isControlled) onClose?.();
    else setInternalOpen(false);
  }

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setCameraError(null);
  }, []);

  async function startCamera() {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      setCameraActive(true);
      // Attendre que le DOM soit prêt
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch {
      setCameraError("Impossible d'accéder à la caméra. Autorisez l'accès dans votre navigateur.");
    }
  }

  function capturePhoto() {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    const base64 = dataUrl.split(",")[1];
    setImage(base64);
    setMediaType("image/jpeg");
    setImagePreviewUrl(dataUrl);
    setDetected(null);
    setResults([]);
    setError(null);
    stopCamera();
  }

  function handleFileSelected(file: File) {
    const type = file.type && file.type.startsWith("image/") ? file.type : "image/jpeg";
    const previewUrl = URL.createObjectURL(file);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      setImage(base64);
      setMediaType(type);
      setImagePreviewUrl(previewUrl);
      setDetected(null);
      setResults([]);
      setError(null);
    };
    reader.readAsDataURL(file);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFileSelected(file);
    e.target.value = "";
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
        body: JSON.stringify({ image, media_type: mediaType, products }),
      });

      const result = await response.json();
      if (result.error) throw new Error(result.error);
      if (!result.detected) throw new Error("Aucune réponse reçue de l'IA");

      setDetected(result.detected);
      const matched = (products || []).filter((p: Product) =>
        result.matches?.includes(p.id)
      );
      setResults(matched);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur inconnue";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    setImage(null);
    setMediaType("image/jpeg");
    setImagePreviewUrl(null);
    setDetected(null);
    setResults([]);
    setError(null);
    stopCamera();
  }

  function handleClose() {
    reset();
    close();
  }

  return (
    <>
      {!isControlled && (
        <button
          onClick={() => setInternalOpen(true)}
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border hover:bg-accent transition text-sm font-medium"
          title="Rechercher par image"
          aria-label="Recherche par image"
        >
          <Camera className="h-4 w-4" />
          <span className="hidden sm:block">Photo</span>
        </button>
      )}

      {/* Input galerie caché */}
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {mounted && isOpen && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl animate-fade-in-up">

            <div className="flex items-center justify-between p-5 border-b">
              <div>
                <h2 className="font-bold text-lg">🔍 Recherche par image</h2>
                <p className="text-sm text-muted-foreground">
                  Photographiez un objet pour trouver des produits similaires
                </p>
              </div>
              <button onClick={handleClose} className="p-2 hover:bg-accent rounded-xl transition" aria-label="Fermer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">

              {/* Vue caméra active */}
              {cameraActive && !image && (
                <div className="space-y-3">
                  <div className="relative rounded-2xl overflow-hidden bg-black" style={{ aspectRatio: "4/3" }}>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {cameraError && (
                    <p className="text-red-500 text-sm text-center">{cameraError}</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={stopCamera}
                      className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-accent transition"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={capturePhoto}
                      className="flex-1 py-2.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition flex items-center justify-center gap-2"
                      style={{ background: "oklch(0.35 0.12 145)" }}
                    >
                      <ZoomIn className="h-4 w-4" />
                      Capturer
                    </button>
                  </div>
                </div>
              )}

              {/* Choix initial */}
              {!image && !cameraActive && (
                <div className="space-y-3">
                  <button
                    onClick={startCamera}
                    className="w-full flex items-center justify-center gap-3 h-28 border-2 border-dashed border-border rounded-2xl hover:bg-muted transition-colors cursor-pointer group"
                  >
                    <Camera className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                    <div className="text-left">
                      <p className="font-semibold text-sm">Prendre une photo</p>
                      <p className="text-xs text-muted-foreground">Utiliser l&apos;appareil photo</p>
                    </div>
                  </button>

                  {cameraError && (
                    <p className="text-red-500 text-sm text-center px-2">{cameraError}</p>
                  )}

                  <button
                    onClick={() => galleryRef.current?.click()}
                    className="w-full flex items-center justify-center gap-3 h-20 border border-border rounded-2xl hover:bg-muted transition-colors cursor-pointer group"
                  >
                    <ImageIcon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    <div className="text-left">
                      <p className="font-medium text-sm">Choisir depuis la galerie</p>
                      <p className="text-xs text-muted-foreground">JPG, PNG, WebP, GIF</p>
                    </div>
                  </button>
                </div>
              )}

              {/* Aperçu image sélectionnée */}
              {image && (
                <div className="relative">
                  <img
                    src={imagePreviewUrl ?? `data:${mediaType};base64,${image}`}
                    alt="Image à analyser"
                    className="w-full h-52 object-cover rounded-2xl"
                  />
                  <button
                    onClick={reset}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                    aria-label="Supprimer l'image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm">
                    {mediaType.replace("image/", "").toUpperCase()}
                  </div>
                </div>
              )}

              {image && !loading && results.length === 0 && !detected && (
                <button
                  onClick={searchByImage}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white hover:opacity-90 transition"
                  style={{ background: "oklch(0.35 0.12 145)" }}
                >
                  <Search className="h-5 w-5" />
                  Analyser avec l&apos;IA ✨
                </button>
              )}

              {loading && (
                <div className="flex flex-col items-center justify-center py-8 gap-3">
                  <Loader className="h-8 w-8 animate-spin" style={{ color: "oklch(0.35 0.12 145)" }} />
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
                  <h3 className="font-semibold mb-3">Produits similaires ({results.length}) :</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {results.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.id}`}
                        onClick={handleClose}
                        className="flex items-center gap-3 p-3 bg-muted rounded-xl hover:bg-accent transition"
                      >
                        <div className="w-12 h-12 bg-background rounded-xl flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                          ) : product.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.category}</p>
                        </div>
                        <span className="font-bold text-sm flex-shrink-0" style={{ color: "oklch(0.35 0.12 145)" }}>
                          {formatPrice(product.price)}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {results.length === 0 && detected && !loading && (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">Aucun produit similaire trouvé pour &quot;{detected}&quot;</p>
                  <button
                    onClick={reset}
                    className="mt-2 text-sm font-medium underline"
                    style={{ color: "oklch(0.35 0.12 145)" }}
                  >
                    Essayer une autre image
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
