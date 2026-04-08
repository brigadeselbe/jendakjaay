"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Header from "@/components/Header";
import Logo from "@/components/Logo";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  async function handleSubmit() {
    if (!form.email || !form.password) {
      setError("Veuillez remplir tous les champs !");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (error) throw error;
      router.push("/seller/dashboard");
    } catch {
      setError("Email ou mot de passe incorrect !");
    } finally {
      setLoading(false);
    }
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
            <h1 className="text-2xl font-bold">Connexion</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Accédez à votre espace vendeur
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <div>
              <label className="text-sm font-medium mb-1 block">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="votre@email.com"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Mot de passe</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring pr-12"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white hover:opacity-90 transition disabled:opacity-50"
              style={{ background: "oklch(0.35 0.12 145)" }}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>

            <div className="text-center text-sm text-muted-foreground">
              Pas encore de compte ?{" "}
              <Link
                href="/auth/register"
                className="font-medium hover:text-primary"
                style={{ color: "oklch(0.35 0.12 145)" }}
              >
                Créer un compte
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}