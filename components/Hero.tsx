import Link from "next/link";

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden py-20 md:py-32"
      style={{ background: "linear-gradient(135deg, oklch(0.35 0.12 145 / 0.95), oklch(0.65 0.19 45 / 0.90))" }}
    >
      {/* Cercles décoratifs */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl"
          style={{ background: "oklch(0.65 0.19 45)" }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">

          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Achetez et Vendez Localement au Sénégal
          </h1>
          <p className="text-lg md:text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            La marketplace sénégalaise qui connecte vendeurs et acheteurs.
            Découvrez des produits locaux de qualité, soutenez l&apos;économie locale.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#products"
              className="bg-white font-semibold px-8 py-3 rounded-lg hover:bg-white/90 transition"
              style={{ color: "oklch(0.35 0.12 145)" }}
            >
              🛍️ Commencer à acheter
            </Link>
            <Link
              href="/seller"
              className="border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/10 transition"
            >
              🏪 Devenir vendeur
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "500+", label: "Vendeurs" },
              { value: "10k+", label: "Produits" },
              { value: "25k+", label: "Clients" },
              { value: "14", label: "Régions" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}