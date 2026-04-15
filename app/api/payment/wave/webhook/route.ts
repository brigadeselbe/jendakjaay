import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const event = JSON.parse(body);

    console.log("Wave webhook received:", event.type, event.data?.client_reference);

    const supabase = await createClient();

    switch (event.type) {
      case "checkout.session.completed": {
        // Paiement réussi — mettre la commande en "payé"
        const orderId = event.data?.client_reference;
        if (!orderId) break;

        await supabase
          .from("orders")
          .update({ status: "paye", wave_session_id: event.data?.id })
          .eq("id", orderId);

        console.log(`Commande ${orderId} marquée comme payée`);
        break;
      }

      case "checkout.session.failed":
      case "checkout.session.expired": {
        // Paiement échoué ou expiré — annuler la commande
        const orderId = event.data?.client_reference;
        if (!orderId) break;

        await supabase
          .from("orders")
          .update({ status: "annule" })
          .eq("id", orderId)
          .eq("status", "en_attente_paiement"); // ne pas écraser si déjà payé

        console.log(`Commande ${orderId} annulée (${event.type})`);
        break;
      }

      default:
        console.log("Webhook Wave non géré:", event.type);
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    console.error("Wave webhook error:", e);
    return NextResponse.json({ error: "Erreur webhook" }, { status: 500 });
  }
}
