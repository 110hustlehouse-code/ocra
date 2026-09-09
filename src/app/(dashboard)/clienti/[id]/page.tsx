"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useStore } from "@/lib/demo/store";
import { eur, eur2, dateIt, dayMonth, daysFromToday } from "@/lib/demo/data";
import { Badge, Panel, PageHead, Avatar, Progress, KV, Empty } from "@/components/ui/kit";

const TABS = ["Panoramica", "Progetti", "Contenuti", "Contabilità", "Riunioni"] as const;
type Tab = (typeof TABS)[number];

export default function ClienteDetail() {
  const { id } = useParams<{ id: string }>();
  const s = useStore();
  const [tab, setTab] = React.useState<Tab>("Panoramica");

  const c = s.clients.find((x) => x.id === id);
  if (!c) {
    return <Empty title="Cliente non trovato" hint="Potrebbe essere stato archiviato." action={<Link href="/clienti" className="btn btn-ghost">Torna ai clienti</Link>} />;
  }

  const projects = s.projects.filter((p) => p.clientId === c.id);
  const invoices = s.invoices.filter((i) => projects.some((p) => p.id === i.projectId));
  const content = s.content.filter((x) => x.clientId === c.id);
  const releases = s.releases.filter((r) => r.clientId === c.id);
  const meetings = s.meetings.filter((m) =>
    m.title.toLowerCase().includes(c.companyName.toLowerCase().split(" ")[0])
  );

  const fatturato = invoices.filter((i) => i.direction === "E").reduce((a, i) => a + i.amount, 0);
  const aperto = invoices.filter((i) => i.direction === "E" && i.status !== "paid").reduce((a, i) => a + i.amount, 0);

  return (
    <div className="rise">
      <Link href="/clienti" className="t-meta hover:underline">← Clienti</Link>

      <PageHead
        title={c.companyName}
        sub={`${c.sector || "Settore non indicato"} · cliente dal ${dateIt(c.since)}`}
        actions={
          <>
            {c.driveFolderId && <button className="btn btn-ghost btn-sm">Drive ↗</button>}
            {c.trelloBoardId && <button className="btn btn-ghost btn-sm">Trello ↗</button>}
            <button className="btn btn-primary btn-sm">Nuovo preventivo</button>
          </>
        }
      />

      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          ["Fatturato totale", eur(fatturato)],
          ["Da incassare", eur(aperto)],
          ["Progetti", `${projects.filter((p) => p.status !== "consegnato").length} attivi · ${projects.length} totali`],
          ["Responsabile", c.owner],
        ].map(([l, v]) => (
          <div key={l as string} className="card card-pad">
            <div className="t-label">{l as string}</div>
            <div className="text-[17px] font-semibold mt-1.5 tracking-tight">{v as string}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-1 mb-4 border-b" style={{ borderColor: "var(--line)" }}>
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-3 py-2 text-[12.5px] font-medium -mb-px border-b-2 transition-colors"
            style={{
              borderColor: tab === t ? "var(--brand)" : "transparent",
              color: tab === t ? "var(--text)" : "var(--text-3)",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Panoramica" && (
        <div className="grid grid-cols-[1fr_1fr] gap-5 items-start">
          <Panel title="Anagrafica">
            <div className="px-5 py-2">
              <KV k="Referente" v={c.contactName} />
              <KV k="Email" v={c.contactEmail} />
              <KV k="Telefono" v={c.contactPhone || "—"} />
              <KV k="Partita IVA" v={c.vatNumber || "—"} />
              <KV k="Responsabile interno" v={<span className="inline-flex items-center gap-1.5"><Avatar name={c.owner} size={18} />{c.owner}</span>} />
              <KV k="Stato" v={c.status === "active" ? <Badge tone="ok" dot>Attivo</Badge> : <Badge tone="warn" dot>Onboarding</Badge>} />
            </div>
          </Panel>

          <div className="space-y-5">
            <Panel title="Note">
              <p className="px-5 py-4 text-[12.5px] leading-relaxed" style={{ color: "var(--text-2)" }}>
                {c.notes || "Nessuna nota."}
              </p>
            </Panel>

            {releases.length > 0 && (
              <Panel title="Release discografiche" action={<Badge tone="brand">Modulo musica</Badge>}>
                <div className="px-5 py-2">
                  {releases.map((r) => (
                    <div key={r.id} className="py-3 border-b last:border-0" style={{ borderColor: "var(--line-2)" }}>
                      <div className="flex items-center justify-between">
                        <div className="text-[12.5px] font-medium">{r.artistName} — {r.trackTitle}</div>
                        <span className="t-meta">{dateIt(r.releaseDate)}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {([["Cover", r.cover], ["Master", r.master], ["Pitch", r.pitch]] as const).map(([l, ok]) => (
                          <Badge key={l} tone={ok ? "ok" : "neutral"} dot>{l}</Badge>
                        ))}
                        <span className="t-meta ml-auto">{r.distributor}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            )}
          </div>
        </div>
      )}

      {tab === "Progetti" && (
        <Panel>
          {projects.length === 0 ? (
            <Empty title="Nessun progetto" hint="Apri un progetto per assegnare un codice PO e tracciare il budget." />
          ) : (
            <div className="scroll-x">
              <table className="tbl">
                <thead>
                  <tr><th>Progetto</th><th>Codice PO</th><th>Stato</th><th className="w-[140px]">Avanzamento</th><th>Budget</th><th>Consegna</th></tr>
                </thead>
                <tbody>
                  {projects.map((p) => {
                    const burn = p.budgetPlanned ? p.budgetActual / p.budgetPlanned : 0;
                    return (
                      <tr key={p.id}>
                        <td className="font-medium">{p.name}</td>
                        <td className="t-meta tabular">{p.poCode}</td>
                        <td><Badge tone={p.status === "consegnato" ? "ok" : p.status === "briefing" ? "info" : "brand"}>{p.status}</Badge></td>
                        <td>
                          <div className="flex items-center gap-2">
                            <Progress value={p.progress} />
                            <span className="t-meta tabular w-8 text-right">{p.progress}%</span>
                          </div>
                        </td>
                        <td className="tabular">
                          {eur(p.budgetActual)} <span className="t-meta">/ {eur(p.budgetPlanned)}</span>
                          <span className="ml-1.5 text-[11px]" style={{ color: burn > 0.85 ? "var(--danger)" : "var(--text-3)" }}>
                            {Math.round(burn * 100)}%
                          </span>
                        </td>
                        <td className="t-meta">{dateIt(p.endDate)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      )}

      {tab === "Contenuti" && (
        <Panel title="Piano editoriale" action={<button className="btn btn-ghost btn-sm">+ Contenuto</button>}>
          {content.length === 0 ? (
            <Empty title="Nessun contenuto pianificato" hint="Il piano editoriale si attiva per i clienti con gestione continuativa." />
          ) : (
            <div className="px-5 py-2">
              {content
                .sort((a, b) => +new Date(a.date) - +new Date(b.date))
                .map((x) => {
                  const gap = daysFromToday(x.date);
                  const tone =
                    x.status === "pubblicato" ? "ok"
                    : x.status === "programmato" ? "brand"
                    : x.status === "approvazione" ? "warn" : "neutral";
                  return (
                    <div key={x.id} className="flex items-center gap-3 py-2.5 border-b last:border-0" style={{ borderColor: "var(--line-2)" }}>
                      <span className="t-meta tabular w-14 shrink-0">{dayMonth(x.date)}</span>
                      <Badge>{x.channel}</Badge>
                      <span className="text-[12.5px] flex-1 min-w-0 truncate">{x.title}</span>
                      <Avatar name={x.owner} size={20} />
                      <Badge tone={tone as "ok"}>{x.status}</Badge>
                      {gap === 0 && <span className="t-meta">oggi</span>}
                    </div>
                  );
                })}
            </div>
          )}
        </Panel>
      )}

      {tab === "Contabilità" && (
        <Panel>
          {invoices.length === 0 ? (
            <Empty title="Nessun documento contabile" />
          ) : (
            <table className="tbl">
              <thead>
                <tr><th>Descrizione</th><th>Codice PO</th><th>Emessa</th><th>Scadenza</th><th>Importo</th><th>Stato</th></tr>
              </thead>
              <tbody>
                {invoices.map((i) => (
                  <tr key={i.id}>
                    <td className="font-medium">{i.description}</td>
                    <td className="t-meta tabular">{i.poCode}</td>
                    <td className="t-meta">{dayMonth(i.issueDate)}</td>
                    <td className="t-meta">{dayMonth(i.dueDate)}</td>
                    <td className="tabular">{eur2(i.amount)}</td>
                    <td>
                      {i.status === "paid" ? <Badge tone="ok" dot>Incassata</Badge>
                       : i.status === "overdue" ? <Badge tone="danger" dot>Scaduta</Badge>
                       : <Badge tone="warn" dot>In attesa</Badge>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Panel>
      )}

      {tab === "Riunioni" && (
        <div className="space-y-4">
          {meetings.length === 0 ? (
            <Panel><Empty title="Nessuna riunione registrata" hint="Le riunioni con questo cliente compaiono qui appena Fireflies le trascrive." /></Panel>
          ) : meetings.map((m) => (
            <Panel key={m.id} title={m.title} action={<span className="t-meta">{dateIt(m.date)} · {m.duration} min</span>}>
              <div className="px-5 py-4">
                <p className="text-[12.5px] leading-relaxed" style={{ color: "var(--text-2)" }}>{m.summary}</p>
                {m.actions && (
                  <div className="mt-3 space-y-1">
                    {m.actions.map((a, i) => (
                      <div key={i} className="text-[12px]">
                        <b className="font-medium">{a.who}</b> — {a.what} <span className="t-meta">· {dayMonth(a.when)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}
