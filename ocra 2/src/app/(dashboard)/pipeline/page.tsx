"use client";

import * as React from "react";
import { useStore } from "@/lib/demo/store";
import { STAGES, eur, dayMonth, daysFromToday, type Stage } from "@/lib/demo/data";
import { Badge, PageHead, Avatar, Panel } from "@/components/ui/kit";
import { Modal } from "@/components/ui/modal";

export default function PipelinePage() {
  const s = useStore();
  const [dragging, setDragging] = React.useState<string | null>(null);
  const [over, setOver] = React.useState<Stage | null>(null);
  const [won, setWon] = React.useState<string | null>(null);

  const aperte = s.leads.filter((l) => !["vinto", "perso"].includes(l.stage));
  const valore = aperte.reduce((a, l) => a + l.value, 0);
  const vinti = s.leads.filter((l) => l.stage === "vinto");
  const persi = s.leads.filter((l) => l.stage === "perso");
  const winRate = vinti.length + persi.length
    ? Math.round((vinti.length / (vinti.length + persi.length)) * 100) : 0;
  const inRitardo = aperte.filter((l) => l.nextFollowUp && daysFromToday(l.nextFollowUp) < 0);

  const drop = (stage: Stage) => {
    if (!dragging) return;
    const lead = s.leads.find((l) => l.id === dragging);
    s.moveLead(dragging, stage);
    if (stage === "vinto" && lead) setWon(dragging);
    setDragging(null);
    setOver(null);
  };

  const wonLead = s.leads.find((l) => l.id === won);

  return (
    <div className="rise">
      <PageHead
        title="Pipeline"
        sub="Trascina una scheda per cambiare fase. Ogni passaggio aggiorna previsioni e follow-up."
        actions={<button className="btn btn-primary">+ Nuova trattativa</button>}
      />

      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          ["Valore in pipeline", eur(valore), `${aperte.length} trattative aperte`],
          ["Ponderato", eur(Math.round(aperte.reduce((a, l) => a + l.value * weight(l.stage), 0))), "per probabilità di fase"],
          ["Win rate", `${winRate}%`, `${vinti.length} vinte · ${persi.length} perse`],
          ["Follow-up scaduti", String(inRitardo.length), inRitardo.length ? "richiedono azione oggi" : "tutto in pari"],
        ].map(([l, v, sub], i) => (
          <div key={l} className="card card-pad">
            <div className="t-label">{l}</div>
            <div className="text-[21px] font-semibold tabular mt-1.5 tracking-tight"
                 style={i === 3 && inRitardo.length ? { color: "var(--danger)" } : undefined}>{v}</div>
            <div className="t-meta mt-1">{sub}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-3.5" style={{ gridTemplateColumns: `repeat(${STAGES.length}, minmax(0,1fr))` }}>
        {STAGES.map((st) => {
          const items = s.leads.filter((l) => l.stage === st.key);
          const tot = items.reduce((a, l) => a + l.value, 0);
          return (
            <div
              key={st.key}
              onDragOver={(e) => { e.preventDefault(); setOver(st.key); }}
              onDragLeave={() => setOver((o) => (o === st.key ? null : o))}
              onDrop={() => drop(st.key)}
              className="rounded-[12px] p-2 transition-colors min-h-[420px]"
              style={{
                background: over === st.key ? "var(--brand-soft)" : "transparent",
                outline: over === st.key ? "1px dashed var(--brand)" : "1px solid transparent",
              }}
            >
              <div className="flex items-baseline justify-between px-1.5 pb-2">
                <span className="text-[11.5px] font-semibold">{st.label}</span>
                <span className="t-meta tabular">{items.length}</span>
              </div>
              <div className="px-1.5 pb-2.5">
                <div className="t-meta tabular">{eur(tot)}</div>
              </div>

              <div className="space-y-2">
                {items.map((l) => {
                  const gap = l.nextFollowUp ? daysFromToday(l.nextFollowUp) : null;
                  return (
                    <div
                      key={l.id}
                      draggable
                      onDragStart={() => setDragging(l.id)}
                      onDragEnd={() => { setDragging(null); setOver(null); }}
                      className="card p-3 cursor-grab active:cursor-grabbing transition-shadow"
                      style={{
                        opacity: dragging === l.id ? 0.4 : 1,
                        boxShadow: dragging === l.id ? "none" : "0 1px 2px rgba(16,17,20,.04)",
                      }}
                    >
                      <div className="text-[12.5px] font-medium leading-snug">{l.company}</div>
                      <div className="t-meta mt-0.5">{l.contactName}</div>
                      <div className="flex items-center justify-between mt-2.5">
                        <span className="text-[12.5px] font-semibold tabular">{eur(l.value)}</span>
                        <Avatar name={l.owner} size={20} />
                      </div>
                      {gap !== null && st.key !== "vinto" && (
                        <div className="mt-2">
                          <Badge tone={gap < 0 ? "danger" : gap <= 2 ? "warn" : "neutral"} dot>
                            {gap < 0 ? `in ritardo ${-gap}g` : gap === 0 ? "follow-up oggi" : dayMonth(l.nextFollowUp!)}
                          </Badge>
                        </div>
                      )}
                      <div className="t-meta mt-2 leading-snug line-clamp-2">{l.note}</div>
                    </div>
                  );
                })}
                {items.length === 0 && (
                  <div className="text-center py-6 t-meta">— vuoto —</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {persi.length > 0 && (
        <div className="mt-5">
          <Panel title={`Perse (${persi.length})`}>
            <table className="tbl">
              <thead><tr><th>Azienda</th><th>Referente</th><th>Valore</th><th>Motivo</th><th>Ultimo contatto</th></tr></thead>
              <tbody>
                {persi.map((l) => (
                  <tr key={l.id}>
                    <td className="font-medium">{l.company}</td>
                    <td style={{ color: "var(--text-2)" }}>{l.contactName}</td>
                    <td className="tabular">{eur(l.value)}</td>
                    <td className="t-meta">{l.note}</td>
                    <td className="t-meta">{dayMonth(l.lastTouch)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
        </div>
      )}

      <Modal
        open={!!won}
        onClose={() => setWon(null)}
        title="Trattativa vinta"
        sub="Vuoi trasformarla subito in cliente attivo?"
        width={460}
      >
        <div className="card-pad">
          <p className="text-[12.5px] leading-relaxed" style={{ color: "var(--text-2)" }}>
            {wonLead?.company} entra in anagrafica con referente <b className="font-medium">{wonLead?.contactName}</b> e
            passa in stato onboarding. Da lì partono cartella Drive, board Trello, codice PO ed email di benvenuto.
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <button className="btn btn-ghost" onClick={() => setWon(null)}>Non ora</button>
            <button
              className="btn btn-brand"
              onClick={() => { if (won) s.convertLead(won); setWon(null); }}
            >
              Crea cliente
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/** Probabilità di chiusura associata alla fase. */
function weight(stage: Stage) {
  return { lead: 0.1, contatto: 0.25, proposta: 0.5, negoziazione: 0.75, vinto: 1, perso: 0 }[stage];
}
