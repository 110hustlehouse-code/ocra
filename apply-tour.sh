#!/bin/bash
set -e

echo "=== OCRA Tour v2 — 22 step espansi ==="
echo ""

# ─────────────────────────────────────────────────
# 1. Sovrascrivi tour.tsx (file completo)
# ─────────────────────────────────────────────────
echo "[1/3] Sovrascrivo src/components/ui/tour.tsx..."
cat > src/components/ui/tour.tsx << 'TOUREOF'
"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

/* ── Step definitions ── */
interface Step {
  target: string | null; // data-tour value — null = centered card
  title: string;
  body: string;
  placement?: "top" | "bottom" | "left" | "right";
}

const STEPS: Step[] = [
  /* ── 0  Welcome ── */
  {
    target: null,
    title: "Benvenuto in OCRA",
    body: "Il sistema operativo di Fulcro Lucem. Ti faccio vedere cosa può fare per la tua agenzia — ci vogliono 60 secondi.",
  },
  /* ── 1  Sidebar overview ── */
  {
    target: "sidebar-nav",
    title: "Cinque aree, tutto connesso",
    body: "Dashboard, clienti, pipeline commerciale, AI Studio e operativo. Ogni sezione parla con le altre — i dati si incrociano automaticamente.",
    placement: "right",
  },

  /* ── DASHBOARD ── */
  /* ── 2  KPI cards ── */
  {
    target: "kpi-cards",
    title: "I numeri dell'agenzia",
    body: "Incassato, crediti aperti, valore pipeline e progetti attivi. Calcolati in tempo reale da fatture, trattative e progetti — niente più Excel.",
    placement: "bottom",
  },
  /* ── 3  Attention panel ── */
  {
    target: "attention-panel",
    title: "OCRA pensa per te",
    body: "Incrocia fatture scadute, follow-up mancati, budget sforati e azioni aperte. Ti dice cosa serve oggi, ordinato per priorità.",
    placement: "bottom",
  },
  /* ── 4  Last meeting minutes ── */
  {
    target: "verbale-panel",
    title: "Verbali automatici",
    body: "L'ultimo verbale generato dall'AI a partire dalla trascrizione Fireflies. Le azioni estratte hanno responsabile e scadenza — spuntale qui.",
    placement: "bottom",
  },
  /* ── 5  Active projects ── */
  {
    target: "progetti-panel",
    title: "Progetti in corso",
    body: "Avanzamento, budget consumato e date di consegna per ogni progetto attivo. Se il budget sfora o la deadline è vicina, diventa rosso.",
    placement: "bottom",
  },
  /* ── 6  Meetings ── */
  {
    target: "riunioni-panel",
    title: "Prossime riunioni",
    body: "Le riunioni in calendario con stato Fireflies. Quando la call finisce, il verbale si genera da solo e compare qui sopra.",
    placement: "left",
  },
  /* ── 7  Funnel mini ── */
  {
    target: "funnel-panel",
    title: "Funnel vendite",
    body: "Quanto vale ogni fase della pipeline — lead, contatto, proposta, negoziazione. Una fotografia rapida delle trattative aperte.",
    placement: "left",
  },
  /* ── 8  Expected payments ── */
  {
    target: "incassi-panel",
    title: "Incassi attesi",
    body: "Le prossime fatture da incassare, ordinate per scadenza. Se una è scaduta, il sollecito automatico è già in coda.",
    placement: "left",
  },

  /* ── CLIENTI (sidebar) ── */
  /* ── 9 ── */
  {
    target: "nav-clienti",
    title: "Clienti",
    body: "Anagrafica completa: azienda, referente, settore, progetti attivi, stato. Clicca su un cliente per la scheda dettagliata con storico e documenti.",
    placement: "right",
  },
  /* ── 10  Clienti — onboarding ── */
  {
    target: "nav-clienti",
    title: "Onboarding automatico",
    body: "Nuovo cliente? Compila una scheda e OCRA fa il resto: cartella Drive, board Trello, codice PO, email di benvenuto e kickoff in calendario. 30 secondi, non 40 minuti.",
    placement: "right",
  },

  /* ── PIPELINE (sidebar) ── */
  /* ── 11 ── */
  {
    target: "nav-pipeline",
    title: "Pipeline commerciale",
    body: "Board drag & drop con le fasi del funnel: lead → contatto → proposta → negoziazione → vinto. Trascina una card per avanzarla. Il valore ponderato si aggiorna da solo.",
    placement: "right",
  },
  /* ── 12  Pipeline — follow-up ── */
  {
    target: "nav-pipeline",
    title: "Follow-up intelligenti",
    body: "Ogni trattativa ha una data di follow-up. Se scade, OCRA segnala il ritardo nella dashboard e può inviare un reminder. Nessun prospect dimenticato.",
    placement: "right",
  },

  /* ── AI STUDIO (sidebar) ── */
  /* ── 13 ── */
  {
    target: "nav-studio",
    title: "AI Studio",
    body: "Il cuore dell'intelligenza artificiale. Quattro strumenti: verbali riunioni, preventivi, analisi bandi e scrittura progetti — tutti alimentati da Claude.",
    placement: "right",
  },
  /* ── 14  AI Studio — verbali ── */
  {
    target: "nav-studio",
    title: "Verbali AI",
    body: "Fireflies registra la riunione, Claude la trasforma in verbale strutturato con decisioni, azioni e responsabili. In 15 secondi, non in un'ora.",
    placement: "right",
  },
  /* ── 15  AI Studio — preventivi ── */
  {
    target: "nav-studio",
    title: "Preventivi AI",
    body: "Seleziona i servizi, indica il cliente e le specifiche. Claude genera un preventivo professionale personalizzato, pronto da esportare in PDF.",
    placement: "right",
  },
  /* ── 16  AI Studio — bandi ── */
  {
    target: "nav-studio",
    title: "Analisi bandi",
    body: "Incolla il bando, Claude analizza requisiti e opportunità in base al profilo dell'agenzia. Score di pertinenza e suggerimenti operativi in pochi secondi.",
    placement: "right",
  },

  /* ── OPERATIVO (sidebar) ── */
  /* ── 17 ── */
  {
    target: "nav-operativo",
    title: "Operativo",
    body: "Contabilità, scadenziario e flussi di cassa. Fatture in entrata e uscita, solleciti automatici per insoluti e generatore di codici PO.",
    placement: "right",
  },
  /* ── 18  Operativo — previsione cassa ── */
  {
    target: "nav-operativo",
    title: "Previsione di cassa",
    body: "Grafico a 8 settimane: entrate attese vs uscite previste. Saldo netto calcolato automaticamente dalle fatture aperte. Sempre aggiornato.",
    placement: "right",
  },
  /* ── 19  Operativo — solleciti ── */
  {
    target: "nav-operativo",
    title: "Solleciti automatici",
    body: "A 7 giorni dalla scadenza parte il primo sollecito, a 21 il secondo con il responsabile in copia. Il testo si può rivedere prima dell'invio.",
    placement: "right",
  },

  /* ── 20  Integrations ── */
  {
    target: "integrations-panel",
    title: "Integrazioni attive",
    body: "Fireflies per le trascrizioni, Google Workspace per Drive e calendario, n8n per le automazioni. Tutto collegato e sincronizzato.",
    placement: "right",
  },

  /* ── 21  Finale ── */
  {
    target: null,
    title: "Tutto tuo",
    body: "Ogni sezione è interattiva — trascina le trattative, spunta le azioni, genera documenti con l'AI. OCRA lavora per te. Buon lavoro.",
  },
];

/* ── Context ── */
const TourCtx = React.createContext<{ start: () => void }>({ start: () => {} });
export const useTour = () => React.useContext(TourCtx);

/* ── Provider ── */
export function TourProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [step, setStep] = React.useState(-1);
  const [rect, setRect] = React.useState<DOMRect | null>(null);
  const active = step >= 0;
  const current = active ? STEPS[step] : null;

  /* Measure target element */
  React.useEffect(() => {
    if (!current?.target) { setRect(null); return; }
    const el = document.querySelector(`[data-tour="${current.target}"]`);
    if (!el) {
      // Target not found — skip this step
      setStep((s) => (s < STEPS.length - 1 ? s + 1 : -1));
      return;
    }
    const measure = () => setRect(el.getBoundingClientRect());
    measure();
    // Scroll into view
    el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    const raf = requestAnimationFrame(measure);

    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [step, current?.target]);

  /* Keyboard: Escape = close, ArrowRight/Left = nav */
  React.useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  /* Auto-start on first visit to /dashboard */
  React.useEffect(() => {
    if (pathname !== "/dashboard") return;
    try {
      if (localStorage.getItem("ocra.tour.done")) return;
    } catch { return; }
    const t = setTimeout(() => setStep(0), 900);
    return () => clearTimeout(t);
  }, [pathname]);

  const start = React.useCallback(() => setStep(0), []);

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else close();
  };

  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  const close = () => {
    setStep(-1);
    setRect(null);
    try { localStorage.setItem("ocra.tour.done", "1"); } catch {}
  };

  return (
    <TourCtx.Provider value={{ start }}>
      {children}
      {active && current && (
        <Overlay
          key={step}
          step={step}
          total={STEPS.length}
          current={current}
          rect={rect}
          onNext={next}
          onPrev={prev}
          onSkip={close}
          isFirst={step === 0}
          isLast={step === STEPS.length - 1}
        />
      )}
    </TourCtx.Provider>
  );
}

/* ── Section labels for grouping progress ── */
const SECTIONS = [
  { from: 0, to: 1, label: "Intro" },
  { from: 2, to: 8, label: "Dashboard" },
  { from: 9, to: 10, label: "Clienti" },
  { from: 11, to: 12, label: "Pipeline" },
  { from: 13, to: 16, label: "AI Studio" },
  { from: 17, to: 19, label: "Operativo" },
  { from: 20, to: 20, label: "Integrazioni" },
  { from: 21, to: 21, label: "Finale" },
];

function getSectionLabel(step: number): string {
  const s = SECTIONS.find((sec) => step >= sec.from && step <= sec.to);
  return s?.label ?? "";
}

/* ── Overlay + Spotlight + Tooltip ── */
function Overlay({
  step, total, current, rect, onNext, onPrev, onSkip, isFirst, isLast,
}: {
  step: number; total: number; current: Step; rect: DOMRect | null;
  onNext: () => void; onPrev: () => void; onSkip: () => void; isFirst: boolean; isLast: boolean;
}) {
  const PAD = 10;
  const GAP = 16;
  const isCenter = !current.target || !rect;

  const tooltipPos = React.useMemo((): React.CSSProperties => {
    if (isCenter) return { left: "50%", top: "50%", transform: "translate(-50%, -50%)" };
    const p = current.placement || "bottom";
    const base: React.CSSProperties = { maxWidth: 380 };
    switch (p) {
      case "bottom":
        return { ...base, left: rect!.left + rect!.width / 2, top: rect!.bottom + PAD + GAP, transform: "translateX(-50%)" };
      case "top":
        return { ...base, left: rect!.left + rect!.width / 2, bottom: window.innerHeight - rect!.top + PAD + GAP, transform: "translateX(-50%)" };
      case "right":
        return { ...base, left: rect!.right + PAD + GAP, top: rect!.top + rect!.height / 2, transform: "translateY(-50%)" };
      case "left":
        return { ...base, right: window.innerWidth - rect!.left + PAD + GAP, top: rect!.top + rect!.height / 2, transform: "translateY(-50%)" };
    }
  }, [isCenter, rect, current.placement]);

  const sectionLabel = getSectionLabel(step);

  return (
    <>
      {/* Click blocker layer */}
      <div style={{ position: "fixed", inset: 0, zIndex: 9997 }} />

      {/* Dark overlay — centered variant */}
      {isCenter && (
        <div
          className="tour-overlay-bg"
          style={{ position: "fixed", inset: 0, zIndex: 9998, pointerEvents: "none" }}
        />
      )}

      {/* Spotlight cutout — targeted variant */}
      {!isCenter && rect && (
        <div
          className="tour-spotlight"
          style={{
            position: "fixed", zIndex: 9998, pointerEvents: "none",
            left: rect.left - PAD, top: rect.top - PAD,
            width: rect.width + PAD * 2, height: rect.height + PAD * 2,
          }}
        />
      )}

      {/* Tooltip card */}
      <div className="tour-tooltip" style={{ position: "fixed", zIndex: 9999, width: isCenter ? 440 : 380, ...tooltipPos }}>
        {/* Progress header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <span
            style={{
              fontSize: 10, fontWeight: 600, letterSpacing: "0.06em",
              textTransform: "uppercase", color: "var(--brand)",
            }}
          >
            {sectionLabel}
          </span>
          <span className="t-meta">{step + 1}/{total}</span>
        </div>

        {/* Segmented progress bar */}
        <div style={{ display: "flex", gap: 2, height: 3, marginBottom: 16, borderRadius: 2, overflow: "hidden" }}>
          {SECTIONS.map((sec) => {
            const width = ((sec.to - sec.from + 1) / total) * 100;
            const filled = step >= sec.to ? 100 : step >= sec.from ? ((step - sec.from + 1) / (sec.to - sec.from + 1)) * 100 : 0;
            return (
              <div
                key={sec.label}
                style={{
                  width: `${width}%`, background: "var(--line-2)", borderRadius: 2,
                  overflow: "hidden", position: "relative",
                }}
              >
                <div
                  style={{
                    width: `${filled}%`, height: "100%", background: "var(--brand)",
                    borderRadius: 2, transition: "width .35s ease",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Content */}
        <h3 className="tour-title">{current.title}</h3>
        <p className="tour-body">{current.body}</p>

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>
          <div style={{ display: "flex", gap: 6 }}>
            <button className="btn btn-ghost btn-sm" onClick={onSkip}>
              {isLast ? "Chiudi" : "Salta tour"}
            </button>
            {!isFirst && (
              <button className="btn btn-ghost btn-sm" onClick={onPrev}>
                ← Indietro
              </button>
            )}
          </div>
          <button className="btn btn-brand btn-sm" onClick={onNext}>
            {isFirst ? "Inizia →" : isLast ? "Esplora ✦" : "Avanti →"}
          </button>
        </div>
      </div>

      {/* Confetti on last step */}
      {isLast && <Confetti />}
    </>
  );
}

/* ── Confetti ── */
const COLORS = ["#e85d24", "#17795e", "#2b5ba8", "#a8620a", "#f5a623"];

function Confetti() {
  const particles = React.useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.8,
        duration: 1.8 + Math.random() * 1.5,
        color: COLORS[i % COLORS.length],
        size: 5 + Math.random() * 5,
        drift: (Math.random() - 0.5) * 120,
      })),
    [],
  );

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 10000, pointerEvents: "none", overflow: "hidden" }}>
      {particles.map((p) => (
        <span
          key={p.id}
          className="tour-confetti"
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: -12,
            width: p.size,
            height: p.size * 0.6,
            background: p.color,
            borderRadius: 2,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            ["--drift" as string]: `${p.drift}px`,
          }}
        />
      ))}
    </div>
  );
}
TOUREOF
echo "    ✓ tour.tsx (22 step, progress bar segmentata, pulsante indietro)"


# ─────────────────────────────────────────────────
# 2. Edit sidebar.tsx — aggiunge data-tour ai link nav + integrazioni
# ─────────────────────────────────────────────────
echo "[2/3] Aggiorno sidebar.tsx..."
python3 << 'PYEOF'
import sys

f = "src/components/layout/sidebar.tsx"
with open(f, "r") as fh:
    src = fh.read()

# 2a. Aggiungi tour id al NAV array
old_nav = '''const NAV = [
  { href: "/dashboard", label: "Dashboard", hint: "Oggi", icon: Grid },
  { href: "/clienti", label: "Clienti", hint: "Anagrafica e progetti", icon: Users },
  { href: "/pipeline", label: "Pipeline", hint: "Trattative", icon: Funnel },
  { href: "/studio", label: "AI Studio", hint: "Verbali, preventivi, bandi", icon: Spark },
  { href: "/operativo", label: "Operativo", hint: "Contabilità e scadenze", icon: Ledger },
];'''

new_nav = '''const NAV = [
  { href: "/dashboard", label: "Dashboard", hint: "Oggi", icon: Grid, tour: "nav-dashboard" },
  { href: "/clienti", label: "Clienti", hint: "Anagrafica e progetti", icon: Users, tour: "nav-clienti" },
  { href: "/pipeline", label: "Pipeline", hint: "Trattative", icon: Funnel, tour: "nav-pipeline" },
  { href: "/studio", label: "AI Studio", hint: "Verbali, preventivi, bandi", icon: Spark, tour: "nav-studio" },
  { href: "/operativo", label: "Operativo", hint: "Contabilità e scadenze", icon: Ledger, tour: "nav-operativo" },
];'''

if old_nav in src:
    src = src.replace(old_nav, new_nav)
elif "tour: \"nav-dashboard\"" in src:
    print("  (NAV tour ids already present)")
else:
    print("ERROR: Cannot find NAV array to patch", file=sys.stderr)
    sys.exit(1)

# 2b. Aggiungi data-tour al Link element
old_link = '{NAV.map(({ href, label, hint, icon: Icon }) => {'
new_link = '{NAV.map(({ href, label, hint, icon: Icon, tour: tourId }) => {'
if old_link in src:
    src = src.replace(old_link, new_link)

old_link2 = '''<Link
              key={href}
              href={href}
              className="flex items-center gap-2.5'''
new_link2 = '''<Link
              key={href}
              href={href}
              data-tour={tourId}
              className="flex items-center gap-2.5'''
if old_link2 in src and 'data-tour={tourId}' not in src:
    src = src.replace(old_link2, new_link2)

# 2c. Aggiungi data-tour="integrations-panel" al pannello integrazioni
old_int = '{/* Stato integrazioni */}\n      <div className="px-4 py-3 mx-2.5 mb-2 rounded-[10px]" style={{ background: "#191a1e" }}>'
new_int = '{/* Stato integrazioni */}\n      <div className="px-4 py-3 mx-2.5 mb-2 rounded-[10px]" data-tour="integrations-panel" style={{ background: "#191a1e" }}>'
if 'data-tour="integrations-panel"' not in src:
    src = src.replace(old_int, new_int)

with open(f, "w") as fh:
    fh.write(src)

print("    ✓ sidebar.tsx (data-tour su nav links + integrazioni)")
PYEOF


# ─────────────────────────────────────────────────
# 3. Edit dashboard/page.tsx — aggiunge data-tour wrapper ai pannelli
# ─────────────────────────────────────────────────
echo "[3/3] Aggiorno dashboard/page.tsx..."
python3 << 'PYEOF'
import sys

f = "src/app/(dashboard)/dashboard/page.tsx"
with open(f, "r") as fh:
    src = fh.read()

changes = 0

# 3a. Wrap "Ultimo verbale" panel
old_verb = '''          {ultimoVerbale && (
            <Panel
              title="Ultimo verbale generato"'''
new_verb = '''          {ultimoVerbale && (
            <div data-tour="verbale-panel">
            <Panel
              title="Ultimo verbale generato"'''
if 'data-tour="verbale-panel"' not in src:
    if old_verb in src:
        src = src.replace(old_verb, new_verb)
        changes += 1
    else:
        print("WARN: Cannot find verbale panel to wrap", file=sys.stderr)

# Close verbale wrapper + open progetti wrapper
old_close_verb = '''            </Panel>
          )}

          <Panel title="Progetti in corso"'''
new_close_verb = '''            </Panel>
            </div>
          )}

          <div data-tour="progetti-panel">
          <Panel title="Progetti in corso"'''
if 'data-tour="progetti-panel"' not in src:
    if old_close_verb in src:
        src = src.replace(old_close_verb, new_close_verb)
        changes += 1

# Close progetti wrapper before lateral column
old_close_proj = '''          </Panel>
        </div>

        {/* ── Colonna laterale ── */}
        <div className="space-y-5">
          <Panel title="Riunioni">'''
new_close_proj = '''          </Panel>
          </div>
        </div>

        {/* ── Colonna laterale ── */}
        <div className="space-y-5">
          <div data-tour="riunioni-panel">
          <Panel title="Riunioni">'''
if 'data-tour="riunioni-panel"' not in src:
    if old_close_proj in src:
        src = src.replace(old_close_proj, new_close_proj)
        changes += 1

# Close riunioni wrapper + open funnel wrapper
old_close_riun = '''          </Panel>

          <Panel title="Funnel">'''
new_close_riun = '''          </Panel>
          </div>

          <div data-tour="funnel-panel">
          <Panel title="Funnel">'''
if 'data-tour="funnel-panel"' not in src:
    if old_close_riun in src:
        src = src.replace(old_close_riun, new_close_riun)
        changes += 1

# Close funnel wrapper + open incassi wrapper
old_close_fun = '''          </Panel>

          <Panel title="Incassi attesi">'''
new_close_fun = '''          </Panel>
          </div>

          <div data-tour="incassi-panel">
          <Panel title="Incassi attesi">'''
if 'data-tour="incassi-panel"' not in src:
    if old_close_fun in src:
        src = src.replace(old_close_fun, new_close_fun)
        changes += 1

# Close incassi wrapper before team card
old_close_inc = '''          </Panel>

          <div className="card card-pad">
            <div className="t-label mb-2">Il team</div>'''
new_close_inc = '''          </Panel>
          </div>

          <div className="card card-pad">
            <div className="t-label mb-2">Il team</div>'''
if old_close_inc in src:
    src = src.replace(old_close_inc, new_close_inc)
    changes += 1

with open(f, "w") as fh:
    fh.write(src)

print(f"    ✓ dashboard/page.tsx ({changes} data-tour wrappers aggiunti)")
PYEOF


echo ""
echo "=== Fatto! ==="
echo ""
echo "Il tour ora ha 22 step organizzati per sezione:"
echo "  • Intro (2 step)"
echo "  • Dashboard (7 step — KPI, attenzione, verbale, progetti, riunioni, funnel, incassi)"
echo "  • Clienti (2 step — anagrafica + onboarding)"
echo "  • Pipeline (2 step — board + follow-up)"
echo "  • AI Studio (4 step — intro, verbali, preventivi, bandi)"
echo "  • Operativo (3 step — intro, previsione cassa, solleciti)"
echo "  • Integrazioni (1 step)"
echo "  • Finale con confetti (1 step)"
echo ""
echo "Novità rispetto a v1:"
echo "  ✦ Progress bar segmentata per sezione (non più pallini)"
echo "  ✦ Label sezione corrente (Dashboard, Clienti, ecc.)"
echo "  ✦ Pulsante ← Indietro"
echo "  ✦ Frecce tastiera: → avanti, ← indietro, Esc chiudi"
echo ""
echo "Per testare:"
echo "  npm run dev"
echo "  (apri /dashboard — il tour parte da solo)"
echo ""
echo "Per committare:"
echo "  git add -A"
echo "  git commit -m 'feat: tour v2 — 22 step con progress segmentata'"
echo "  git push"