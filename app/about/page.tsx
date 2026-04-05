import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const team = [
  { name: "Amadou Diallo", role: "CEO & Fondateur", emoji: "👨🏿‍💼", region: "Dakar" },
  { name: "Fatou Ndiaye", role: "Directrice Marketing", emoji: "👩🏿‍💼", region: "Saint-Louis" },
  { name: "Moussa Sow", role: "Lead Développeur", emoji: "👨🏿‍💻", region: "Thiès" },
  { name: "Aminata Fall", role: "Responsable Vendeurs", emoji: "👩🏿‍🤝‍👨🏿", region: "Dakar" },
];

const values = [
  { emoji: "🇸🇳", title: "100% Sénégalais", description: "Créé au Sénégal, pour les Sénégalais. Nous soutenons l'économie locale et les entrepreneurs locaux." },
  { emoji: "🤝", title: "Confiance", description: "Chaque vendeur est vérifié. Chaque transaction est sécurisée. Votre confiance est notre priorité." },
  { emoji: "🌍", title: "Impact Local", description: "Nous connectons les vendeurs de toutes les 14 régions du Sénégal avec des acheteurs partout." },
  { emoji: "🚀", title: "Innovation", description: "IA, recherche par image, WhatsApp Business — nous utilisons la technologie pour simplifier le commerce." },
];

const stats = [
  { value: "2024", label: "Année de création" },
  { value: "500+", label: "Vendeurs actifs" },
  { value: "14", label: "Régions couvertes" },
  { value: "25k+", label: "Clients satisfaits" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">

        {/* Hero */}
        <section className="relative py-20 text-white overflow-hidden"
          style={{ background: "linear-gradient(135deg, oklch(0.35 0.12 145), oklch(0.65 0.19 45))" }}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-medium mb-6">
              🇸🇳 Notre histoire
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              À Propos de Jënd ak Jaay
            </h1>
            <p className="text-lg text-white/85 max-w-2xl mx-auto">
              Jënd ak Jaay signifie &quot;Acheter et Vendre&quot; en Wolof. Notre mission est de connecter
              vendeurs et acheteurs à travers tout le Sénégal grâce à la technologie.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 border-b">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-jaay-green mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Notre histoire */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 text-white"
                  style={{ background: "oklch(0.35 0.12 145)" }}>
                  📖 Notre histoire
                </div>
                <h2 className="text-3xl font-bold mb-4">Né d&apos;un besoin réel</h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Jënd ak Jaay est né d&apos;une observation simple : les vendeurs sénégalais méritaient
                  une plateforme moderne, adaptée à leurs besoins, qui parle leur langue et accepte
                  leurs moyens de paiement.
                </p>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  En 2024, nous avons lancé la première version de notre marketplace avec un objectif
                  clair : rendre le commerce en ligne accessible à tous les Sénégalais, des artisans
                  de Saint-Louis aux commerçants de Ziguinchor.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Aujourd&apos;hui, nous connectons plus de 500 vendeurs avec des milliers d&apos;acheteurs
                  dans les 14 régions du Sénégal, avec Wave, Orange Money et Free Money comme
                  moyens de paiement.
                </p>
              </div>
              <div className="bg-muted rounded-3xl p-8 text-center">
                <div className="text-8xl mb-4">🇸🇳</div>
                <h3 className="text-xl font-bold mb-2">Fièrement Sénégalais</h3>
                <p className="text-muted-foreground text-sm">
                  De Dakar à Ziguinchor, de Thiès à Kédougou — nous couvrons tout le Sénégal
                </p>
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  {["Dakar", "Thiès", "Saint-Louis", "Ziguinchor", "Kaolack", "Tambacounda"].map((r) => (
                    <span key={r} className="text-xs bg-background px-3 py-1 rounded-full border border-border">
                      📍 {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Valeurs */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Nos Valeurs</h2>
              <p className="text-muted-foreground">Ce qui nous guide chaque jour</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => (
                <div key={value.title} className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="text-4xl mb-4">{value.emoji}</div>
                  <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Équipe */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Notre Équipe</h2>
              <p className="text-muted-foreground">Des Sénégalais passionnés au service du commerce local</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member) => (
                <div key={member.name} className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-md transition">
                  <div className="text-6xl mb-4">{member.emoji}</div>
                  <h3 className="font-bold mb-1">{member.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{member.role}</p>
                  <span className="text-xs bg-muted px-3 py-1 rounded-full">📍 {member.region}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 text-white"
          style={{ background: "linear-gradient(135deg, oklch(0.35 0.12 145), oklch(0.65 0.19 45))" }}>
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Rejoignez l&apos;aventure ! 🚀</h2>
            <p className="text-white/85 mb-8 max-w-xl mx-auto">
              Que vous soyez acheteur ou vendeur, Jënd ak Jaay est fait pour vous
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/seller"
                className="bg-white font-bold px-8 py-3 rounded-xl hover:bg-white/90 transition"
                style={{ color: "oklch(0.35 0.12 145)" }}>
                Devenir vendeur
              </Link>
              <Link href="/contact"
                className="border-2 border-white text-white font-bold px-8 py-3 rounded-xl hover:bg-white/10 transition">
                Nous contacter
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}