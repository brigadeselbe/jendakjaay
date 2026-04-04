"use client";

const categories = [
  { name: "Tous", emoji: "🏪" },
  { name: "Alimentation", emoji: "🍚" },
  { name: "Mode & Vêtements", emoji: "👗" },
  { name: "Électronique", emoji: "📱" },
  { name: "Artisanat", emoji: "🧺" },
  { name: "Maison & Déco", emoji: "🏠" },
  { name: "Beauté & Santé", emoji: "💄" },
  { name: "Agriculture", emoji: "🌿" },
  { name: "Services", emoji: "🛠️" },
];

interface CategoryNavProps {
  selected: string;
  onSelect: (category: string) => void;
}

export default function CategoryNav({ selected, onSelect }: CategoryNavProps) {
  return (
    <div className="border-b bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex gap-2 overflow-x-auto py-3">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => onSelect(cat.name)}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                background: selected === cat.name ? "oklch(0.35 0.12 145)" : "",
                color: selected === cat.name ? "white" : "",
              }}
            >
              <span>{cat.emoji}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}