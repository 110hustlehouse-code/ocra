#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel 2>/dev/null || echo .)"

echo "=== Nuove pagine: Reporting + Marketing (Mail + WhatsApp) ==="
echo ""

mkdir -p .guide-backup
TS=$(date +%s)
for f in "src/components/layout/sidebar.tsx" "src/components/ui/guide.tsx"; do
  if [ -f "$f" ]; then
    cp "$f" ".guide-backup/$(basename "$f").$TS.bak"
  fi
done
echo "[0/4] Backup salvato"

# ══════════════════════════════════════════════════════════════
# 1 — nuova pagina Reporting
# ══════════════════════════════════════════════════════════════
echo "[1/4] Creo src/app/(dashboard)/reporting/page.tsx..."
mkdir -p "src/app/(dashboard)/reporting"

cat > "src/app/(dashboard)/reporting/page.tsx" << 'ENDOFREPORTING'
"use client";

import * as React from "react";
import { Badge, Panel, PageHead } from "@/components/ui/kit";

type Platform = "Instagram" | "Facebook" | "LinkedIn" | "TikTok";
type AdPlatform = "Meta" | "YouTube" | "TikTok";

const SOCIAL: { client: string; platform: Platform; followers: number; growth: number; engagement: number; reach: number }[] = [
  { client: "Festival d'Arte Moderna", platform: "Instagram", followers: 18400, growth: 6.2, engagement: 4.8, reach: 92000 },
  { client: "Studio Creativo Roma", platform: "LinkedIn", followers: 5200, growth: 3.1, engagement: 2.9, reach: 21000 },
  { client: "Indie Records", platform: "Instagram", followers: 31200, growth: 9.4, engagement: 6.1, reach: 145000 },
  { client: "Teatro Moderno", platform: "Facebook", followers: 9800, growth: 1.8, engagement: 2.2, reach: 34000 },
  { client: "Municipio Roma XV", platform: "Facebook", followers: 12600, growth: 2.4, engagement: 1.9, reach: 41000 },
];

const WEB = [
  { client: "Studio Creativo Roma", sessions: 8400, pageviews: 21300, avgDuration: "2:14", conversionRate: 3.2 },
  { client: "Festival d'Arte Moderna", sessions: 15200, pageviews: 39800, avgDuration: "3:02", conversionRate: 5.1 },
  { client: "Indie Records", sessions: 6100, pageviews: 14200, avgDuration: "1:48", conversionRate: 2.6 },
];

const CAMPAGNE = [
  { name: "Lancio 'Notte Blu'", client: "Indie Records", channel: "Meta + TikTok", budget: 1800, spent: 1240, results: "48.000 impression · 620 click", status: "attiva" as const },
  { name: "Festival d'Arte — awareness", client: "Festival d'Arte Moderna", channel: "Meta + Instagram", budget: 3200, spent: 2890, results: "112.000 reach · 3,1% CTR", status: "attiva" as const },
  { name: "Growth Q4", client: "Studio Creativo Roma", channel: "Meta", budget: 900, spent: 300, results: "avviata da 4 giorni", status: "attiva" as const },
  { name: "Evento Teatro Moderno", client: "Teatro Moderno", channel: "Facebook", budget: 600, spent: 600, results: "18.500 reach · 210 conversioni", status: "conclusa" as const },
];

const ADV: { platform: AdPlatform; spend: number; impressions: number; ctr: number; roas: number }[] = [
  { platform: "Meta", spend: 4430, impressions: 312000, ctr: 2.1, roas: 3.4 },
  { platform: "YouTube", spend: 1200, impressions: 88000, ctr: 1.4, roas: 2.1 },
  { platform: "TikTok", spend: 1800, impressions: 145000, ctr: 3.2, roas: 4.0 },
];

const ROI = [
  { client: "Festival d'Arte Moderna", investment: 3900, result: 14200 },
  { client: "Indie Records", investment: 1800, result: 6100 },
  { client: "Studio Creativo Roma", investment: 1200, result: 3100 },
  { client: "Teatro Moderno", investment: 600, result: 1450 },
];

export default function ReportingPage() {
  const spesaTotale = ADV.reduce((a, x) => a + x.spend, 0);
  const roasMedio = (ADV.reduce((a, x) => a + x.roas, 0) / ADV.length).toFixed(1);
  const reachTotale = SOCIAL.reduce((a, x) => a + x.reach, 0);
  const conversioniTotali = WEB.reduce((a, x) => a + Math.round((x.sessions * x.conversionRate) / 100), 0);

  return (
    <div className="rise">
      <PageHead title="Reporting" sub="Performance social, web e campagne — dati aggregati su tutti i clienti" />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-5" data-guide="reporting-kpi">
        <div className="card card-pad">
          <div className="t-label">Reach totale</div>
          <div className="text-[22px] font-semibold mt-1.5">{reachTotale.toLocaleString("it-IT")}</div>
          <div className="t-meta mt-1">ultimi 30 giorni</div>
        </div>
        <div className="card card-pad">
          <div className="t-label">Spesa ADV</div>
          <div className="text-[22px] font-semibold mt-1.5">€{spesaTotale.toLocaleString("it-IT")}</div>
          <div className="t-meta mt-1">Meta + YouTube + TikTok</div>
        </div>
        <div className="card card-pad">
          <div className="t-label">ROAS medio</div>
          <div className="text-[22px] font-semibold mt-1.5" style={{ color: "var(--ok)" }}>{roasMedio}x</div>
          <div className="t-meta mt-1">ritorno su spesa pubblicitaria</div>
        </div>
        <div className="card card-pad">
          <div className="t-label">Conversioni web</div>
          <div className="text-[22px] font-semibold mt-1.5">{conversioniTotali}</div>
          <div className="t-meta mt-1">stimate su tutti i siti</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
        <div data-guide="reporting-social">
          <Panel title="Social — performance per cliente" action={<span className="t-meta">ultimi 30 giorni</span>}>
            <div className="scroll-x">
              <table className="tbl">
                <thead><tr><th>Cliente</th><th>Canale</th><th>Follower</th><th>Crescita</th><th>Engagement</th><th>Reach</th></tr></thead>
                <tbody>
                  {SOCIAL.map((x, i) => (
                    <tr key={i}>
                      <td className="font-medium">{x.client}</td>
                      <td><Badge tone="neutral">{x.platform}</Badge></td>
                      <td className="tabular">{x.followers.toLocaleString("it-IT")}</td>
                      <td className="tabular" style={{ color: "var(--ok)" }}>+{x.growth}%</td>
                      <td className="tabular">{x.engagement}%</td>
                      <td className="tabular">{x.reach.toLocaleString("it-IT")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>

        <div data-guide="reporting-web">
          <Panel title="Web analytics" action={<span className="t-meta">ultimi 30 giorni</span>}>
            <div className="scroll-x">
              <table className="tbl">
                <thead><tr><th>Cliente</th><th>Sessioni</th><th>Pagine viste</th><th>Durata media</th><th>Conversione</th></tr></thead>
                <tbody>
                  {WEB.map((x, i) => (
                    <tr key={i}>
                      <td className="font-medium">{x.client}</td>
                      <td className="tabular">{x.sessions.toLocaleString("it-IT")}</td>
                      <td className="tabular">{x.pageviews.toLocaleString("it-IT")}</td>
                      <td className="tabular">{x.avgDuration}</td>
                      <td className="tabular">{x.conversionRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>
      </div>

      <div className="mb-5" data-guide="reporting-campagne">
        <Panel title="Performance campagne" action={<span className="t-meta">{CAMPAGNE.filter((c) => c.status === "attiva").length} attive</span>}>
          <div className="scroll-x">
            <table className="tbl">
              <thead><tr><th>Campagna</th><th>Cliente</th><th>Canale</th><th>Budget</th><th>Speso</th><th>Risultati</th><th>Stato</th></tr></thead>
              <tbody>
                {CAMPAGNE.map((c, i) => (
                  <tr key={i}>
                    <td className="font-medium">{c.name}</td>
                    <td style={{ color: "var(--text-2)" }}>{c.client}</td>
                    <td className="t-meta">{c.channel}</td>
                    <td className="tabular">€{c.budget.toLocaleString("it-IT")}</td>
                    <td className="tabular">€{c.spent.toLocaleString("it-IT")}</td>
                    <td className="t-meta">{c.results}</td>
                    <td>{c.status === "attiva" ? <Badge tone="brand" dot>Attiva</Badge> : <Badge tone="ok" dot>Conclusa</Badge>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div data-guide="reporting-adv">
          <Panel title="ADV per piattaforma" action={<span className="t-meta">mese in corso</span>}>
            <div className="scroll-x">
              <table className="tbl">
                <thead><tr><th>Piattaforma</th><th>Spesa</th><th>Impression</th><th>CTR</th><th>ROAS</th></tr></thead>
                <tbody>
                  {ADV.map((x, i) => (
                    <tr key={i}>
                      <td className="font-medium">{x.platform}</td>
                      <td className="tabular">€{x.spend.toLocaleString("it-IT")}</td>
                      <td className="tabular">{x.impressions.toLocaleString("it-IT")}</td>
                      <td className="tabular">{x.ctr}%</td>
                      <td className="tabular" style={{ color: "var(--ok)" }}>{x.roas}x</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>

        <div data-guide="reporting-roi">
          <Panel title="ROI aggregato per cliente" action={<span className="t-meta">investimento vs risultato</span>}>
            <div className="scroll-x">
              <table className="tbl">
                <thead><tr><th>Cliente</th><th>Investimento</th><th>Risultato</th><th>ROI</th></tr></thead>
                <tbody>
                  {ROI.map((x, i) => {
                    const roi = Math.round(((x.result - x.investment) / x.investment) * 100);
                    return (
                      <tr key={i}>
                        <td className="font-medium">{x.client}</td>
                        <td className="tabular">€{x.investment.toLocaleString("it-IT")}</td>
                        <td className="tabular">€{x.result.toLocaleString("it-IT")}</td>
                        <td className="tabular font-medium" style={{ color: "var(--ok)" }}>+{roi}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
ENDOFREPORTING

echo "    ✓ reporting/page.tsx creata"

# ══════════════════════════════════════════════════════════════
# 2 — nuova pagina Marketing (Mail + WhatsApp)
# ══════════════════════════════════════════════════════════════
echo "[2/4] Creo src/app/(dashboard)/marketing/page.tsx..."
mkdir -p "src/app/(dashboard)/marketing"

cat > "src/app/(dashboard)/marketing/page.tsx" << 'ENDOFMARKETING'
"use client";

import * as React from "react";
import { Badge, Panel, PageHead } from "@/components/ui/kit";

const LISTE = [
  { segment: "Clienti attivi", contatti: 84 },
  { segment: "Lead pipeline", contatti: 132 },
  { segment: "Artisti St'Art Factory", contatti: 46 },
  { segment: "Newsletter generale", contatti: 310 },
];

const EMAIL_CAMPAGNE = [
  { name: "Newsletter settembre", segmento: "Newsletter generale", data: "2026-09-05", inviate: 310, apertura: 34.2, click: 6.1, status: "inviata" as const },
  { name: "Follow-up post evento Teatro", segmento: "Lead pipeline", data: "2026-09-09", inviate: 132, apertura: 41.5, click: 9.8, status: "inviata" as const },
  { name: "Aggiornamento bandi settembre", segmento: "Artisti St'Art Factory", data: "2026-09-11", inviate: 46, apertura: 52.1, click: 15.2, status: "inviata" as const },
  { name: "Promemoria rinnovo contratti", segmento: "Clienti attivi", data: "2026-09-14", inviate: 0, apertura: 0, click: 0, status: "programmata" as const },
];

const WHATSAPP_FLOW = [
  { name: "Conferma appuntamento", trigger: "Nuova riunione in calendario", inviati: 18, status: "attivo" as const },
  { name: "Promemoria scadenza fattura", trigger: "7 giorni prima della scadenza", inviati: 9, status: "attivo" as const },
  { name: "Follow-up trattativa", trigger: "Nessun contatto da 5 giorni", inviati: 12, status: "attivo" as const },
  { name: "Onboarding nuovo cliente", trigger: "Cliente creato in anagrafica", inviati: 3, status: "attivo" as const },
  { name: "Check-in progetto", trigger: "Ogni 2 settimane, progetto attivo", inviati: 6, status: "in pausa" as const },
];

export default function MarketingPage() {
  const contattiTotali = LISTE.reduce((a, x) => a + x.contatti, 0);
  const emailInviate = EMAIL_CAMPAGNE.reduce((a, x) => a + x.inviate, 0);
  const aperturaMedia = (
    EMAIL_CAMPAGNE.filter((x) => x.inviate > 0).reduce((a, x) => a + x.apertura, 0) /
    Math.max(1, EMAIL_CAMPAGNE.filter((x) => x.inviate > 0).length)
  ).toFixed(1);
  const whatsappInviati = WHATSAPP_FLOW.reduce((a, x) => a + x.inviati, 0);

  return (
    <div className="rise">
      <PageHead title="Marketing" sub="Email marketing e automazioni WhatsApp, segmentate per lista e cliente" />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-5" data-guide="marketing-kpi">
        <div className="card card-pad">
          <div className="t-label">Contatti in lista</div>
          <div className="text-[22px] font-semibold mt-1.5">{contattiTotali}</div>
          <div className="t-meta mt-1">su {LISTE.length} segmenti</div>
        </div>
        <div className="card card-pad">
          <div className="t-label">Email inviate</div>
          <div className="text-[22px] font-semibold mt-1.5">{emailInviate}</div>
          <div className="t-meta mt-1">questo mese</div>
        </div>
        <div className="card card-pad">
          <div className="t-label">Apertura media</div>
          <div className="text-[22px] font-semibold mt-1.5" style={{ color: "var(--ok)" }}>{aperturaMedia}%</div>
          <div className="t-meta mt-1">sulle campagne inviate</div>
        </div>
        <div className="card card-pad">
          <div className="t-label">WhatsApp automatici</div>
          <div className="text-[22px] font-semibold mt-1.5">{whatsappInviati}</div>
          <div className="t-meta mt-1">messaggi questo mese</div>
        </div>
      </div>

      <div className="mb-5" data-guide="marketing-liste">
        <Panel title="Liste segmentate" action={<span className="t-meta">{LISTE.length} segmenti</span>}>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 px-5 py-4">
            {LISTE.map((l, i) => (
              <div key={i} className="rounded-[9px] px-3 py-2.5" style={{ background: "var(--surface-2)" }}>
                <div className="t-label mb-1">{l.segment}</div>
                <div className="text-[16px] font-semibold tabular">{l.contatti}</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mb-5" data-guide="marketing-email">
        <Panel title="Campagne email" action={<span className="t-meta">{EMAIL_CAMPAGNE.length} campagne</span>}>
          <div className="scroll-x">
            <table className="tbl">
              <thead><tr><th>Campagna</th><th>Segmento</th><th>Data</th><th>Inviate</th><th>Apertura</th><th>Click</th><th>Stato</th></tr></thead>
              <tbody>
                {EMAIL_CAMPAGNE.map((c, i) => (
                  <tr key={i}>
                    <td className="font-medium">{c.name}</td>
                    <td style={{ color: "var(--text-2)" }}>{c.segmento}</td>
                    <td className="t-meta">{c.data}</td>
                    <td className="tabular">{c.inviate || "—"}</td>
                    <td className="tabular">{c.inviate ? `${c.apertura}%` : "—"}</td>
                    <td className="tabular">{c.inviate ? `${c.click}%` : "—"}</td>
                    <td>{c.status === "inviata" ? <Badge tone="ok" dot>Inviata</Badge> : <Badge tone="warn" dot>Programmata</Badge>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>

      <div data-guide="marketing-whatsapp">
        <Panel title="Automazioni WhatsApp" action={<Badge tone="brand">automatico</Badge>}>
          <div className="px-2 py-2">
            {WHATSAPP_FLOW.map((w, i) => (
              <div key={i} className="flex items-center gap-4 px-3 py-2.5 border-b last:border-0" style={{ borderColor: "var(--line-2)" }}>
                <div className="flex-1 min-w-0">
                  <div className="text-[12.5px] font-medium">{w.name}</div>
                  <div className="t-meta mt-0.5">Trigger: {w.trigger}</div>
                </div>
                <span className="t-meta shrink-0 tabular">{w.inviati} inviati</span>
                <span className="shrink-0">
                  {w.status === "attivo" ? <Badge tone="ok" dot>Attivo</Badge> : <Badge tone="neutral" dot>In pausa</Badge>}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
ENDOFMARKETING

echo "    ✓ marketing/page.tsx creata"

# ══════════════════════════════════════════════════════════════
# 3 — sidebar.tsx: aggiunge le 2 nuove voci di navigazione
# ══════════════════════════════════════════════════════════════
echo "[3/4] Aggiorno sidebar.tsx..."

python3 << 'ENDPY'
path = "src/components/layout/sidebar.tsx"
with open(path) as f:
    c = f.read()

n = 0

if '"/reporting"' in c:
    print("    ✓ voci già presenti")
else:
    old = '''  { href: "/operativo", label: "Operativo", hint: "Contabilità e scadenze", icon: Ledger },
];'''
    new = '''  { href: "/operativo", label: "Operativo", hint: "Contabilità e scadenze", icon: Ledger },
  { href: "/reporting", label: "Reporting", hint: "Social, web, campagne", icon: Chart },
  { href: "/marketing", label: "Marketing", hint: "Email e WhatsApp", icon: Mail },
];'''
    if old in c:
        c = c.replace(old, new, 1); n += 1
        print("    + Reporting e Marketing aggiunti al NAV")

    old = '''function Calendar({ active }: IP) {
  return (
    <svg {...S(active)}>
      <rect x="2" y="3" width="12" height="11" rx="1.5" />
      <path d="M2 6.5h12M5 1.5v3M11 1.5v3M5 9h2M9 9h2M5 11.5h2" />
    </svg>
  );
}'''
    new = old + '''

function Chart({ active }: IP) {
  return (
    <svg {...S(active)}>
      <path d="M2 13.5h12" />
      <rect x="3.5" y="8" width="2.4" height="5.5" rx="0.6" />
      <rect x="6.8" y="4.5" width="2.4" height="9" rx="0.6" />
      <rect x="10.1" y="6.5" width="2.4" height="7" rx="0.6" />
    </svg>
  );
}
function Mail({ active }: IP) {
  return (
    <svg {...S(active)}>
      <rect x="2" y="3.5" width="12" height="9" rx="1.5" />
      <path d="M2.5 4.5l5.5 4.5 5.5-4.5" />
    </svg>
  );
}'''
    if old in c:
        c = c.replace(old, new, 1); n += 1
        print("    + icone Chart e Mail aggiunte")

    with open(path, "w") as f:
        f.write(c)
    print(f"    ✓ sidebar.tsx ({n}/2 modifiche)")
ENDPY

# ══════════════════════════════════════════════════════════════
# 4 — guide.tsx: aggiunge le 2 nuove sezioni al tour (12 step)
# ══════════════════════════════════════════════════════════════
echo "[4/4] Aggiorno guide.tsx (aggiungo Reporting + Marketing al tour)..."

python3 << 'ENDPY'
path = "src/components/ui/guide.tsx"
with open(path) as f:
    c = f.read()

if 'reporting-kpi' in c:
    print("    ✓ già presenti, nessuna modifica necessaria")
else:
    anchor = '''  { page: "/operativo", target: "operativo-po", section: "Operativo", title: "Generatore codice PO", body: "Genera il codice ordine nel formato standard dell'agenzia, pronto da copiare in un click." },
];'''

    insertion = '''  { page: "/operativo", target: "operativo-po", section: "Operativo", title: "Generatore codice PO", body: "Genera il codice ordine nel formato standard dell'agenzia, pronto da copiare in un click." },

  // ── Reporting ──
  {
    page: "/reporting", section: "Reporting",
    title: "Tutti i numeri in un posto solo",
    body: "Performance social, web e campagne pubblicitarie aggregate su tutti i clienti — niente più fogli sparsi tra Meta, Analytics e report manuali.",
    features: [
      "Performance social per cliente: follower, crescita, engagement, reach",
      "Web analytics: sessioni, pagine viste, tasso di conversione",
      "Campagne attive con budget, speso e risultati",
      "ADV su Meta, YouTube e TikTok con ROAS",
      "ROI aggregato per cliente",
    ],
  },
  { page: "/reporting", target: "reporting-kpi", section: "Reporting", title: "I numeri chiave", body: "Reach totale, spesa pubblicitaria, ROAS medio e conversioni web — la fotografia generale in quattro numeri." },
  { page: "/reporting", target: "reporting-social", section: "Reporting", title: "Social per cliente", body: "Follower, crescita ed engagement su Instagram, Facebook e LinkedIn, cliente per cliente." },
  { page: "/reporting", target: "reporting-web", section: "Reporting", title: "Web analytics", body: "Sessioni, pagine viste e tasso di conversione per ogni sito cliente." },
  { page: "/reporting", target: "reporting-campagne", section: "Reporting", title: "Performance campagne", body: "Ogni campagna attiva con budget, speso e risultati — a colpo d'occhio quali stanno rendendo." },
  { page: "/reporting", target: "reporting-adv", section: "Reporting", title: "ADV per piattaforma", body: "Spesa, impression, CTR e ROAS separati per Meta, YouTube e TikTok." },
  { page: "/reporting", target: "reporting-roi", section: "Reporting", title: "ROI per cliente", body: "Investimento contro risultato ottenuto, per capire dove il marketing sta davvero rendendo." },

  // ── Marketing (Email + WhatsApp) ──
  {
    page: "/marketing", section: "Marketing",
    title: "Email e WhatsApp, insieme",
    body: "Le due leve di comunicazione segmentata dell'agenzia in un'unica vista, invece di due strumenti separati.",
    features: [
      "Liste segmentate: clienti, lead, artisti St'Art Factory, newsletter",
      "Campagne email con apertura e click per ogni invio",
      "Automazioni WhatsApp collegate a eventi reali: nuova riunione, fattura in scadenza, follow-up",
      "Tutto tracciato, nessun invio manuale ripetitivo",
    ],
  },
  { page: "/marketing", target: "marketing-kpi", section: "Marketing", title: "I numeri della comunicazione", body: "Contatti totali in lista, email inviate questo mese, apertura media e messaggi WhatsApp automatici partiti da soli." },
  { page: "/marketing", target: "marketing-liste", section: "Marketing", title: "Liste segmentate", body: "Clienti attivi, lead in pipeline, artisti St'Art Factory e newsletter generale — ogni comunicazione parte dal segmento giusto." },
  { page: "/marketing", target: "marketing-email", section: "Marketing", title: "Campagne email", body: "Ogni invio con tasso di apertura e di click, per capire cosa funziona e cosa va rivisto." },
  { page: "/marketing", target: "marketing-whatsapp", section: "Marketing", title: "Automazioni WhatsApp", body: "Messaggi che partono da soli quando succede qualcosa di specifico: una riunione fissata, una fattura in scadenza, un lead silenzioso da 5 giorni." },
];'''

    if anchor in c:
        c = c.replace(anchor, insertion, 1)
        with open(path, "w") as f:
            f.write(c)
        print("    + 12 nuovi step aggiunti (Reporting: 7, Marketing: 5)")
    else:
        print("    ⚠ ATTENZIONE: ancora finale non trovata — guide.tsx potrebbe essere stato modificato. Nessuna modifica applicata.")
ENDPY

echo ""
echo "=== Fatto ==="
echo "  npm run dev"
echo "  → verifica Reporting e Marketing in sidebar, poi il tour completo (sessionStorage.clear())"
