"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Store, MapPin, Phone, User, ChevronRight } from "lucide-react";
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
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    shop_name: "",
    region: "",
    city: "",
    category: "",
    description: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("sellers").insert([form]);
      if (error) throw error;
      setStep(3);
    } catch (e) {
      alert("Erreur lors de l'inscription. Réessayez !");
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
            <p className="text-muted-foreground mb-6">
              Votre boutique <strong>{form.shop_name}</strong> a été créée avec succès !
            </p>
            <button
              onClick={() => router.push("/seller/dashboard")}
              className="bg-jaay-green text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition"
            >
              Accéder à mon tableau de bord →
            </button>
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
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{ background: step >= s ? "oklch(0.35 0.12 145)" : "oklch(0.90 0 0)" }}
                  >
                    {s}
                  </div>
                  {s < 2 && <div className="flex-1 h-1 rounded" style={{ background: step > s ? "oklch(0.35 0.12 145)" : "oklch(0.90 0 0)" }} />}
                </div>
              ))}
            </div>

            {/* Étape 1 — Infos personnelles */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="font-semibold text-lg mb-4">👤 Vos informations</h2>

                <div>
                  <label className="text-sm font-medium mb-1 block">Nom complet *</label>
                  <input
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    placeholder="Ex: Amadou Diallo"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Numéro WhatsApp *</label>
                  <div className="flex gap-2">
                    <span className="px-3 py-3 bg-muted rounded-xl text-sm border border-border">🇸🇳 +221</span>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="77 123 45 67"
                      className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Région *</label>
                  <select
                    name="region"
                    value={form.region}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Choisir votre région</option>
                    {regions.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Ville / Quartier *</label>
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Ex: Plateau, Médina, HLM..."
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <button
                  onClick={() => {
                    if (!form.full_name || !form.phone || !form.region || !form.city) {
                      alert("Veuillez remplir tous les champs !");
                      return;
                    }
                    setStep(2);
                  }}
                  className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 transition"
                  style={{ background: "oklch(0.35 0.12 145)" }}
                >
                  Continuer <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Étape 2 — Infos boutique */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="font-semibold text-lg mb-4">🏪 Votre boutique</h2>

                <div>
                  <label className="text-sm font-medium mb-1 block">Nom de la boutique *</label>
                  <input
                    name="shop_name"
                    value={form.shop_name}
                    onChange={handleChange}
                    placeholder="Ex: Boutique Aminata Mode"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Catégorie principale *</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Choisir une catégorie</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Description de votre boutique</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Décrivez ce que vous vendez..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                </div>

                {/* Avantages */}
                <div className="bg-muted rounded-xl p-4 space-y-2">
                  {["Vendez gratuitement", "Paiements Wave & Orange Money", "Support WhatsApp 24/7", "Livraison dans tout le Sénégal"].map((a) => (
                    <div key={a} className="flex items-center gap-2 text-sm">
                      <span className="text-jaay-green">✓</span>
                      {a}
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 rounded-xl font-semibold border border-border hover:bg-accent transition"
                  >
                    ← Retour
                  </button>
                  <button
                    onClick={() => {
                      if (!form.shop_name || !form.category) {
                        alert("Veuillez remplir tous les champs !");
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