const features = [
  { emoji: "🔒", title: "Paiement Sécurisé", description: "Wave, Orange Money, Free Money — 100% sécurisé" },
  { emoji: "🚚", title: "Livraison Rapide", description: "Livraison dans toutes les régions du Sénégal" },
  { emoji: "💳", title: "Multi Paiements", description: "Mobile Money, cartes bancaires et plus" },
  { emoji: "🎧", title: "Support 24/7", description: "Une équipe dédiée pour vous accompagner" },
];

export default function Features() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Pourquoi Choisir Jënd ak Jaay ?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Une plateforme moderne, sûre et adaptée aux besoins du marché sénégalais
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">{f.emoji}</div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}