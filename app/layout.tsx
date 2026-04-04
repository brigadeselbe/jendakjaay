import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import WhatsAppButton from "@/components/WhatsAppButton";
import ChatBot from "@/components/ChatBot";
import PWAInstall from "@/components/PWAInstall";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jënd ak Jaay - Marketplace Sénégalaise",
  description: "La marketplace sénégalaise qui connecte vendeurs et acheteurs. Wave, Orange Money, Free Money.",
  manifest: "/manifest.json",
  keywords: "marketplace sénégal, achat vente dakar, wave, orange money",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1a5c2a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Jënd ak Jaay" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className={`${poppins.variable} font-sans antialiased`}>
        <CartProvider>
          {children}
          <WhatsAppButton variant="floating" />
          <ChatBot />
          <PWAInstall />
        </CartProvider>
      </body>
    </html>
  );
}