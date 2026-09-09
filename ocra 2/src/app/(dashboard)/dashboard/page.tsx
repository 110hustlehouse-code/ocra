"use client";

import Link from "next/link";
import { useStore } from "@/lib/demo/store";
import { buildAlerts } from "@/lib/demo/insights";
import {
  eur, dateIt, dayMonth, daysFromToday, clientName, TODAY, TENANT, STAGES,
} from "@/lib/demo/data";
import { Badge, Panel, Stat, Progress, Avatar, PageHead } from "@/components/ui/kit";

export default function DashboardPage() {
  const s = useStore();
  const alerts = buildAlerts(s);

  const incassato = s.invoices
    .filter((i) => i.direction === "E" && i.status === "paid")
    .reduce((a, i) => a + i.amount, 0);
  const daIncassare = s.invoices
    .filter((i) => i.direction === "E" && i.status !== "paid")
    .reduce((a, i) => a + i.amount, 0);
  const scaduto = s.invoices
    .filter((i) => i.direction === "E" && i.status === "overdue")
    .reduce((a, i) => a + i.amount, 0);
  const pipeline = s.leads
    .filter((l) => !["vinto", "perso"].includes(l.stage))
    .reduce((a, l) => a + l.value, 0);
  const attivi = s.projects.filter((p) => p.status !== "consegnato");

  const oggi = new Intl.DateTimeFormat("it-IT", {
    weekday: "long", day: "numeric", month: "long",
  }).format(TODAY);

  const prossimeRiunioni = [...s.meetings]
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, 3);

  const ultimoVerbale = s.meetings.find((m) => m.status === "elaborato");

  const incassiProssimi = s.invoices
    .filter((i) => i.direction === "E" && i.status !== "paid")
    .sort((a, b) => +new Date(a.dueDate) - +new Date(b.dueDate));

  return (
    <div className="rise">
      <PageHead
        title={`Buongiorno, Daniele`}
        sub={`${oggi.charAt(0).toUpperCase() + oggi.slice(1)} · ${alerts.filter((a) => a.severity === "danger").length} cose richiedono attenzione`}
        actions={
          <>
            <Link href="/studio" className="btn btn-ghost">AI Studio</Link>
            <Link href="/clienti?nuovo=1" className="btn btn-primary">+ Nuovo cliente</Link>
          </>
        }
      />

      <div className="grid grid-cols-4 gap-4 mb-5">
        <Stat label="Incassato 2026" value={eur(incassato)} trend={12} sub="vs anno scorso" />
        <Stat label="Da incassare" value={eur(daIncassare)} sub={scaduto ? `di cui ${eur(scaduto)} scaduti` : "tutto in termini"} tone={scaduto ? "danger" : undefined} />
        <Stat label="Pipeline aperta" value={eur(pipeline)} sub={`${s.leads.filter((l) => !["vinto", "perso"].includes(l.stage)).length} trattative`} />
        <Stat label="Progetti attivi" value={String(attivi.length)} sub={`${s.clients.filter((c) => c.status === "active").length} clienti in portafoglio`} />
      </div>

      <div className="grid grid-cols-[1.65fr_1fr] gap-5 items-start">
        {/* ── Colonna principale ── */}
        <div className="space-y-5">
          <Panel
            title="Richiede attenzione"
            action={<span className="t-meta">{alerts.length} segnalazioni</span>}
          >
            <div>
              {alerts.slice(0, 7).map((a) => (
                <Link
                  key={a.id}
                  href={a.href}
                  className="flex items-start gap-3 px-5 py-3 border-b last:border-0 hover:bg-[var(--surface-2)] transition-colors"
                  style={{ borderColor: "var(--line-2)" }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full mt-[7px] shrink-0"
                    style={{
                      background:
                        a.severity === "danger" ? "var(--danger)"
                        : a.severity === "warn" ? "var(--warn)" : "var(--info)",
                    }}
                  />
                  <span className="flex-1 min-w-0">
                    <span className="flex items-center gap-2">
                      <span className="text-[12.5px] font-medium truncate">{a.title}</span>
                      <span className="t-meta shrink-0">· {a.area}</span>
                    </span>
                    <span className="block t-meta truncate mt-0.5">{a.detail}</span>
                  </span>
                  <span className="text-[11.5px] font-medium shrink-0 mt-0.5" style={{ color: "var(--brand)" }}>
                    {a.cta} →
                  </span>
                </Link>
              ))}
            </div>
          </Panel>

          {ultimoVerbale && (
            <Panel
              title="Ultimo verbale generato"
              action={<Link href="/studio" className="text-[11.5px] font-medium" style={{ color: "var(--brand)" }}>Tutti i verbali →</Link>}
            >
              <div className="px-5 py-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge tone="brand" dot>Fireflies</Badge>
                  <span className="text-[13px] font-medium">{ultimoVerbale.title}</span>
                  <span className="t-meta">
                    {dateIt(ultimoVerbale.date)} · {ultimoVerbale.duration} min
                  </span>
                </div>
                <p className="text-[12.5px] leading-relaxed" style={{ color: "var(--text-2)" }}>
                  {ultimoVerbale.summary}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1.5">
                  {(ultimoVerbale.actions ?? []).map((a, i) => (
                    <label key={i} className="flex items-start gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={a.done}
                        onChange={() => s.toggleAction(ultimoVerbale.id, i)}
                        className="mt-[3px] accent-[var(--brand)]"
                      />
                      <span
                        className="text-[12px] leading-snug"
                        style={{
                          color: a.done ? "var(--text-3)" : "var(--text)",
                          textDecoration: a.done ? "line-through" : "none",
                        }}
                      >
                        <b className="font-medium">{a.who}</b> — {a.what}
                        <span className="t-meta"> · {dayMonth(a.when)}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </Panel>
          )}

          <Panel title="Progetti in corso" action={<Link href="/clienti" className="text-[11.5px] font-medium" style={{ color: "var(--brand)" }}>Tutti →</Link>}>
            <div className="scroll-x">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Progetto</th><th>Cliente</th><th>Resp.</th>
                    <th className="w-[150px]">Avanzamento</th><th>Budget</th><th>Consegna</th>
                  </tr>
                </thead>
                <tbody>
                  {attivi.map((p) => {
                    const burn = p.budgetPlanned ? p.budgetActual / p.budgetPlanned : 0;
                    const left = daysFromToday(p.endDate);
                    return (
                      <tr key={p.id}>
                        <td className="font-medium">{p.name}</td>
                        <td style={{ color: "var(--text-2)" }}>{clientName(p.clientId)}</td>
                        <td><Avatar name={p.lead} size={22} /></td>
                        <td>
                          <div className="flex items-center gap-2">
                            <Progress value={p.progress} />
                            <span className="t-meta tabular w-8 text-right">{p.progress}%</span>
                          </div>
                        </td>
                        <td className="tabular" style={{ color: burn > 0.85 ? "var(--danger)" : "var(--text-2)" }}>
                          {Math.round(burn * 100)}%
                        </td>
                        <td>
                          <span className="tabular" style={{ color: left <= 14 ? "var(--warn)" : "var(--text-2)" }}>
                            {dayMonth(p.endDate)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>

        {/* ── Colonna laterale ── */}
        <div className="space-y-5">
          <Panel title="Riunioni">
            <div className="px-5 py-1">
              {prossimeRiunioni.map((m) => (
                <div key={m.id} className="flex items-start gap-3 py-3 border-b last:border-0" style={{ borderColor: "var(--line-2)" }}>
                  <div className="text-center shrink-0 w-9">
                    <div className="text-[15px] font-semibold tabular leading-none">
                      {new Date(m.date).getDate()}
                    </div>
                    <div className="text-[10px] uppercase" style={{ color: "var(--text-3)" }}>
                      {new Intl.DateTimeFormat("it-IT", { month: "short" }).format(new Date(m.date))}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[12.5px] font-medium truncate">{m.title}</div>
                    <div className="t-meta truncate">{m.participants.join(", ")}</div>
                    <div className="mt-1.5">
                      {m.status === "in_corso"
                        ? <Badge tone="danger" dot>In corso · Fireflies collegato</Badge>
                        : <Badge tone="ok" dot>Verbale pronto</Badge>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Funnel">
            <div className="px-5 py-4 space-y-2.5">
              {STAGES.filter((st) => st.key !== "vinto").map((st) => {
                const items = s.leads.filter((l) => l.stage === st.key);
                const val = items.reduce((a, l) => a + l.value, 0);
                const max = Math.max(
                  ...STAGES.map((x) => s.leads.filter((l) => l.stage === x.key).reduce((a, l) => a + l.value, 0)), 1
                );
                return (
                  <div key={st.key}>
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="text-[12px]">{st.label}</span>
                      <span className="t-meta tabular">{items.length} · {eur(val)}</span>
                    </div>
                    <Progress value={(val / max) * 100} />
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel title="Incassi attesi">
            <div className="px-5 py-1">
              {incassiProssimi.map((i) => {
                const gap = daysFromToday(i.dueDate);
                return (
                  <div key={i.id} className="flex items-center justify-between gap-3 py-2.5 border-b last:border-0" style={{ borderColor: "var(--line-2)" }}>
                    <div className="min-w-0">
                      <div className="text-[12.5px] truncate">{i.counterpart}</div>
                      <div className="t-meta">
                        {gap < 0 ? `scaduta da ${-gap}g` : `fra ${gap}g · ${dayMonth(i.dueDate)}`}
                      </div>
                    </div>
                    <div className="text-[12.5px] font-medium tabular shrink-0"
                         style={{ color: i.status === "overdue" ? "var(--danger)" : undefined }}>
                      {eur(i.amount)}
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>

          <div className="card card-pad">
            <div className="t-label mb-2">Il team</div>
            <div className="flex -space-x-1.5">
              {TENANT.team.map((n) => <Avatar key={n} name={n} size={26} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
