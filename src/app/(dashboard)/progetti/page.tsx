"use client";

import * as React from "react";
import { Badge, Panel, PageHead } from "@/components/ui/kit";

type ProjectStatus = "attivo" | "in_consegna" | "completato" | "in_pausa";

const PROJECTS = [
  { id: "1", name: "Rebranding Municipio Roma XV", client: "Municipio Roma XV", status: "attivo" as ProjectStatus, progress: 65, pm: "Daniele", deadline: "2026-10-15", budget: 6500, spent: 3200, tasks: { done: 12, total: 18 } },
  { id: "2", name: "Campagna Festival d'Arte", client: "Festival d'Arte Moderna", status: "attivo" as ProjectStatus, progress: 40, pm: "Erika", deadline: "2026-11-01", budget: 3900, spent: 1100, tasks: { done: 6, total: 15 } },
  { id: "3", name: "Brand Identity Studio Creativo", client: "Studio Creativo Roma", status: "in_consegna" as ProjectStatus, progress: 90, pm: "Daniele", deadline: "2026-09-20", budget: 4800, spent: 4200, tasks: { done: 14, total: 16 } },
  { id: "4", name: "Distribuzione 'Notte Blu'", client: "Indie Records", status: "attivo" as ProjectStatus, progress: 55, pm: "Erika", deadline: "2026-09-30", budget: 1800, spent: 800, tasks: { done: 5, total: 9 } },
  { id: "5", name: "Marketing Growth Q4", client: "Studio Creativo Roma", status: "attivo" as ProjectStatus, progress: 20, pm: "Daniele", deadline: "2026-12-31", budget: 1200, spent: 200, tasks: { done: 2, total: 10 } },
  { id: "6", name: "Evento Teatro Moderno", client: "Teatro Moderno", status: "completato" as ProjectStatus, progress: 100, pm: "Erika", deadline: "2026-08-30", budget: 4200, spent: 4100, tasks: { done: 20, total: 20 } },
];

const STATUS_MAP: Record<ProjectStatus, { label: string; tone: "ok" | "warn" | "neutral" | "brand" }> = {
  attivo: { label: "Attivo", tone: "brand" },
  in_consegna: { label: "In consegna", tone: "warn" },
  completato: { label: "Completato", tone: "ok" },
  in_pausa: { label: "In pausa", tone: "neutral" },
};

export default function ProgettiPage() {
  const [filter, setFilter] = React.useState<"tutti" | ProjectStatus>("tutti");
  const [sel, setSel] = React.useState<string | null>(null);

  const filtered = filter === "tutti" ? PROJECTS : PROJECTS.filter(p => p.status === filter);
  const selected = PROJECTS.find(p => p.id === sel);

  const attivi = PROJECTS.filter(p => p.status === "attivo").length;
  const inConsegna = PROJECTS.filter(p => p.status === "in_consegna").length;
  const budgetTotale = PROJECTS.filter(p => p.status !== "completato").reduce((a, p) => a + p.budget, 0);
  const spesaTotale = PROJECTS.filter(p => p.status !== "completato").reduce((a, p) => a + p.spent, 0);

  return (
    <div>
      <PageHead
        title="Progetti"
        sub={`${attivi} attivi · ${inConsegna} in consegna · budget aperto €${budgetTotale.toLocaleString("it-IT")}`}
      />

      <div className="grid grid-cols-4 gap-4 mb-5">
        <div className="card card-pad">
          <div className="t-label mb-1">Progetti attivi</div>
          <div className="text-[22px] font-semibold">{attivi}</div>
        </div>
        <div className="card card-pad">
          <div className="t-label mb-1">In consegna</div>
          <div className="text-[22px] font-semibold" style={{ color: "var(--warn)" }}>{inConsegna}</div>
        </div>
        <div className="card card-pad">
          <div className="t-label mb-1">Budget impegnato</div>
          <div className="text-[22px] font-semibold">€{budgetTotale.toLocaleString("it-IT")}</div>
        </div>
        <div className="card card-pad">
          <div className="t-label mb-1">Speso</div>
          <div className="text-[22px] font-semibold">€{spesaTotale.toLocaleString("it-IT")}</div>
          <div className="text-[11px] mt-1" style={{ color: "var(--text-2)" }}>{Math.round((spesaTotale / budgetTotale) * 100)}% del budget</div>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {(["tutti", "attivo", "in_consegna", "completato"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="btn btn-sm"
            style={{
              background: filter === f ? "var(--brand)" : "var(--surface-2)",
              color: filter === f ? "#fff" : "var(--text-2)",
            }}
          >
            {f === "tutti" ? "Tutti" : STATUS_MAP[f]?.label || f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_380px] gap-5">
        <Panel title="Progetti" action={<span className="t-meta">{filtered.length} risultati</span>}>
          <div>
            {filtered.map(p => (
              <button
                key={p.id}
                onClick={() => setSel(p.id)}
                className="w-full text-left px-5 py-3.5 border-b transition-colors flex items-center gap-4"
                style={{
                  borderColor: "var(--rule)",
                  background: sel === p.id ? "var(--surface-2)" : "transparent",
                }}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium">{p.name}</div>
                  <div className="t-meta mt-0.5">{p.client} · PM: {p.pm} · Scadenza: {p.deadline}</div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--surface-2)" }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${p.progress}%`, background: p.progress >= 90 ? "var(--ok)" : "var(--brand)" }}
                    />
                  </div>
                  <span className="text-[11px] tabular-nums w-8 text-right" style={{ color: "var(--text-2)" }}>{p.progress}%</span>
                  <Badge tone={STATUS_MAP[p.status].tone}>{STATUS_MAP[p.status].label}</Badge>
                </div>
              </button>
            ))}
          </div>
        </Panel>

        <div className="space-y-4">
          {selected ? (
            <>
              <Panel title={selected.name}>
                <div className="card-pad space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div><div className="t-label">Cliente</div><div className="text-[12.5px] mt-1">{selected.client}</div></div>
                    <div><div className="t-label">PM</div><div className="text-[12.5px] mt-1">{selected.pm}</div></div>
                    <div><div className="t-label">Scadenza</div><div className="text-[12.5px] mt-1">{selected.deadline}</div></div>
                    <div><div className="t-label">Stato</div><div className="mt-1"><Badge tone={STATUS_MAP[selected.status].tone}>{STATUS_MAP[selected.status].label}</Badge></div></div>
                  </div>
                  <div>
                    <div className="t-label mb-2">Avanzamento</div>
                    <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "var(--surface-2)" }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${selected.progress}%`, background: "var(--brand)" }} />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="t-meta">{selected.tasks.done}/{selected.tasks.total} task completati</span>
                      <span className="t-meta">{selected.progress}%</span>
                    </div>
                  </div>
                  <div>
                    <div className="t-label mb-2">Budget</div>
                    <div className="flex justify-between text-[12.5px]">
                      <span>Preventivato</span><span className="font-medium">€{selected.budget.toLocaleString("it-IT")}</span>
                    </div>
                    <div className="flex justify-between text-[12.5px] mt-1">
                      <span>Speso</span><span className="font-medium">€{selected.spent.toLocaleString("it-IT")}</span>
                    </div>
                    <div className="flex justify-between text-[12.5px] mt-1 pt-1 border-t" style={{ borderColor: "var(--rule)" }}>
                      <span>Residuo</span><span className="font-medium" style={{ color: "var(--ok)" }}>€{(selected.budget - selected.spent).toLocaleString("it-IT")}</span>
                    </div>
                  </div>
                </div>
              </Panel>
              <div className="card card-pad">
                <div className="t-label mb-2">Automazioni attive</div>
                <div className="space-y-2">
                  {["Reminder scadenza al PM — 7gg e 3gg prima", "Check-in automatico al cliente — ogni 2 settimane", "Aggiornamento board Trello — da OCRA"].map((a, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--ok)" }} />
                      <span className="text-[11.5px]" style={{ color: "var(--text-2)" }}>{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="card card-pad flex items-center justify-center" style={{ minHeight: 300 }}>
              <p className="t-meta">Seleziona un progetto per vedere i dettagli</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
