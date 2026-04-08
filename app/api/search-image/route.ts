import { NextRequest, NextResponse } from "next/server";

type MediaType = "image/jpeg" | "image/png" | "image/gif" | "image/webp";

export async function POST(request: NextRequest) {
  try {
    const { image, media_type, products } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "Image manquante" }, { status: 400 });
    }

    const safeMediaType: MediaType =
      ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(media_type)
        ? media_type
        : "image/jpeg";

    const productList = (products ?? [])
      .map((p: { id: string; name: string; category: string }) =>
        `- ID: ${p.id} | Nom: ${p.name} | Catégorie: ${p.category}`
      )
      .join("\n");

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-6",
        max_tokens: 600,
        messages: [{
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: safeMediaType, data: image },
            },
            {
              type: "text",
              text: `Tu es un assistant de recherche de produits pour Jënd ak Jaay, marketplace sénégalaise.

Analyse cette image et identifie l'objet ou produit principal visible.

Produits disponibles sur le site :
${productList || "Aucun produit disponible"}

Réponds UNIQUEMENT avec ce JSON (sans markdown, sans texte avant/après) :
{"detected":"nom de l'objet vu","category":"catégorie correspondante","matches":["id1","id2","id3"]}

Si aucun produit ne correspond exactement, mets les IDs les plus proches par catégorie.
Si la liste est vide, mets matches:[].`,
            },
          ],
        }],
      }),
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      const errMsg = errBody?.error?.message ?? `Erreur Anthropic ${response.status}`;
      console.error("Anthropic API error:", response.status, errBody);
      return NextResponse.json({ error: errMsg }, { status: 502 });
    }

    const data = await response.json();
    const rawText = data.content?.[0]?.text ?? "{}";

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Réponse IA non JSON:", rawText);
      return NextResponse.json({ error: "Réponse IA invalide" }, { status: 502 });
    }

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json(result);
  } catch (err) {
    console.error("search-image error:", err);
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
