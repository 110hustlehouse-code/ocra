"use client";

import Link from "next/link";
import { useStore } from "@/lib/demo/store";
import { buildAlerts } from "@/lib/demo/insights";
import {
  eur, dayMonth, daysFromToday, clientName, TODAY, STAGES,
} from "@/lib/demo/data";
import { Badge, Panel, Progress, Avatar, PageHead } from "@/components/ui/kit";

const WEEKDAYS = ["Domenica","Lunedì","Martedì","Mercoledì","Giovedì","Venerdì","Sabato"];
const MONTHS = ["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","agosto","settembre","ottobre","novembre","dicembre"];

function oggi() {
  return WEEKDAYS[TODAY.getDay()] + " " + TODAY.getDate() + " " + MONTHS[TODAY.getMonth()];
}

export default function DashboardPage() {
  const s = useStore();
  const alerts = buildAlerts(s);

  const incassato = s.invoices.filter((i) => i.direction === "E" && i.status === "paid").reduce((a, i) => a + i.amount, 0);
  const daIncassare = s.invoices.filter((i) => i.direction === "E" && i.status !== "paid").reduce((a, i) => a + i.amount, 0);
  const scaduto = s.invoices.filter((i) => i.direction === "E" && i.status === "overdue").reduce((a, i) => a + i.amount, 0);
  const pipeline = s.leads.filter((l) => !["vinto", "perso"].includes(l.stage)).reduce((a, l) => a + l.value, 0);
  const attivi = s.projects.filter((p) => p.status !== "consegnato");
  const prossimeRiunioni = [...s.meetings].sort((a, b) => +new Date(b.date) - +new Date(a.date)).slice(0, 3);
  const ultimoVerbale = s.meetings.find((m) => m.status === "elaborato");

  return (
    <div className="rise">
      {/* ── HEADER ── */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="t-meta mb-1">{oggi()}</div>
          <h1 className="t-page">Buongiorno, Daniele</h1>
        </div>
        <div className="flex gap-2">
          <Link href="/studio" className="btn btn-ghost">AI Studio</Link>
          <Link href="/clienti?nuovo=1" className="btn btn-primary">+ Nuovo cliente</Link>
        </div>
      </div>

      {/* ── BLOCCO 1: KPI — leggibili in 1 secondo ── */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <KPI label="Incassato 2026" value={eur(incassato)} trend="+12%" positive />
        <KPI label="Da incassare" value={eur(daIncassare)} tag={scaduto ? eur(scaduto) + " scaduti" : undefined} danger={!!scaduto} />
        <KPI label="Pipeline" value={eur(pipeline)} tag={s.leads.filter((l) => !["vinto","perso"].includes(l.stage)).length + " trattative"} />
        <KPI label="Progetti" value={String(attivi.length)} tag={s.clients.filter((c) => c.status === "active").length + " clienti attivi"} />
      </div>

      {/* ── BLOCCO 2: ATTENZIONE — max 5 righe, azione immediata ── */}
      {alerts.length > 0 && (
        <div className="card mb-6 overflow-hidden">
          <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid var(--line-2)" }}>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: "var(--danger)" }} />
              <span className="text-[13px] font-semibold">{alerts.length} cose richiedono attenzione</span>
            </div>
          </div>
          {alerts.slice(0, 5).map((a) => (
            <Link
              key={a.id}
              href={a.href}
              className="flex items-center gap-4 px-5 py-2.5 border-b last:border-0 hover:bg-[var(--surface-2)] transition-colors"
              style={{ borderColor: "var(--line-2)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{
                background: a.severity === "danger" ? "var(--danger)" : a.severity === "warn" ? "var(--warn)" : "var(--info)"
              }} />
              <span className="text-[12.5px] font-medium flex-1 truncate">{a.title}</span>
              <span className="t-meta shrink-0">{a.area}</span>
              <span className="text-[11.5px] font-medium shrink-0" style={{ color: "var(--brand)" }}>{a.cta} →</span>
            </Link>
          ))}
        </div>
      )}

      {/* ── BLOCCO 3: DUE COLONNE — progetti + sidebar ── */}
      <div className="grid grid-cols-[1.6fr_1fr] gap-5">

        {/* Colonna sinistra: Progetti + Verbale */}
        <div className="space-y-5">
          <div className="card overflow-hidden">
            <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid var(--line-2)" }}>
              <span className="text-[13px] font-semibold">Progetti in corso</span>
              <Link href="/progetti" className="text-[11.5px] font-medium" style={{ color: "var(--brand)" }}>Tutti →</Link>
            </div>
            {attivi.map((p) => {
              const left = daysFromToday(p.endDate);
              return (
                <div key={p.id} className="flex items-center gap-4 px-5 py-3 border-b last:border-0" style={{ borderColor: "var(--line-2)" }}>
                  <Avatar name={p.lead} size={24} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12.5px] font-medium truncate">{p.name}</div>
                    <div className="t-meta">{clientName(p.clientId)}</div>
                  </div>
                  <div className="w-20 shrink-0">
                    <Progress value={p.progress} />
                  </div>
                  <span className="text-[11px] tabular w-7 text-right shrink-0" style={{ color: "var(--text-3)" }}>{p.progress}%</span>
                  <span className="text-[11px] tabular shrink-0" style={{ color: left <= 14 ? "var(--warn)" : "var(--text-3)" }}>{dayMonth(p.endDate)}</span>
                </div>
              );
            })}
          </div>

          {/* Verbale — compatto */}
          {ultimoVerbale && (
            <div className="card overflow-hidden">
              <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid var(--line-2)" }}>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold">Ultimo verbale</span>
                  <Badge tone="brand" dot>AI</Badge>
                </div>
                <Link href="/studio" className="text-[11.5px] font-medium" style={{ color: "var(--brand)" }}>Apri →</Link>
              </div>
              <div className="px-5 py-3">
                <div className="text-[12.5px] font-medium mb-1">{ultimoVerbale.title}</div>
                <p className="text-[12px] leading-relaxed mb-3" style={{ color: "var(--text-2)" }}>
                  {(ultimoVerbale.summary || "").slice(0, 200)}…
                </p>
                <div className="space-y-1.5">
                  {(ultimoVerbale.actions ?? []).slice(0, 3).map((a, i) => (
                    <label key={i} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={a.done} onChange={() => s.toggleAction(ultimoVerbale.id, i)} className="accent-[var(--brand)]" />
                      <span className="text-[11.5px]" style={{ color: a.done ? "var(--text-3)" : "var(--text)", textDecoration: a.done ? "line-through" : "none" }}>
                        <b>{a.who}</b> — {a.what}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Colonna destra: Riunioni + Funnel */}
        <div className="space-y-5">
          <div className="card overflow-hidden">
            <div className="px-5 py-3" style={{ borderBottom: "1px solid var(--line-2)" }}>
              <span className="text-[13px] font-semibold">Prossime riunioni</span>
            </div>
            {prossimeRiunioni.map((m) => (
              <div key={m.id} className="flex items-center gap-3 px-5 py-2.5 border-b last:border-0" style={{ borderColor: "var(--line-2)" }}>
                <div className="text-center shrink-0 w-9">
                  <div className="text-[15px] font-semibold tabular leading-none">{new Date(m.date).getDate()}</div>
                  <div className="text-[10px] uppercase" style={{ color: "var(--text-3)" }}>
                    {MONTHS[new Date(m.date).getMonth()].slice(0, 3)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12.5px] font-medium truncate">{m.title}</div>
                  <div className="t-meta truncate">{m.participants.join(", ")}</div>
                </div>
                {m.status === "elaborato" ? <Badge tone="ok" dot>Verbale</Badge> : <Badge tone="neutral" dot>In arrivo</Badge>}
              </div>
            ))}
          </div>

          <div className="card overflow-hidden">
            <div className="px-5 py-3" style={{ borderBottom: "1px solid var(--line-2)" }}>
              <span className="text-[13px] font-semibold">Pipeline</span>
            </div>
            <div className="px-5 py-3 space-y-3">
              {STAGES.filter((st) => !["vinto","perso"].includes(st.key)).map((st) => {
                const items = s.leads.filter((l) => l.stage === st.key);
                const val = items.reduce((a, l) => a + l.value, 0);
                const max = Math.max(...STAGES.map((x) => s.leads.filter((l) => l.stage === x.key).reduce((a, l) => a + l.value, 0)), 1);
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
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── KPI Card — pulita, futuristica ── */
function KPI({ label, value, trend, positive, tag, danger }: {
  label: string; value: string; trend?: string; positive?: boolean; tag?: string; danger?: boolean;
}) {
  return (
    <div className="card card-pad">
      <div className="t-label">{label}</div>
      <div className="text-[24px] font-semibold tracking-tight leading-none mt-2" style={danger ? { color: "var(--danger)" } : undefined}>
        {value}
      </div>
      <div className="mt-2 flex items-center gap-1.5">
        {trend && (
          <span className="text-[11px] font-medium" style={{ color: positive ? "var(--ok)" : "var(--text-3)" }}>
            {positive ? "▲" : ""} {trend}
          </span>
        )}
        {tag && (
          <span className="text-[11px]" style={{ color: danger ? "var(--danger)" : "var(--text-3)" }}>{tag}</span>
        )}
      </div>
    </div>
  );
}
