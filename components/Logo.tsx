import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
}

export default function Logo({ size = "md", href = "/", className = "" }: LogoProps) {
  const sizes = {
    sm: { icon: 32, bag: 18, text: "text-sm", gap: "gap-2" },
    md: { icon: 40, bag: 22, text: "text-base", gap: "gap-2.5" },
    lg: { icon: 52, bag: 28, text: "text-xl", gap: "gap-3" },
  };
  const s = sizes[size];

  const content = (
    <span className={`flex items-center ${s.gap} ${className} group cursor-pointer`}>
      {/* Icône SVG */}
      <span
        className="flex-shrink-0 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:scale-105"
        style={{
          width: s.icon,
          height: s.icon,
          background: "linear-gradient(135deg, oklch(0.38 0.13 145) 0%, oklch(0.30 0.10 145) 40%, oklch(0.60 0.18 45) 100%)",
        }}
      >
        {/* Reflet interne */}
        <span className="absolute top-0 left-0 right-0 h-1/2 rounded-t-2xl opacity-20"
          style={{ background: "linear-gradient(180deg, white, transparent)" }} />

        {/* Sac shopping SVG */}
        <svg
          width={s.bag}
          height={s.bag}
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Corps du sac */}
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" fill="rgba(255,255,255,0.2)" stroke="white" />
          {/* Ligne horizontale du sac */}
          <line x1="3" y1="6" x2="21" y2="6" />
          {/* Anses */}
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
      </span>

      {/* Texte */}
      <span className={`font-black leading-none ${s.text} tracking-tight select-none`}>
        <span className="text-foreground transition-colors duration-200">Jënd ak </span>
        <span
          className="transition-colors duration-200"
          style={{ color: "oklch(0.62 0.19 45)" }}
        >
          Jaay
        </span>
      </span>
    </span>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
