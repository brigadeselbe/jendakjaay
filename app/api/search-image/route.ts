import { NextRequest, NextResponse } from "next/server";

const GEMINI_KEY = process.env.GEMINI_API_KEY!;

// Génère un embedding texte via Google text-embedding-004
async function getTextEmbedding(text: string): Promise<number[] | null> {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "models/text-embedding-004",
          content: { parts: [{ text }] },
        }),
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.embedding?.values ?? null;
  } catch {
    return null;
  }
}

// Identifie l'objet dans l'image via Gemini Vision
async function identifyImage(image: string, mediaType: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [
              { inline_data: { mime_type: mediaType, data: image } },
              { text: "Identifie en 5 mots maximum l'objet ou produit principal visible dans cette image. Réponds uniquement avec le nom de l'objet, en français, sans ponctuation." },
            ],
          }],
          generationConfig: { maxOutputTokens: 50, temperature: 0.1 },
        }),
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const parts: Array<{ text?: string; thought?: boolean }> = data.candidates?.[0]?.content?.parts ?? [];
    return parts.filter((p) => !p.thought && p.text).map((p) => p.text).join("").trim() || null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { image, media_type, products } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "Image manquante" }, { status: 400 });
    }

    const safeMediaType =
      ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(media_type)
        ? media_type : "image/jpeg";

    // 1. Identifier l'objet dans l'image
    const detected = await identifyImage(image, safeMediaType);
    if (!detected) {
      return NextResponse.json({ error: "Impossible d'analyser l'image" }, { status: 502 });
    }

    // 2. Générer l'embedding du texte détecté
    const embedding = await getTextEmbedding(detected);

    let matchedIds: string[] = [];

    if (embedding) {
      // 3a. Recherche vectorielle via Supabase
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

        const rpcRes = await fetch(`${supabaseUrl}/rest/v1/rpc/match_products`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({ query_embedding: embedding, match_count: 8 }),
        });

        if (rpcRes.ok) {
          const vectorResults = await rpcRes.json();
          matchedIds = (vectorResults as Array<{ id: string; similarity: number }>)
            .filter((r) => r.similarity > 0.5)
            .map((r) => r.id);
        }
      } catch {
        // Fallback si la recherche vectorielle échoue
      }
    }

    // 3b. Fallback textuel si pas de résultats vectoriels
    if (matchedIds.length === 0 && products?.length > 0) {
      const productList = (products as Array<{ id: string; name: string; category: string }>)
        .map((p) => `- ID: ${p.id} | Nom: ${p.name} | Catégorie: ${p.category}`)
        .join("\n");

      const fallbackRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              role: "user",
              parts: [{
                text: `Objet détecté: "${detected}"\n\nProduits disponibles:\n${productList}\n\nRéponds UNIQUEMENT avec ce JSON (sans markdown):\n{"matches":["id1","id2","id3"]}\n\nMets les IDs des produits les plus similaires à l'objet détecté.`,
              }],
            }],
            generationConfig: { maxOutputTokens: 300, temperature: 0.1 },
          }),
        }
      );

      if (fallbackRes.ok) {
        const fallbackData = await fallbackRes.json();
        const fallbackParts: Array<{ text?: string; thought?: boolean }> =
          fallbackData.candidates?.[0]?.content?.parts ?? [];
        const rawText = fallbackParts.filter((p) => !p.thought && p.text).map((p) => p.text).join("") || "{}";
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const result = JSON.parse(jsonMatch[0]);
          matchedIds = result.matches ?? [];
        }
      }
    }

    return NextResponse.json({ detected, matches: matchedIds });

  } catch (err) {
    console.error("search-image error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
