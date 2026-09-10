"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";

type Step = {
  page: string;
  section: string;
  title: string;
  body: string;
  features: string[];
};

const STEPS: Step[] = [
  {
    page: "/dashboard", section: "Dashboard",
    title: "Il tuo centro di controllo",
    body: "Ogni mattina apri OCRA e sai esattamente cosa fare.",
    features: [
      "KPI aggiornati in tempo reale: incassato, da incassare, pipeline, progetti",
      "Alert intelligenti: solo ciò che richiede un'azione oggi",
      "Progetti in corso con avanzamento e scadenze",
      "Ultimo verbale generato con task assegnati",
      "Pipeline e riunioni nella sidebar destra",
    ],
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

export function Guide() {
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = React.useState(false);
  const [step, setStep] = React.useState(0);

  React.useEffect(() => {
    const seen = sessionStorage.getItem("ocra-guide-seen");
    if (!seen) {
      const t = setTimeout(() => setActive(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  React.useEffect(() => {
    if (!active) return;
    const s = STEPS[step];
    if (s && pathname !== s.page) {
      router.push(s.page);
    }
  }, [active, step, pathname, router]);

  const go = (dir: 1 | -1) => {
    const next = step + dir;
    if (next < 0) return;
    if (next >= STEPS.length) return close();
    setStep(next);
  };

  const close = () => {
    setActive(false);
    sessionStorage.setItem("ocra-guide-seen", "1");
  };

  if (!active) return null;

  const s = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <>
      <div
        onClick={close}
        style={{
          position: "fixed", inset: 0, zIndex: 9998,
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(4px)",
        }}
      />

      <div
        style={{
          position: "fixed",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10000,
          width: 460,
          animation: "rise 0.3s ease both",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 24px 80px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.04)",
          }}
        >
          {/* Progress bar */}
          <div style={{ height: 3, background: "rgba(0,0,0,0.04)" }}>
            <div style={{
              height: "100%", width: `${progress}%`,
              background: "var(--brand)",
              borderRadius: 3,
              transition: "width 0.4s cubic-bezier(0.2, 0, 0, 1)",
            }} />
          </div>

          <div style={{ padding: "28px 32px 24px" }}>
            {/* Section badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "4px 12px", borderRadius: 20,
              background: "rgba(232,93,36,0.08)",
              fontSize: 11.5, fontWeight: 600, color: "var(--brand)",
              marginBottom: 16,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: 3, background: "var(--brand)" }} />
              {s.section}
            </div>

            <h2 style={{ fontSize: 20, fontWeight: 650, letterSpacing: "-0.02em", marginBottom: 6, color: "var(--text)" }}>
              {s.title}
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.6, marginBottom: 20 }}>
              {s.body}
            </p>

            {/* Feature list */}
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

            {/* Navigation */}
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
