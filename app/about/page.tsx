"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useRef, useState } from "react";

const values = [
  {
    emoji: "🇸🇳",
    title: "100% Sénégalais",
    description: "Conçu au Sénégal, pour les Sénégalais. Nous soutenons l'économie locale et donnons une vitrine digitale aux entrepreneurs de toutes les régions.",
    color: "oklch(0.35 0.12 145)",
    bg: "oklch(0.92 0.06 145)",
  },
  {
    emoji: "🤝",
    title: "Transparence",
    description: "Pas de chiffres gonflés, pas de promesses vides. Nous construisons une plateforme honnête, brique par brique, avec les vrais utilisateurs.",
    color: "oklch(0.65 0.19 45)",
    bg: "oklch(0.96 0.05 55)",
  },
  {
    emoji: "🚀",
    title: "Innovation",
    description: "IA intégrée, recherche par image, messagerie en temps réel — nous utilisons les dernières technologies pour rendre le commerce simple.",
    color: "oklch(0.35 0.12 145)",
    bg: "oklch(0.92 0.06 145)",
  },
  {
    emoji: "🌍",
    title: "Impact Local",
    description: "Nous connectons vendeurs et acheteurs dans les 14 régions du Sénégal, avec les moyens de paiement du quotidien : Wave, Orange Money, Free Money.",
    color: "oklch(0.65 0.19 45)",
    bg: "oklch(0.96 0.05 55)",
  },
];

const roles = [
  { emoji: "💻", title: "Développement Full-Stack", description: "Architecture Next.js, Supabase, API IA" },
  { emoji: "🎨", title: "Design & UX", description: "Interface moderne, expérience utilisateur fluide" },
  { emoji: "🧠", title: "Intelligence Artificielle", description: "Chatbot, recherche par image, génération de contenu" },
  { emoji: "📱", title: "Intégrations Mobile", description: "WhatsApp Business, paiements mobiles Wave & Orange Money" },
];

const stack = [
  { name: "Next.js 15", emoji: "⚡" },
  { name: "Supabase", emoji: "🟢" },
  { name: "TypeScript", emoji: "🔷" },
  { name: "Tailwind CSS", emoji: "🎨" },
  { name: "Claude AI", emoji: "🤖" },
  { name: "Vercel", emoji: "▲" },
];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function AnimSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function AboutPage() {
  const [count, setCount] = useState({ regions: 0, payment: 0, year: 0 });
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setStatsVisible(true); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!statsVisible) return;
    const duration = 1500;
    const start = Date.now();
    const targets = { regions: 14, payment: 3, year: 2025 };
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount({
        regions: Math.round(targets.regions * ease),
        payment: Math.round(targets.payment * ease),
        year: Math.round(2000 + (targets.year - 2000) * ease),
      });
      if (progress >= 1) clearInterval(interval);
    }, 16);
    return () => clearInterval(interval);
  }, [statsVisible]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 overflow-hidden">

        {/* ─── Hero ─── */}
        <section className="relative py-24 text-white overflow-hidden"
          style={{ background: "linear-gradient(135deg, oklch(0.28 0.12 145), oklch(0.55 0.19 45) 60%, oklch(0.40 0.15 145))", backgroundSize: "200% 200%" }}>

          {/* Orbes décoratifs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="animate-float-slow absolute top-8 left-[10%] w-72 h-72 rounded-full opacity-20"
              style={{ background: "radial-gradient(circle, white, transparent 70%)" }} />
            <div className="animate-float absolute bottom-4 right-[8%] w-96 h-96 rounded-full opacity-10"
              style={{ background: "radial-gradient(circle, oklch(0.65 0.19 45), transparent 70%)" }} />
            <div className="animate-float-slow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
              style={{ background: "white", animationDelay: "1s" }} />
            {/* Grille décorative */}
            <div className="absolute inset-0 opacity-5"
              style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="animate-fade-in-up opacity-0-init"
              style={{ animation: "fadeInUp 0.6s ease-out 0.1s forwards" }}>
              <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 px-5 py-2 rounded-full text-sm font-medium mb-6">
                🎓 Projet étudiant · DAUST · Dakar
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight"
              style={{ animation: "fadeInUp 0.6s ease-out 0.2s forwards", opacity: 0 }}>
              À Propos de{" "}
              <span className="animate-gradient-text">Jënd ak Jaay</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed"
              style={{ animation: "fadeInUp 0.6s ease-out 0.35s forwards", opacity: 0 }}>
              <strong className="text-white">Jënd ak Jaay</strong> signifie &ldquo;Acheter et Vendre&rdquo; en Wolof.
              Une marketplace sénégalaise née dans les salles de cours, construite avec passion par de futurs ingénieurs.
            </p>
          </div>
        </section>

        {/* ─── Stats compteur ─── */}
        <section className="py-14 border-b" ref={statsRef}>
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              {[
                { value: count.year, label: "Lancement", suffix: "" },
                { value: count.regions, label: "Régions couvertes", suffix: "" },
                { value: count.payment, label: "Moyens de paiement", suffix: "" },
              ].map((stat, i) => (
                <div key={stat.label} className="text-center group"
                  style={{ animation: statsVisible ? `scale-in 0.5s ease-out ${i * 150}ms forwards` : "none", opacity: statsVisible ? 1 : 0 }}>
                  <div className="text-4xl md:text-5xl font-black mb-1"
                    style={{ color: "oklch(0.35 0.12 145)" }}>
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Notre histoire ─── */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <AnimSection>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white mb-5"
                  style={{ background: "oklch(0.35 0.12 145)" }}>
                  📖 Notre histoire
                </span>
                <h2 className="text-3xl md:text-4xl font-black mb-5 leading-tight">
                  Né dans une salle de cours, <br />
                  <span style={{ color: "oklch(0.35 0.12 145)" }}>construit pour le Sénégal</span>
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Jënd ak Jaay est un projet étudiant lancé en <strong className="text-foreground">2025</strong> par des étudiants de la{" "}
                    <strong className="text-foreground">Dakar American University of Science & Technology (DAUST)</strong>.
                  </p>
                  <p>
                    L&apos;idée est simple : donner aux commerçants sénégalais une plateforme moderne qui parle leur langue,
                    accepte leurs moyens de paiement habituels — Wave, Orange Money, Free Money — et les connecte
                    à des acheteurs dans toutes les 14 régions du pays.
                  </p>
                  <p>
                    Ce projet est autant une aventure technique qu&apos;humaine. Chaque ligne de code reflète
                    notre engagement envers l&apos;innovation locale et l&apos;entrepreneuriat sénégalais.
                  </p>
                </div>
              </AnimSection>

              <AnimSection delay={200}>
                <div className="relative">
                  {/* Carte principale */}
                  <div className="rounded-3xl p-8 text-white text-center relative overflow-hidden"
                    style={{ background: "linear-gradient(135deg, oklch(0.35 0.12 145), oklch(0.55 0.17 120))" }}>
                    <div className="absolute inset-0 opacity-10"
                      style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
                    <div className="animate-float text-7xl mb-4 relative z-10">🎓</div>
                    <h3 className="text-xl font-bold mb-1 relative z-10">DAUST</h3>
                    <p className="text-white/75 text-sm mb-4 relative z-10">
                      Dakar American University of<br />Science & Technology
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center relative z-10">
                      {["Informatique", "Innovation", "Entrepreneuriat"].map((tag) => (
                        <span key={tag} className="text-xs bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  {/* Badge flottant */}
                  <div className="animate-float absolute -top-4 -right-4 bg-card border border-border rounded-2xl px-4 py-2 shadow-xl text-sm font-semibold"
                    style={{ animationDelay: "0.5s" }}>
                    🇸🇳 Made in Dakar
                  </div>
                  <div className="animate-float absolute -bottom-4 -left-4 bg-card border border-border rounded-2xl px-4 py-2 shadow-xl text-sm font-semibold"
                    style={{ animationDelay: "1s" }}>
                    ⚡ Projet 2025
                  </div>
                </div>
              </AnimSection>
            </div>
          </div>
        </section>

        {/* ─── Notre équipe (honnête) ─── */}
        <section className="py-20" style={{ background: "oklch(0.98 0.01 145)" }}>
          <div className="container mx-auto px-4 max-w-5xl">
            <AnimSection className="text-center mb-14">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white mb-4"
                style={{ background: "oklch(0.65 0.19 45)" }}>
                👥 Notre équipe
              </span>
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                Étudiants passionnés,<br />
                <span style={{ color: "oklch(0.65 0.19 45)" }}>ingénieurs en devenir</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Nous sommes une équipe d&apos;étudiants en informatique à <strong>DAUST</strong>, unis par une même vision :
                construire des solutions technologiques utiles pour le Sénégal.
              </p>
            </AnimSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {roles.map((role, i) => (
                <AnimSection key={role.title} delay={i * 100}>
                  <div className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4"
                      style={{ background: i % 2 === 0 ? "oklch(0.92 0.06 145)" : "oklch(0.96 0.05 55)" }}>
                      {role.emoji}
                    </div>
                    <h3 className="font-bold mb-2 text-sm">{role.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{role.description}</p>
                  </div>
                </AnimSection>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Valeurs ─── */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-5xl">
            <AnimSection className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-black mb-3">Nos Valeurs</h2>
              <p className="text-muted-foreground">Ce qui guide chacune de nos décisions</p>
            </AnimSection>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((val, i) => (
                <AnimSection key={val.title} delay={i * 100}>
                  <div className="flex gap-5 p-6 bg-card border border-border rounded-2xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ background: val.bg }}>
                      {val.emoji}
                    </div>
                    <div>
                      <h3 className="font-bold text-base mb-1">{val.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{val.description}</p>
                    </div>
                  </div>
                </AnimSection>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Stack technique ─── */}
        <section className="py-20" style={{ background: "oklch(0.98 0.01 145)" }}>
          <div className="container mx-auto px-4 max-w-4xl">
            <AnimSection className="text-center mb-12">
              <h2 className="text-3xl font-black mb-3">Notre Stack Technique</h2>
              <p className="text-muted-foreground">Les technologies que nous utilisons pour construire Jënd ak Jaay</p>
            </AnimSection>
            <div className="flex flex-wrap justify-center gap-4">
              {stack.map((tech, i) => (
                <AnimSection key={tech.name} delay={i * 80}>
                  <div className="flex items-center gap-2 bg-card border border-border px-5 py-3 rounded-full hover:shadow-md hover:scale-105 transition-all duration-200 cursor-default">
                    <span className="text-xl">{tech.emoji}</span>
                    <span className="font-semibold text-sm">{tech.name}</span>
                  </div>
                </AnimSection>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="py-20 text-white relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, oklch(0.28 0.12 145), oklch(0.55 0.19 45))" }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="animate-float-slow absolute -top-16 -left-16 w-64 h-64 rounded-full opacity-10 bg-white" />
            <div className="animate-float absolute -bottom-16 -right-16 w-80 h-80 rounded-full opacity-10 bg-white" style={{ animationDelay: "1.5s" }} />
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <AnimSection>
              <div className="text-5xl mb-6 animate-float">🚀</div>
              <h2 className="text-3xl md:text-4xl font-black mb-4">Rejoignez l&apos;aventure</h2>
              <p className="text-white/80 mb-8 max-w-lg mx-auto text-lg">
                Que vous soyez acheteur ou vendeur, Jënd ak Jaay est là pour vous.
                Faisons grandir le commerce sénégalais ensemble.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/seller"
                  className="inline-flex items-center justify-center gap-2 bg-white font-bold px-8 py-3.5 rounded-xl hover:bg-white/90 hover:scale-105 transition-all duration-200"
                  style={{ color: "oklch(0.35 0.12 145)" }}>
                  🏪 Devenir vendeur
                </Link>
                <Link href="/contact"
                  className="inline-flex items-center justify-center gap-2 border-2 border-white/50 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-white/10 hover:scale-105 transition-all duration-200">
                  📬 Nous contacter
                </Link>
              </div>
            </AnimSection>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
