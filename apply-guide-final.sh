#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel 2>/dev/null || echo .)"

echo "=== OCRA Guide — versione definitiva (spotlight + navigazione automatica) ==="
echo ""

# ── Backup di sicurezza ──
mkdir -p .guide-backup
cp src/components/ui/guide.tsx .guide-backup/guide.tsx.bak 2>/dev/null || true
cp "src/app/(dashboard)/layout.tsx" .guide-backup/layout.tsx.bak 2>/dev/null || true
cp src/components/layout/sidebar.tsx .guide-backup/sidebar.tsx.bak 2>/dev/null || true
cp "src/app/(dashboard)/dashboard/page.tsx" .guide-backup/dashboard-page.tsx.bak 2>/dev/null || true
echo "[0/5] Backup salvato in .guide-backup/"

# ══════════════════════════════════════════════════════════════
# 1 — guide.tsx: riscrittura completa con spotlight sui pannelli dashboard
# ══════════════════════════════════════════════════════════════
echo "[1/5] Riscrivo src/components/ui/guide.tsx..."

cat > src/components/ui/guide.tsx << 'ENDOFGUIDE'
"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";

type Step = {
  page: string;
  target?: string;
  section: string;
  title: string;
  body: string;
  features?: string[];
};

const STEPS: Step[] = [
  {
    page: "/dashboard", section: "Benvenuto",
    title: "Benvenuto in OCRA",
    body: "La piattaforma che unisce Fulcro Lucem, St'Art Factory e Duit in un unico sistema operativo. Ti accompagno attraverso le 7 aree in due minuti — ogni pagina si aprirà da sola man mano che ne parliamo.",
  },
  {
    page: "/dashboard", section: "Dashboard",
    title: "Il tuo centro di controllo",
    body: "Ogni mattina apri OCRA e sai esattamente cosa fare.",
    features: [
      "KPI aggiornati in tempo reale: incassato, da incassare, pipeline, progetti",
      "Alert intelligenti: solo ciò che richiede un'azione oggi",
      "Progetti in corso con avanzamento e scadenze",
      "Ultimo verbale generato con task assegnati",
      "Pipeline e riunioni nella colonna destra",
    ],
  },
  {
    page: "/dashboard", target: "kpi-cards", section: "Dashboard",
    title: "KPI in tempo reale",
    body: "Incassato, da incassare, pipeline aperta e progetti attivi: i numeri chiave della tua agenzia sempre sotto controllo, aggiornati automaticamente.",
  },
  {
    page: "/dashboard", target: "attention-panel", section: "Dashboard",
    title: "Richiede attenzione",
    body: "OCRA analizza fatture, progetti e scadenze e ti segnala solo ciò che serve un'azione oggi. Ogni riga ti porta direttamente alla soluzione con un click.",
  },
  {
    page: "/dashboard", target: "progetti-panel", section: "Dashboard",
    title: "Progetti in corso",
    body: "Avanzamento, responsabile e data di consegna per ogni progetto attivo tra le tre società. I colori ti avvisano quando qualcosa sta sforando.",
  },
  {
    page: "/dashboard", target: "verbale-panel", section: "Dashboard",
    title: "Ultimo verbale AI",
    body: "Generato automaticamente da Fireflies + Claude, con le azioni già assegnate a chi deve farle. Spuntale direttamente da qui.",
  },
  {
    page: "/dashboard", target: "riunioni-panel", section: "Dashboard",
    title: "Prossime riunioni",
    body: "Le riunioni in calendario, con lo stato del verbale: se è già pronto o se Fireflies lo sta ancora elaborando.",
  },
  {
    page: "/dashboard", target: "funnel-panel", section: "Dashboard",
    title: "Pipeline commerciale",
    body: "Il valore delle trattative in ogni fase del funnel, colpo d'occhio immediato su dove si concentra il fatturato potenziale.",
  },
  {
    page: "/clienti", section: "Clienti",
    title: "Anagrafica e onboarding",
    body: "Ogni cliente in un posto solo, con onboarding che si fa da sé.",
    features: [
      "Portafoglio clienti con settore, referente e fatturato",
      "Onboarding automatico: Drive + Trello + email in un click",
      "Dettaglio cliente con progetti, fatture e storico",
      "Stato: attivo, in onboarding, lead",
    ],
  },
  {
    page: "/pipeline", section: "Pipeline",
    title: "Funnel vendite visivo",
    body: "Trascina, chiudi, incassa. Il CRM che non ti fa perdere lead.",
    features: [
      "Board a colonne: Lead → Contatto → Proposta → Negoziazione → Vinto",
      "Drag & drop per cambiare fase",
      "Follow-up automatici programmati",
      "Valore ponderato per probabilità di chiusura",
      "Nuova trattativa con un click",
    ],
  },
  {
    page: "/progetti", section: "Progetti",
    title: "Avanzamento e scadenze",
    body: "Tutti i progetti attivi tra le tre società, con budget e deadline.",
    features: [
      "Progress bar per ogni progetto",
      "Budget impegnato vs speso",
      "Filtri: attivo, in consegna, completato",
      "Dettaglio con automazioni attive (reminder, check-in)",
    ],
  },
  {
    page: "/contenuti", section: "Contenuti",
    title: "Pipeline editoriale",
    body: "Ogni contenuto attraversa un flusso — da idea a pubblicazione.",
    features: [
      "Board kanban: idea → briefing → produzione → revisione → approvato → pubblicato",
      "Formato, canale e responsabile per ogni contenuto",
      "Vista board e vista lista",
      "KPI: in lavorazione, da approvare, pronti, pubblicati",
    ],
  },
  {
    page: "/studio", section: "AI Studio",
    title: "L'intelligenza artificiale al lavoro",
    body: "Due modalità: strumenti per il team e strumenti per i servizi che vendete ai clienti.",
    features: [
      "Uso interno: verbali automatici, preventivi, analisi bandi, scrittura progetti",
      "Servizi al cliente: business audit, naming, personas, piano editoriale, campaign concept, business plan, piano lancio, growth analysis",
      "Ogni documento generato da Claude in tempo reale",
      "Export PDF e invio diretto al cliente",
    ],
  },
  {
    page: "/operativo", section: "Operativo",
    title: "Contabilità che gira da sola",
    body: "Scadenziario, codici PO, previsione di cassa e solleciti automatici.",
    features: [
      "Scadenziario con filtri: entrate, uscite, scadute",
      "Generatore codici PO nel formato standard dell'agenzia",
      "Previsione di cassa a 8 settimane",
      "Solleciti automatici per fatture scadute",
      "Gestione collaboratori e documenti fiscali",
    ],
  },
];

type Rect = { top: number; left: number; width: number; height: number };

export function Guide() {
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = React.useState(false);
  const [step, setStep] = React.useState(0);
  const [rect, setRect] = React.useState<Rect | null>(null);

  const current = STEPS[step];

  React.useEffect(() => {
    const seen = sessionStorage.getItem("ocra-guide-seen");
    if (!seen) {
      const t = setTimeout(() => setActive(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  // Naviga automaticamente alla pagina dello step corrente
  React.useEffect(() => {
    if (!active) return;
    if (current && pathname !== current.page) {
      router.push(current.page);
    }
  }, [active, step, pathname, router, current]);

  // Trova ed evidenzia l'elemento target (step con spotlight)
  React.useEffect(() => {
    if (!active || !current?.target || pathname !== current.page) {
      setRect(null);
      return;
    }
    let raf = 0;
    let tries = 0;
    const find = () => {
      const el = document.querySelector(`[data-guide="${current.target}"]`);
      if (el) {
        const r = el.getBoundingClientRect();
        setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (tries < 40) {
        tries++;
        raf = requestAnimationFrame(find);
      }
    };
    find();
    return () => cancelAnimationFrame(raf);
  }, [active, step, pathname, current]);

  // Ricalcola la posizione durante resize/scroll
  React.useEffect(() => {
    if (!active || !current?.target) return;
    const update = () => {
      const el = document.querySelector(`[data-guide="${current.target}"]`);
      if (el) {
        const r = el.getBoundingClientRect();
        setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
      }
    };
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [active, step, current]);

  const go = (dir: 1 | -1) => {
    const nextStep = step + dir;
    if (nextStep < 0) return;
    if (nextStep >= STEPS.length) { close(); return; }
    setRect(null);
    setStep(nextStep);
  };

  const close = () => {
    setActive(false);
    setRect(null);
    sessionStorage.setItem("ocra-guide-seen", "1");
  };

  if (!active) return null;

  const s = current;
  const progress = ((step + 1) / STEPS.length) * 100;
  const waitingForTarget = !!s.target && !rect;
  const cardWidth = rect ? 360 : 460;

  let cardStyle: React.CSSProperties = {
    position: "fixed", top: "50%", left: "50%",
    transform: "translate(-50%, -50%)",
  };
  if (rect) {
    const margin = 16;
    const cardHeight = 240;
    let top = rect.top + rect.height + margin;
    let left = rect.left;
    if (top + cardHeight > window.innerHeight) top = Math.max(margin, rect.top - cardHeight - margin);
    if (left + cardWidth > window.innerWidth - margin) left = window.innerWidth - cardWidth - margin;
    if (left < margin) left = margin;
    cardStyle = { position: "fixed", top, left, transform: "none" };
  }

  return (
    <>
      <div
        onClick={close}
        style={{
          position: "fixed", inset: 0, zIndex: 9998,
          background: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(4px)",
        }}
      />

      {rect && (
        <div
          style={{
            position: "fixed",
            top: rect.top - 6, left: rect.left - 6,
            width: rect.width + 12, height: rect.height + 12,
            borderRadius: 14,
            boxShadow: "0 0 0 3px rgba(232,93,36,0.45), 0 0 24px 4px rgba(232,93,36,0.12), 0 0 0 9999px rgba(0,0,0,0.55)",
            zIndex: 9999,
            pointerEvents: "none",
            transition: "top .35s cubic-bezier(.4,0,.2,1), left .35s cubic-bezier(.4,0,.2,1), width .35s cubic-bezier(.4,0,.2,1), height .35s cubic-bezier(.4,0,.2,1)",
          }}
        />
      )}

      <div style={{ ...cardStyle, zIndex: 10000, width: cardWidth }}>
        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 24px 80px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.04)",
            opacity: waitingForTarget ? 0 : 1,
            transform: waitingForTarget ? "scale(.97)" : "scale(1)",
            transition: "opacity .18s ease, transform .18s ease",
          }}
        >
          <div style={{ height: 3, background: "rgba(0,0,0,0.04)" }}>
            <div style={{
              height: "100%", width: `${progress}%`,
              background: "var(--brand)", borderRadius: 3,
              transition: "width 0.4s cubic-bezier(0.2, 0, 0, 1)",
            }} />
          </div>

          <div style={{ padding: rect ? "20px 22px 18px" : "28px 32px 24px" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "4px 12px", borderRadius: 20,
              background: "rgba(232,93,36,0.08)",
              fontSize: 11.5, fontWeight: 600, color: "var(--brand)",
              marginBottom: 14,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: 3, background: "var(--brand)" }} />
              {s.section}
            </div>

            <h2 style={{
              fontSize: rect ? 16 : 20, fontWeight: 650, letterSpacing: "-0.02em",
              marginBottom: 6, color: "var(--text)",
            }}>
              {s.title}
            </h2>
            <p style={{
              fontSize: rect ? 12.5 : 14, color: "var(--text-2)", lineHeight: 1.6,
              marginBottom: s.features ? 20 : 18,
            }}>
              {s.body}
            </p>

            {s.features && (
              <div style={{ marginBottom: 24 }}>
                {s.features.map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
                    <span style={{
                      width: 18, height: 18, borderRadius: 9,
                      background: "rgba(232,93,36,0.08)",
                      color: "var(--brand)",
                      fontSize: 10, fontWeight: 700,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, marginTop: 1,
                    }}>
                      ✓
                    </span>
                    <span style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.5 }}>{f}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button onClick={close} style={{ background: "none", border: "none", fontSize: 12.5, color: "var(--text-3)", cursor: "pointer" }}>
                Salta il tour
              </button>
              <div style={{ display: "flex", gap: 6 }}>
                {step > 0 && (
                  <button
                    onClick={() => go(-1)}
                    style={{
                      padding: "8px 16px", borderRadius: 10,
                      fontSize: 13, fontWeight: 550,
                      background: "rgba(0,0,0,0.04)", border: "none",
                      cursor: "pointer", color: "var(--text-2)",
                    }}
                  >
                    ← Indietro
                  </button>
                )}
                <button
                  onClick={() => go(1)}
                  style={{
                    padding: "8px 20px", borderRadius: 10,
                    fontSize: 13, fontWeight: 550,
                    background: "var(--brand)", color: "#fff",
                    border: "none", cursor: "pointer",
                  }}
                >
                  {step === STEPS.length - 1 ? "Iniziamo ✓" : "Avanti →"}
                </button>
              </div>
            </div>

            <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 14, textAlign: "center" }}>
              {step + 1} di {STEPS.length}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function GuideButton() {
  const restart = () => {
    sessionStorage.removeItem("ocra-guide-seen");
    window.location.href = "/dashboard";
  };

  return (
    <button
      onClick={restart}
      title="Tour guidato"
      style={{
        position: "fixed", bottom: 20, right: 20,
        width: 38, height: 38, borderRadius: 19,
        background: "var(--brand)", color: "#fff",
        border: "none", cursor: "pointer", fontSize: 16,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 16px rgba(232,93,36,0.25)",
        zIndex: 100,
        transition: "transform 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      ?
    </button>
  );
}
ENDOFGUIDE

echo "    ✓ guide.tsx (14 step: 1 benvenuto + dashboard con 6 spotlight + 6 pagine overview)"

# ══════════════════════════════════════════════════════════════
# 2 — layout.tsx: rimuove TourProvider (sistema conflittuale)
# ══════════════════════════════════════════════════════════════
echo "[2/5] Aggiorno layout.tsx (rimuovo TourProvider)..."

cat > "src/app/(dashboard)/layout.tsx" << 'ENDOFLAYOUT'
import { Sidebar } from "@/components/layout/sidebar";
import { DemoProvider } from "@/lib/demo/store";
import { ToastProvider } from "@/components/ui/toast";
import { Guide, GuideButton } from "@/components/ui/guide";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoProvider>
      <ToastProvider>
        <div className="min-h-screen">
          <Sidebar />
          <main className="ml-[228px]">
            <div className="max-w-[1120px] mx-auto px-8 py-7">
              {children}
            </div>
          </main>
          <Guide />
          <GuideButton />
        </div>
      </ToastProvider>
    </DemoProvider>
  );
}
ENDOFLAYOUT

echo "    ✓ layout.tsx (solo Guide attivo)"

# ══════════════════════════════════════════════════════════════
# 3 — sidebar.tsx: rimuove pulsante/import del vecchio Tour
# ══════════════════════════════════════════════════════════════
echo "[3/5] Aggiorno sidebar.tsx (rimuovo pulsante tour conflittuale)..."

cat > src/components/layout/sidebar.tsx << 'ENDOFSIDEBAR'
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TENANT } from "@/lib/demo/data";

const NAV = [
  { href: "/dashboard", label: "Dashboard", hint: "Oggi", icon: Grid },
  { href: "/clienti", label: "Clienti", hint: "Anagrafica e progetti", icon: Users },
  { href: "/pipeline", label: "Pipeline", hint: "Trattative", icon: Funnel },
  { href: "/progetti", label: "Progetti", hint: "Avanzamento e scadenze", icon: Folder },
  { href: "/contenuti", label: "Contenuti", hint: "Pipeline editoriale", icon: Calendar },
  { href: "/studio", label: "AI Studio", hint: "Verbali, preventivi, bandi", icon: Spark },
  { href: "/operativo", label: "Operativo", hint: "Contabilità e scadenze", icon: Ledger },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-[228px] flex flex-col z-20"
      style={{ background: "var(--sidebar)" }}
    >
      {/* Marchio */}
      <div className="px-4 pt-5 pb-4">
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-[8px] flex items-center justify-center shrink-0"
            style={{ background: "var(--brand)" }}
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="#fff" strokeWidth="2" />
              <path d="M8 2a6 6 0 0 1 6 6" stroke="var(--brand)" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          </div>
          <div className="leading-tight">
            <div className="text-[13px] font-semibold text-white tracking-tight">OCRA</div>
            <div className="text-[10.5px]" style={{ color: "var(--sidebar-text)" }}>
              {TENANT.name}
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-2.5 space-y-0.5">
        {NAV.map(({ href, label, hint, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              data-guide={href.slice(1)}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-[9px] transition-colors group"
              style={{
                background: active ? "var(--sidebar-hover)" : "transparent",
                color: active ? "#fff" : "var(--sidebar-text)",
              }}
            >
              <Icon active={active} />
              <span className="flex-1 min-w-0">
                <span className="block text-[12.5px] font-medium leading-tight">{label}</span>
                <span
                  className="block text-[10.5px] truncate leading-tight mt-px"
                  style={{ color: active ? "#7e8089" : "#606269" }}
                >
                  {hint}
                </span>
              </span>
              {active && (
                <span className="w-1 h-1 rounded-full shrink-0" style={{ background: "var(--brand)" }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Stato integrazioni */}
      <div className="px-4 py-3 mx-2.5 mb-2 rounded-[10px]" style={{ background: "#191a1e" }}>
        <div
          className="text-[9.5px] font-semibold tracking-[0.08em] uppercase mb-2"
          style={{ color: "#5d5f66" }}
        >
          Integrazioni
        </div>
        {[
          ["Fireflies", true],
          ["Google Workspace", true],
          ["n8n", true],
          ["Fatture in Cloud", false],
        ].map(([n, on]) => (
          <div key={n as string} className="flex items-center gap-2 py-[3px]">
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: on ? "#2fb888" : "#4a4c53" }}
            />
            <span className="text-[11px]" style={{ color: on ? "#9a9ca3" : "#5d5f66" }}>
              {n as string}
            </span>
          </div>
        ))}
      </div>

      <div className="px-4 py-3 border-t" style={{ borderColor: "#232429" }}>
        <div className="flex items-center gap-2.5">
          <span
            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold"
            style={{ background: "#2a2c32", color: "#c9cbd1" }}
          >
            D
          </span>
          <div className="min-w-0">
            <div className="text-[11.5px] text-white leading-tight">Daniele</div>
            <div className="text-[10px] leading-tight" style={{ color: "#5d5f66" }}>
              Amministratore
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ── Icone (tratto 1.5, 16px) ── */
type IP = { active?: boolean };
const S = (a?: boolean) => ({
  width: 16, height: 16, viewBox: "0 0 16 16", fill: "none",
  stroke: a ? "#ffffff" : "currentColor", strokeWidth: 1.5,
  strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
});

function Grid({ active }: IP) {
  return (
    <svg {...S(active)}>
      <rect x="2" y="2" width="5" height="5" rx="1.4" />
      <rect x="9" y="2" width="5" height="5" rx="1.4" />
      <rect x="2" y="9" width="5" height="5" rx="1.4" />
      <rect x="9" y="9" width="5" height="5" rx="1.4" />
    </svg>
  );
}
function Users({ active }: IP) {
  return (
    <svg {...S(active)}>
      <circle cx="6" cy="5" r="2.4" />
      <path d="M1.8 13.4c0-2.3 1.9-3.8 4.2-3.8s4.2 1.5 4.2 3.8" />
      <path d="M11 3.1a2.4 2.4 0 0 1 0 4.6M12.2 9.9c1.3.5 2.1 1.6 2.1 3.1" />
    </svg>
  );
}
function Funnel({ active }: IP) {
  return (
    <svg {...S(active)}>
      <path d="M2 3h12l-4.6 5.2v4.4L6.6 14V8.2z" />
    </svg>
  );
}
function Spark({ active }: IP) {
  return (
    <svg {...S(active)}>
      <path d="M8 1.8l1.5 3.9 3.9 1.5-3.9 1.5L8 12.6 6.5 8.7 2.6 7.2l3.9-1.5z" />
      <path d="M12.6 11.4l.6 1.5 1.5.6-1.5.6-.6 1.5-.6-1.5-1.5-.6 1.5-.6z" />
    </svg>
  );
}
function Ledger({ active }: IP) {
  return (
    <svg {...S(active)}>
      <rect x="2.5" y="2" width="11" height="12" rx="1.6" />
      <path d="M5.5 5.5h5M5.5 8h5M5.5 10.5h3" />
    </svg>
  );
}
function Folder({ active }: IP) {
  return (
    <svg {...S(active)}>
      <path d="M2 4.5c0-.8.7-1.5 1.5-1.5h3l1.5 1.5h5c.8 0 1.5.7 1.5 1.5v6c0 .8-.7 1.5-1.5 1.5h-10c-.8 0-1.5-.7-1.5-1.5z" />
    </svg>
  );
}
function Calendar({ active }: IP) {
  return (
    <svg {...S(active)}>
      <rect x="2" y="3" width="12" height="11" rx="1.5" />
      <path d="M2 6.5h12M5 1.5v3M11 1.5v3M5 9h2M9 9h2M5 11.5h2" />
    </svg>
  );
}
ENDOFSIDEBAR

echo "    ✓ sidebar.tsx (pulsante tour rimosso, data-guide mantenuto sui link)"

# ══════════════════════════════════════════════════════════════
# 4 — dashboard/page.tsx: aggiunge data-guide sui 6 pannelli
# ══════════════════════════════════════════════════════════════
echo "[4/5] Aggiorno dashboard/page.tsx (aggiungo data-guide sui pannelli)..."

cat > "src/app/(dashboard)/dashboard/page.tsx" << 'ENDOFDASHBOARD'
"use client";

import Link from "next/link";
import { useStore } from "@/lib/demo/store";
import { buildAlerts } from "@/lib/demo/insights";
import {
  eur, dayMonth, daysFromToday, clientName, TODAY, STAGES,
} from "@/lib/demo/data";
import { Badge, Panel, Progress, Avatar, PageHead } from "@/components/ui/kit";

const WEEKDAYS = ["Domenica","Lunedì","Martedì","Mercoledì","Giovedì","Venerdì","Sabato"];
const MONTHS = ["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","agosto","settembre","ottobre","novembre","dicembre"];

function oggi() {
  return WEEKDAYS[TODAY.getDay()] + " " + TODAY.getDate() + " " + MONTHS[TODAY.getMonth()];
}

export default function DashboardPage() {
  const s = useStore();
  const alerts = buildAlerts(s);

  const incassato = s.invoices.filter((i) => i.direction === "E" && i.status === "paid").reduce((a, i) => a + i.amount, 0);
  const daIncassare = s.invoices.filter((i) => i.direction === "E" && i.status !== "paid").reduce((a, i) => a + i.amount, 0);
  const scaduto = s.invoices.filter((i) => i.direction === "E" && i.status === "overdue").reduce((a, i) => a + i.amount, 0);
  const pipeline = s.leads.filter((l) => !["vinto", "perso"].includes(l.stage)).reduce((a, l) => a + l.value, 0);
  const attivi = s.projects.filter((p) => p.status !== "consegnato");
  const prossimeRiunioni = [...s.meetings].sort((a, b) => +new Date(b.date) - +new Date(a.date)).slice(0, 3);
  const ultimoVerbale = s.meetings.find((m) => m.status === "elaborato");

  return (
    <div className="rise">
      {/* ── HEADER ── */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="t-meta mb-1">{oggi()}</div>
          <h1 className="t-page">Buongiorno, Daniele</h1>
        </div>
        <div className="flex gap-2">
          <Link href="/studio" className="btn btn-ghost">AI Studio</Link>
          <Link href="/clienti?nuovo=1" className="btn btn-primary">+ Nuovo cliente</Link>
        </div>
      </div>

      {/* ── BLOCCO 1: KPI — leggibili in 1 secondo ── */}
      <div className="grid grid-cols-4 gap-3 mb-6" data-guide="kpi-cards">
        <KPI label="Incassato 2026" value={eur(incassato)} trend="+12%" positive />
        <KPI label="Da incassare" value={eur(daIncassare)} tag={scaduto ? eur(scaduto) + " scaduti" : undefined} danger={!!scaduto} />
        <KPI label="Pipeline" value={eur(pipeline)} tag={s.leads.filter((l) => !["vinto","perso"].includes(l.stage)).length + " trattative"} />
        <KPI label="Progetti" value={String(attivi.length)} tag={s.clients.filter((c) => c.status === "active").length + " clienti attivi"} />
      </div>

      {/* ── BLOCCO 2: ATTENZIONE — max 5 righe, azione immediata ── */}
      {alerts.length > 0 && (
        <div className="card mb-6 overflow-hidden" data-guide="attention-panel">
          <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid var(--line-2)" }}>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: "var(--danger)" }} />
              <span className="text-[13px] font-semibold">{alerts.length} cose richiedono attenzione</span>
            </div>
          </div>
          {alerts.slice(0, 5).map((a) => (
            <Link
              key={a.id}
              href={a.href}
              className="flex items-center gap-4 px-5 py-2.5 border-b last:border-0 hover:bg-[var(--surface-2)] transition-colors"
              style={{ borderColor: "var(--line-2)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{
                background: a.severity === "danger" ? "var(--danger)" : a.severity === "warn" ? "var(--warn)" : "var(--info)"
              }} />
              <span className="text-[12.5px] font-medium flex-1 truncate">{a.title}</span>
              <span className="t-meta shrink-0">{a.area}</span>
              <span className="text-[11.5px] font-medium shrink-0" style={{ color: "var(--brand)" }}>{a.cta} →</span>
            </Link>
          ))}
        </div>
      )}

      {/* ── BLOCCO 3: DUE COLONNE — progetti + sidebar ── */}
      <div className="grid grid-cols-[1.6fr_1fr] gap-5">

        {/* Colonna sinistra: Progetti + Verbale */}
        <div className="space-y-5">
          <div className="card overflow-hidden" data-guide="progetti-panel">
            <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid var(--line-2)" }}>
              <span className="text-[13px] font-semibold">Progetti in corso</span>
              <Link href="/progetti" className="text-[11.5px] font-medium" style={{ color: "var(--brand)" }}>Tutti →</Link>
            </div>
            {attivi.map((p) => {
              const left = daysFromToday(p.endDate);
              return (
                <div key={p.id} className="flex items-center gap-4 px-5 py-3 border-b last:border-0" style={{ borderColor: "var(--line-2)" }}>
                  <Avatar name={p.lead} size={24} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12.5px] font-medium truncate">{p.name}</div>
                    <div className="t-meta">{clientName(p.clientId)}</div>
                  </div>
                  <div className="w-20 shrink-0">
                    <Progress value={p.progress} />
                  </div>
                  <span className="text-[11px] tabular w-7 text-right shrink-0" style={{ color: "var(--text-3)" }}>{p.progress}%</span>
                  <span className="text-[11px] tabular shrink-0" style={{ color: left <= 14 ? "var(--warn)" : "var(--text-3)" }}>{dayMonth(p.endDate)}</span>
                </div>
              );
            })}
          </div>

          {/* Verbale — compatto */}
          {ultimoVerbale && (
            <div className="card overflow-hidden" data-guide="verbale-panel">
              <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid var(--line-2)" }}>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold">Ultimo verbale</span>
                  <Badge tone="brand" dot>AI</Badge>
                </div>
                <Link href="/studio" className="text-[11.5px] font-medium" style={{ color: "var(--brand)" }}>Apri →</Link>
              </div>
              <div className="px-5 py-3">
                <div className="text-[12.5px] font-medium mb-1">{ultimoVerbale.title}</div>
                <p className="text-[12px] leading-relaxed mb-3" style={{ color: "var(--text-2)" }}>
                  {(ultimoVerbale.summary || "").slice(0, 200)}…
                </p>
                <div className="space-y-1.5">
                  {(ultimoVerbale.actions ?? []).slice(0, 3).map((a, i) => (
                    <label key={i} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={a.done} onChange={() => s.toggleAction(ultimoVerbale.id, i)} className="accent-[var(--brand)]" />
                      <span className="text-[11.5px]" style={{ color: a.done ? "var(--text-3)" : "var(--text)", textDecoration: a.done ? "line-through" : "none" }}>
                        <b>{a.who}</b> — {a.what}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Colonna destra: Riunioni + Funnel */}
        <div className="space-y-5">
          <div className="card overflow-hidden" data-guide="riunioni-panel">
            <div className="px-5 py-3" style={{ borderBottom: "1px solid var(--line-2)" }}>
              <span className="text-[13px] font-semibold">Prossime riunioni</span>
            </div>
            {prossimeRiunioni.map((m) => (
              <div key={m.id} className="flex items-center gap-3 px-5 py-2.5 border-b last:border-0" style={{ borderColor: "var(--line-2)" }}>
                <div className="text-center shrink-0 w-9">
                  <div className="text-[15px] font-semibold tabular leading-none">{new Date(m.date).getDate()}</div>
                  <div className="text-[10px] uppercase" style={{ color: "var(--text-3)" }}>
                    {MONTHS[new Date(m.date).getMonth()].slice(0, 3)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12.5px] font-medium truncate">{m.title}</div>
                  <div className="t-meta truncate">{m.participants.join(", ")}</div>
                </div>
                {m.status === "elaborato" ? <Badge tone="ok" dot>Verbale</Badge> : <Badge tone="neutral" dot>In arrivo</Badge>}
              </div>
            ))}
          </div>

          <div className="card overflow-hidden" data-guide="funnel-panel">
            <div className="px-5 py-3" style={{ borderBottom: "1px solid var(--line-2)" }}>
              <span className="text-[13px] font-semibold">Pipeline</span>
            </div>
            <div className="px-5 py-3 space-y-3">
              {STAGES.filter((st) => !["vinto","perso"].includes(st.key)).map((st) => {
                const items = s.leads.filter((l) => l.stage === st.key);
                const val = items.reduce((a, l) => a + l.value, 0);
                const max = Math.max(...STAGES.map((x) => s.leads.filter((l) => l.stage === x.key).reduce((a, l) => a + l.value, 0)), 1);
                return (
                  <div key={st.key}>
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="text-[12px]">{st.label}</span>
                      <span className="t-meta tabular">{items.length} · {eur(val)}</span>
                    </div>
                    <Progress value={(val / max) * 100} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── KPI Card — pulita, futuristica ── */
function KPI({ label, value, trend, positive, tag, danger }: {
  label: string; value: string; trend?: string; positive?: boolean; tag?: string; danger?: boolean;
}) {
  return (
    <div className="card card-pad">
      <div className="t-label">{label}</div>
      <div className="text-[24px] font-semibold tracking-tight leading-none mt-2" style={danger ? { color: "var(--danger)" } : undefined}>
        {value}
      </div>
      <div className="mt-2 flex items-center gap-1.5">
        {trend && (
          <span className="text-[11px] font-medium" style={{ color: positive ? "var(--ok)" : "var(--text-3)" }}>
            {positive ? "▲" : ""} {trend}
          </span>
        )}
        {tag && (
          <span className="text-[11px]" style={{ color: danger ? "var(--danger)" : "var(--text-3)" }}>{tag}</span>
        )}
      </div>
    </div>
  );
}
ENDOFDASHBOARD

echo "    ✓ dashboard/page.tsx (6 data-guide aggiunti: kpi-cards, attention-panel, progetti-panel, verbale-panel, riunioni-panel, funnel-panel)"

# ══════════════════════════════════════════════════════════════
# 5 — Pulizia: rimuove tour.tsx se non più referenziato
# ══════════════════════════════════════════════════════════════
echo "[5/5] Verifico riferimenti residui a tour.tsx..."

REFS=$(grep -rl "components/ui/tour" src --include="*.tsx" --include="*.ts" 2>/dev/null | grep -v "src/components/ui/tour.tsx" || true)

if [ -z "$REFS" ]; then
  if [ -f src/components/ui/tour.tsx ]; then
    rm src/components/ui/tour.tsx
    echo "    ✓ tour.tsx rimosso (nessun riferimento residuo)"
  fi
else
  echo "    ⚠ Riferimenti residui trovati, tour.tsx NON rimosso:"
  echo "$REFS"
fi

echo ""
echo "=== Fatto! ==="
echo "Ora c'è UN SOLO sistema di guida (Guide), niente più conflitti."
echo ""
echo "  npm run dev"
echo "  → apri in incognito o svuota sessionStorage per vedere il tour dall'inizio"
echo "  → 14 step: benvenuto → dashboard (overview + 6 spotlight sui pannelli) → 6 pagine con navigazione automatica"
echo ""
echo "  git add -A"
echo "  git commit -m 'fix: guida unificata con spotlight dashboard e navigazione automatica'"
echo "  git push"
