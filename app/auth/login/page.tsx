"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, Mail, KeyRound } from "lucide-react";
import Logo from "@/components/Logo";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/seller/dashboard";

  // "magic" = lien par email | "password" = mot de passe classique
  const [mode, setMode] = useState<"magic" | "password">("magic");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // --- Magic Link ---
  async function handleMagicLink() {
    if (!email) { setError("Entrez votre adresse email."); return; }
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}${redirect}` },
      });
      if (error) throw error;
      setSent(true);
    } catch {
      setError("Impossible d'envoyer le lien. Vérifiez l'email.");
    } finally {
      setLoading(false);
    }
  }

  // --- Mot de passe ---
  async function handlePassword() {
    if (!email || !password) { setError("Remplissez tous les champs."); return; }
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push(redirect);
    } catch {
      setError("Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  }

  // Écran de confirmation après envoi du magic link
  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm w-full">
          <div className="text-6xl mb-6">📬</div>
          <h1 className="text-2xl font-bold mb-2">Vérifiez votre boîte mail</h1>
          <p className="text-muted-foreground text-sm mb-6">
            Un lien de connexion a été envoyé à <strong>{email}</strong>.<br />
            Cliquez dessus pour accéder à votre espace.
          </p>
          <button
            onClick={() => { setSent(false); setError(""); }}
            className="text-sm underline text-muted-foreground hover:text-foreground transition"
          >
            Utiliser un autre email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Link>

          <div className="text-center mb-8">
            <div className="flex justify-center mb-4"><Logo size="lg" href="/" /></div>
            <h1 className="text-2xl font-bold">Connexion</h1>
            <p className="text-muted-foreground text-sm mt-1">Accédez à votre espace vendeur</p>
          </div>

          {/* Sélecteur de mode */}
          <div className="flex gap-2 mb-6 bg-muted p-1 rounded-xl">
            <button
              onClick={() => { setMode("magic"); setError(""); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition ${mode === "magic" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Mail className="h-4 w-4" />
              Lien par email
            </button>
            <button
              onClick={() => { setMode("password"); setError(""); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition ${mode === "password" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <KeyRound className="h-4 w-4" />
              Mot de passe
            </button>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {/* Email (commun aux deux modes) */}
            <div>
              <label className="text-sm font-medium mb-1 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && (mode === "magic" ? handleMagicLink() : handlePassword())}
                placeholder="votre@email.com"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Mot de passe (uniquement en mode password) */}
            {mode === "password" && (
              <div>
                <label className="text-sm font-medium mb-1 block">Mot de passe</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && handlePassword()}
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
            )}

            {/* Bouton principal */}
            <button
              onClick={mode === "magic" ? handleMagicLink : handlePassword}
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: "oklch(0.35 0.12 145)" }}
            >
              {loading
                ? "Envoi en cours..."
                : mode === "magic"
                  ? "✉️ Recevoir le lien de connexion"
                  : "Se connecter"}
            </button>

            {mode === "magic" && (
              <p className="text-xs text-center text-muted-foreground">
                Vous recevrez un lien valable 1 heure. Pas de mot de passe à retenir.
              </p>
            )}

            <div className="text-center text-sm text-muted-foreground">
              Pas encore de compte ?{" "}
              <Link href="/auth/register" className="font-medium hover:text-primary" style={{ color: "oklch(0.35 0.12 145)" }}>
                Créer un compte
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-muted-foreground">Chargement...</div></div>}>
      <LoginForm />
    </Suspense>
  );
}
