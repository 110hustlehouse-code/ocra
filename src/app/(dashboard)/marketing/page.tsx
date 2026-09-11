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
