"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  href?: string;
  label?: string;
  className?: string;
}

export default function BackButton({
  href,
  label = "Retour",
  className = "",
}: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (href) router.push(href);
    else router.back();
  };

  return (
    <button
      onClick={handleClick}
      className={`btn btn-back btn-sm flex items-center gap-1.5 ${className}`}
    >
      <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
      {label}
    </button>
  );
}
