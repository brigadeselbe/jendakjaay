import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { image, media_type, name, category, region } = await request.json();

    const textPrompt = `Tu es un assistant pour vendeurs sénégalais sur Jënd ak Jaay.
${name ? `Nom du produit : "${name}"` : ""}
${category ? `Catégorie : "${category}"` : ""}
${region ? `Vendu à : ${region}` : ""}

${image ? "Analyse l'image de ce produit et génère" : "Génère"} une description courte, attrayante et simple pour ce produit.
- Maximum 2-3 phrases
- En français simple et clair
- Mentionne les caractéristiques visibles (couleur, matière, usage) si image fournie
- Adapté au marché sénégalais
- Réponds UNIQUEMENT avec la description, sans commentaire`;

    const parts = image
      ? [
          { inline_data: { mime_type: media_type ?? "image/jpeg", data: image } },
          { text: textPrompt },
        ]
      : [{ text: textPrompt }];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts }],
          generationConfig: { maxOutputTokens: 300, temperature: 0.7 },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      return NextResponse.json({ error: "Erreur IA" }, { status: 502 });
    }

    const data = await response.json();
    const parts2: Array<{ text?: string; thought?: boolean }> =
      data.candidates?.[0]?.content?.parts ?? [];
    const description = parts2
      .filter((p) => !p.thought && p.text)
      .map((p) => p.text)
      .join("")
      .trim();

    return NextResponse.json({ description });
  } catch (e) {
    console.error("describe-product error:", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
