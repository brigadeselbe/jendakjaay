import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Politique de Confidentialité</h1>
          <p className="text-muted-foreground text-sm">Dernière mise à jour : Janvier 2025</p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed">

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "oklch(0.35 0.12 145)" }}>
              1. Introduction
            </h2>
            <p className="text-muted-foreground">
              Jënd ak Jaay s&apos;engage à protéger votre vie privée. Cette politique explique
              comment nous collectons, utilisons et protégeons vos données personnelles
              conformément aux lois sénégalaises en vigueur.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "oklch(0.35 0.12 145)" }}>
              2. Données collectées
            </h2>
            <p className="text-muted-foreground mb-3">Nous collectons les données suivantes :</p>
            <div className="space-y-3">
              {[
                { title: "Données d'identification", items: ["Nom et prénom", "Numéro de téléphone", "Adresse email (optionnel)"] },
                { title: "Données de livraison", items: ["Adresse de livraison", "Région", "Instructions spéciales"] },
                { title: "Données de transaction", items: ["Produits commandés", "Montants des transactions", "Mode de paiement"] },
              ].map((section) => (
                <div key={section.title} className="bg-muted rounded-xl p-4">
                  <p className="font-semibold mb-2">{section.title}</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    {section.items.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "oklch(0.35 0.12 145)" }}>
              3. Utilisation des données
            </h2>
            <p className="text-muted-foreground mb-3">Vos données sont utilisées pour :</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Traiter et livrer vos commandes</li>
              <li>Vous contacter concernant vos commandes</li>
              <li>Améliorer notre service</li>
              <li>Prévenir les fraudes</li>
              <li>Respecter nos obligations légales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "oklch(0.35 0.12 145)" }}>
              4. Partage des données
            </h2>
            <p className="text-muted-foreground mb-3">
              Nous partageons vos données uniquement avec :
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Les vendeurs pour traiter vos commandes</li>
              <li>Les opérateurs de paiement (Wave, Orange Money, Free Money)</li>
              <li>Les services de livraison partenaires</li>
            </ul>
            <p className="text-muted-foreground mt-3">
              Nous ne vendons jamais vos données à des tiers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "oklch(0.35 0.12 145)" }}>
              5. Sécurité des données
            </h2>
            <p className="text-muted-foreground">
              Vos données sont stockées de manière sécurisée sur Supabase, une plateforme
              certifiée SOC 2. Nous utilisons le chiffrement SSL pour toutes les transmissions
              de données. L&apos;accès à vos données est strictement limité.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "oklch(0.35 0.12 145)" }}>
              6. Cookies
            </h2>
            <p className="text-muted-foreground">
              Nous utilisons des cookies essentiels pour le fonctionnement du site (panier,
              session). Nous n&apos;utilisons pas de cookies publicitaires ou de tracking.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "oklch(0.35 0.12 145)" }}>
              7. Vos droits
            </h2>
            <p className="text-muted-foreground mb-3">Vous avez le droit de :</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Accéder à vos données personnelles</li>
              <li>Corriger vos données inexactes</li>
              <li>Supprimer vos données</li>
              <li>Vous opposer au traitement de vos données</li>
            </ul>
            <p className="text-muted-foreground mt-3">
              Pour exercer ces droits, contactez-nous via WhatsApp au +221 78 385 44 65.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "oklch(0.35 0.12 145)" }}>
              8. Conservation des données
            </h2>
            <p className="text-muted-foreground">
              Vos données sont conservées pendant 3 ans après votre dernière commande,
              puis supprimées automatiquement sauf obligation légale contraire.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "oklch(0.35 0.12 145)" }}>
              9. Contact
            </h2>
            <p className="text-muted-foreground mb-3">
              Pour toute question sur vos données personnelles :
            </p>
            <div className="space-y-1 text-muted-foreground">
              <p>📞 +221 78 385 44 65</p>
              <p>✉️ privacy@jendakjaay.sn</p>
              <p>📍 Dakar, Sénégal</p>
            </div>
          </section>

        </div>

        <div className="mt-12 p-6 bg-muted rounded-2xl text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Consultez également nos conditions d&apos;utilisation
          </p>
          <Link href="/terms"
            className="inline-block text-white px-6 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition"
            style={{ background: "oklch(0.35 0.12 145)" }}>
            Conditions d&apos;utilisation →
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}