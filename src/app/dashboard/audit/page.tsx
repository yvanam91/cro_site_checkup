"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  Gauge,
  Code,
  Camera,
  CheckCircle,
  Play,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Download,
  RefreshCw,
  AlertTriangle,
  Info,
  Settings,
  Globe,
  ExternalLink
} from "lucide-react";

// --- TypeScript Interfaces ---

interface Finding {
  readonly id: string;
  readonly severity: "critical" | "warning" | "optimization";
  readonly ruleBreached: string;
  readonly summary: string;
  readonly description: string;
  readonly recommendation: string;
  readonly selector: string;
  readonly codeSnippet?: string;
}

interface AuditReport {
  readonly globalScore: number;
  readonly metrics: {
    readonly performance: number;
    readonly accessibility: number;
    readonly conversionFriction: number;
  };
  readonly findings: readonly Finding[];
}

// --- Mock Report Templates by Category ---

const mockReportTemplates: Record<"saas" | "ecommerce" | "landing", AuditReport> = {
  saas: {
    globalScore: 78,
    metrics: {
      performance: 88,
      accessibility: 72,
      conversionFriction: 74,
    },
    findings: [
      {
        id: "saas-f1",
        severity: "critical",
        ruleBreached: "Bastien & Scapin - Guidage",
        summary: "Les exigences de mot de passe ne sont indiquées qu'après soumission infructueuse.",
        description: "L'utilisateur saisit un mot de passe sans connaître les contraintes complexes (majuscules, caractères spéciaux, longueur). Le message d'erreur s'affiche a posteriori, brisant le principe de guidage et augmentant la charge cognitive.",
        recommendation: "Affichez les critères de mot de passe en temps réel sous le champ de saisie avec des indicateurs de validation dynamiques (vert/rouge) avant soumission.",
        selector: "form#login-form .error-container",
        codeSnippet: `<input type="password" id="password" name="password" autocomplete="new-password" />\n<!-- Contraintes masquées par défaut -->`,
      },
      {
        id: "saas-f2",
        severity: "warning",
        ruleBreached: "General UX Laws - Loi de Fitts",
        summary: "Le menu de navigation mobile a une cible de clic trop petite.",
        description: "Le bouton de menu burger (hauteur de 32px) sur mobile est trop proche d'autres éléments tactiles, ce qui entraîne des erreurs de ciblage répétées pour les utilisateurs sur écran tactile.",
        recommendation: "Augmentez la zone de clic du bouton de menu pour atteindre un minimum de 48px x 48px conformément aux critères d'accessibilité mobile.",
        selector: "header button#mobile-menu-trigger",
        codeSnippet: `<button id="mobile-menu-trigger" class="w-8 h-8 flex items-center justify-center">\n  <svg>...</svg>\n</button>`,
      },
      {
        id: "saas-f3",
        severity: "optimization",
        ruleBreached: "Baymard Rules - Vitesse de chargement",
        summary: "L'image principale (Hero banner) n'utilise pas l'attribut fetchpriority.",
        description: "L'image vedette de la landing page est chargée sans priorité haute, ce qui retarde l'affichage du Largest Contentful Paint (LCP) de près de 1.8 secondes.",
        recommendation: "Ajoutez l'attribut fetchpriority='high' et le chargement anticipé (preload) à l'image principale pour optimiser le rendu initial.",
        selector: "section#hero img.banner",
        codeSnippet: `<img src="/images/hero-banner.png" class="banner" alt="Hero Banner" />`,
      },
    ],
  },
  ecommerce: {
    globalScore: 54,
    metrics: {
      performance: 61,
      accessibility: 50,
      conversionFriction: 51,
    },
    findings: [
      {
        id: "eco-f1",
        severity: "critical",
        ruleBreached: "Baymard Rules - Tunnel de Commande",
        summary: "Le bouton 'Achat Invité' est masqué derrière une inscription obligatoire.",
        description: "Les nouveaux utilisateurs sont forcés de créer un compte complet (avec mot de passe et confirmation) avant de pouvoir renseigner leurs coordonnées de livraison. C'est l'une des causes majeures d'abandon de panier.",
        recommendation: "Proposez une option d'achat en tant qu'invité clairement visible dès la première étape du panier, avec création de compte optionnelle en fin de parcours.",
        selector: "div#checkout-gateway .auth-wall-container",
        codeSnippet: `<div class="auth-wall-container">\n  <h3>Veuillez vous connecter ou créer un compte</h3>\n  <!-- Option invité inexistante ou cachée -->\n</div>`,
      },
      {
        id: "eco-f2",
        severity: "critical",
        ruleBreached: "Bastien & Scapin - Gestion des erreurs",
        summary: "La validation de carte bancaire vide tous les champs du formulaire.",
        description: "En cas de code de sécurité (CVV) incorrect, le système réinitialise entièrement le numéro de carte, le nom et la date d'expiration, obligeant l'utilisateur à tout ressaisir.",
        recommendation: "Conservez les champs de saisie valides et mettez en évidence uniquement le champ erroné (CVV) avec un message d'erreur contextuel approprié.",
        selector: "form#payment-form input#card-number",
        codeSnippet: `<input id="card-number" class="error-input" value="" />\n<!-- Champs réinitialisés par le handler d'erreur -->`,
      },
      {
        id: "eco-f3",
        severity: "warning",
        ruleBreached: "Bastien & Scapin - Charge de travail",
        summary: "Filtres de recherche trop denses et non catégorisés.",
        description: "La barre latérale de filtrage affiche une liste de 24 cases à cocher en vrac pour les tailles et couleurs, ce qui augmente le temps de lecture et la fatigue décisionnelle.",
        recommendation: "Regroupez les filtres par catégories extensibles (accordéons) et masquez par défaut les options secondaires sous un bouton 'Voir plus'.",
        selector: "aside#filters .checkbox-group",
        codeSnippet: `<div class="checkbox-group">\n  <!-- 24 checkboxes consécutives sans structure -->\n</div>`,
      },
      {
        id: "eco-f4",
        severity: "warning",
        ruleBreached: "General UX Laws - Loi de Hick",
        summary: "Le méga menu contient trop de liens sur un seul niveau.",
        description: "Le menu de navigation principal expose 45 catégories et sous-catégories à plat dès le survol, ce qui submerge le champ visuel du visiteur.",
        recommendation: "Structurez la navigation avec une hiérarchie claire à 3 niveaux maximum et mettez en valeur visuellement les 5 catégories phares.",
        selector: "nav#mega-menu",
        codeSnippet: `<nav id="mega-menu" class="grid grid-cols-4 gap-4">\n  <!-- 45 liens non hiérarchisés -->\n</nav>`,
      },
      {
        id: "eco-f5",
        severity: "optimization",
        ruleBreached: "General UX Laws - Effet d'esthétique-utilisabilité",
        summary: "Contraste insuffisant pour les fiches techniques des produits.",
        description: "Le texte gris clair (`#8F9CAE`) sur fond blanc ou gris très clair des caractéristiques techniques rend la lecture difficile, particulièrement en extérieur ou pour les personnes malvoyantes.",
        recommendation: "Modifiez la couleur du texte pour du gris foncé (`#334155`) pour respecter un ratio de contraste minimal de 4.5:1 (WCAG AA).",
        selector: "section#product-specs .spec-text",
        codeSnippet: `<span class="spec-text text-slate-400">Poids : 1.2 kg</span>`,
      },
    ],
  },
  landing: {
    globalScore: 85,
    metrics: {
      performance: 92,
      accessibility: 80,
      conversionFriction: 83,
    },
    findings: [
      {
        id: "lan-f1",
        severity: "critical",
        ruleBreached: "General UX Laws - Loi de Jakob",
        summary: "L'icône de recherche lance une boîte de dialogue d'inscription à la newsletter.",
        description: "L'icône de loupe située dans le coin supérieur droit est détournée pour ouvrir un pop-up d'abonnement. Cela va à l'encontre des conventions du web où la loupe représente exclusivement la recherche interne.",
        recommendation: "Utilisez une icône de boîte aux lettres ou d'enveloppe pour l'inscription, ou transformez l'action en barre de recherche standard.",
        selector: "header button.search-toggle-btn",
        codeSnippet: `<button class="search-toggle-btn" aria-label="Search">\n  <svg class="icon-search">...</svg>\n</button>`,
      },
      {
        id: "lan-f2",
        severity: "warning",
        ruleBreached: "Bastien & Scapin - Guidage / Homogénéité",
        summary: "Absence de focus visible sur les champs du formulaire d'inscription.",
        description: "Les champs d'e-mail et de nom du formulaire de capture n'affichent aucune bordure ni contour contrasté lors du focus clavier, ce qui désoriente les utilisateurs naviguant au clavier.",
        recommendation: "Ajoutez un anneau de focus contrasté en CSS (`focus-visible:ring-2 focus-visible:ring-indigo-500`) sur tous les éléments interactifs.",
        selector: "form#signup-form input:focus",
        codeSnippet: `input:focus { outline: none; } /* Aucun fallback visuel fourni */`,
      },
      {
        id: "lan-f3",
        severity: "optimization",
        ruleBreached: "Baymard Rules - Layout de Conversion",
        summary: "Le bouton d'appel à l'action de la grille de prix manque de contraste.",
        description: "Dans la grille des tarifs, l'offre 'Populaire' utilise un bouton d'action avec un fond ardoise sombre similaire au fond de la carte, ce qui diminue son impact visuel par rapport aux autres offres.",
        recommendation: "Appliquez le style dégradé Indigo/Violet sur ce bouton spécifique pour attirer le regard et optimiser le taux de clic (CTR).",
        selector: ".pricing-card.popular .cta-button",
        codeSnippet: `<button class="cta-button bg-slate-800 text-slate-200">Choisir cette offre</button>`,
      },
    ],
  },
};

const progressSteps = [
  { message: "Initialisation de l'analyse ergonomique...", icon: Settings },
  { message: "Scraping du DOM HTML & Extraction de la structure...", icon: Code },
  { message: "Capture d'écran des versions Desktop et Mobile...", icon: Camera },
  { message: "Analyse heuristique croisée via Gemini AI...", icon: ShieldAlert },
  { message: "Compilation et structuration des recommandations...", icon: CheckCircle },
];

// Helper to classify URL and pick mock template
function classifyUrl(urlString: string): { category: string; templateKey: "saas" | "ecommerce" | "landing" } {
  const urlLower = urlString.toLowerCase();
  if (/(product|shop|store|cart|checkout|buy|item|commerce|detail)/i.test(urlLower)) {
    return { category: "E-Commerce", templateKey: "ecommerce" };
  }
  if (/(app|saas|dashboard|console|admin|portal|system)/i.test(urlLower)) {
    return { category: "SaaS Platform", templateKey: "saas" };
  }
  return { category: "Landing Page", templateKey: "landing" };
}

export default function AuditPage() {
  const [viewState, setViewState] = useState<"config" | "loading" | "report">("config");
  const [urlInput, setUrlInput] = useState<string>("https://www.mywebsite.com/product1234");
  const [urlError, setUrlError] = useState<string>("");
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [expandedFindingId, setExpandedFindingId] = useState<string | null>(null);

  // States frozen when audit starts
  const [auditedUrl, setAuditedUrl] = useState<string>("");
  const [auditedCategory, setAuditedCategory] = useState<string>("");
  const [auditedReport, setAuditedReport] = useState<AuditReport | null>(null);

  // Launch simulated audit
  const handleLaunchAudit = () => {
    let formatted = urlInput.trim();
    if (!formatted) {
      setUrlError("Veuillez renseigner l'URL à analyser.");
      return;
    }

    // Add protocol if missing
    if (!/^https?:\/\//i.test(formatted)) {
      formatted = `https://${formatted}`;
    }

    try {
      new URL(formatted);
      setUrlError("");
    } catch {
      setUrlError("Saisie invalide. Veuillez entrer une URL correcte (ex: https://site.com/page).");
      return;
    }

    // Determine report template
    const { category, templateKey } = classifyUrl(formatted);
    const template = mockReportTemplates[templateKey];

    setAuditedUrl(formatted);
    setAuditedCategory(category);
    setAuditedReport(template);

    setViewState("loading");
    setCurrentStepIndex(0);
    setProgressPercent(0);
  };

  // Effect to simulate loading progress
  useEffect(() => {
    if (viewState !== "loading") return;

    const stepDuration = 1000; // ms per step
    const totalDuration = stepDuration * progressSteps.length;
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += 100;
      const progress = Math.min(Math.round((elapsed / totalDuration) * 100), 99);
      setProgressPercent(progress);

      const nextStepIndex = Math.floor(elapsed / stepDuration);
      if (nextStepIndex !== currentStepIndex && nextStepIndex < progressSteps.length) {
        setCurrentStepIndex(nextStepIndex);
      }

      if (elapsed >= totalDuration) {
        clearInterval(interval);
        setProgressPercent(100);
        setTimeout(() => {
          setViewState("report");
        }, 300);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [viewState, currentStepIndex]);

  // Toggle expanded state of a finding card
  const toggleExpandFinding = (id: string) => {
    setExpandedFindingId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* 1. Header component */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/40 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Moteur d&apos;Audit Ergonomique
            </span>
          </h1>
          <p className="text-slate-400 text-sm mt-1 leading-relaxed max-w-2xl">
            Analysez l&apos;ergonomie, l&apos;accessibilité et les frictions de conversion de vos interfaces grâce à des algorithmes de vision et de traitement heuristique propulsés par l&apos;IA.
          </p>
        </div>

        {viewState === "report" && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setViewState("config")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-850 hover:bg-slate-900 text-slate-300 font-semibold text-sm transition-all duration-150 cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 flex-shrink-0" />
              Nouvelle analyse
            </button>
            <button
              type="button"
              onClick={() => alert("Téléchargement du rapport au format PDF simulé.")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all duration-150 shadow-md shadow-indigo-600/10 cursor-pointer"
            >
              <Download className="w-4 h-4 flex-shrink-0" />
              Exporter le rapport
            </button>
          </div>
        )}
      </div>

      {/* --- Main Content Render --- */}

      {/* 2. Configuration View */}
      {viewState === "config" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main config panel (2 cols wide on large screens) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-xl relative overflow-hidden">
              {/* Glow element */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl -z-10" />

              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                Lancer l&apos;Analyse
              </h2>

              <div className="space-y-6">
                {/* Custom URL Input Field */}
                <div>
                  <label htmlFor="url-input" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
                    Adresse URL de la page à analyser
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Globe className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    </div>
                    <input
                      type="text"
                      id="url-input"
                      value={urlInput}
                      onChange={(e) => {
                        setUrlInput(e.target.value);
                        if (urlError) setUrlError("");
                      }}
                      placeholder="ex: https://www.mywebsite.com/product1234"
                      className={`w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900 border text-slate-200 text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all duration-150 ${
                        urlError ? "border-rose-500/80 focus:ring-rose-500/30" : "border-slate-800"
                      }`}
                    />
                  </div>
                  {urlError && (
                    <p className="text-xs text-rose-455 font-medium mt-1.5 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                      {urlError}
                    </p>
                  )}
                  <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                    Le système lancera automatiquement notre suite d&apos;analyse standardisée (critères de Bastien & Scapin, règles e-commerce de Baymard et lois générales d&apos;ergonomie UX).
                  </p>
                </div>
              </div>

              {/* Submit Action Button */}
              <div className="mt-8 pt-6 border-t border-slate-800/40 flex justify-end">
                <button
                  type="button"
                  onClick={handleLaunchAudit}
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-slate-950 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current flex-shrink-0" />
                  Lancer l&apos;analyse IA
                </button>
              </div>
            </div>
          </div>

          {/* Quick Info Sidebar */}
          <div className="space-y-6">
            <div className="bg-gradient-to-b from-slate-950/60 to-slate-950/20 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md shadow-xl relative overflow-hidden">
              <div className="absolute -top-16 -right-16 w-36 h-36 bg-violet-500/5 rounded-full blur-2xl -z-10" />

              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Info className="w-4.5 h-4.5 text-indigo-400 flex-shrink-0" />
                Comment ça marche ?
              </h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400 flex-shrink-0">
                    1
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    <strong>Saisie URL :</strong> Renseignez l&apos;URL exacte de n&apos;importe quelle page web publique à analyser.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400 flex-shrink-0">
                    2
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    <strong>Collecte automatisée :</strong> Notre bot capture le code HTML, le CSS et les visuels à la fois sur mobile et desktop.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400 flex-shrink-0">
                    3
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    <strong>Rapport standard :</strong> L&apos;IA évalue l&apos;interface selon nos grilles de qualité et livre ses recommandations de conversion.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md">
              <h3 className="text-sm font-bold text-white mb-3">Statistiques globale</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800/50 text-center">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase block">Analyses lancées</span>
                  <span className="text-xl font-bold text-slate-200 mt-1 block">14</span>
                </div>
                <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800/50 text-center">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase block">Score moyen</span>
                  <span className="text-xl font-bold text-indigo-400 mt-1 block">72%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Analysis Progress Indicator (Loading simulated steps) */}
      {viewState === "loading" && (
        <div className="max-w-md mx-auto py-12">
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden text-center">
            {/* Background glowing circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl -z-10" />

            {/* Spinner container */}
            <div className="relative w-24 h-24 mx-auto mb-8 flex items-center justify-center">
              {/* Spinning progress outer ring */}
              <div className="absolute inset-0 rounded-full border-2 border-slate-800" />
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="46"
                  className="stroke-slate-800"
                  strokeWidth="3"
                  fill="transparent"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="46"
                  className="stroke-indigo-500"
                  strokeWidth="3"
                  fill="transparent"
                  strokeDasharray="289"
                  strokeDashoffset={289 - (289 * progressPercent) / 100}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 0.1s linear" }}
                />
              </svg>
              {/* Inner animated rotating loader */}
              <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 shadow-inner">
                <RefreshCw className="w-7 h-7 text-indigo-400 animate-spin" />
              </div>
            </div>

            <h2 className="text-xl font-bold text-white mb-2 tracking-tight">
              Analyse en cours...
            </h2>
            <p className="text-slate-400 text-xs mb-6 max-w-xs mx-auto truncate" title={auditedUrl}>
              Scans heuristiques sur <span className="text-slate-300 font-semibold">{auditedUrl}</span>.
            </p>

            {/* Step list progression */}
            <div className="text-left space-y-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800/60 max-w-sm mx-auto">
              {progressSteps.map((step, idx) => {
                const StepIcon = step.icon;
                const isFinished = idx < currentStepIndex;
                const isActive = idx === currentStepIndex;

                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3.5 transition-all duration-300 ${
                      isFinished
                        ? "text-emerald-400"
                        : isActive
                        ? "text-indigo-400 font-semibold"
                        : "text-slate-650"
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {isFinished ? (
                        <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                      ) : isActive ? (
                        <span className="relative flex h-2 w-2 mx-1">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                      ) : (
                        <StepIcon className="w-4 h-4 flex-shrink-0 text-slate-600" />
                      )}
                    </div>
                    <span className="text-xs leading-relaxed truncate">{step.message}</span>
                  </div>
                );
              })}
            </div>

            {/* Percentage Bar */}
            <div className="mt-8">
              <div className="flex justify-between items-center text-[10px] text-slate-500 uppercase font-semibold mb-1.5 px-1">
                <span>Progression</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800/80">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full transition-all duration-100 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Audit Report Section (Mock Data Model Visualization) */}
      {viewState === "report" && auditedReport && (
        <div className="space-y-8 animate-fade-in">
          {/* Summary stats row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Global Score Card (Circular gauge) */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md shadow-xl flex items-center justify-between gap-4 relative overflow-hidden">
              <div className="absolute -top-16 -left-16 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -z-10" />

              <div className="flex-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">
                  Score Global UX
                </span>
                <span className="text-2xl font-bold text-white mt-1 block">
                  {auditedReport.globalScore}/100
                </span>
                <p className="text-slate-450 text-xs mt-2 leading-relaxed">
                  {auditedReport.globalScore >= 80
                    ? "Excellente ergonomie globale. Des optimisations mineures subsistent."
                    : auditedReport.globalScore >= 60
                    ? "Ergonomie moyenne. Frictions détectées sur les parcours clés."
                    : "Ergonomie critique. De multiples failles entravent la conversion."}
                </p>
              </div>

              {/* SVG Radial Progress */}
              <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    className="stroke-slate-900"
                    strokeWidth="5"
                    fill="transparent"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    className={`stroke-[5] ${
                      auditedReport.globalScore >= 80
                        ? "stroke-emerald-500"
                        : auditedReport.globalScore >= 60
                        ? "stroke-amber-500"
                        : "stroke-rose-500"
                    }`}
                    fill="transparent"
                    strokeDasharray="213.6"
                    strokeDashoffset={213.6 - (213.6 * auditedReport.globalScore) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-sm font-bold text-slate-200">
                  {auditedReport.globalScore}%
                </span>
              </div>
            </div>

            {/* Submetrics list */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md shadow-xl flex flex-col justify-between gap-4">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">
                Indicateurs Clés
              </span>
              <div className="space-y-3 flex-1 justify-center flex flex-col">
                {/* Performance */}
                <div>
                  <div className="flex justify-between items-center text-xs text-slate-300 mb-1">
                    <span className="flex items-center gap-1.5">
                      <Gauge className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                      Performance de chargement
                    </span>
                    <span className="font-semibold text-slate-200">{auditedReport.metrics.performance}/100</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full ${
                        auditedReport.metrics.performance >= 80
                          ? "bg-emerald-500"
                          : auditedReport.metrics.performance >= 60
                          ? "bg-amber-500"
                          : "bg-rose-500"
                      }`}
                      style={{ width: `${auditedReport.metrics.performance}%` }}
                    />
                  </div>
                </div>

                {/* Accessibility */}
                <div>
                  <div className="flex justify-between items-center text-xs text-slate-300 mb-1">
                    <span className="flex items-center gap-1.5">
                      <Code className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                      Accessibilité (a11y)
                    </span>
                    <span className="font-semibold text-slate-200">{auditedReport.metrics.accessibility}/100</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full ${
                        auditedReport.metrics.accessibility >= 80
                          ? "bg-emerald-500"
                          : auditedReport.metrics.accessibility >= 60
                          ? "bg-amber-500"
                          : "bg-rose-500"
                      }`}
                      style={{ width: `${auditedReport.metrics.accessibility}%` }}
                    />
                  </div>
                </div>

                {/* Conversion Friction */}
                <div>
                  <div className="flex justify-between items-center text-xs text-slate-300 mb-1">
                    <span className="flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                      Résistance à la Conversion
                    </span>
                    <span className="font-semibold text-slate-200">{auditedReport.metrics.conversionFriction}/100</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full ${
                        auditedReport.metrics.conversionFriction >= 80
                          ? "bg-emerald-500"
                          : auditedReport.metrics.conversionFriction >= 60
                          ? "bg-amber-500"
                          : "bg-rose-500"
                      }`}
                      style={{ width: `${auditedReport.metrics.conversionFriction}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Target context specs */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md shadow-xl flex flex-col justify-between">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-2">
                Contexte d&apos;Analyse
              </span>
              <div className="space-y-2 flex-1 flex flex-col justify-center text-xs">
                <div className="flex justify-between border-b border-slate-900 pb-1.5">
                  <span className="text-slate-500">Site Web</span>
                  <a
                    href={auditedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-400 hover:underline truncate max-w-[150px] font-semibold flex items-center gap-1"
                  >
                    <span className="truncate">{auditedUrl.replace(/^https?:\/\//i, "")}</span>
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-1.5">
                  <span className="text-slate-500">Catégorie</span>
                  <span className="text-slate-300 font-semibold">{auditedCategory}</span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-1.5">
                  <span className="text-slate-500">Alertes critiques</span>
                  <span className="text-rose-455 font-bold">
                    {auditedReport.findings.filter((f) => f.severity === "critical").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Moteur d&apos;analyse</span>
                  <span className="text-indigo-400 font-semibold truncate max-w-[140px]" title="Analyse Heuristique Standard">
                    Standard (Plateforme)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* List of Heuristic Findings */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-indigo-400 flex-shrink-0" />
              Failles Heuristiques Détectées
            </h3>

            {/* Guardrail: Variable alerts container */}
            <div className="space-y-3">
              {auditedReport.findings.map((finding) => {
                const isExpanded = expandedFindingId === finding.id;

                // Color configuration by severity
                let badgeColor = "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
                let borderColor = "border-slate-800/80";
                let severityLabel = "Optimisation";
                let Icon = CheckCircle;

                if (finding.severity === "critical") {
                  badgeColor = "bg-rose-500/10 text-rose-400 border-rose-500/20";
                  borderColor = "border-rose-950/40 hover:border-rose-900/60";
                  severityLabel = "Critique";
                  Icon = ShieldAlert;
                } else if (finding.severity === "warning") {
                  badgeColor = "bg-amber-500/10 text-amber-400 border-amber-500/20";
                  borderColor = "border-amber-950/40 hover:border-amber-900/60";
                  severityLabel = "Avertissement";
                  Icon = AlertTriangle;
                }

                return (
                  <div
                    key={finding.id}
                    className={`bg-slate-950/60 border rounded-2xl transition-all duration-200 overflow-hidden ${
                      isExpanded ? "border-indigo-500/40 bg-slate-950/90 shadow-md" : borderColor
                    }`}
                  >
                    {/* Collapsed Header Bar */}
                    <div
                      onClick={() => toggleExpandFinding(finding.id)}
                      className="p-5 flex items-start gap-4 cursor-pointer select-none hover:bg-slate-900/10 transition-colors duration-150"
                    >
                      <div className="pt-0.5">
                        <Icon className={`w-5 h-5 flex-shrink-0 ${
                          finding.severity === "critical"
                            ? "text-rose-400"
                            : finding.severity === "warning"
                            ? "text-amber-400"
                            : "text-indigo-400"
                        }`} />
                      </div>

                      <div className="flex-1 min-w-0 md:grid md:grid-cols-4 md:gap-4 items-center">
                        <div className="md:col-span-1 mb-1.5 md:mb-0">
                          <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
                            {severityLabel}
                          </span>
                          <span className="block text-[10px] text-slate-500 font-medium mt-1 uppercase truncate">
                            {finding.ruleBreached}
                          </span>
                        </div>
                        <div className="md:col-span-3">
                          <p className="text-sm font-semibold text-slate-200 leading-snug text-wrap break-words pr-2">
                            {finding.summary}
                          </p>
                        </div>
                      </div>

                      <div className="pt-1">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-450 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-450 flex-shrink-0" />
                        )}
                      </div>
                    </div>

                    {/* Expandable finding contents */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-2 border-t border-slate-900/80 space-y-4 bg-slate-950/40">
                        {/* Description block */}
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">
                            Description du problème
                          </span>
                          <p className="text-sm text-slate-350 leading-relaxed text-wrap break-words">
                            {finding.description}
                          </p>
                        </div>

                        {/* Recommandation */}
                        <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl">
                          <span className="text-[10px] text-indigo-400 font-bold uppercase block mb-1">
                            Recommandation d&apos;optimisation
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed font-semibold text-wrap break-words">
                            {finding.recommendation}
                          </p>
                        </div>

                        {/* CSS Selector or code snapshot (Technical Area mapping location) */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] text-slate-500 font-bold uppercase block">
                            Localisation du composant (Sélecteur CSS)
                          </span>
                          <div className="flex items-center gap-2 px-3 py-2 bg-slate-900 rounded-xl border border-slate-800 text-[11px] font-mono text-indigo-400 select-all overflow-x-auto">
                            <span className="text-slate-500 flex-shrink-0 select-none">$</span>
                            <span className="whitespace-nowrap">{finding.selector}</span>
                          </div>

                          {finding.codeSnippet && (
                            <div className="mt-3">
                              <span className="text-[10px] text-slate-600 font-bold uppercase block mb-1">
                                Extrait HTML suspect
                              </span>
                              <pre className="p-4 bg-slate-950/80 border border-slate-900 rounded-2xl text-[10px] font-mono text-slate-400 overflow-x-auto leading-relaxed max-w-full">
                                <code>{finding.codeSnippet}</code>
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
