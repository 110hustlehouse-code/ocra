"use client";

import * as React from "react";
import { PageHead } from "@/components/ui/kit";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";

type ContentStatus = "idea" | "briefing" | "produzione" | "revisione" | "approvato" | "pubblicato";

type Content = {
  id: string;
  title: string;
  client: string;
  format: string;
  channel: string;
  status: ContentStatus;
  assignee: string;
  deadline: string;
};

const STATUS_COLORS: Record<ContentStatus, string> = {
  idea: "#a3a29d",
  briefing: "#3b82f6",
  produzione: "#8b5cf6",
  revisione: "#f59e0b",
  approvato: "#2fb888",
  pubblicato: "#16a34a",
};

const INIT: Content[] = [
  { id: "1", title: "Reel backstage Festival", client: "Festival d\u0027Arte", format: "Reel", channel: "Instagram", status: "produzione", assignee: "Marco", deadline: "2026-09-15" },
  { id: "2", title: "Case study Municipio Roma XV", client: "Interno", format: "Articolo", channel: "Blog + LinkedIn", status: "briefing", assignee: "Sara", deadline: "2026-09-18" },
  { id: "3", title: "Lancio brand Studio Creativo", client: "Studio Creativo Roma", format: "Carosello", channel: "Instagram + Facebook", status: "revisione", assignee: "Luca", deadline: "2026-09-12" },
  { id: "4", title: "Newsletter settembre", client: "Interno", format: "Newsletter", channel: "Email", status: "briefing", assignee: "Sara", deadline: "2026-09-20" },
  { id: "5", title: "Teaser release \u0027Alba\u0027", client: "Indie Records", format: "Story + Reel", channel: "Instagram + TikTok", status: "idea", assignee: "Marco", deadline: "2026-09-25" },
  { id: "6", title: "Post founders program", client: "Interno", format: "Post", channel: "LinkedIn", status: "approvato", assignee: "Sara", deadline: "2026-09-11" },
  { id: "7", title: "Video recap evento Teatro", client: "Teatro Moderno", format: "Video", channel: "YouTube + Instagram", status: "pubblicato", assignee: "Marco", deadline: "2026-09-08" },
  { id: "8", title: "Grafiche promo Growth", client: "Studio Creativo Roma", format: "Grafica", channel: "Instagram + Facebook", status: "produzione", assignee: "Luca", deadline: "2026-09-22" },
];

const STAGES: ContentStatus[] = ["idea", "briefing", "produzione", "revisione", "approvato", "pubblicato"];
const FORMATS = ["Post", "Reel", "Story", "Carosello", "Video", "Articolo", "Newsletter", "Grafica"];
const TEAM = ["Marco", "Sara", "Luca", "Erika", "Daniele"];

export default function ContenutiPage() {
  const [items, setItems] = React.useState<Content[]>(INIT);
  const [dragging, setDragging] = React.useState<string | null>(null);
  const [over, setOver] = React.useState<ContentStatus | null>(null);
  const [showNew, setShowNew] = React.useState(false);
  const toast = useToast();

  const onDragStart = (id: string) => setDragging(id);
  const onDragEnd = () => { setDragging(null); setOver(null); };

  const onDrop = (stage: ContentStatus) => {
    if (!dragging) return;
    setItems((prev) => prev.map((c) => c.id === dragging ? { ...c, status: stage } : c));
    setOver(null);
    setDragging(null);
    toast("Contenuto spostato in " + stage, "ok");
  };

  const addContent = (c: Omit<Content, "id">) => {
    setItems((prev) => [...prev, { ...c, id: "c" + Date.now() }]);
    setShowNew(false);
    toast("Contenuto aggiunto", "ok");
  };

  return (
    <div className="rise">
      <PageHead
        title="Contenuti"
        sub="Pipeline editoriale \u2014 trascina i contenuti tra le fasi"
        actions={
          <button className="btn btn-primary" onClick={() => setShowNew(true)}>+ Nuovo contenuto</button>
        }
      />

      <div className="grid grid-cols-4 gap-4 mb-5">
        <div className="card card-pad">
          <div className="t-label mb-1">In lavorazione</div>
          <div className="text-[22px] font-semibold">{items.filter(c => ["briefing", "produzione", "revisione"].includes(c.status)).length}</div>
        </div>
        <div className="card card-pad">
          <div className="t-label mb-1">Da approvare</div>
          <div className="text-[22px] font-semibold" style={{ color: "var(--warn)" }}>{items.filter(c => c.status === "revisione").length}</div>
        </div>
        <div className="card card-pad">
          <div className="t-label mb-1">Pronti</div>
          <div className="text-[22px] font-semibold" style={{ color: "var(--ok)" }}>{items.filter(c => c.status === "approvato").length}</div>
        </div>
        <div className="card card-pad">
          <div className="t-label mb-1">Pubblicati</div>
          <div className="text-[22px] font-semibold">{items.filter(c => c.status === "pubblicato").length}</div>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-3">
        {STAGES.map((stage) => {
          const stageItems = items.filter((c) => c.status === stage);
          const isOver = over === stage && dragging;
          return (
            <div
              key={stage}
              onDragOver={(e) => { e.preventDefault(); setOver(stage); }}
              onDragLeave={() => setOver(null)}
              onDrop={(e) => { e.preventDefault(); onDrop(stage); }}
              style={{
                borderRadius: 12,
                border: isOver ? "2px dashed var(--brand)" : "2px dashed transparent",
                background: isOver ? "var(--brand-soft, rgba(232,93,36,0.04))" : "transparent",
                transition: "all 0.15s",
                padding: 4,
              }}
            >
              <div className="flex items-center gap-2 mb-3 px-1">
                <span className="w-2 h-2 rounded-full" style={{ background: STATUS_COLORS[stage] }} />
                <span className="text-[11.5px] font-medium capitalize">{stage}</span>
                <span className="t-meta ml-auto">{stageItems.length}</span>
              </div>
              <div className="space-y-2 min-h-[200px]">
                {stageItems.map((c) => (
                  <div
                    key={c.id}
                    draggable
                    onDragStart={() => onDragStart(c.id)}
                    onDragEnd={onDragEnd}
                    className="card cursor-grab active:cursor-grabbing transition-all hover:shadow-sm"
                    style={{
                      padding: "10px 12px",
                      opacity: dragging === c.id ? 0.4 : 1,
                    }}
                  >
                    <div className="text-[12px] font-medium leading-snug mb-1.5">{c.title}</div>
                    <div className="flex flex-wrap gap-1 mb-1.5">
                      <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "var(--surface-2, #f5f5f3)", color: "var(--text-2)" }}>{c.format}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "var(--surface-2, #f5f5f3)", color: "var(--text-2)" }}>{c.channel}</span>
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

      <NewContentModal open={showNew} onClose={() => setShowNew(false)} onSave={addContent} />
    </div>
  );
}

function NewContentModal({ open, onClose, onSave }: { open: boolean; onClose: () => void; onSave: (c: Omit<Content, "id">) => void }) {
  const [form, setForm] = React.useState({ title: "", client: "", format: FORMATS[0], channel: "", assignee: TEAM[0], deadline: "" });
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const submit = () => {
    if (!form.title.trim()) return;
    onSave({ ...form, status: "idea" });
    setForm({ title: "", client: "", format: FORMATS[0], channel: "", assignee: TEAM[0], deadline: "" });
  };

  return (
    <Modal open={open} onClose={onClose} title="Nuovo contenuto" sub="Aggiungi un contenuto alla pipeline editoriale">
      <div className="p-5 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="lbl">Titolo *</label><input className="field" placeholder="Es. Reel backstage evento" value={form.title} onChange={set("title")} /></div>
          <div><label className="lbl">Cliente</label><input className="field" placeholder="Es. Festival d\u0027Arte" value={form.client} onChange={set("client")} /></div>
          <div><label className="lbl">Formato</label>
            <select className="field" value={form.format} onChange={set("format")}>
              {FORMATS.map((f) => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div><label className="lbl">Canale</label><input className="field" placeholder="Es. Instagram + TikTok" value={form.channel} onChange={set("channel")} /></div>
          <div><label className="lbl">Responsabile</label>
            <select className="field" value={form.assignee} onChange={set("assignee")}>
              {TEAM.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div><label className="lbl">Deadline</label><input type="date" className="field" value={form.deadline} onChange={set("deadline")} /></div>
        </div>
        <div className="flex justify-end gap-2 pt-3" style={{ borderTop: "1px solid var(--line-2, #eee)" }}>
          <button className="btn btn-ghost" onClick={onClose}>Annulla</button>
          <button className="btn btn-primary" onClick={submit} disabled={!form.title.trim()}>Aggiungi contenuto</button>
        </div>
      </div>
    </Modal>
  );
}
