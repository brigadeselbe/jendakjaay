import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

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
        system: `Tu es l'assistant virtuel de Jënd ak Jaay, la marketplace sénégalaise.
Tu parles français et tu comprends le wolof.
Tu aides les acheteurs à trouver des produits, tu expliques comment passer une commande, comment payer avec Wave ou Orange Money.
Tu aides aussi les vendeurs à publier leurs produits.
Tu es chaleureux, amical et tu utilises parfois des expressions sénégalaises.
Les produits disponibles incluent: vêtements traditionnels (boubous, caftans), alimentation (thiéboudienne, yassa, bissap), électronique, artisanat, meubles.
Le site accepte Wave, Orange Money et Free Money comme paiement.
Réponds de manière courte et utile, maximum 3-4 phrases.`,
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