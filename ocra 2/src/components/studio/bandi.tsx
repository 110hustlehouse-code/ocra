"use client";

import * as React from "react";
import { useStore } from "@/lib/demo/store";
import { dateIt, daysFromToday } from "@/lib/demo/data";
import { Panel, Badge } from "@/components/ui/kit";
import { useStream, Output } from "./output";

export function BandiTab() {
  const s = useStore();
  const [sel, setSel] = React.useState(s.bandi[0]?.id);
  const { text, loading, error, run } = useStream();

  const b = s.bandi.find((x) => x.id === sel);
  const portafoglio = s.clients.map((c) => `${c.companyName} (${c.sector})`).join(", ");

  return (
    <div className="grid grid-cols-[340px_1fr] gap-5 items-start">
      <div className="space-y-4">
        <Panel
          title="Bandi monitorati"
          action={<span className="t-meta">aggiornato oggi</span>}
        >
          <div className="px-2 py-2">
            {s.bandi.map((x) => {
              const left = daysFromToday(x.deadline);
              const active = x.id === sel;
              return (
                <button
                  key={x.id}
                  onClick={() => setSel(x.id)}
                  className="w-full text-left px-3 py-2.5 rounded-[9px] transition-colors"
                  style={{ background: active ? "var(--surface-2)" : "transparent" }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Badge tone={x.relevance === "alta" ? "ok" : x.relevance === "media" ? "warn" : "neutral"} dot>
                      {x.relevance}
                    </Badge>
                    <span className="t-meta ml-auto" style={{ color: left <= 30 ? "var(--warn)" : undefined }}>
                      {left > 0 ? `${left} giorni` : "scaduto"}
                    </span>
                  </div>
                  <div className="text-[12.5px] font-medium leading-snug">{x.name}</div>
                  <div className="t-meta mt-0.5">{x.entity} · {x.amount}</div>
                </button>
              );
            })}
          </div>
        </Panel>

        <div className="card card-pad">
          <div className="t-label mb-2">Ricerca automatica</div>
          <p className="text-[11.5px] leading-relaxed" style={{ color: "var(--text-2)" }}>
            Ogni lunedì un workflow n8n interroga le fonti pubbliche (Camere di Commercio, MIMIT,
            Regione, MiC), filtra per settore e dimensione dei clienti e deposita qui solo i bandi
            compatibili. Il resto lo si legge già valutato.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {b && (
          <Panel
            title={b.name}
            action={
              <div className="flex items-center gap-2">
                <select
                  className="field btn-sm"
                  style={{ height: 28, padding: "0 8px", width: "auto" }}
                  value={b.status}
                  onChange={(e) => s.setBandoStatus(b.id, e.target.value as typeof b.status)}
                >
                  <option value="new">Da valutare</option>
                  <option value="valutazione">In valutazione</option>
                  <option value="in_scrittura">In scrittura</option>
                  <option value="scartato">Scartato</option>
                </select>
                <button
                  className="btn btn-brand btn-sm"
                  disabled={loading}
                  onClick={() => run("/api/ai/bando", {
                    name: b.name, entity: b.entity,
                    description: `${b.why}\nScadenza: ${b.deadline}\nImporto: ${b.amount}\nFonte: ${b.url}`,
                    clients: portafoglio,
                  })}
                >
                  {loading ? "Analisi…" : "Analizza con l'AI"}
                </button>
              </div>
            }
          >
            <div className="px-5 py-4 grid grid-cols-3 gap-4">
              <div><div className="t-label">Ente</div><div className="text-[12.5px] mt-1">{b.entity}</div></div>
              <div><div className="t-label">Importo</div><div className="text-[12.5px] mt-1">{b.amount}</div></div>
              <div><div className="t-label">Scadenza</div><div className="text-[12.5px] mt-1">{dateIt(b.deadline)}</div></div>
              <div className="col-span-3">
                <div className="t-label">Perché ci riguarda</div>
                <p className="text-[12.5px] mt-1 leading-relaxed" style={{ color: "var(--text-2)" }}>{b.why}</p>
              </div>
            </div>
          </Panel>
        )}
        <Output text={text} loading={loading} error={error} empty="Nessuna analisi generata" filename="analisi-bando.txt" />
      </div>
    </div>
  );
}
