import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
  /** force le texte en blanc (ex: sur fond sombre) */
  light?: boolean;
}

/** Couleurs fidèles au logo original */
const C = {
  cartGreen:  "#2d8a4e",   // vert du corps du chariot
  cartOrange: "#f07a1a",   // orange du manche + roue droite
  textGreen:  "#1a4d2b",   // vert foncé du texte
  textOrange: "#f07a1a",   // orange du "Jaay"
};

/** Icône chariot SVG — reproduit fidèlement le logo */
function CartIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ── Corps du chariot (vert) ── */}
      {/* Côté gauche + bas + barre intérieure */}
      <path
        d="M10 12 L10 38 L44 38"
        stroke={C.cartGreen}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Barre horizontale intérieure */}
      <line
        x1="10" y1="26"
        x2="44" y2="26"
        stroke={C.cartGreen}
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* ── Manche + bord supérieur (orange) ── */}
      {/* Bord supérieur du panier */}
      <line
        x1="10" y1="12"
        x2="38" y2="12"
        stroke={C.cartOrange}
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Manche courbé vers le haut-droite */}
      <path
        d="M38 12 Q50 12 50 4"
        stroke={C.cartOrange}
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />

      {/* ── Roues ── */}
      <circle cx="18" cy="46" r="5" fill={C.cartGreen} />
      <circle cx="36" cy="46" r="5" fill={C.cartOrange} />
    </svg>
  );
}

export default function Logo({ size = "md", href = "/", className = "", light = false }: LogoProps) {
  const cfg = {
    sm: { icon: 34, textSize: "text-[15px]", gap: "gap-2",   tracking: "tracking-tight" },
    md: { icon: 42, textSize: "text-[18px]", gap: "gap-2.5", tracking: "tracking-tight" },
    lg: { icon: 56, textSize: "text-[24px]", gap: "gap-3",   tracking: "tracking-tight" },
  }[size];

  const textGreen  = light ? "text-white"        : undefined;
  const textOrange = light ? "text-orange-300"   : undefined;

  const inner = (
    <span
      className={`inline-flex items-center ${cfg.gap} ${className} group select-none`}
    >
      {/* Icône chariot */}
      <span className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
        <CartIcon size={cfg.icon} />
      </span>

      {/* Texte */}
      <span className={`font-black ${cfg.textSize} ${cfg.tracking} leading-none`}>
        <span
          className={`transition-colors ${textGreen ?? ""}`}
          style={!light ? { color: C.textGreen } : undefined}
        >
          Jënd ak{" "}
        </span>
        <span
          className={`transition-colors ${textOrange ?? ""}`}
          style={!light ? { color: C.textOrange } : undefined}
        >
          Jaay
        </span>
      </span>
    </span>
  );

  return href ? (
    <Link href={href} className="outline-none">
      {inner}
    </Link>
  ) : inner;
}
