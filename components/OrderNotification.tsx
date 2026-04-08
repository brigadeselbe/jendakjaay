"use client";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  emoji?: string;
}

interface Order {
  buyer_name: string;
  buyer_phone: string;
  buyer_region: string;
  buyer_address: string;
  items: OrderItem[];
  total_price: number;
  payment_method: string;
}

interface OrderNotificationProps {
  order: Order;
  sellerPhone: string;
  sellerName: string;
}

function formatPrice(price: number) {
  return price.toLocaleString("fr-SN") + " FCFA";
}

export default function OrderNotification({ order, sellerPhone, sellerName }: OrderNotificationProps) {
  const itemsList = order.items
    .map((i) => `${i.emoji ?? "📦"} ${i.name} x${i.quantity}`)
    .join(", ");

  const paymentLabel =
    order.payment_method === "wave"
      ? "Wave"
      : order.payment_method === "orange"
      ? "Orange Money"
      : "Free Money";

  const buyerMsg = encodeURIComponent(
    "Bonjour " + order.buyer_name + " ! Votre commande chez " + sellerName + " est confirmée.\n" +
    "Articles : " + itemsList + "\n" +
    "Total : " + formatPrice(order.total_price) + " (" + paymentLabel + ")\n" +
    "Livraison à " + order.buyer_address + ", " + order.buyer_region + ".\nMerci !"
  );

  const sellerMsg = encodeURIComponent(
    "🛍️ Nouvelle commande reçue !\n" +
    "Client : " + order.buyer_name + " (" + order.buyer_phone + ")\n" +
    "Articles : " + itemsList + "\n" +
    "Total : " + formatPrice(order.total_price) + " (" + paymentLabel + ")\n" +
    "Livraison : " + order.buyer_address + ", " + order.buyer_region
  );

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <a
        href={"https://wa.me/" + order.buyer_phone + "?text=" + buyerMsg}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium hover:opacity-90 transition"
        style={{ background: "#25D366" }}
      >
        📱 Notifier l&apos;acheteur
      </a>
      <a
        href={"https://wa.me/" + sellerPhone + "?text=" + sellerMsg}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium hover:opacity-90 transition"
        style={{ background: "#25D366" }}
      >
        🏪 Notifier le vendeur
      </a>
    </div>
  );
}
