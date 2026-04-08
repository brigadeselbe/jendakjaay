import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { image, products } = await request.json();

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        messages: [{
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/jpeg",
                data: image,
              },
            },
            {
              type: "text",
              text: `Regarde cette image et identifie l'objet ou le produit principal.
Voici la liste des produits disponibles sur notre marketplace sénégalaise:
${products.map((p: {id: string, name: string, category: string}) => `- ID: ${p.id} | Nom: ${p.name} | Catégorie: ${p.category}`).join("\n")}

Retourne UNIQUEMENT un JSON avec:
{
  "detected": "nom de l'objet détecté dans l'image",
  "category": "catégorie la plus proche",
  "matches": ["id1", "id2", "id3"] // les 3 IDs de produits les plus similaires
}
Ne retourne rien d'autre que ce JSON.`
            }
          ],
        }],
      }),
    });

    const data = await response.json();
    const text = data.content?.[0]?.text || "{}";
    const clean = text.replace(/```json|```/g, "").trim();
    const result = JSON.parse(clean);

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Erreur analyse image" }, { status: 500 });
  }
}