import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { phone, message } = await request.json();

    if (!phone || !message) {
      return NextResponse.json({ error: "Phone et message requis" }, { status: 400 });
    }

    // Nettoyer le numéro de téléphone
    const cleanPhone = phone.replace(/\D/g, "");
    const fullPhone = cleanPhone.startsWith("221") ? cleanPhone : `221${cleanPhone}`;

    // URL WhatsApp API (wa.me)
    const whatsappUrl = `https://wa.me/${fullPhone}?text=${encodeURIComponent(message)}`;

    return NextResponse.json({ success: true, url: whatsappUrl });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}