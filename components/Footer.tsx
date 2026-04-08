import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-muted/50 border-t mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* Brand */}
          <div>
            <div className="mb-4">
              <img src="/logo.png" alt="Jënd ak Jaay" className="h-10 w-auto" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              La marketplace sénégalaise qui connecte vendeurs et acheteurs localement.
              Projet étudiant — DAUST, Dakar.
            </p>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-accent hover:border-primary transition-colors font-medium">
                Facebook
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-accent hover:border-primary transition-colors font-medium">
                Instagram
              </a>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="font-semibold mb-4">Liens Rapides</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">À propos</Link></li>
              <li><Link href="/help" className="hover:text-primary transition-colors">Comment ça marche</Link></li>
              <li><Link href="/seller" className="hover:text-primary transition-colors">Devenir vendeur</Link></li>
              <li><Link href="/" className="hover:text-primary transition-colors">Tous les produits</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/help" className="hover:text-primary transition-colors">Centre d&apos;aide</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Conditions d&apos;utilisation</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Confidentialité</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Nous contacter</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>📍 Dakar, Sénégal</li>
              <li>
                <a href="tel:+221783854465" className="hover:text-primary transition-colors">
                  📞 +221 78 385 44 65
                </a>
              </li>
              <li>
                <a href="mailto:contact@jendakjaay.sn" className="hover:text-primary transition-colors">
                  ✉️ contact@jendakjaay.sn
                </a>
              </li>
            </ul>

            <div className="mt-5">
              <p className="text-xs font-semibold mb-2 text-foreground">Paiements acceptés</p>
              <div className="flex gap-2 text-xs">
                <span className="bg-background border border-border px-2.5 py-1.5 rounded-lg font-medium">📱 Wave</span>
                <span className="bg-background border border-border px-2.5 py-1.5 rounded-lg font-medium">🟠 Orange</span>
                <span className="bg-background border border-border px-2.5 py-1.5 rounded-lg font-medium">🔵 Free</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bas de page */}
        <div className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>&copy; 2025 Jënd ak Jaay · Projet étudiant DAUST. Tous droits réservés.</p>
          <p>Fait avec ❤️ au Sénégal 🇸🇳</p>
        </div>
      </div>
    </footer>
  );
}
