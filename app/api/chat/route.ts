import { NextRequest, NextResponse } from "next/server";

async function fetchProducts() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/products?select=name,category,price,emoji,seller_name,seller_location,in_stock,description&in_stock=eq.true&limit=100`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
        },
      }
    );
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function POST(request: NextRequest) {
  try {
    const { messages, system } = await request.json();

    const products = await fetchProducts();
    const productsList = products.length > 0
      ? products.map((p: { name: string; category: string; price: number; emoji: string; seller_name: string; seller_location: string; description?: string }) =>
          `${p.emoji} ${p.name} — ${p.category} — ${p.price.toLocaleString("fr-SN")} FCFA — Vendeur: ${p.seller_name} (${p.seller_location})${p.description ? ` — ${p.description}` : ""}`
        ).join("\n")
      : "Aucun produit disponible pour le moment.";

    const defaultSystem = `Tu es l'assistant virtuel de Jënd ak Jaay, la marketplace sénégalaise.
Tu parles français et tu comprends le wolof.
Tu es chaleureux, amical et tu utilises parfois des expressions sénégalaises.
Le site accepte Wave, Orange Money et Free Money comme paiement.
La livraison est disponible dans toutes les régions du Sénégal.

Voici les produits actuellement disponibles sur le site :
${productsList}

Aide les acheteurs à trouver des produits parmi cette liste, à passer une commande, à payer avec Wave ou Orange Money.
Aide aussi les vendeurs à publier leurs produits.
Réponds de manière courte et utile, maximum 3-4 phrases.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: system ?? defaultSystem,
        messages,
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
