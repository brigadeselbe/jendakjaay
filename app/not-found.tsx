import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-md w-full">

          {/* Illustration */}
          <div className="relative mx-auto w-40 h-40 mb-8">
            <div className="absolute inset-0 rounded-full opacity-10 animate-pulse"
              style={{ background: "oklch(0.35 0.12 145)" }} />
            <div className="absolute inset-4 rounded-full opacity-15"
              style={{ background: "oklch(0.65 0.19 45)" }} />
            <div className="absolute inset-0 flex items-center justify-center text-7xl">
              🛒
            </div>
          </div>

          {/* Code */}
          <p className="text-8xl font-black mb-2 leading-none"
            style={{
              background: "linear-gradient(135deg, oklch(0.35 0.12 145), oklch(0.65 0.19 45))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
            404
          </p>

          <h1 className="text-2xl font-bold mb-3">Page introuvable</h1>
          <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
            La page que vous cherchez n&apos;existe pas ou a été déplacée.
            Pas de panique, les produits sont toujours là !
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/"
              className="btn btn-primary btn-lg">
              🏠 Retour à l&apos;accueil
            </Link>
            <Link href="/profile"
              className="btn btn-outline btn-lg">
              📦 Mes commandes
            </Link>
          </div>

          {/* Liens rapides */}
          <div className="mt-10 pt-8 border-t">
            <p className="text-xs text-muted-foreground mb-4">Liens utiles</p>
            <div className="flex flex-wrap gap-3 justify-center text-sm">
              {[
                { href: "/", label: "Produits" },
                { href: "/cart", label: "Panier" },
                { href: "/seller", label: "Vendre" },
                { href: "/help", label: "Aide" },
                { href: "/contact", label: "Contact" },
              ].map((l) => (
                <Link key={l.href} href={l.href}
                  className="px-3 py-1.5 rounded-full border border-border hover:border-primary hover:text-primary transition-colors text-muted-foreground">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
