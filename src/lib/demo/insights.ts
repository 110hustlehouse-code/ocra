import { daysFromToday, clientName, eur, type Invoice, type Lead, type Project, type Meeting, type Bando } from "./data";

export type Alert = {
  id: string;
  severity: "danger" | "warn" | "info";
  area: string;
  title: string;
  detail: string;
  href: string;
  cta: string;
};

/**
 * Il cuore del sistema: incrocia contabilità, pipeline, progetti, verbali e
 * bandi e restituisce solo ciò che richiede una decisione oggi.
 * È la differenza fra un gestionale e un assistente.
 */
export function buildAlerts(d: {
  invoices: Invoice[]; leads: Lead[]; projects: Project[]; meetings: Meeting[]; bandi: Bando[];
}): Alert[] {
  const out: Alert[] = [];

  // 1. Fatture scadute
  for (const i of d.invoices) {
    if (i.status !== "overdue") continue;
    const late = -daysFromToday(i.dueDate);
    out.push({
      id: "inv-" + i.id,
      severity: "danger",
      area: "Contabilità",
      title: `${i.counterpart} — ${i.direction === "E" ? "insoluto" : "da pagare"} da ${late} giorni`,
      detail: `${i.description} · ${eur(i.amount)} + IVA · PO ${i.poCode}`,
      href: "/operativo",
      cta: i.direction === "E" ? "Sollecita" : "Paga",
    });
  }

  // 2. Follow-up commerciali scaduti o in giornata
  for (const l of d.leads) {
    if (!l.nextFollowUp || l.stage === "vinto" || l.stage === "perso") continue;
    const gap = daysFromToday(l.nextFollowUp);
    if (gap > 1) continue;
    out.push({
      id: "lead-" + l.id,
      severity: gap < 0 ? "danger" : "warn",
      area: "Pipeline",
      title:
        gap < 0
          ? `Follow-up saltato: ${l.company} (${-gap}g)`
          : `Follow-up oggi: ${l.company}`,
      detail: `${l.contactName} · ${eur(l.value)} · ${l.note}`,
      href: "/pipeline",
      cta: "Apri trattativa",
    });
  }

  // 3. Progetti oltre budget o in scadenza
  for (const p of d.projects) {
    if (p.status === "consegnato") continue;
    const left = daysFromToday(p.endDate);
    const burn = p.budgetPlanned ? p.budgetActual / p.budgetPlanned : 0;
    if (burn > 0.85 && p.progress < 90) {
      out.push({
        id: "prj-b-" + p.id,
        severity: "warn",
        area: "Progetti",
        title: `${p.name}: ${Math.round(burn * 100)}% del budget consumato al ${p.progress}% di avanzamento`,
        detail: `${clientName(p.clientId)} · responsabile ${p.lead}`,
        href: `/clienti/${p.clientId}`,
        cta: "Verifica",
      });
    }
    if (left <= 21 && left >= 0 && p.progress < 90) {
      out.push({
        id: "prj-d-" + p.id,
        severity: left <= 7 ? "danger" : "warn",
        area: "Progetti",
        title: `${p.name} consegna fra ${left} giorni, avanzamento ${p.progress}%`,
        detail: `${clientName(p.clientId)} · responsabile ${p.lead}`,
        href: `/clienti/${p.clientId}`,
        cta: "Apri progetto",
      });
    }
  }

  // 4. Azioni da verbale scadute
  for (const m of d.meetings) {
    for (const a of m.actions ?? []) {
      if (a.done) continue;
      const gap = daysFromToday(a.when);
      if (gap > 3) continue;
      out.push({
        id: `act-${m.id}-${a.what.slice(0, 8)}`,
        severity: gap < 0 ? "danger" : "info",
        area: "Verbali",
        title: `${a.who}: ${a.what}`,
        detail: gap < 0 ? `Scaduta da ${-gap} giorni · da "${m.title}"` : `Entro ${gap} giorni · da "${m.title}"`,
        href: "/studio",
        cta: "Vedi verbale",
      });
    }
  }

  // 5. Bandi in scadenza ancora da lavorare
  for (const b of d.bandi) {
    if (b.status === "scartato") continue;
    const left = daysFromToday(b.deadline);
    if (left > 45 || left < 0) continue;
    out.push({
      id: "bando-" + b.id,
      severity: left <= 20 ? "warn" : "info",
      area: "Bandi",
      title: `${b.name} scade fra ${left} giorni`,
      detail: `${b.entity} · ${b.amount} · rilevanza ${b.relevance}`,
      href: "/studio",
      cta: "Valuta",
    });
  }

  const rank = { danger: 0, warn: 1, info: 2 };
  return out.sort((a, b) => rank[a.severity] - rank[b.severity]);
}
