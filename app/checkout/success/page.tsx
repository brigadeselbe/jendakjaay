"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check, Loader } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const method = searchParams.get("method");
  const [status, setStatus] = useState<"loading" | "paid" | "pending">("loading");

  useEffect(() => {
    if (!orderId) { setStatus("pending"); return; }

    async function checkOrder() {
      const supabase = createClient();
      const { data } = await supabase
        .from("orders")
        .select("status")
        .eq("id", orderId)
        .single();

      if (data?.status === "paye") setStatus("paid");
      else setStatus("pending");
    }

    // Vérifier après 2s (le webhook Wave peut prendre quelques secondes)
    const timer = setTimeout(checkOrder, 2000);
    return () => clearTimeout(timer);
  }, [orderId]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-md w-full">

          {status === "loading" && (
            <>
              <Loader className="h-16 w-16 animate-spin mx-auto mb-6 text-muted-foreground" />
              <h1 className="text-xl font-bold mb-2">Vérification du paiement...</h1>
              <p className="text-muted-foreground text-sm">Merci de patienter quelques secondes.</p>
            </>
          )}

          {status === "paid" && (
            <>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-white"
                style={{ background: "oklch(0.35 0.12 145)" }}>
                <Check className="h-10 w-10" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Paiement confirmé ! 🎉</h1>
              <p className="text-muted-foreground mb-2">Votre commande a été payée avec succès.</p>
              {orderId && (
                <p className="text-sm text-muted-foreground mb-6">
                  Commande : <span className="font-mono font-medium">{orderId.slice(0, 8).toUpperCase()}</span>
                </p>
              )}
              <div className="bg-muted rounded-xl p-4 mb-6 text-sm space-y-1 text-left">
                <p>📱 Paiement {method === "wave" ? "Wave" : method} confirmé</p>
                <p>📦 Votre commande est en cours de traitement</p>
                <p>📲 Vous recevrez une confirmation par SMS</p>
              </div>
              <Link href="/orders"
                className="inline-block text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition mb-3 w-full text-center"
                style={{ background: "oklch(0.35 0.12 145)" }}>
                Voir mes commandes
              </Link>
              <Link href="/" className="block text-sm text-muted-foreground hover:text-foreground transition">
                Retour à l&apos;accueil
              </Link>
            </>
          )}

          {status === "pending" && (
            <>
              <div className="text-5xl mb-6">⏳</div>
              <h1 className="text-2xl font-bold mb-2">Paiement en attente</h1>
              <p className="text-muted-foreground mb-6 text-sm">
                Votre paiement est en cours de vérification. Votre commande sera confirmée dès réception.
              </p>
              {orderId && (
                <p className="text-sm text-muted-foreground mb-6">
                  Commande : <span className="font-mono font-medium">{orderId.slice(0, 8).toUpperCase()}</span>
                </p>
              )}
              <Link href="/orders"
                className="inline-block text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition w-full text-center"
                style={{ background: "oklch(0.35 0.12 145)" }}>
                Suivre ma commande
              </Link>
            </>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}
