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
