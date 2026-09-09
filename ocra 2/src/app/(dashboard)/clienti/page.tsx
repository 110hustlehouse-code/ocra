"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/lib/demo/store";
import { eur, dateIt, TENANT } from "@/lib/demo/data";
import { Badge, Panel, PageHead, Avatar, Progress } from "@/components/ui/kit";
import { Modal } from "@/components/ui/modal";

export default function ClientiPage() {
  return (
    <React.Suspense fallback={null}>
      <ClientiInner />
    </React.Suspense>
  );
}

function ClientiInner() {
  const s = useStore();
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = React.useState("");
  const [open, setOpen] = React.useState(params.get("nuovo") === "1");

  const list = s.clients.filter((c) =>
    [c.companyName, c.contactName, c.sector].join(" ").toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="rise">
      <PageHead
        title="Clienti"
        sub="Anagrafica, progetti attivi e onboarding automatico"
        actions={
          <>
            <input
              className="field w-56"
              placeholder="Cerca cliente…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button className="btn btn-primary" onClick={() => setOpen(true)}>+ Nuovo cliente</button>
          </>
        }
      />

      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          ["Clienti attivi", s.clients.filter((c) => c.status === "active").length],
          ["In onboarding", s.clients.filter((c) => c.status === "onboarding").length],
          ["Progetti aperti", s.projects.filter((p) => p.status !== "consegnato").length],
          ["Valore progetti", eur(s.projects.filter((p) => p.status !== "consegnato").reduce((a, p) => a + p.budgetPlanned, 0))],
        ].map(([l, v]) => (
          <div key={l as string} className="card card-pad">
            <div className="t-label">{l as string}</div>
            <div className="text-[20px] font-semibold tabular mt-1.5 tracking-tight">{v}</div>
          </div>
        ))}
      </div>

      <Panel title={`Portafoglio (${list.length})`}>
        <div className="scroll-x">
          <table className="tbl">
            <thead>
              <tr>
                <th>Azienda</th><th>Referente</th><th>Settore</th>
                <th>Progetti</th><th>Responsabile</th><th>Cliente dal</th><th>Stato</th>
              </tr>
            </thead>
            <tbody>
              {list.map((c) => {
                const prj = s.projects.filter((p) => p.clientId === c.id && p.status !== "consegnato");
                return (
                  <tr key={c.id} className="row-link" onClick={() => router.push(`/clienti/${c.id}`)}>
                    <td className="font-medium">{c.companyName}</td>
                    <td style={{ color: "var(--text-2)" }}>{c.contactName}</td>
                    <td style={{ color: "var(--text-2)" }}>{c.sector || "—"}</td>
                    <td className="tabular">{prj.length || "—"}</td>
                    <td><Avatar name={c.owner} size={22} /></td>
                    <td className="t-meta">{dateIt(c.since)}</td>
                    <td>
                      {c.status === "active"
                        ? <Badge tone="ok" dot>Attivo</Badge>
                        : c.status === "onboarding"
                        ? <Badge tone="warn" dot>Onboarding</Badge>
                        : <Badge>Archiviato</Badge>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <OnboardingModal open={open} onClose={() => { setOpen(false); router.replace("/clienti"); }} />
    </div>
  );
}

/* ─────────── Onboarding ─────────── */

const STEPS = [
  "Scheda cliente creata in anagrafica",
  "Cartella Google Drive generata con struttura standard",
  "Board Trello creata con le liste di progetto",
  "Codice PO assegnato secondo lo standard Fulcro",
  "Email di benvenuto inviata al referente",
  "Kickoff proposto in calendario · Fireflies attivato",
];

function OnboardingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const s = useStore();
  const [f, setF] = React.useState({
    companyName: "", contactName: "", contactEmail: "", contactPhone: "",
    vatNumber: "", sector: "", owner: TENANT.team[0], notes: "",
    createProject: true, projectName: "", budget: "",
  });
  const [phase, setPhase] = React.useState<"form" | "running" | "done">("form");
  const [step, setStep] = React.useState(0);
  const [created, setCreated] = React.useState<string | null>(null);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  const valid = f.companyName.trim() && f.contactName.trim() && f.contactEmail.includes("@");

  const run = () => {
    setPhase("running");
    setStep(0);
    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      setStep(i);
      if (i >= STEPS.length) {
        clearInterval(timer);
        const c = s.addClient(
          {
            companyName: f.companyName, vatNumber: f.vatNumber, contactName: f.contactName,
            contactEmail: f.contactEmail, contactPhone: f.contactPhone, sector: f.sector,
            status: "onboarding", since: new Date().toISOString().slice(0, 10),
            owner: f.owner, notes: f.notes,
          },
          { createProject: f.createProject, projectName: f.projectName, budget: Number(f.budget) || 0 }
        );
        setCreated(c.id);
        setPhase("done");
      }
    }, 420);
  };

  const reset = () => {
    setPhase("form"); setStep(0); setCreated(null);
    setF({ companyName: "", contactName: "", contactEmail: "", contactPhone: "", vatNumber: "",
      sector: "", owner: TENANT.team[0], notes: "", createProject: true, projectName: "", budget: "" });
  };

  return (
    <Modal
      open={open}
      onClose={() => { onClose(); setTimeout(reset, 250); }}
      title="Onboarding cliente"
      sub="Una scheda compilata, sei operazioni eseguite in automatico"
      width={620}
    >
      {phase === "form" && (
        <div className="card-pad space-y-3.5">
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="lbl">Ragione sociale *</label>
              <input className="field" value={f.companyName} onChange={set("companyName")} placeholder="Es. Terrazza Bianca Srl" />
            </div>
            <div>
              <label className="lbl">Partita IVA</label>
              <input className="field" value={f.vatNumber} onChange={set("vatNumber")} placeholder="IT01234567890" />
            </div>
            <div>
              <label className="lbl">Referente *</label>
              <input className="field" value={f.contactName} onChange={set("contactName")} placeholder="Nome e cognome" />
            </div>
            <div>
              <label className="lbl">Email *</label>
              <input className="field" value={f.contactEmail} onChange={set("contactEmail")} placeholder="nome@azienda.it" />
            </div>
            <div>
              <label className="lbl">Telefono</label>
              <input className="field" value={f.contactPhone} onChange={set("contactPhone")} placeholder="+39 …" />
            </div>
            <div>
              <label className="lbl">Settore</label>
              <input className="field" value={f.sector} onChange={set("sector")} placeholder="Es. Food & Beverage" />
            </div>
            <div>
              <label className="lbl">Responsabile interno</label>
              <select className="field" value={f.owner} onChange={set("owner")}>
                {TENANT.team.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="lbl">Budget primo progetto</label>
              <input className="field" value={f.budget} onChange={set("budget")} placeholder="€" inputMode="numeric" />
            </div>
          </div>

          <div>
            <label className="lbl">Note</label>
            <textarea className="field" rows={2} value={f.notes} onChange={set("notes")} placeholder="Contesto, provenienza, aspettative…" />
          </div>

          <label className="flex items-center gap-2 text-[12.5px] cursor-pointer">
            <input
              type="checkbox"
              checked={f.createProject}
              onChange={(e) => setF((p) => ({ ...p, createProject: e.target.checked }))}
              className="accent-[var(--brand)]"
            />
            Apri subito un progetto con codice PO
          </label>

          {f.createProject && (
            <input className="field" value={f.projectName} onChange={set("projectName")} placeholder="Nome progetto (opzionale)" />
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button className="btn btn-ghost" onClick={onClose}>Annulla</button>
            <button className="btn btn-brand" disabled={!valid} onClick={run}>Avvia onboarding</button>
          </div>
        </div>
      )}

      {phase !== "form" && (
        <div className="card-pad">
          <div className="space-y-2.5">
            {STEPS.map((label, i) => {
              const state = i < step ? "done" : i === step ? "run" : "wait";
              return (
                <div key={label} className="flex items-center gap-2.5">
                  <span
                    className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] shrink-0"
                    style={{
                      background: state === "done" ? "var(--ok)" : state === "run" ? "var(--brand)" : "var(--line-2)",
                      color: state === "wait" ? "var(--text-3)" : "#fff",
                    }}
                  >
                    {state === "done" ? "✓" : state === "run" ? "•" : ""}
                  </span>
                  <span
                    className={`text-[12.5px] ${state === "run" ? "pulsing" : ""}`}
                    style={{ color: state === "wait" ? "var(--text-3)" : "var(--text)" }}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4">
            <Progress value={(step / STEPS.length) * 100} tone={phase === "done" ? "var(--ok)" : "var(--brand)"} />
          </div>

          {phase === "done" && created && (
            <div className="mt-5 flex items-center justify-between gap-3">
              <div className="text-[12.5px]">
                <b className="font-medium">{f.companyName}</b> è operativo.
                <span className="t-meta"> Tempo impiegato: 2,5 secondi contro i 40 minuti abituali.</span>
              </div>
              <Link href={`/clienti/${created}`} className="btn btn-brand shrink-0" onClick={onClose}>
                Apri scheda
              </Link>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
