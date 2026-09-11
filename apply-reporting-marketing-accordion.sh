#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel 2>/dev/null || echo .)"

echo "=== Reporting + Marketing: tendine + righe compatte (no scroll laterale) ==="
echo ""

mkdir -p .guide-backup
TS=$(date +%s)
for f in "src/app/(dashboard)/reporting/page.tsx" "src/app/(dashboard)/marketing/page.tsx"; do
  if [ -f "$f" ]; then
    cp "$f" ".guide-backup/$(basename "$f").$TS.bak"
  fi
done
echo "[0/3] Backup salvato"

# ══════════════════════════════════════════════════════════════
# 1 — componente Accordion condiviso
# ══════════════════════════════════════════════════════════════
echo "[1/3] Creo src/components/ui/accordion.tsx..."

cat > src/components/ui/accordion.tsx << 'ENDOFACCORDION'
"use client";

import * as React from "react";

export function Accordion({
  title, meta, defaultOpen = false, dataGuide, children,
}: {
  title: string;
  meta?: React.ReactNode;
  defaultOpen?: boolean;
  dataGuide?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <div className="card overflow-hidden" data-guide={dataGuide}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-5 py-3.5 text-left transition-colors"
        style={{ borderBottom: open ? "1px solid var(--line-2)" : "1px solid transparent" }}
      >
        <span className="flex items-center gap-2.5 min-w-0">
          <span className="text-[13px] font-semibold">{title}</span>
        </span>
        <span className="flex items-center gap-3 shrink-0">
          {meta}
          <svg
            width="14" height="14" viewBox="0 0 16 16" fill="none"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ color: "var(--text-3)", transform: open ? "rotate(180deg)" : "none", transition: "transform .2s ease" }}
          >
            <path d="M4 6l4 4 4-4" />
          </svg>
        </span>
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}
ENDOFACCORDION

echo "    ✓ accordion.tsx creato"

# ══════════════════════════════════════════════════════════════
# 2 — Reporting: sezioni come tendine, tabelle → righe compatte
# ══════════════════════════════════════════════════════════════
echo "[2/3] Riscrivo reporting/page.tsx..."

cat > "src/app/(dashboard)/reporting/page.tsx" << 'ENDOFREPORTING'
"use client";

import * as React from "react";
import { Badge, PageHead } from "@/components/ui/kit";
import { Accordion } from "@/components/ui/accordion";

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

/** Riga compatta: va a capo invece di richiedere scroll laterale. */
function Row({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex flex-wrap items-center gap-x-5 gap-y-1.5 px-5 py-3 border-b last:border-0"
      style={{ borderColor: "var(--line-2)" }}
    >
      {children}
    </div>
  );
}
function Stat({ label, value, tone }: { label: string; value: React.ReactNode; tone?: string }) {
  return (
    <span className="text-[12px]" style={{ color: tone || "var(--text-2)" }}>
      {label} <b className="tabular font-medium" style={{ color: tone || "var(--text)" }}>{value}</b>
    </span>
  );
}

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

      <div className="space-y-3">
        <Accordion title="Social — performance per cliente" dataGuide="reporting-social" meta={<span className="t-meta">{SOCIAL.length} canali</span>}>
          {SOCIAL.map((x, i) => (
            <Row key={i}>
              <span className="font-medium text-[12.5px] min-w-[170px]">{x.client}</span>
              <Badge tone="neutral">{x.platform}</Badge>
              <Stat label="Follower" value={x.followers.toLocaleString("it-IT")} />
              <Stat label="Crescita" value={`+${x.growth}%`} tone="var(--ok)" />
              <Stat label="Engagement" value={`${x.engagement}%`} />
              <Stat label="Reach" value={x.reach.toLocaleString("it-IT")} />
            </Row>
          ))}
        </Accordion>

        <Accordion title="Web analytics" dataGuide="reporting-web" meta={<span className="t-meta">{WEB.length} siti</span>}>
          {WEB.map((x, i) => (
            <Row key={i}>
              <span className="font-medium text-[12.5px] min-w-[170px]">{x.client}</span>
              <Stat label="Sessioni" value={x.sessions.toLocaleString("it-IT")} />
              <Stat label="Pagine viste" value={x.pageviews.toLocaleString("it-IT")} />
              <Stat label="Durata media" value={x.avgDuration} />
              <Stat label="Conversione" value={`${x.conversionRate}%`} />
            </Row>
          ))}
        </Accordion>

        <Accordion title="Performance campagne" dataGuide="reporting-campagne" meta={<span className="t-meta">{CAMPAGNE.filter((c) => c.status === "attiva").length} attive</span>}>
          {CAMPAGNE.map((c, i) => (
            <Row key={i}>
              <span className="font-medium text-[12.5px] min-w-[170px]">{c.name}</span>
              <span className="t-meta">{c.client}</span>
              <span className="t-meta">{c.channel}</span>
              <Stat label="Budget" value={`€${c.budget.toLocaleString("it-IT")}`} />
              <Stat label="Speso" value={`€${c.spent.toLocaleString("it-IT")}`} />
              <span className="t-meta">{c.results}</span>
              {c.status === "attiva" ? <Badge tone="brand" dot>Attiva</Badge> : <Badge tone="ok" dot>Conclusa</Badge>}
            </Row>
          ))}
        </Accordion>

        <Accordion title="ADV per piattaforma" dataGuide="reporting-adv" meta={<span className="t-meta">mese in corso</span>}>
          {ADV.map((x, i) => (
            <Row key={i}>
              <span className="font-medium text-[12.5px] min-w-[170px]">{x.platform}</span>
              <Stat label="Spesa" value={`€${x.spend.toLocaleString("it-IT")}`} />
              <Stat label="Impression" value={x.impressions.toLocaleString("it-IT")} />
              <Stat label="CTR" value={`${x.ctr}%`} />
              <Stat label="ROAS" value={`${x.roas}x`} tone="var(--ok)" />
            </Row>
          ))}
        </Accordion>

        <Accordion title="ROI aggregato per cliente" dataGuide="reporting-roi" meta={<span className="t-meta">investimento vs risultato</span>}>
          {ROI.map((x, i) => {
            const roi = Math.round(((x.result - x.investment) / x.investment) * 100);
            return (
              <Row key={i}>
                <span className="font-medium text-[12.5px] min-w-[170px]">{x.client}</span>
                <Stat label="Investimento" value={`€${x.investment.toLocaleString("it-IT")}`} />
                <Stat label="Risultato" value={`€${x.result.toLocaleString("it-IT")}`} />
                <Stat label="ROI" value={`+${roi}%`} tone="var(--ok)" />
              </Row>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}
ENDOFREPORTING

echo "    ✓ reporting/page.tsx aggiornata"

# ══════════════════════════════════════════════════════════════
# 3 — Marketing: sezioni come tendine, righe compatte
# ══════════════════════════════════════════════════════════════
echo "[3/3] Riscrivo marketing/page.tsx..."

cat > "src/app/(dashboard)/marketing/page.tsx" << 'ENDOFMARKETING'
"use client";

import * as React from "react";
import { Badge, PageHead } from "@/components/ui/kit";
import { Accordion } from "@/components/ui/accordion";

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

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex flex-wrap items-center gap-x-5 gap-y-1.5 px-5 py-3 border-b last:border-0"
      style={{ borderColor: "var(--line-2)" }}
    >
      {children}
    </div>
  );
}
function Stat({ label, value, tone }: { label: string; value: React.ReactNode; tone?: string }) {
  return (
    <span className="text-[12px]" style={{ color: tone || "var(--text-2)" }}>
      {label} <b className="tabular font-medium" style={{ color: tone || "var(--text)" }}>{value}</b>
    </span>
  );
}

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

      <div className="space-y-3">
        <Accordion title="Liste segmentate" dataGuide="marketing-liste" meta={<span className="t-meta">{LISTE.length} segmenti</span>}>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 px-5 py-4">
            {LISTE.map((l, i) => (
              <div key={i} className="rounded-[9px] px-3 py-2.5" style={{ background: "var(--surface-2)" }}>
                <div className="t-label mb-1">{l.segment}</div>
                <div className="text-[16px] font-semibold tabular">{l.contatti}</div>
              </div>
            ))}
          </div>
        </Accordion>

        <Accordion title="Campagne email" dataGuide="marketing-email" meta={<span className="t-meta">{EMAIL_CAMPAGNE.length} campagne</span>}>
          {EMAIL_CAMPAGNE.map((c, i) => (
            <Row key={i}>
              <span className="font-medium text-[12.5px] min-w-[190px]">{c.name}</span>
              <span className="t-meta">{c.segmento}</span>
              <span className="t-meta">{c.data}</span>
              <Stat label="Inviate" value={c.inviate || "—"} />
              <Stat label="Apertura" value={c.inviate ? `${c.apertura}%` : "—"} />
              <Stat label="Click" value={c.inviate ? `${c.click}%` : "—"} />
              {c.status === "inviata" ? <Badge tone="ok" dot>Inviata</Badge> : <Badge tone="warn" dot>Programmata</Badge>}
            </Row>
          ))}
        </Accordion>

        <Accordion title="Automazioni WhatsApp" dataGuide="marketing-whatsapp" meta={<Badge tone="brand">automatico</Badge>}>
          {WHATSAPP_FLOW.map((w, i) => (
            <Row key={i}>
              <span className="font-medium text-[12.5px] min-w-[190px]">{w.name}</span>
              <span className="t-meta">Trigger: {w.trigger}</span>
              <Stat label="Inviati" value={w.inviati} />
              {w.status === "attivo" ? <Badge tone="ok" dot>Attivo</Badge> : <Badge tone="neutral" dot>In pausa</Badge>}
            </Row>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
ENDOFMARKETING

echo "    ✓ marketing/page.tsx aggiornata"

echo ""
echo "=== Fatto ==="
echo "Gli id data-guide sono rimasti identici (reporting-*, marketing-*),"
echo "quindi il tour funziona senza bisogno di altre modifiche a guide.tsx."
echo ""
echo "  npm run dev"
echo "  → verifica: le sezioni partono chiuse, click per aprire, righe che vanno"
echo "    a capo invece di scorrere lateralmente, anche restringendo la finestra"
