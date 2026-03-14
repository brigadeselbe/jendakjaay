"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Heart, ShoppingCart, Star, ArrowLeft, Share2, Shield, Truck, RotateCcw } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import WhatsAppButton from "@/components/WhatsAppButton";

const products = [
  {
    id: 1,
    name: "Boubou Traditionnel",
    price: 25000,
    originalPrice: 35000,
    rating: 4.5,
    reviews: 12,
    seller: "Amadou Diallo",
    location: "Dakar",
    category: "Mode",
    emoji: "👘",
    badge: "Populaire",
    description: "Magnifique boubou traditionnel sénégalais, confectionné à la main avec du tissu bazin de haute qualité. Disponible en plusieurs couleurs. Idéal pour les cérémonies et fêtes.",
    specs: ["Tissu: Bazin riche", "Fait main", "Disponible en S, M, L, XL", "Livraison sous 48h"],
  },
  {
    id: 2,
    name: "Thiéboudienne Familiale",
    price: 8500,
    originalPrice: null,
    rating: 5,
    reviews: 34,
    seller: "Fatou Ndiaye",
    location: "Thiès",
    category: "Alimentation",
    emoji: "🍚",
    badge: "Top Vendeur",
    description: "Thiéboudienne préparée avec du riz local et du poisson frais. Portion familiale pour 4 à 6 personnes.",
    specs: ["Pour 4-6 personnes", "Poisson frais", "Riz local", "Livraison le jour même"],
  },
  {
    id: 3,
    name: "Smartphone Samsung A15",
    price: 120000,
    originalPrice: 145000,
    rating: 4,
    reviews: 8,
    seller: "Tech Dakar",
    location: "Dakar",
    category: "Électronique",
    emoji: "📱",
    badge: "Promo",
    description: "Samsung Galaxy A15 neuf, sous emballage d'origine. 4GB RAM, 128GB stockage. Garantie 1 an.",
    specs: ["Écran 6.5 pouces", "4GB RAM / 128GB", "Batterie 5000mAh", "Garantie 1 an"],
  },
  {
    id: 4,
    name: "Panier Tressé Artisanal",
    price: 5500,
    originalPrice: null,
    rating: 4.8,
    reviews: 21,
    seller: "Mariama Sow",
    location: "Saint-Louis",
    category: "Artisanat",
    emoji: "🧺",
    badge: null,
    description: "Panier tressé à la main par des artisanes de Saint-Louis. Matériaux naturels, durable et écologique.",
    specs: ["Fait main", "Matériaux naturels", "Diamètre 40cm", "Artisanat local"],
  },
  {
    id: 5,
    name: "Huile de Palme Bio",
    price: 3200,
    originalPrice: null,
    rating: 4.6,
    reviews: 45,
    seller: "Biosenegal",
    location: "Ziguinchor",
    category: "Alimentation",
    emoji: "🫙",
    badge: "Bio",
    description: "Huile de palme 100% biologique, extraite à froid. Certifiée sans pesticides. 1 litre.",
    specs: ["100% Bio", "Extraite à froid", "1 litre", "Sans pesticides"],
  },
  {
    id: 6,
    name: "Canapé 3 Places",
    price: 185000,
    originalPrice: 220000,
    rating: 4.2,
    reviews: 6,
    seller: "Meubles Dakar",
    location: "Dakar",
    category: "Maison",
    emoji: "🛋️",
    badge: "Promo",
    description: "Canapé 3 places en tissu de qualité, structure en bois massif. Livraison et montage inclus à Dakar.",
    specs: ["3 places", "Bois massif", "Livraison incluse", "3 coloris disponibles"],
  },
];

function formatPrice(price: number) {
  return price.toLocaleString("fr-SN") + " FCFA";
}

export default function ProductDetail() {
  const params = useParams();
  const product = products.find((p) => p.id === Number(params.id)) || products[0];
  const { addItem } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [favorite, setFavorite] = useState(false);
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      emoji: product.emoji,
      seller: product.seller,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">

        {/* Retour */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Retour aux produits
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Image produit */}
          <div className="relative bg-muted rounded-2xl flex items-center justify-center h-80 md:h-full min-h-[320px] text-9xl">
            {product.emoji}
            {product.badge && (
              <span
                className="absolute top-4 left-4 text-white text-sm font-semibold px-3 py-1 rounded-full"
                style={{ background: "oklch(0.65 0.19 45)" }}
              >
                {product.badge}
              </span>
            )}
            {discount && (
              <span className="absolute top-4 right-4 bg-red-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                -{discount}%
              </span>
            )}
          </div>

          {/* Infos produit */}
          <div>
            <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
              {product.category}
            </span>

            <h1 className="text-3xl font-bold mt-3 mb-2">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4"
                    fill={i < Math.floor(product.rating) ? "oklch(0.65 0.19 45)" : "none"}
                    stroke="oklch(0.65 0.19 45)"
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-muted-foreground">({product.reviews} avis)</span>
            </div>

            {/* Prix */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-jaay-green">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Specs */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Caractéristiques</h3>
              <ul className="space-y-2">
                {product.specs.map((spec) => (
                  <li key={spec} className="flex items-center gap-2 text-sm">
                    <span className="text-jaay-green font-bold">✓</span>
                    {spec}
                  </li>
                ))}
              </ul>
            </div>

            {/* Vendeur */}
            <div className="flex items-center gap-3 p-4 bg-muted rounded-xl mb-6">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                style={{ background: "oklch(0.35 0.12 145)" }}
              >
                {product.seller[0]}
              </div>
              <div>
                <p className="font-medium text-sm">{product.seller}</p>
                <p className="text-xs text-muted-foreground">📍 {product.location}</p>
              </div>
            </div>

            {/* Quantité */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium">Quantité :</span>
              <div className="flex items-center border border-border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-accent transition-colors"
                >−</button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-accent transition-colors"
                >+</button>
              </div>
            </div>

            {/* Boutons */}
            <div className="flex gap-3 mb-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white transition-all"
                style={{ background: "oklch(0.35 0.12 145)", opacity: added ? 0.85 : 1 }}
              >
                <ShoppingCart className="h-5 w-5" />
                {added ? "✓ Ajouté !" : "Ajouter au panier"}
              </button>
              <button
                onClick={() => setFavorite(!favorite)}
                className="p-3 border border-border rounded-xl hover:bg-accent transition-colors"
              >
                <Heart
                  className="h-5 w-5"
                  fill={favorite ? "red" : "none"}
                  stroke={favorite ? "red" : "currentColor"}
                />
              </button>
              <button className="p-3 border border-border rounded-xl hover:bg-accent transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>

            {/* WhatsApp */}
            <div className="mb-6">
              <WhatsAppButton
                productName={product.name}
                price={product.price}
                phone="221783854465"
              />
            </div>

            {/* Garanties */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <Shield className="h-4 w-4" />, text: "Paiement sécurisé" },
                { icon: <Truck className="h-4 w-4" />, text: "Livraison rapide" },
                { icon: <RotateCcw className="h-4 w-4" />, text: "Retour facile" },
              ].map((item) => (
                <div key={item.text} className="flex flex-col items-center gap-1 p-3 bg-muted rounded-xl text-center">
                  <span className="text-jaay-green">{item.icon}</span>
                  <span className="text-xs text-muted-foreground">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}