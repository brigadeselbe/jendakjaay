"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, Plus, Upload, X, Video } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";

const categories = [
  "Alimentation", "Mode & Vêtements", "Électronique",
  "Artisanat", "Maison & Déco", "Beauté & Santé",
  "Agriculture", "Services", "Autres"
];

const regions = [
  "Dakar", "Thiès", "Saint-Louis", "Diourbel", "Louga",
  "Fatick", "Kaolack", "Kaffrine", "Ziguinchor", "Kolda",
  "Sédhiou", "Tambacounda", "Kédougou", "Matam"
];

const emojis = ["📦", "👘", "🍚", "📱", "🧺", "🫙", "🛋️", "🍗", "🥤", "💻", "👗", "🪵", "🥭", "🍎", "👜", "💍", "🌿", "🧴", "🍳", "🎁"];

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    original_price: "",
    category: "",
    emoji: "📦",
    badge: "",
    seller_name: "",
    seller_location: "",
    seller_phone: "",
    seller_region: "",
    wave_merchant_url: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("L'image ne doit pas dépasser 5MB !");
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview(null);
  }

  function handleVideoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      alert("La vidéo ne doit pas dépasser 50MB !");
      return;
    }
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  }

  function removeVideo() {
    setVideoFile(null);
    setVideoPreview(null);
  }

  async function generateDescription() {
    setAiLoading(true);
    try {
      // Extraire le base64 de l'image si disponible
      let imageBase64: string | null = null;
      let imageMediaType: string | null = null;
      if (imagePreview) {
        const parts = imagePreview.split(",");
        imageBase64 = parts[1] ?? null;
        const match = parts[0].match(/data:(image\/\w+);base64/);
        imageMediaType = match?.[1] ?? "image/jpeg";
      } else if (videoPreview && videoFile) {
        // Extraire une frame de la vidéo via canvas
        try {
          const frame = await extractVideoFrame(videoPreview);
          if (frame) {
            imageBase64 = frame.split(",")[1];
            imageMediaType = "image/jpeg";
          }
        } catch { /* ignore, on continue sans image */ }
      }

      const response = await fetch("/api/describe-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: imageBase64,
          media_type: imageMediaType,
          name: form.name,
          category: form.category,
          region: form.seller_region,
        }),
      });
      const data = await response.json();
      if (data.description) {
        setForm((prev) => ({ ...prev, description: data.description }));
      } else {
        alert("Erreur lors de la génération. Réessayez !");
      }
    } catch {
      alert("Erreur lors de la génération. Réessayez !");
    } finally {
      setAiLoading(false);
    }
  }

  function extractVideoFrame(videoUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.src = videoUrl;
      video.crossOrigin = "anonymous";
      video.currentTime = 1;
      video.onloadeddata = () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d")?.drawImage(video, 0, 0);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      video.onerror = reject;
    });
  }

  async function handleSubmit() {
    if (!form.name || !form.price || !form.category || !form.seller_name || !form.seller_region) {
      alert("Veuillez remplir tous les champs obligatoires !");
      return;
    }
    if (!form.wave_merchant_url || !form.wave_merchant_url.startsWith("https://pay.wave.com/")) {
      alert("⚠️ L'URL Wave marchand est obligatoire pour recevoir les paiements.\n\nFormat attendu :\nhttps://pay.wave.com/m/M_sn_.../c/sn/\n\n📱 Ouvrez Wave → Mon QR Code → Copier le lien marchand");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      let image_url = null;
      let video_url = null;

      // Upload image si présente
      if (imageFile) {
        setUploadProgress(20);
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `img_${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("products")
          .upload(fileName, imageFile);
        if (uploadError) throw uploadError;
        setUploadProgress(50);
        const { data: urlData } = supabase.storage
          .from("products")
          .getPublicUrl(fileName);
        image_url = urlData.publicUrl;
      }

      // Upload vidéo si présente
      if (videoFile) {
        setUploadProgress(60);
        const fileExt = videoFile.name.split(".").pop();
        const fileName = `vid_${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("products")
          .upload(fileName, videoFile);
        if (uploadError) throw uploadError;
        setUploadProgress(85);
        const { data: urlData } = supabase.storage
          .from("products")
          .getPublicUrl(fileName);
        video_url = urlData.publicUrl;
        setUploadProgress(100);
      } else {
        setUploadProgress(100);
      }

      const { error } = await supabase.from("products").insert([{
        name: form.name,
        description: form.description,
        price: parseInt(form.price),
        original_price: form.original_price ? parseInt(form.original_price) : null,
        category: form.category,
        emoji: form.emoji,
        badge: form.badge || null,
        seller_name: form.seller_name,
        seller_location: form.seller_location,
        seller_phone: form.seller_phone,
        seller_region: form.seller_region,
        wave_merchant_url: form.wave_merchant_url || null,
        image_url,
        video_url,
        rating: 0,
        reviews_count: 0,
        in_stock: true,
      }]);

      if (error) throw error;
      router.push("/seller/dashboard");
    } catch (e) {
      alert("Erreur lors de l'ajout. Réessayez !");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">

        <Link href="/seller/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Retour au dashboard
        </Link>

        <h1 className="text-2xl font-bold mb-2">Ajouter un Produit</h1>
        <p className="text-muted-foreground text-sm mb-8">Remplissez les informations de votre produit</p>

        <div className="space-y-6">

          {/* Infos vendeur */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="font-semibold">👤 Vos informations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Votre nom *</label>
                <input name="seller_name" value={form.seller_name} onChange={handleChange}
                  placeholder="Ex: Aminata Diallo"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Téléphone WhatsApp</label>
                <input name="seller_phone" value={form.seller_phone} onChange={handleChange}
                  placeholder="77 123 45 67"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Lien Wave Marchand <span className="text-red-500">*</span>
                <span className="ml-2 text-xs font-normal text-muted-foreground">(obligatoire pour recevoir les paiements)</span>
              </label>
              <input name="wave_merchant_url" value={form.wave_merchant_url} onChange={handleChange}
                placeholder="https://pay.wave.com/m/M_sn_.../c/sn/"
                className={`w-full px-4 py-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring ${
                  form.wave_merchant_url && !form.wave_merchant_url.startsWith("https://pay.wave.com/")
                    ? "border-red-400 focus:ring-red-300"
                    : "border-border"
                }`} />
              {form.wave_merchant_url && !form.wave_merchant_url.startsWith("https://pay.wave.com/") && (
                <p className="text-xs text-red-500 mt-1">⚠️ URL invalide — doit commencer par https://pay.wave.com/</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                📱 Ouvrez Wave → Mon QR Code → Copier le lien marchand
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Région *</label>
                <select name="seller_region" value={form.seller_region} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="">Choisir votre région</option>
                  {regions.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Ville / Quartier</label>
                <input name="seller_location" value={form.seller_location} onChange={handleChange}
                  placeholder="Ex: Médina, Plateau..."
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
          </div>

          {/* Photo produit */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="font-semibold">📸 Photo du produit</h2>
            {!imagePreview ? (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted transition-colors">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium">Cliquez pour ajouter une photo</p>
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG — Max 5MB</p>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            ) : (
              <div className="relative w-full h-48 rounded-xl overflow-hidden">
                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Vidéo produit */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="font-semibold">🎬 Vidéo du produit (optionnel)</h2>
            {!videoPreview ? (
              <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted transition-colors">
                <Video className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium">Cliquez pour ajouter une vidéo</p>
                <p className="text-xs text-muted-foreground mt-1">MP4, MOV — Max 50MB</p>
                <input type="file" accept="video/*" onChange={handleVideoChange} className="hidden" />
              </label>
            ) : (
              <div className="relative w-full rounded-xl overflow-hidden bg-black">
                <video src={videoPreview} controls className="w-full max-h-48 object-contain" />
                <button
                  onClick={removeVideo}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Infos produit */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="font-semibold">📦 Votre produit</h2>

            <div>
              <label className="text-sm font-medium mb-1 block">Nom du produit *</label>
              <input name="name" value={form.name} onChange={handleChange}
                placeholder="Ex: Boubou Traditionnel Bazin"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Catégorie *</label>
              <select name="category" value={form.category} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">Choisir une catégorie</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium">Description</label>
                <button onClick={generateDescription} disabled={aiLoading}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg text-white transition hover:opacity-90 disabled:opacity-50"
                  style={{ background: "oklch(0.65 0.19 45)" }}>
                  <Sparkles className="h-3 w-3" />
                  {aiLoading ? "Analyse en cours..." : imagePreview || videoPreview ? "Analyser photo/vidéo ✨" : "Générer avec IA ✨"}
                </button>
              </div>
              <textarea name="description" value={form.description} onChange={handleChange}
                placeholder="Décrivez votre produit ou utilisez l'IA..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Icône du produit</label>
              <div className="flex flex-wrap gap-2">
                {emojis.map((e) => (
                  <button key={e} onClick={() => setForm({ ...form, emoji: e })}
                    className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition ${form.emoji === e ? "ring-2 bg-muted" : "hover:bg-muted"}`}>
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Prix */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="font-semibold">💰 Prix</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Prix de vente * (FCFA)</label>
                <input name="price" value={form.price} onChange={handleChange}
                  type="number" placeholder="Ex: 25000"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Prix original (FCFA)</label>
                <input name="original_price" value={form.original_price} onChange={handleChange}
                  type="number" placeholder="Ex: 35000 (optionnel)"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Badge (optionnel)</label>
              <select name="badge" value={form.badge} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">Aucun badge</option>
                <option value="Nouveau">Nouveau</option>
                <option value="Promo">Promo</option>
                <option value="Populaire">Populaire</option>
                <option value="Bio">Bio</option>
                <option value="Artisanat">Artisanat</option>
                <option value="Saison">Saison</option>
              </select>
            </div>
          </div>

          {/* Progress bar upload */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="bg-muted rounded-xl p-4">
              <p className="text-sm font-medium mb-2">Upload en cours... {uploadProgress}%</p>
              <div className="w-full bg-border rounded-full h-2">
                <div className="h-2 rounded-full transition-all" style={{ width: `${uploadProgress}%`, background: "oklch(0.35 0.12 145)" }} />
              </div>
            </div>
          )}

          <button onClick={handleSubmit} disabled={loading}
            className="w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50 text-lg"
            style={{ background: "oklch(0.35 0.12 145)" }}>
            <Plus className="h-5 w-5" />
            {loading ? "Publication en cours..." : "Publier mon produit 🚀"}
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}