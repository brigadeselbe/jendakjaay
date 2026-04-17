"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Header from "@/components/Header";
import Logo from "@/components/Logo";
import { createClient } from "@/lib/supabase/client";

const regions = [
  "Dakar", "Thiès", "Saint-Louis", "Diourbel", "Louga",
  "Fatick", "Kaolack", "Kaffrine", "Ziguinchor", "Kolda",
  "Sédhiou", "Tambacounda", "Kédougou", "Matam"
];

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    region: "",
    shop_name: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  async function handleSubmit() {
    if (!form.full_name || !form.email || !form.password || !form.phone || !form.region || !form.shop_name) {
      setError("Veuillez remplir tous les champs !");
      return;
    }
    if (form.password.length < 6) {
      setError("Le mot de passe doit avoir au moins 6 caractères !");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.full_name,
            phone: form.phone,
            shop_name: form.shop_name,
            region: form.region,
          }
        }
      });
      if (authError) throw authError;
      if (data.user) {
        await supabase.from("sellers").insert([{
          user_id: data.user.id,
          full_name: form.full_name,
          phone: form.phone,
          region: form.region,
          city: "",
          shop_name: form.shop_name,
          category: "Autres",
        }]);
      }
      setSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur lors de l'inscription !";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-2xl font-bold mb-2">Compte créé !</h1>
            <p className="text-muted-foreground mb-6">
              Vérifiez votre email pour confirmer votre compte, puis connectez-vous.
            </p>
            <Link href="/auth/login"
              className="inline-block text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition"
              style={{ background: "oklch(0.35 0.12 145)" }}>
              Se connecter
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Link>

          <div className="text-center mb-8">
            <div className="flex justify-center mb-4"><Logo size="lg" href="/" /></div>
            <h1 className="text-2xl font-bold">Créer un compte vendeur</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Rejoignez Jënd ak Jaay gratuitement
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <div>
              <label className="text-sm font-medium mb-1 block">Nom complet *</label>
              <input name="full_name" value={form.full_name} onChange={handleChange}
                placeholder="Ex: Aminata Diallo"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Nom de la boutique *</label>
              <input name="shop_name" value={form.shop_name} onChange={handleChange}
                placeholder="Ex: Boutique Aminata Mode"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Téléphone WhatsApp *</label>
              <input name="phone" value={form.phone} onChange={handleChange}
                placeholder="77 123 45 67"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
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
              <label className="text-sm font-medium mb-1 block">Email *</label>
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
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring pr-12" />
                <button onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button onClick={handleSubmit} disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white hover:opacity-90 transition disabled:opacity-50"
              style={{ background: "oklch(0.35 0.12 145)" }}>
              {loading ? "Création..." : "Créer mon compte 🚀"}
            </button>

            <div className="text-center text-sm text-muted-foreground">
              Déjà un compte ?{" "}
              <Link href="/auth/login" className="font-medium" style={{ color: "oklch(0.35 0.12 145)" }}>
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}