"use client";

import * as React from "react";
import { useStore } from "@/lib/demo/store";
import { dateIt, dayMonth } from "@/lib/demo/data";
import { Badge, Panel, Empty, Avatar } from "@/components/ui/kit";
import { useStream, Output } from "./output";

export function VerbaliTab() {
  const s = useStore();
  const [sel, setSel] = React.useState(s.meetings.find((m) => m.status === "trascritto")?.id ?? s.meetings[0]?.id);
  const [manual, setManual] = React.useState(false);
  const [raw, setRaw] = React.useState("");
  const { text, loading, error, run } = useStream();

  const m = s.meetings.find((x) => x.id === sel);

  const genera = () => {
    if (!m) return;
    run("/api/ai/verbale", {
      transcription: m.transcription,
      title: m.title,
      participants: m.participants,
      date: m.date,
    });
  };

  return (
    <div className="grid grid-cols-[290px_1fr] gap-5 items-start">
      {/* Elenco riunioni */}
      <div className="space-y-4">
        <Panel
          title="Riunioni"
          action={
            <span className="inline-flex items-center gap-1.5 t-meta">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#2fb888" }} />
              Fireflies attivo
            </span>
          }
        >
          <div className="px-2 py-2">
            {s.meetings.map((x) => {
              const active = x.id === sel;
              return (
                <button
                  key={x.id}
                  onClick={() => { setSel(x.id); setManual(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-[9px] transition-colors"
                  style={{ background: active ? "var(--surface-2)" : "transparent" }}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="t-meta">{dayMonth(x.date)}</span>
                    {x.source === "fireflies" && <span className="t-meta">· auto</span>}
                    <span className="ml-auto">
                      {x.status === "elaborato" ? <Badge tone="ok" dot>Pronto</Badge>
                        : x.status === "trascritto" ? <Badge tone="warn" dot>Da elaborare</Badge>
                        : <Badge tone="danger" dot>In corso</Badge>}
                    </span>
                  </div>
                  <div className="text-[12.5px] font-medium leading-snug">{x.title}</div>
                  <div className="t-meta truncate mt-0.5">{x.participants.join(", ")}</div>
                </button>
              );
            })}
          </div>
        </Panel>

        <button
          className="btn btn-ghost w-full"
          onClick={() => { setManual(true); }}
        >
          Incolla una trascrizione
        </button>

        <div className="card card-pad">
          <div className="t-label mb-2">Come funziona</div>
          <p className="text-[11.5px] leading-relaxed" style={{ color: "var(--text-2)" }}>
            Fireflies è collegato al calendario del team ed entra da solo in ogni riunione su Meet.
            Nessuno deve avviare o fermare niente: a riunione finita la trascrizione arriva qui e
            diventa un verbale con decisioni e azioni assegnate.
          </p>
        </div>
      </div>

      {/* Dettaglio */}
      <div className="space-y-4">
        {manual ? (
          <>
            <Panel title="Trascrizione manuale">
              <div className="card-pad space-y-3">
                <textarea
                  className="field"
                  rows={7}
                  placeholder="Incolla qui la trascrizione della riunione…"
                  value={raw}
                  onChange={(e) => setRaw(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <button className="btn btn-ghost" onClick={() => setManual(false)}>Annulla</button>
                  <button
                    className="btn btn-brand"
                    disabled={!raw.trim() || loading}
                    onClick={() => run("/api/ai/verbale", { transcription: raw })}
                  >
                    Genera verbale
                  </button>
                </div>
              </div>
            </Panel>
            <Output text={text} loading={loading} error={error} empty="Nessun verbale generato" filename="verbale.txt" />
          </>
        ) : !m ? (
          <Panel><Empty title="Nessuna riunione selezionata" /></Panel>
        ) : (
          <>
            <Panel
              title={m.title}
              action={
                <div className="flex items-center gap-2">
                  <span className="t-meta">{dateIt(m.date)} · {m.duration} min</span>
                  {m.source === "fireflies" && <Badge tone="brand" dot>Fireflies</Badge>}
                </div>
              }
            >
              <div className="px-5 py-4">
                <div className="flex items-center gap-1.5 mb-3">
                  {m.participants.map((p) => <Avatar key={p} name={p} size={22} />)}
                  <span className="t-meta ml-1">{m.participants.join(", ")}</span>
                </div>

                {m.status === "elaborato" && m.summary ? (
                  <div className="space-y-4">
                    <div>
                      <div className="t-label mb-1.5">In sintesi</div>
                      <p className="text-[12.5px] leading-relaxed" style={{ color: "var(--text-2)" }}>{m.summary}</p>
                    </div>
                    {m.decisions && (
                      <div>
                        <div className="t-label mb-1.5">Decisioni</div>
                        <ol className="space-y-1 list-decimal pl-4">
                          {m.decisions.map((d, i) => <li key={i} className="text-[12.5px]">{d}</li>)}
                        </ol>
                      </div>
                    )}
                    {m.actions && (
                      <div>
                        <div className="t-label mb-1.5">Azioni</div>
                        <div className="space-y-1">
                          {m.actions.map((a, i) => (
                            <label key={i} className="flex items-start gap-2 cursor-pointer">
                              <input type="checkbox" checked={a.done} onChange={() => s.toggleAction(m.id, i)} className="mt-[3px] accent-[var(--brand)]" />
                              <span className="text-[12.5px]" style={{ textDecoration: a.done ? "line-through" : "none", color: a.done ? "var(--text-3)" : "var(--text)" }}>
                                <b className="font-medium">{a.who}</b> — {a.what} <span className="t-meta">· entro {dayMonth(a.when)}</span>
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2 pt-1">
                      <button className="btn btn-ghost btn-sm">Invia ai partecipanti</button>
                      <button className="btn btn-ghost btn-sm">Crea task su Trello</button>
                      <button className="btn btn-ghost btn-sm">Salva su Drive</button>
                    </div>
                  </div>
                ) : m.transcription ? (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="t-label">Trascrizione grezza · {m.transcription.split("\n").length} battute</div>
                      <button className="btn btn-brand btn-sm" onClick={genera} disabled={loading}>
                        {loading ? "Elaborazione…" : "Genera verbale"}
                      </button>
                    </div>
                    <div
                      className="text-[12px] leading-relaxed max-h-40 overflow-y-auto rounded-[9px] p-3 whitespace-pre-wrap"
                      style={{ background: "var(--surface-2)", color: "var(--text-2)" }}
                    >
                      {m.transcription}
                    </div>
                  </div>
                ) : (
                  <Empty title="Riunione in corso" hint="Fireflies sta registrando. Il verbale comparirà qui pochi minuti dopo la fine." />
                )}
              </div>
            </Panel>

            {(loading || text) && (
              <Output text={text} loading={loading} error={error} empty="" filename={`verbale-${m.id}.txt`} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
