import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Conditions d&apos;Utilisation</h1>
          <p className="text-muted-foreground text-sm">Dernière mise à jour : Janvier 2025</p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed">

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "oklch(0.35 0.12 145)" }}>
              1. Acceptation des conditions
            </h2>
            <p className="text-muted-foreground">
              En utilisant la plateforme Jënd ak Jaay, vous acceptez les présentes conditions
              d&apos;utilisation. Si vous n&apos;acceptez pas ces conditions, veuillez ne pas utiliser
              notre service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "oklch(0.35 0.12 145)" }}>
              2. Description du service
            </h2>
            <p className="text-muted-foreground mb-3">
              Jënd ak Jaay est une marketplace en ligne qui permet aux vendeurs sénégalais de
              publier leurs produits et aux acheteurs de les découvrir et les commander.
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Publication et vente de produits légaux</li>
              <li>Paiement via Wave, Orange Money et Free Money</li>
              <li>Livraison dans toutes les régions du Sénégal</li>
              <li>Support client via WhatsApp</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "oklch(0.35 0.12 145)" }}>
              3. Obligations des vendeurs
            </h2>
            <p className="text-muted-foreground mb-3">En tant que vendeur sur Jënd ak Jaay, vous vous engagez à :</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Fournir des informations exactes sur vos produits</li>
              <li>Respecter les délais de livraison annoncés</li>
              <li>Ne vendre que des produits légaux et conformes</li>
              <li>Traiter les acheteurs avec respect et professionnalisme</li>
              <li>Honorer les commandes reçues</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "oklch(0.35 0.12 145)" }}>
              4. Obligations des acheteurs
            </h2>
            <p className="text-muted-foreground mb-3">En tant qu&apos;acheteur, vous vous engagez à :</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Fournir des informations de livraison exactes</li>
              <li>Effectuer le paiement dans les délais convenus</li>
              <li>Traiter les vendeurs avec respect</li>
              <li>Ne pas effectuer de commandes frauduleuses</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "oklch(0.35 0.12 145)" }}>
              5. Paiements et transactions
            </h2>
            <p className="text-muted-foreground mb-3">
              Les paiements sur Jënd ak Jaay s&apos;effectuent via :
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Wave — paiement mobile sécurisé</li>
              <li>Orange Money — paiement mobile Orange</li>
              <li>Free Money — paiement mobile Free</li>
            </ul>
            <p className="text-muted-foreground mt-3">
              Jënd ak Jaay n&apos;est pas responsable des problèmes liés aux opérateurs de paiement.
              En cas de litige, contactez notre support via WhatsApp.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "oklch(0.35 0.12 145)" }}>
              6. Retours et remboursements
            </h2>
            <p className="text-muted-foreground mb-3">
              Les retours sont acceptés dans les 48h suivant la livraison pour les produits :
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Non conformes à la description</li>
              <li>Défectueux ou endommagés</li>
              <li>Non reçus dans les délais annoncés</li>
            </ul>
            <p className="text-muted-foreground mt-3">
              Les produits alimentaires ne sont pas remboursables sauf en cas de problème de qualité.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "oklch(0.35 0.12 145)" }}>
              7. Propriété intellectuelle
            </h2>
            <p className="text-muted-foreground">
              Tout le contenu de Jënd ak Jaay (logo, design, textes) est protégé par le droit
              d&apos;auteur. Les vendeurs conservent la propriété de leurs contenus publiés sur la
              plateforme.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "oklch(0.35 0.12 145)" }}>
              8. Limitation de responsabilité
            </h2>
            <p className="text-muted-foreground">
              Jënd ak Jaay agit en tant qu&apos;intermédiaire entre vendeurs et acheteurs. Nous ne
              sommes pas responsables des transactions entre utilisateurs, de la qualité des
              produits vendus, ni des litiges entre vendeurs et acheteurs.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "oklch(0.35 0.12 145)" }}>
              9. Modification des conditions
            </h2>
            <p className="text-muted-foreground">
              Jënd ak Jaay se réserve le droit de modifier ces conditions à tout moment.
              Les utilisateurs seront informés des modifications importantes via WhatsApp ou email.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: "oklch(0.35 0.12 145)" }}>
              10. Contact
            </h2>
            <p className="text-muted-foreground">
              Pour toute question concernant ces conditions, contactez-nous :
            </p>
            <div className="mt-3 space-y-1 text-muted-foreground">
              <p>📞 +221 78 385 44 65</p>
              <p>✉️ contact@jendakjaay.sn</p>
              <p>📍 Dakar, Sénégal</p>
            </div>
          </section>

        </div>

        <div className="mt-12 p-6 bg-muted rounded-2xl text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Consultez également notre politique de confidentialité
          </p>
          <Link href="/privacy"
            className="inline-block text-white px-6 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition"
            style={{ background: "oklch(0.35 0.12 145)" }}>
            Politique de confidentialité →
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
