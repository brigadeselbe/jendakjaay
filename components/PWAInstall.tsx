"use client";

import { useEffect, useState } from "react";
import { Download, X, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstall() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Enregistrer le service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(console.error);
    }

    // Vérifier si déjà dismissé
    const wasDismissed = localStorage.getItem("pwa-dismissed");
    if (wasDismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setVisible(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setInstalled(true));

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstall() {
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") setInstalled(true);
    setVisible(false);
  }

  function handleDismiss() {
    setVisible(false);
    setDismissed(true);
    localStorage.setItem("pwa-dismissed", "true");
  }

  if (!visible || installed || dismissed) return null;

  return (
    <div className="fixed bottom-24 right-4 z-50 w-80 bg-card border border-border rounded-2xl shadow-2xl p-4 animate-fade-in-up">
      <div className="flex items-start gap-3">
        {/* Icône */}
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0"
          style={{ background: "linear-gradient(135deg, oklch(0.35 0.12 145), oklch(0.65 0.19 45))" }}>
          <Smartphone className="h-6 w-6" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm">Installer Jënd ak Jaay</p>
          <p className="text-xs text-muted-foreground mt-0.5 mb-3">
            Accédez rapidement depuis votre écran d&apos;accueil, même sans internet !
          </p>

          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              className="flex items-center gap-1.5 text-white text-xs font-semibold px-3 py-2 rounded-lg hover:opacity-90 transition"
              style={{ background: "oklch(0.35 0.12 145)" }}
            >
              <Download className="h-3 w-3" />
              Installer
            </button>
            <button
              onClick={handleDismiss}
              className="text-xs text-muted-foreground px-3 py-2 rounded-lg hover:bg-accent transition"
            >
              Plus tard
            </button>
          </div>
        </div>

        <button onClick={handleDismiss} className="p-1 hover:bg-accent rounded-lg transition flex-shrink-0">
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}