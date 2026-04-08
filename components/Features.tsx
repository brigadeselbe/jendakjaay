import React from "react";
import Link from "next/link";

type Feature = {
  emoji: string;
  title: string;
  description: string;
  color: string;
  bg: string;
};

const features: Feature[] = [
  {
    emoji: "🔒",
    title: "Paiement Sécurisé",
    description: "Wave, Orange Money, Free Money — transactions 100% sécurisées",
    color: "oklch(0.35 0.12 145)",
    bg: "oklch(0.92 0.06 145)",
  },
  {
    emoji: "🚚",
    title: "Livraison Rapide",
    description: "Livraison dans toutes les 14 régions du Sénégal",
    color: "oklch(0.65 0.19 45)",
    bg: "oklch(0.96 0.05 55)",
  },
  {
    emoji: "🤖",
    title: "IA Intégrée",
    description: "Assistant intelligent pour vous aider 24h/24 en français et wolof",
    color: "oklch(0.35 0.12 145)",
    bg: "oklch(0.92 0.06 145)",
  },
  {
    emoji: "🎧",
    title: "Support WhatsApp",
    description: "Contactez vendeurs et support directement sur WhatsApp",
    color: "oklch(0.65 0.19 45)",
    bg: "oklch(0.96 0.05 55)",
  },
];

export default function Features() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 text-white"
            style={{ background: "oklch(0.35 0.12 145)" }}
          >
            ✨ Pourquoi nous choisir
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            La Meilleure Expérience d&apos;Achat
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Une plateforme moderne, sûre et adaptée aux besoins du marché sénégalais
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4"
                style={{ background: f.bg }}
                aria-hidden
              >
                {f.emoji}
              </div>
              <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                {f.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>

        {/* Bannière CTA */}
        <div
          className="mt-16 rounded-3xl p-8 md:p-12 text-white text-center"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.35 0.12 145), oklch(0.65 0.19 45))",
          }}
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Prêt à commencer ? 🚀</h3>
          <p className="text-white/85 mb-8 max-w-xl mx-auto">
            Rejoignez des milliers de vendeurs et acheteurs qui font confiance à Jënd ak Jaay
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="bg-white font-bold px-8 py-3 rounded-xl hover:bg-white/90 transition"
              aria-label="Créer un compte vendeur"
              style={{ color: "oklch(0.35 0.12 145)" }}
            >
              Créer un compte vendeur
            </Link>
            <Link
              href="/"
              className="border-2 border-white text-white font-bold px-8 py-3 rounded-xl hover:bg-white/10 transition"
              aria-label="Explorer les produits"
            >
              Explorer les produits
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}