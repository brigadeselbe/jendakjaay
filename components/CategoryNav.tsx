"use client";

const categories = [
  { name: "Alimentation", emoji: "🍚" },
  { name: "Électronique", emoji: "📱" },
  { name: "Mode", emoji: "👗" },
  { name: "Artisanat", emoji: "🧺" },
  { name: "Maison", emoji: "🏠" },
  { name: "Général", emoji: "📦" },
];

export default function CategoryNav() {
  return (
    <div className="border-b bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex gap-2 overflow-x-auto py-3">
          {categories.map((cat) => (
            <button
              key={cat.name}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent transition-colors"
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