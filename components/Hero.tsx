import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Fond gradient */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, oklch(0.35 0.12 145), oklch(0.45 0.15 145) 50%, oklch(0.65 0.19 45))" }} />

      {/* Motif décoratif */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-white rounded-full blur-3xl" />
      </div>

      {/* Émojis flottants décoratifs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {["🍚", "👘", "📱", "🧺", "🥭", "🛋️", "💍", "🌿"].map((emoji, i) => (
          <div
            key={i}
            className="absolute text-4xl opacity-20"
            style={{
              top: `${10 + (i * 12) % 80}%`,
              left: `${5 + (i * 13) % 90}%`,
              transform: `rotate(${i * 45}deg)`,
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
            🇸🇳 La marketplace du Sénégal
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
            Achetez et Vendez
            <span className="block" style={{ color: "oklch(0.95 0.10 55)" }}>
              Localement au Sénégal
            </span>
          </h1>

          <p className="text-lg md:text-xl mb-10 text-white/85 max-w-2xl mx-auto leading-relaxed">
            La marketplace sénégalaise qui connecte vendeurs et acheteurs.
            Produits locaux de qualité, paiements Wave & Orange Money.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/#products"
              className="flex items-center justify-center gap-2 bg-white font-bold px-8 py-4 rounded-2xl hover:bg-white/90 transition shadow-lg text-base"
              style={{ color: "oklch(0.35 0.12 145)" }}>
              🛍️ Commencer à acheter
            </Link>
            <Link href="/seller"
              className="flex items-center justify-center gap-2 border-2 border-white text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/10 transition text-base">
              🏪 Devenir vendeur
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "500+", label: "Vendeurs actifs", emoji: "🏪" },
              { value: "10k+", label: "Produits", emoji: "📦" },
              { value: "25k+", label: "Clients satisfaits", emoji: "😊" },
              { value: "14", label: "Régions couvertes", emoji: "📍" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="text-2xl mb-1">{stat.emoji}</div>
                <div className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-xs text-white/75">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vague décorative en bas */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H0Z" fill="white" fillOpacity="0.05"/>
        </svg>
      </div>
    </section>
  );
}