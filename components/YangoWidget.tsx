"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

const YANGO_APP_ID = "2187871";
const YANGO_REF = "jendakjaay";
const YANGO_PROXY_URL =
  "https://yango.go.link/route?start-lat={start-lat}&start-lon={start-lon}&end-lat={end-lat}&end-lon={end-lon}&adj_adgroup=widget&ref={ref}&adj_t=vokme8e_nd9s9z9&lang=fr&adj_deeplink_js=1&utm_source=widget&adj_fallback=https%3A%2F%2Fyango.com%2Ffr_sn%2Forder%2F%3Fgfrom%3D{start-lon}%2C{start-lat}%26gto%3D{end-lon}%2C{end-lat}%26ref%3D{ref}";

/* ────────────────────────────────────────
   Badge compact (xs) — juste le logo Yango
──────────────────────────────────────── */
export function YangoBadge({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && (window as any).YaTaxi) {
      (window as any).YaTaxi.init();
    }
  }, []);

  return (
    <>
      <Script src="//yastatic.net/taxi-widget/ya-taxi-widget.js" strategy="lazyOnload" />
      <div
        ref={ref}
        className={`ya-taxi-widget ${className}`}
        data-ref={YANGO_REF}
        data-size="xs"
        data-theme="normal"
        data-title="Livraison Yango"
        data-use-location="true"
        data-app={YANGO_APP_ID}
        data-lang="fr"
        data-proxy-url={YANGO_PROXY_URL}
      />
    </>
  );
}

/* ────────────────────────────────────────
   Bouton standard (s) — bouton de réservation
──────────────────────────────────────── */
interface YangoButtonProps {
  title?: string;
  description?: string;
  className?: string;
}

export function YangoButton({ title = "Commander Yango", description, className = "" }: YangoButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && (window as any).YaTaxi) {
      (window as any).YaTaxi.init();
    }
  }, []);

  return (
    <>
      <Script src="//yastatic.net/taxi-widget/ya-taxi-widget.js" strategy="lazyOnload" />
      <div
        ref={ref}
        className={`ya-taxi-widget ${className}`}
        data-ref={YANGO_REF}
        data-size="s"
        data-theme="normal"
        data-title={title}
        {...(description ? { "data-description": description } : {})}
        data-use-location="true"
        data-app={YANGO_APP_ID}
        data-lang="fr"
        data-proxy-url={YANGO_PROXY_URL}
      />
    </>
  );
}

/* ────────────────────────────────────────
   Carte Yango personnalisée aux couleurs Jënd ak Jaay
   → utilisée dans la page commandes vendeur
──────────────────────────────────────── */
interface YangoDeliveryCardProps {
  buyerAddress: string;
  buyerName: string;
}

export function YangoDeliveryCard({ buyerAddress, buyerName }: YangoDeliveryCardProps) {
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (widgetRef.current && (window as any).YaTaxi) {
      (window as any).YaTaxi.init();
    }
  }, []);

  const yangoLink = `https://yango.com/fr_sn/order/?ref=${YANGO_REF}`;

  return (
    <>
      <Script src="//yastatic.net/taxi-widget/ya-taxi-widget.js" strategy="lazyOnload" />

      <div className="rounded-xl overflow-hidden border border-border shadow-sm">
        {/* Header Yango brandé */}
        <div
          className="px-4 py-3 flex items-center justify-between"
          style={{ background: "linear-gradient(135deg, oklch(0.35 0.12 145), oklch(0.28 0.09 148))" }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">🚗</span>
            <div>
              <p className="font-semibold text-sm text-white">Livraison via Yango</p>
              <p className="text-xs text-white/75">Réservez un chauffeur maintenant</p>
            </div>
          </div>
          <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full font-medium">
            Partenaire
          </span>
        </div>

        {/* Infos livraison */}
        <div className="bg-card p-4 space-y-3">
          <div className="flex items-start gap-3 text-sm">
            <div className="flex flex-col items-center gap-1 mt-0.5">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <div className="w-0.5 h-6 bg-border" />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "oklch(0.35 0.12 145)" }} />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Point de départ</p>
                <p className="font-medium">📍 Votre position actuelle (GPS)</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Destination</p>
                <p className="font-medium">{buyerAddress}</p>
                <p className="text-xs text-muted-foreground">Pour : {buyerName}</p>
              </div>
            </div>
          </div>

          {/* Widget Yango officiel */}
          <div
            ref={widgetRef}
            className="ya-taxi-widget w-full"
            data-ref={YANGO_REF}
            data-size="s"
            data-theme="normal"
            data-title="Commander un chauffeur"
            data-description={`Livraison pour ${buyerName} — ${buyerAddress}`}
            data-use-location="true"
            data-app={YANGO_APP_ID}
            data-lang="fr"
            data-proxy-url={YANGO_PROXY_URL}
          />

          {/* Lien de secours si widget ne charge pas */}
          <a
            href={yangoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-semibold transition hover:opacity-90"
            style={{ background: "oklch(0.35 0.12 145)" }}
          >
            🚖 Ouvrir Yango
          </a>
        </div>
      </div>
    </>
  );
}
