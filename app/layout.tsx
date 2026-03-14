import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import WhatsAppButton from "@/components/WhatsAppButton";
import ChatBot from "@/components/ChatBot";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jënd ak Jaay - Marketplace Sénégalaise",
  description: "La marketplace sénégalaise qui connecte vendeurs et acheteurs.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans antialiased`}>
        <CartProvider>
          {children}
          <WhatsAppButton variant="floating" />
          <ChatBot />
        </CartProvider>
      </body>
    </html>
  );
}