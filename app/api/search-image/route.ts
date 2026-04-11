import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { image, media_type, products } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "Image manquante" }, { status: 400 });
    }

    const safeMediaType =
      ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(media_type)
        ? media_type
        : "image/jpeg";

    const productList = (products ?? [])
      .map((p: { id: string; name: string; category: string }) =>
        `- ID: ${p.id} | Nom: ${p.name} | Catégorie: ${p.category}`
      )
      .join("\n");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [
              {
                inline_data: {
                  mime_type: safeMediaType,
                  data: image,
                },
              },
              {
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
          generationConfig: {
            maxOutputTokens: 600,
            temperature: 0.2,
          },
        }),
      }
    );

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      console.error("Gemini API error:", response.status, errBody);
      return NextResponse.json({ error: "Erreur API image" }, { status: 502 });
    }

    const data = await response.json();

    // Gemini 2.5 flash peut retourner plusieurs parts (dont des "pensées")
    // On cherche la première part qui contient du JSON
    const parts: Array<{ text?: string; thought?: boolean }> =
      data.candidates?.[0]?.content?.parts ?? [];
    const rawText = parts
      .filter((p) => !p.thought && p.text)
      .map((p) => p.text)
      .join("") || "{}";

    console.log("Gemini image raw response:", rawText.slice(0, 300));

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
