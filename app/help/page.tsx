"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const faqs = [
  {
    category: "🛍️ Achats",
    questions: [
      {
        q: "Comment passer une commande ?",
        a: "C'est simple ! Choisissez votre produit, cliquez sur 'Ajouter au panier', puis allez dans votre panier et cliquez sur 'Commander maintenant'. Remplissez vos informations de livraison et choisissez votre mode de paiement (Wave, Orange Money ou Free Money)."
      },
      {
        q: "Quels sont les modes de paiement acceptés ?",
        a: "Nous acceptons Wave, Orange Money et Free Money. Ces paiements sont 100% sécurisés. Le vendeur vous contactera sur WhatsApp pour finaliser le paiement après votre commande."
      },
      {
        q: "Comment suivre ma commande ?",
        a: "Allez sur 'Mon Profil' et entrez votre numéro de téléphone. Vous verrez toutes vos commandes avec leur statut en temps réel. Vous pouvez aussi contacter directement le vendeur via WhatsApp."
      },
      {
        q: "Puis-je annuler ma commande ?",
        a: "Oui, vous pouvez annuler votre commande avant qu'elle soit confirmée par le vendeur. Contactez le vendeur directement via WhatsApp ou notre support au +221 78 385 44 65."
      },
      {
        q: "Comment retourner un produit ?",
        a: "Les retours sont acceptés dans les 48h suivant la livraison si le produit ne correspond pas à la description ou est défectueux. Contactez le vendeur via WhatsApp avec des photos du problème."
      },
    ]
  },
  {
    category: "🏪 Vendeurs",
    questions: [
      {
        q: "Comment devenir vendeur sur Jënd ak Jaay ?",
        a: "C'est gratuit ! Cliquez sur 'Devenir vendeur' dans le menu, remplissez vos informations (nom, téléphone, région, boutique) et votre compte est créé instantanément. Vous pouvez commencer à vendre dès maintenant."
      },
      {
        q: "Comment ajouter un produit ?",
        a: "Dans votre dashboard vendeur, cliquez sur 'Ajouter un produit'. Remplissez le nom, la catégorie, le prix et utilisez notre IA pour générer automatiquement une description professionnelle. Vous pouvez aussi ajouter des photos."
      },
      {
        q: "Comment recevoir les paiements ?",
        a: "Quand un acheteur passe une commande, vous recevez une notification. Vous contactez l'acheteur sur WhatsApp pour finaliser le paiement via Wave, Orange Money ou Free Money directement sur votre numéro."
      },
      {
        q: "Est-ce que c'est vraiment gratuit ?",
        a: "Oui, 100% gratuit ! Pas de commission, pas d'abonnement. Vous gardez l'intégralité de vos ventes. Nous gagnons de l'argent uniquement via des services premium optionnels."
      },
      {
        q: "Comment voir mes commandes reçues ?",
        a: "Dans votre dashboard vendeur, cliquez sur 'Voir les commandes'. Vous verrez toutes vos commandes avec les informations des acheteurs. Vous pouvez changer le statut et contacter les acheteurs via WhatsApp."
      },
    ]
  },
  {
    category: "🚚 Livraison",
    questions: [
      {
        q: "Livrez-vous dans toutes les régions du Sénégal ?",
        a: "Oui ! Nous couvrons les 14 régions du Sénégal : Dakar, Thiès, Saint-Louis, Diourbel, Louga, Fatick, Kaolack, Kaffrine, Ziguinchor, Kolda, Sédhiou, Tambacounda, Kédougou et Matam."
      },
      {
        q: "Combien coûte la livraison ?",
        a: "La livraison coûte 2 500 FCFA. Elle est GRATUITE pour toute commande supérieure à 50 000 FCFA. Les délais varient selon votre région : 24-48h pour Dakar et Thiès, 2-5 jours pour les autres régions."
      },
      {
        q: "Combien de temps prend la livraison ?",
        a: "Les délais dépendent de votre région et du vendeur. En général : 24h pour Dakar, 24-48h pour Thiès et Saint-Louis, 2-5 jours pour les autres régions. Le vendeur vous communiquera le délai exact."
      },
    ]
  },
  {
    category: "🔒 Sécurité",
    questions: [
      {
        q: "Mes données sont-elles sécurisées ?",
        a: "Oui ! Vos données sont stockées de manière sécurisée sur Supabase (certifié SOC 2). Nous utilisons le chiffrement SSL. Nous ne vendons jamais vos données à des tiers."
      },
      {
        q: "Comment signaler un vendeur frauduleux ?",
        a: "Contactez immédiatement notre équipe sur WhatsApp au +221 78 385 44 65 avec les détails du problème. Nous enquêterons et prendrons les mesures nécessaires dans les 24h."
      },
      {
        q: "Que faire si je ne reçois pas ma commande ?",
        a: "D'abord contactez le vendeur via WhatsApp. Si pas de réponse sous 24h, contactez notre support au +221 78 385 44 65. Nous interviendrons pour résoudre le problème et vous rembourserons si nécessaire."
      },
    ]
  },
  {
    category: "📱 Application",
    questions: [
      {
        q: "Comment installer l'application ?",
        a: "Jënd ak Jaay est une PWA (Progressive Web App). Sur Chrome, cliquez sur le bouton 'Installer' qui apparaît en bas de l'écran. Sur Safari iPhone, cliquez sur 'Partager' puis 'Sur l'écran d'accueil'."
      },
      {
        q: "L'application fonctionne-t-elle sans internet ?",
        a: "Partiellement ! Grâce à notre service worker, vous pouvez consulter les pages déjà visitées sans internet. Pour passer des commandes, une connexion internet est nécessaire."
      },
      {
        q: "Comment utiliser le chatbot IA ?",
        a: "Cliquez sur le bouton 'Assistant IA' en bas à gauche de l'écran. Posez vos questions en français ou en wolof. L'assistant peut vous aider à trouver des produits, expliquer le processus de commande et plus encore."
      },
    ]
  },
];

export default function HelpPage() {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tous");

  function toggleItem(key: string) {
    setOpenItems((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  const filteredFaqs = faqs.map((cat) => ({
    ...cat,
    questions: cat.questions.filter(
      (q) =>
        q.q.toLowerCase().includes(search.toLowerCase()) ||
        q.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) =>
    (activeCategory === "Tous" || cat.category === activeCategory) &&
    cat.questions.length > 0
  );

  const categories = ["Tous", ...faqs.map((f) => f.category)];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">

        {/* Hero */}
        <section className="py-16 text-white"
          style={{ background: "linear-gradient(135deg, oklch(0.35 0.12 145), oklch(0.65 0.19 45))" }}>
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Centre d&apos;Aide</h1>
            <p className="text-white/85 mb-8 max-w-xl mx-auto">
              Trouvez rapidement les réponses à vos questions
            </p>
            {/* Recherche */}
            <div className="relative max-w-lg mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher une question..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-foreground text-sm focus:outline-none shadow-lg"
              />
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">

            {/* Catégories */}
            <div className="flex gap-2 overflow-x-auto mb-8">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition"
                  style={{
                    background: activeCategory === cat ? "oklch(0.35 0.12 145)" : "",
                    color: activeCategory === cat ? "white" : "",
                    border: activeCategory === cat ? "none" : "1px solid var(--border)",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* FAQ */}
            <div className="space-y-8">
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-3">🔍</div>
                  <p className="font-medium">Aucun résultat trouvé</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Essayez d&apos;autres mots-clés ou contactez notre support
                  </p>
                </div>
              ) : (
                filteredFaqs.map((category) => (
                  <div key={category.category}>
                    <h2 className="text-xl font-bold mb-4">{category.category}</h2>
                    <div className="space-y-3">
                      {category.questions.map((item, i) => {
                        const key = `${category.category}-${i}`;
                        const isOpen = openItems.includes(key);
                        return (
                          <div key={key} className="bg-card border border-border rounded-2xl overflow-hidden">
                            <button
                              onClick={() => toggleItem(key)}
                              className="w-full flex items-center justify-between p-5 text-left hover:bg-accent transition"
                            >
                              <span className="font-medium text-sm pr-4">{item.q}</span>
                              {isOpen
                                ? <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                : <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                              }
                            </button>
                            {isOpen && (
                              <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">
                                {item.a}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Contact support */}
            <div className="mt-12 bg-card border border-border rounded-2xl p-8 text-center">
              <div className="text-4xl mb-3">💬</div>
              <h3 className="text-xl font-bold mb-2">Vous n&apos;avez pas trouvé votre réponse ?</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Notre équipe est disponible 7j/7 de 8h à 20h
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                
                  href="https://wa.me/221783854465?text=Bonjour, j'ai besoin d'aide !"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-medium hover:opacity-90 transition"
                  style={{ background: "#25D366" }}
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp Support
                </a>
                <Link href="/contact"
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border font-medium hover:bg-accent transition text-sm">
                  📧 Formulaire de contact
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}