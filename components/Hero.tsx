"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, oklch(0.35 0.12 145), oklch(0.45 0.15 145) 50%, oklch(0.65 0.19 45))" }} />

      {/* Motif décoratif */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute inset-0"
          style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
      </div>

      {/* Émojis flottants */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {["🍚", "👘", "📱", "🧺", "🥭", "🛋️", "💍", "🌿"].map((emoji, i) => (
          <div key={i} className="absolute text-3xl opacity-15 animate-float"
            style={{
              top: `${10 + (i * 12) % 80}%`,
              left: `${5 + (i * 13) % 90}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${3 + (i % 3)}s`,
            }}>
            {emoji}
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">

          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 px-5 py-2 rounded-full text-sm font-medium mb-6"
            style={{ animation: "fadeInUp 0.5s ease-out forwards" }}>
            🇸🇳 La marketplace du Sénégal
          </div>

          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight"
            style={{ animation: "fadeInUp 0.5s ease-out 0.1s forwards", opacity: 0 }}>
            Achetez et Vendez
            <span className="block" style={{ color: "oklch(0.95 0.10 55)" }}>
              Localement au Sénégal
            </span>
          </h1>

          <p className="text-lg md:text-xl mb-10 text-white/85 max-w-2xl mx-auto leading-relaxed"
            style={{ animation: "fadeInUp 0.5s ease-out 0.2s forwards", opacity: 0 }}>
            La marketplace sénégalaise qui connecte vendeurs et acheteurs.
            Paiements Wave, Orange Money & Free Money.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            style={{ animation: "fadeInUp 0.5s ease-out 0.3s forwards", opacity: 0 }}>
            <Link href="/#products" className="btn btn-white btn-xl">
              🛍️ Commencer à acheter
            </Link>
            <Link href="/seller" className="btn btn-outline-white btn-xl">
              🏪 Devenir vendeur
            </Link>
          </div>

          {/* Vrais atouts */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4"
            style={{ animation: "fadeInUp 0.5s ease-out 0.4s forwards", opacity: 0 }}>
            {[
              { emoji: "🇸🇳", label: "100% Sénégalais" },
              { emoji: "📍", label: "14 régions" },
              { emoji: "💳", label: "Wave · Orange · Free" },
              { emoji: "🤖", label: "IA intégrée" },
            ].map((item) => (
              <div key={item.label} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-4 hover:bg-white/15 transition-colors">
                <div className="text-2xl mb-1">{item.emoji}</div>
                <div className="text-sm font-medium text-white/90">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vague décorative */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H0Z"
            fill="white" fillOpacity="0.05"/>
        </svg>
      </div>
    </section>
  );
}
