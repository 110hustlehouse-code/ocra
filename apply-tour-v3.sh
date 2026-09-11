#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel 2>/dev/null || echo .)"

echo "=== OCRA Tour v3 — 26 step, 7 aree + progress segmentata ==="
echo ""

# ── Prerequisito: CSS tour deve esistere ──
if ! grep -q "tour-overlay-bg" src/app/globals.css 2>/dev/null; then
  echo "ERROR: Tour CSS mancante in globals.css."
  echo "Verifica che il tour v1 sia stato applicato."
  exit 1
fi

# ══════════════════════════════════════════════════════════════
# STEP 1 — Sovrascrittura completa tour.tsx (26 step)
# ══════════════════════════════════════════════════════════════
echo "[1/3] Sovrascrivo src/components/ui/tour.tsx..."

cat > src/components/ui/tour.tsx << 'ENDOFTOUR'
"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";

/* ── Definizioni step ── */
interface Step { target: string; title: string; body: string }

const STEPS: Step[] = [
  // ── Intro (2) ──
  { target: "sidebar-nav", title: "Benvenuto in OCRA", body: "Il tuo sistema operativo per gestire l’agenzia. Questa guida ti mostra ogni area in 2 minuti." },
  { target: "sidebar-nav", title: "7 aree, tutto connesso", body: "Dashboard · Clienti · Pipeline · Progetti · Contenuti · AI Studio · Operativo — ogni sezione lavora insieme alle altre." },

  // ── Dashboard (7) ──
  { target: "kpi-cards", title: "KPI principali", body: "Incassato, da incassare, pipeline aperta e progetti attivi: i numeri chiave della tua agenzia sempre in vista." },
  { target: "attention-panel", title: "Richiede attenzione", body: "OCRA analizza fatture, progetti e scadenze e ti segnala cosa richiede azione immediata. Ogni avviso ti porta direttamente alla soluzione." },
  { target: "verbale-panel", title: "Ultimo verbale AI", body: "Il verbale più recente generato dall’AI con le azioni da completare. Spunta i task direttamente da qui." },
  { target: "progetti-panel", title: "Progetti in corso", body: "Stato avanzamento, budget consumato e data di consegna per ogni progetto attivo. I colori ti avvisano se qualcosa sfora." },
  { target: "riunioni-panel", title: "Riunioni", body: "Le prossime riunioni in calendario. Fireflies si collega automaticamente per registrare e trascrivere." },
  { target: "funnel-panel", title: "Funnel commerciale", body: "Visualizzazione rapida del valore in ogni fase della pipeline: da primo contatto a proposta inviata." },
  { target: "incassi-panel", title: "Incassi attesi", body: "Fatture in attesa di pagamento ordinate per scadenza. Quelle scadute sono evidenziate in rosso." },

  // ── Clienti (2) ──
  { target: "nav-clienti", title: "Clienti — Anagrafica", body: "Schede cliente complete con dati fiscali, referente, storico progetti e fatturato. Tutto il portafoglio in una vista." },
  { target: "nav-clienti", title: "Clienti — Onboarding", body: "Nuovo cliente? Un form guidato crea la cartella Drive, il board Trello e invia la mail di benvenuto. Tutto automatico." },

  // ── Pipeline (2) ──
  { target: "nav-pipeline", title: "Pipeline — Board", body: "Trascina le trattative tra le fasi: primo contatto, qualificazione, proposta, negoziazione, vinto. Ogni card mostra valore e probabilità." },
  { target: "nav-pipeline", title: "Pipeline — Follow-up", body: "OCRA calcola i giorni dall’ultimo contatto e ti avvisa quando è il momento di ricontattare un lead." },

  // ── Progetti (2) ──
  { target: "nav-progetti", title: "Progetti — Avanzamento", body: "Ogni progetto con milestone, percentuale di completamento, budget consumato e responsabile. Vedi subito cosa è in ritardo." },
  { target: "nav-progetti", title: "Progetti — Timeline", body: "Vista Gantt con le scadenze di consegna. I progetti in scadenza sono evidenziati per priorità." },

  // ── Contenuti (2) ──
  { target: "nav-contenuti", title: "Contenuti — Pipeline editoriale", body: "Gestisci il calendario editoriale: brief, bozze, revisioni, pubblicazione. Ogni contenuto ha stato e scadenza." },
  { target: "nav-contenuti", title: "Contenuti — Distribuzione", body: "Traccia la pubblicazione sui canali: social, blog, newsletter. Vedi cosa è uscito e cosa è in coda." },

  // ── AI Studio (4) ──
  { target: "nav-studio", title: "AI Studio — Verbali", body: "Carica una registrazione o collegati a Fireflies: l’AI genera verbale strutturato, decisioni chiave e action item con scadenze." },
  { target: "nav-studio", title: "AI Studio — Preventivi", body: "Seleziona servizi e cliente, l’AI genera un preventivo professionale personalizzato. Esporta in PDF con il tuo branding." },
  { target: "nav-studio", title: "AI Studio — Bandi", body: "OCRA monitora i bandi pubblici e ti segnala quelli pertinenti ai tuoi servizi. Filtro automatico per pertinenza." },
  { target: "nav-studio", title: "AI Studio — Progetti AI", body: "L’AI ti aiuta a scrivere proposte progettuali partendo dal brief. Genera struttura, budget e timeline." },

  // ── Operativo (3) ──
  { target: "nav-operativo", title: "Operativo — Scadenziario", body: "Tutte le scadenze fiscali e contrattuali in un calendario. Alert automatici prima di ogni scadenza." },
  { target: "nav-operativo", title: "Operativo — Fatture", body: "Registro fatture emesse e ricevute con stato pagamento. Collegato ai progetti per tracciare il cashflow." },
  { target: "nav-operativo", title: "Operativo — Solleciti", body: "Fatture scadute? OCRA prepara il sollecito e lo invia automaticamente. Escalation progressiva configurabile." },

  // ── Integrazioni (1) ──
  { target: "integrations-panel", title: "Integrazioni attive", body: "Fireflies, Google Workspace, n8n e Fatture in Cloud: ogni integrazione mostra il suo stato in tempo reale." },

  // ── Finale (1) ──
  { target: "sidebar-nav", title: "Tutto pronto! 🎉", body: "OCRA è configurato e operativo. Clicca su qualsiasi sezione per iniziare a lavorare. Buon lavoro, Daniele!" },
];

const SECTIONS = [
  { label: "Intro", count: 2 },
  { label: "Dashboard", count: 7 },
  { label: "Clienti", count: 2 },
  { label: "Pipeline", count: 2 },
  { label: "Progetti", count: 2 },
  { label: "Contenuti", count: 2 },
  { label: "AI Studio", count: 4 },
  { label: "Operativo", count: 3 },
  { label: "Integrazioni", count: 1 },
  { label: "Finale", count: 1 },
];

function getSectionLabel(step: number): string {
  let acc = 0;
  for (const s of SECTIONS) {
    acc += s.count;
    if (step < acc) return s.label;
  }
  return "";
}

/* ── Context ── */
interface TourCtx {
  active: boolean; step: number;
  start: () => void; next: () => void; prev: () => void; stop: () => void;
}
const Ctx = createContext<TourCtx>({
  active: false, step: 0, start() {}, next() {}, prev() {}, stop() {},
});
export const useTour = () => useContext(Ctx);

export function TourProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);

  const start = useCallback(() => { setStep(0); setActive(true); }, []);
  const next = useCallback(() =>
    setStep((s) => {
      if (s >= STEPS.length - 1) {
        setActive(false);
        try { localStorage.setItem("ocra.tour.done", "1"); } catch {}
        return 0;
      }
      return s + 1;
    }), []);
  const prev = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);
  const stop = useCallback(() => {
    setActive(false);
    try { localStorage.setItem("ocra.tour.done", "1"); } catch {}
  }, []);

  useEffect(() => {
    try { if (!localStorage.getItem("ocra.tour.done")) start(); } catch {}
  }, [start]);

  return (
    <Ctx.Provider value={{ active, step, start, next, prev, stop }}>
      {children}
      {active && <Overlay step={step} onNext={next} onPrev={prev} onSkip={stop} />}
    </Ctx.Provider>
  );
}

/* ── Overlay ── */
function Overlay({
  step, onNext, onPrev, onSkip,
}: {
  step: number; onNext: () => void; onPrev: () => void; onSkip: () => void;
}) {
  const s = STEPS[step];
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number; w: number; h: number } | null>(null);
  const isLast = step === STEPS.length - 1;

  /* Posiziona spotlight */
  useEffect(() => {
    const el = document.querySelector<HTMLElement>(`[data-tour="${s.target}"]`);
    if (!el) { setPos(null); return; }
    const r = el.getBoundingClientRect();
    const pad = 6;
    setPos({ top: r.top - pad, left: r.left - pad, w: r.width + pad * 2, h: r.height + pad * 2 });
  }, [s.target, step]);

  /* Tastiera */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onSkip();
      else if (e.key === "ArrowRight" || e.key === "Enter") onNext();
      else if (e.key === "ArrowLeft" && step > 0) onPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onNext, onPrev, onSkip, step]);

  /* Confetti ultimo step */
  useEffect(() => {
    if (isLast) {
      const id = setTimeout(() => {
        const el = ref.current?.querySelector(".tour-confetti");
        if (el) el.classList.add("active");
      }, 200);
      return () => clearTimeout(id);
    }
  }, [isLast]);

  if (!pos) return null;

  const tipLeft = Math.min(Math.max(pos.left, 16), window.innerWidth - 370);
  const tipTop = pos.top + pos.h + 14;
  const sectionLabel = getSectionLabel(step);

  return (
    <div ref={ref} className="tour-overlay-bg" onClick={onSkip}>
      {/* Spotlight */}
      <div
        className="tour-spotlight"
        style={{ top: pos.top, left: pos.left, width: pos.w, height: pos.h }}
      />

      {/* Tooltip */}
      <div
        className="tour-tooltip"
        style={{ top: tipTop, left: tipLeft }}
        onClick={(e) => e.stopPropagation()}
      >
        {isLast && <div className="tour-confetti" />}
        <div className="tour-title">{s.title}</div>
        <div className="tour-body">{s.body}</div>

        {/* Barra progresso segmentata */}
        <div style={{ margin: "14px 0 6px" }}>
          <div style={{
            fontSize: "9.5px", fontWeight: 700, letterSpacing: "0.08em",
            textTransform: "uppercase", color: "var(--brand)", marginBottom: 6,
          }}>
            {sectionLabel}
          </div>
          <div style={{ display: "flex", gap: 3 }}>
            {SECTIONS.map((sec, si) => {
              const secStart = SECTIONS.slice(0, si).reduce((a, x) => a + x.count, 0);
              const progress = step < secStart ? 0
                : step >= secStart + sec.count ? 1
                : (step - secStart + 1) / sec.count;
              return (
                <div key={si} style={{
                  flex: sec.count, height: 3, borderRadius: 2,
                  background: "rgba(255,255,255,0.1)", overflow: "hidden",
                }}>
                  <div style={{
                    width: `${progress * 100}%`, height: "100%", borderRadius: 2,
                    background: "var(--brand)", transition: "width .3s ease",
                  }} />
                </div>
              );
            })}
          </div>
          <div style={{
            fontSize: "10.5px", color: "rgba(255,255,255,.45)",
            marginTop: 5, textAlign: "center",
          }}>
            {step + 1} / {STEPS.length}
          </div>
        </div>

        {/* Azioni */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
          {step > 0 ? (
            <button onClick={onPrev} style={{
              background: "none", border: "none", color: "rgba(255,255,255,.5)",
              fontSize: "11.5px", cursor: "pointer", padding: "4px 0",
            }}>
              ← Indietro
            </button>
          ) : <span />}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onSkip} style={{
              background: "none", border: "none", color: "rgba(255,255,255,.45)",
              fontSize: "11.5px", cursor: "pointer", padding: "4px 8px",
            }}>
              Salta
            </button>
            <button onClick={onNext} style={{
              background: "var(--brand)", color: "#fff", border: "none",
              borderRadius: 8, padding: "7px 18px", fontSize: "12px",
              fontWeight: 600, cursor: "pointer",
            }}>
              {isLast ? "Iniziamo!" : "Avanti →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
ENDOFTOUR

echo "    ✓ tour.tsx (26 step, 10 sezioni, progress segmentata)"

# ══════════════════════════════════════════════════════════════
# STEP 2 — Patch sidebar.tsx (tour ids + data-tour + integrazioni)
# ══════════════════════════════════════════════════════════════
echo "[2/3] Aggiorno sidebar.tsx..."

python3 << 'ENDPY'
import re, sys

path = 'src/components/layout/sidebar.tsx'
with open(path, 'r') as f:
    content = f.read()

# Skip if already done
if 'tour: "nav-' in content:
    print("    ✓ sidebar.tsx già aggiornato")
    sys.exit(0)

changes = 0

# 1. Add tour: "nav-xxx" to each NAV entry
# Match lines like: { href: "/dashboard", label: "Dashboard", hint: "Oggi", icon: Grid },
def add_tour_field(m):
    href = m.group(1)
    slug = href.strip('/')
    full = m.group(0)
    idx = full.rfind('}')
    return full[:idx].rstrip() + ', tour: "nav-' + slug + '" }'

content_new, n = re.subn(
    r'\{[^}]*href:\s*"(/[a-z]+)"[^}]*icon:\s*\w+\s*\}',
    add_tour_field,
    content
)
if n > 0:
    content = content_new
    changes += n
    print(f"    + {n} tour ids aggiunti al NAV")
else:
    print("    ⚠ Pattern NAV non trovato — verifica manualmente")
    sys.exit(1)

# 2. Update .map destructuring: add tour: tourId
if 'tour: tourId' not in content:
    content_new = re.sub(
        r'icon:\s*Icon\s*\}\)',
        'icon: Icon, tour: tourId })',
        content,
        count=1
    )
    if content_new != content:
        content = content_new
        changes += 1
        print("    + destructuring .map aggiornato")
    else:
        print("    ⚠ Pattern .map destructuring non trovato")

# 3. Add data-tour={tourId} to <Link>
if 'data-tour={tourId}' not in content:
    content_new = re.sub(
        r'(href=\{href\})\n(\s+)(className=)',
        r'\1\n\2data-tour={tourId}\n\2\3',
        content,
        count=1
    )
    if content_new != content:
        content = content_new
        changes += 1
        print("    + data-tour={tourId} su <Link>")
    else:
        print("    ⚠ Pattern Link href non trovato")

# 4. Add data-tour="integrations-panel" to integrations div
if 'data-tour="integrations-panel"' not in content:
    old_p = 'mx-2.5 mb-2 rounded-[10px]" style='
    new_p = 'mx-2.5 mb-2 rounded-[10px]" data-tour="integrations-panel" style='
    if old_p in content:
        content = content.replace(old_p, new_p, 1)
        changes += 1
        print("    + data-tour su pannello integrazioni")
    else:
        print("    ⚠ Pattern integrazioni non trovato")

with open(path, 'w') as f:
    f.write(content)
print(f"    ✓ sidebar.tsx ({changes} modifiche applicate)")
ENDPY

# ══════════════════════════════════════════════════════════════
# STEP 3 — Patch dashboard/page.tsx (data-tour su pannelli)
# ══════════════════════════════════════════════════════════════
echo "[3/3] Aggiorno dashboard/page.tsx..."

python3 << 'ENDPY'
import re, sys

path = 'src/app/(dashboard)/dashboard/page.tsx'
with open(path, 'r') as f:
    content = f.read()

if 'data-tour="kpi-cards"' in content:
    print("    ✓ dashboard/page.tsx già aggiornato")
    sys.exit(0)

lines = content.split('\n')
changes = 0

# 1. Add data-tour="kpi-cards" to KPI grid div
for idx, line in enumerate(lines):
    if 'grid-cols-4' in line and 'gap-4' in line and 'data-tour' not in line and '<div' in line:
        lines[idx] = line.replace('<div ', '<div data-tour="kpi-cards" ', 1)
        changes += 1
        print("    + data-tour su KPI cards")
        break

# 2. Add data-tour="page-actions" to actions div
for idx, line in enumerate(lines):
    if 'flex items-center gap-2' in line and '<div' in line and 'data-tour' not in line:
        nearby = '\n'.join(lines[max(0,idx-3):idx+5])
        if any(kw in nearby for kw in ['btn', 'AI Studio', 'Nuovo cliente', 'actions']):
            lines[idx] = line.replace('<div ', '<div data-tour="page-actions" ', 1)
            changes += 1
            print("    + data-tour su page actions")
            break

# 3. Wrap Panels with <div data-tour="xxx">
panels = [
    ('Richiede attenzione', 'attention-panel'),
    ('Ultimo verbale generato', 'verbale-panel'),
    ('Progetti in corso', 'progetti-panel'),
    ('Riunioni', 'riunioni-panel'),
    ('Funnel', 'funnel-panel'),
    ('Incassi attesi', 'incassi-panel'),
]

wrap_ops = []
for title, tour_id in panels:
    panel_start = None
    for idx, line in enumerate(lines):
        if f'title="{title}"' in line:
            panel_start = idx
            break

    if panel_start is None:
        print(f"    ⚠ Panel '{title}' non trovato, salto")
        continue

    depth = 0
    panel_end = None
    for idx in range(panel_start, len(lines)):
        if '<Panel' in lines[idx]:
            depth += 1
        if '</Panel>' in lines[idx]:
            depth -= 1
            if depth == 0:
                panel_end = idx
                break

    if panel_end is None:
        print(f"    ⚠ </Panel> per '{title}' non trovato, salto")
        continue

    indent = len(lines[panel_start]) - len(lines[panel_start].lstrip())
    wrap_ops.append((panel_start, panel_end, tour_id, indent))

# Apply wraps in reverse order (so line numbers stay valid)
wrap_ops.sort(key=lambda x: x[0], reverse=True)
for start, end, tour_id, indent in wrap_ops:
    spaces = ' ' * indent
    lines.insert(end + 1, spaces + '</div>')
    lines.insert(start, spaces + '<div data-tour="' + tour_id + '">')
    changes += 1
    print(f'    + wrapper data-tour="{tour_id}"')

content = '\n'.join(lines)
with open(path, 'w') as f:
    f.write(content)
print(f"    ✓ dashboard/page.tsx ({changes} modifiche applicate)")
ENDPY

echo ""
echo "=== Fatto! ==="
echo "  npm run dev     per testare"
echo "  git add -A && git commit -m 'feat: tour v3 — 26 step, 7 aree'"
echo "  git push"
