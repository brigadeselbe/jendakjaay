"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Eye, EyeOff } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";

const regions = [
  "Dakar", "Thiès", "Saint-Louis", "Diourbel", "Louga",
  "Fatick", "Kaolack", "Kaffrine", "Ziguinchor", "Kolda",
  "Sédhiou", "Tambacounda", "Kédougou", "Matam"
];

const categories = [
  "Alimentation", "Mode & Vêtements", "Électronique",
  "Artisanat", "Maison & Déco", "Beauté & Santé",
  "Agriculture", "Services", "Autres"
];

export default function SellerPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    password: "",
    region: "",
    city: "",
    shop_name: "",
    category: "",
    description: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  async function handleSubmit() {
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();

      // 1. Créer le compte Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { full_name: form.full_name } },
      });
      if (authError) throw new Error(authError.message);

      // 2. Insérer le profil vendeur lié au compte
      const { error: sellerError } = await supabase.from("sellers").insert([{
        full_name: form.full_name,
        phone: form.phone,
        email: form.email,
        shop_name: form.shop_name,
        region: form.region,
        city: form.city,
        category: form.category,
        description: form.description,
        user_id: authData.user?.id ?? null,
      }]);
      if (sellerError) throw new Error(sellerError.message);

      setStep(3);
    } catch (e: any) {
      setError(e.message || "Erreur lors de l'inscription. Réessayez !");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">

        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Link>

        {/* Étape 3 — Succès */}
        {step === 3 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-2xl font-bold mb-2">Félicitations !</h1>
            <p className="text-muted-foreground mb-2">
              Votre boutique <strong>{form.shop_name}</strong> a été créée avec succès !
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Un email de confirmation a été envoyé à <strong>{form.email}</strong>.<br />
              Vérifiez votre boîte mail puis connectez-vous.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => router.push("/seller/dashboard")}
                className="btn btn-primary btn-lg"
              >
                Accéder à mon tableau de bord →
              </button>
              <Link href="/auth/login" className="btn btn-outline btn-lg">
                Se connecter
              </Link>
            </div>
          </div>
        )}

        {step !== 3 && (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white text-2xl"
                style={{ background: "oklch(0.35 0.12 145)" }}>
                🏪
              </div>
              <h1 className="text-2xl font-bold mb-2">Devenir Vendeur</h1>
              <p className="text-muted-foreground text-sm">
                Rejoignez des milliers de vendeurs sur Jënd ak Jaay
              </p>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-2 mb-8">
              {[1, 2].map((s) => (
                <div key={s} className="flex items-center gap-2 flex-1">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{ background: step >= s ? "oklch(0.35 0.12 145)" : "oklch(0.90 0 0)" }}>
                    {s}
                  </div>
                  {s < 2 && (
                    <div className="flex-1 h-1 rounded"
                      style={{ background: step > s ? "oklch(0.35 0.12 145)" : "oklch(0.90 0 0)" }} />
                  )}
                </div>
              ))}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
                {error}
              </div>
            )}

            {/* Étape 1 — Infos personnelles + compte */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="font-semibold text-lg mb-4">👤 Vos informations</h2>

                <div>
                  <label className="text-sm font-medium mb-1 block">Nom complet *</label>
                  <input name="full_name" value={form.full_name} onChange={handleChange}
                    placeholder="Ex: Amadou Diallo"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Numéro WhatsApp *</label>
                  <div className="flex gap-2">
                    <span className="px-3 py-3 bg-muted rounded-xl text-sm border border-border">🇸🇳 +221</span>
                    <input name="phone" value={form.phone} onChange={handleChange}
                      placeholder="77 123 45 67"
                      className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Adresse email *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange}
                    placeholder="votre@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Mot de passe *</label>
                  <div className="relative">
                    <input name="password" type={showPassword ? "text" : "password"}
                      value={form.password} onChange={handleChange}
                      placeholder="Minimum 6 caractères"
                      className="w-full px-4 py-3 pr-12 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Région *</label>
                  <select name="region" value={form.region} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="">Choisir votre région</option>
                    {regions.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Ville / Quartier *</label>
                  <input name="city" value={form.city} onChange={handleChange}
                    placeholder="Ex: Plateau, Médina, HLM..."
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>

                <button
                  onClick={() => {
                    if (!form.full_name || !form.phone || !form.email || !form.password || !form.region || !form.city) {
                      setError("Veuillez remplir tous les champs obligatoires.");
                      return;
                    }
                    if (form.password.length < 6) {
                      setError("Le mot de passe doit contenir au moins 6 caractères.");
                      return;
                    }
                    setStep(2);
                  }}
                  className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 transition"
                  style={{ background: "oklch(0.35 0.12 145)" }}
                >
                  Continuer <ChevronRight className="h-5 w-5" />
                </button>

                <p className="text-center text-sm text-muted-foreground">
                  Déjà vendeur ?{" "}
                  <Link href="/auth/login" className="font-medium hover:underline" style={{ color: "oklch(0.35 0.12 145)" }}>
                    Se connecter
                  </Link>
                </p>
              </div>
            )}

            {/* Étape 2 — Infos boutique */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="font-semibold text-lg mb-4">🏪 Votre boutique</h2>

                <div>
                  <label className="text-sm font-medium mb-1 block">Nom de la boutique *</label>
                  <input name="shop_name" value={form.shop_name} onChange={handleChange}
                    placeholder="Ex: Boutique Aminata Mode"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Catégorie principale *</label>
                  <select name="category" value={form.category} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="">Choisir une catégorie</option>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Description de votre boutique</label>
                  <textarea name="description" value={form.description} onChange={handleChange}
                    placeholder="Décrivez ce que vous vendez..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                </div>

                <div className="bg-muted rounded-xl p-4 space-y-2">
                  {["Vendez gratuitement", "Paiements Wave & Orange Money", "Support WhatsApp 24/7", "Livraison dans tout le Sénégal"].map((a) => (
                    <div key={a} className="flex items-center gap-2 text-sm">
                      <span className="text-jaay-green">✓</span> {a}
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)}
                    className="flex-1 py-3 rounded-xl font-semibold border border-border hover:bg-accent transition">
                    ← Retour
                  </button>
                  <button
                    onClick={() => {
                      if (!form.shop_name || !form.category) {
                        setError("Veuillez remplir tous les champs obligatoires.");
                        return;
                      }
                      handleSubmit();
                    }}
                    disabled={loading}
                    className="flex-1 py-3 rounded-xl font-semibold text-white hover:opacity-90 transition disabled:opacity-50"
                    style={{ background: "oklch(0.35 0.12 145)" }}
                  >
                    {loading ? "Création..." : "Créer ma boutique 🎉"}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
