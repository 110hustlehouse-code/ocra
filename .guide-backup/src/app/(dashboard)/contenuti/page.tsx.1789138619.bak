"use client";

import * as React from "react";
import { Badge, Panel, PageHead } from "@/components/ui/kit";

type ContentStatus = "idea" | "briefing" | "produzione" | "revisione" | "approvato" | "pubblicato";

const STATUS_COLORS: Record<ContentStatus, string> = {
  idea: "#a3a29d",
  briefing: "#3b82f6",
  produzione: "#8b5cf6",
  revisione: "#f59e0b",
  approvato: "#2fb888",
  pubblicato: "#16a34a",
};

const CONTENTS = [
  { id: "1", title: "Reel backstage Festival", client: "Festival d'Arte", format: "Reel", channel: "Instagram", status: "produzione" as ContentStatus, assignee: "Marco", deadline: "2026-09-15" },
  { id: "2", title: "Case study Municipio Roma XV", client: "Interno", format: "Articolo", channel: "Blog + LinkedIn", status: "briefing" as ContentStatus, assignee: "Sara", deadline: "2026-09-18" },
  { id: "3", title: "Lancio brand Studio Creativo", client: "Studio Creativo Roma", format: "Carosello", channel: "Instagram + Facebook", status: "revisione" as ContentStatus, assignee: "Luca", deadline: "2026-09-12" },
  { id: "4", title: "Newsletter settembre", client: "Interno", format: "Newsletter", channel: "Email", status: "briefing" as ContentStatus, assignee: "Sara", deadline: "2026-09-20" },
  { id: "5", title: "Teaser release 'Alba'", client: "Indie Records", format: "Story + Reel", channel: "Instagram + TikTok", status: "idea" as ContentStatus, assignee: "Marco", deadline: "2026-09-25" },
  { id: "6", title: "Post founders program", client: "Interno", format: "Post", channel: "LinkedIn", status: "approvato" as ContentStatus, assignee: "Sara", deadline: "2026-09-11" },
  { id: "7", title: "Video recap evento Teatro", client: "Teatro Moderno", format: "Video", channel: "YouTube + Instagram", status: "pubblicato" as ContentStatus, assignee: "Marco", deadline: "2026-09-08" },
  { id: "8", title: "Grafiche promo Growth", client: "Studio Creativo Roma", format: "Grafica", channel: "Instagram + Facebook", status: "produzione" as ContentStatus, assignee: "Luca", deadline: "2026-09-22" },
];

const STAGES: ContentStatus[] = ["idea", "briefing", "produzione", "revisione", "approvato", "pubblicato"];

export default function ContenutiPage() {
  const [view, setView] = React.useState<"board" | "lista">("board");

  return (
    <div>
      <PageHead
        title="Contenuti"
        sub="Pipeline editoriale — trascina i contenuti tra le fasi"
        actions={
          <div className="flex gap-2">
            <button className="btn btn-sm" style={{ background: view === "board" ? "var(--brand)" : "var(--surface-2)", color: view === "board" ? "#fff" : "var(--text-2)" }} onClick={() => setView("board")}>Board</button>
            <button className="btn btn-sm" style={{ background: view === "lista" ? "var(--brand)" : "var(--surface-2)", color: view === "lista" ? "#fff" : "var(--text-2)" }} onClick={() => setView("lista")}>Lista</button>
            <button className="btn btn-primary btn-sm">+ Nuovo contenuto</button>
          </div>
        }
      />

      <div className="grid grid-cols-4 gap-4 mb-5">
        <div className="card card-pad">
          <div className="t-label mb-1">In lavorazione</div>
          <div className="text-[22px] font-semibold">{CONTENTS.filter(c => ["briefing", "produzione", "revisione"].includes(c.status)).length}</div>
        </div>
        <div className="card card-pad">
          <div className="t-label mb-1">Da approvare</div>
          <div className="text-[22px] font-semibold" style={{ color: "var(--warn)" }}>{CONTENTS.filter(c => c.status === "revisione").length}</div>
        </div>
        <div className="card card-pad">
          <div className="t-label mb-1">Pronti</div>
          <div className="text-[22px] font-semibold" style={{ color: "var(--ok)" }}>{CONTENTS.filter(c => c.status === "approvato").length}</div>
        </div>
        <div className="card card-pad">
          <div className="t-label mb-1">Pubblicati questo mese</div>
          <div className="text-[22px] font-semibold">{CONTENTS.filter(c => c.status === "pubblicato").length}</div>
        </div>
      </div>

      {view === "board" ? (
        <div className="grid grid-cols-6 gap-3">
          {STAGES.map(stage => {
            const items = CONTENTS.filter(c => c.status === stage);
            return (
              <div key={stage}>
                <div className="flex items-center gap-2 mb-3 px-1">
                  <span className="w-2 h-2 rounded-full" style={{ background: STATUS_COLORS[stage] }} />
                  <span className="text-[11.5px] font-medium capitalize">{stage}</span>
                  <span className="t-meta ml-auto">{items.length}</span>
                </div>
                <div className="space-y-2 min-h-[200px]">
                  {items.map(c => (
                    <div key={c.id} className="card card-pad cursor-pointer transition-all hover:shadow-sm" style={{ padding: "10px 12px" }}>
                      <div className="text-[12px] font-medium leading-snug mb-1.5">{c.title}</div>
                      <div className="flex flex-wrap gap-1 mb-1.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "var(--surface-2)", color: "var(--text-2)" }}>{c.format}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "var(--surface-2)", color: "var(--text-2)" }}>{c.channel}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="t-meta">{c.assignee}</span>
                        <span className="t-meta">{c.deadline.slice(5)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Panel title="Tutti i contenuti" action={<span className="t-meta">{CONTENTS.length} contenuti</span>}>
          <div>
            {CONTENTS.map(c => (
              <div key={c.id} className="flex items-center gap-4 px-5 py-3 border-b transition-colors" style={{ borderColor: "var(--rule)" }}>
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: STATUS_COLORS[c.status] }} />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium">{c.title}</div>
                  <div className="t-meta mt-0.5">{c.client} · {c.format} · {c.channel}</div>
                </div>
                <span className="t-meta shrink-0">{c.assignee}</span>
                <span className="t-meta shrink-0 tabular-nums">{c.deadline}</span>
                <Badge tone={c.status === "pubblicato" ? "ok" : c.status === "revisione" ? "warn" : "neutral"}>
                  {c.status}
                </Badge>
              </div>
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
}
