"use client";

import * as React from "react";
import { useStore } from "@/lib/demo/store";
import { services, eur } from "@/lib/demo/data";
import { Panel, Badge } from "@/components/ui/kit";
import { useStream, Output } from "./output";
import { useToast } from "@/components/ui/toast";

const CATEGORIES = ["Business Development", "Creative Development", "Marketing Development"] as const;

export function PreventiviTab() {
  const s = useStore();
  const toast = useToast();
  const [client, setClient] = React.useState("");
  const [sel, setSel] = React.useState<string[]>([]);
  const [notes, setNotes] = React.useState("");
  const [discount, setDiscount] = React.useState(0);
  const { text, loading, error, done, run } = useStream();

  const chosen = services.filter((x) => sel.includes(x.id));
  const subtotal = chosen.reduce((a, x) => a + x.price, 0);
  const total = Math.round(subtotal * (1 - discount / 100));
  const weeks = chosen.length ? Math.max(...chosen.map((x) => x.weeks)) : 0;

  const toggle = (id: string) =>
    setSel((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const exportPdf = () => {
    if (!text) return;
    const w = window.open("", "_blank");
    if (!w) { toast("Sblocca i popup per scaricare il PDF", "warn"); return; }
    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Preventivo ${client || "OCRA"}</title>
    <style>
      body { font-family: -apple-system, system-ui, sans-serif; max-width: 700px; margin: 40px auto; padding: 0 20px; color: #16171a; font-size: 14px; line-height: 1.7; }
      h1 { font-size: 22px; margin-bottom: 4px; }
      .meta { color: #8a8c93; font-size: 12px; margin-bottom: 32px; }
      .brand { color: #e85d24; }
      pre { white-space: pre-wrap; font-family: inherit; }
      @media print { body { margin: 20px; } }
    </style></head><body>
    <h1 class="brand">OCRA &mdash; Preventivo</h1>
    <div class="meta">Fulcro Lucem &middot; ${client || "Cliente"} &middot; ${new Date().toLocaleDateString("it-IT")}</div>
    <pre>${text.replace(/</g, "&lt;")}</pre>
    <script>setTimeout(()=>{window.print()},400)<\/script>
    </body></html>`);
    w.document.close();
    toast("PDF in preparazione — usa Salva come PDF nella finestra di stampa");
  };

  return (
    <div className="grid grid-cols-[400px_1fr] gap-5 items-start">
      <div className="space-y-4">
        <Panel title="Cliente">
          <div className="card-pad space-y-3">
            <input
              className="field"
              list="clienti-noti"
              placeholder="Nome del cliente o del prospect"
              value={client}
              onChange={(e) => setClient(e.target.value)}
            />
            <datalist id="clienti-noti">
              {s.clients.map((c) => <option key={c.id} value={c.companyName} />)}
              {s.leads.map((l) => <option key={l.id} value={l.company} />)}
            </datalist>
            <textarea
              className="field"
              rows={3}
              placeholder="Note dal commerciale: contesto, budget dichiarato, condizioni particolari…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </Panel>

        <Panel title="Servizi" action={<span className="t-meta">{sel.length} selezionati</span>}>
          <div className="px-4 py-3 space-y-3 max-h-[380px] overflow-y-auto">
            {CATEGORIES.map((cat) => (
              <div key={cat}>
                <div className="t-label mb-1.5">{cat.replace(" Development", "")}</div>
                <div className="space-y-1">
                  {services.filter((x) => x.category === cat).map((x) => {
                    const on = sel.includes(x.id);
                    return (
                      <button
                        key={x.id}
                        onClick={() => toggle(x.id)}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-[8px] text-left transition-colors"
                        style={{
                          background: on ? "var(--brand-soft)" : "transparent",
                          outline: on ? "1px solid var(--brand)" : "1px solid var(--line-2)",
                        }}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-[4px] flex items-center justify-center text-[9px] shrink-0"
                          style={{ background: on ? "var(--brand)" : "var(--surface)", color: "#fff", border: on ? "none" : "1px solid var(--line)" }}
                        >
                          {on ? "✓" : ""}
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block text-[12.5px] font-medium truncate">{x.name}</span>
                          <span className="block t-meta truncate">{x.weeks} settimane · {x.deliverables.length} deliverable</span>
                        </span>
                        <span className="text-[12px] tabular shrink-0">{eur(x.price)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <div className="card card-pad space-y-3">
          <div className="flex items-center justify-between">
            <span className="t-meta">Subtotale</span>
            <span className="text-[13px] tabular">{eur(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="t-meta">Sconto</span>
            <div className="flex items-center gap-2">
              {[0, 5, 10, 15].map((d) => (
                <button
                  key={d}
                  onClick={() => setDiscount(d)}
                  className="btn btn-sm"
                  style={{
                    background: discount === d ? "var(--ink)" : "var(--surface)",
                    color: discount === d ? "#fff" : "var(--text-2)",
                    border: "1px solid var(--line)",
                  }}
                >
                  {d}%
                </button>
              ))}
            </div>
          </div>
          <div className="hairline" />
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-[15px] font-semibold tabular">{eur(total)} <span className="t-meta font-normal">+ IVA</span></div>
              {weeks > 0 && <div className="t-meta">consegna stimata in {weeks} settimane</div>}
            </div>
            <button
              className="btn btn-brand"
              disabled={!client.trim() || sel.length === 0 || loading}
              onClick={() => run("/api/ai/preventivo", {
                clientName: client,
                services: chosen.map(({ name, category, price, weeks, deliverables }) => ({ name, category, price, weeks, deliverables })),
                notes,
                discount,
              })}
            >
              {loading ? "Scrittura…" : "Genera preventivo"}
            </button>
          </div>
          {subtotal > 0 && subtotal < 1500 && (
            <Badge tone="warn" dot>Sotto la soglia minima di 1.500 € decisa il 7 settembre</Badge>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <Output text={text} loading={loading} error={error} done={done} empty="Nessun preventivo generato" filename={`preventivo-${client || "cliente"}.txt`} />
        {text && !loading && (
          <div className="flex gap-2 justify-end">
            <button className="btn btn-ghost" onClick={exportPdf}>Esporta PDF</button>
            <button className="btn btn-ghost" onClick={() => toast("Preventivo inviato a " + (client || "cliente"), "brand")}>Invia al cliente</button>
          </div>
        )}
      </div>
    </div>
  );
}
