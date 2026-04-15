"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CheckoutCancelPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-md w-full">
          <XCircle className="h-20 w-20 mx-auto mb-6 text-red-500" />
          <h1 className="text-2xl font-bold mb-2">Paiement annulé</h1>
          <p className="text-muted-foreground mb-6 text-sm">
            Votre paiement n&apos;a pas abouti. Votre panier a été conservé.
          </p>
          {orderId && (
            <p className="text-xs text-muted-foreground mb-6">
              Référence : <span className="font-mono">{orderId.slice(0, 8).toUpperCase()}</span>
            </p>
          )}
          <div className="space-y-3">
            <Link href="/cart"
              className="block text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition text-center"
              style={{ background: "oklch(0.35 0.12 145)" }}>
              Réessayer le paiement
            </Link>
            <Link href="/" className="block text-sm text-muted-foreground hover:text-foreground transition">
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
