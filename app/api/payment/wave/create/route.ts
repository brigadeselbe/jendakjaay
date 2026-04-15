import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { order } = await request.json();

    if (!order) {
      return NextResponse.json({ error: "Commande manquante" }, { status: 400 });
    }

    // 1. Sauvegarder la commande en base avec status "en_attente_paiement"
    const supabase = await createClient();
    const { data: savedOrder, error: dbError } = await supabase
      .from("orders")
      .insert([{
        buyer_name: order.buyer_name,
        buyer_phone: order.buyer_phone,
        buyer_address: order.buyer_address,
        buyer_region: order.buyer_region,
        items: order.items,
        total_price: order.total_price,
        delivery_price: order.delivery_price,
        payment_method: "wave",
        notes: order.notes ?? "",
        status: "en_attente_paiement",
      }])
      .select()
      .single();

    if (dbError) throw dbError;

    const orderId = savedOrder.id;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? request.headers.get("origin") ?? "";

    // 2. Créer une session de paiement Wave
    const waveResponse = await fetch("https://api.wave.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WAVE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: String(order.total_price),
        currency: "XOF",
        client_reference: orderId,
        success_url: `${baseUrl}/checkout/success?order_id=${orderId}&method=wave`,
        error_url: `${baseUrl}/checkout/cancel?order_id=${orderId}`,
      }),
    });

    if (!waveResponse.ok) {
      const err = await waveResponse.json();
      console.error("Wave API error:", err);
      // Annuler la commande si Wave échoue
      await supabase.from("orders").update({ status: "annule" }).eq("id", orderId);
      return NextResponse.json({ error: "Erreur Wave, réessayez." }, { status: 502 });
    }

    const session = await waveResponse.json();

    return NextResponse.json({
      order_id: orderId,
      wave_launch_url: session.wave_launch_url,
    });
  } catch (e) {
    console.error("Wave create error:", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
