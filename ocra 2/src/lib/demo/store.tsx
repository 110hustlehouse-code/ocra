"use client";

import * as React from "react";
import {
  clients as seedClients, leads as seedLeads, projects as seedProjects,
  invoices as seedInvoices, meetings as seedMeetings, bandi as seedBandi,
  contentPlan as seedContent, releases as seedReleases,
  type Client, type Lead, type Project, type Invoice, type Meeting,
  type Bando, type ContentItem, type Release, type Stage,
} from "./data";

/**
 * Stato applicativo della demo.
 *
 * Tiene i dati in memoria (con persistenza locale) così ogni azione —
 * creare un cliente, spostare una trattativa, segnare una fattura incassata —
 * ha un effetto reale e visibile in tutta l'interfaccia.
 *
 * Quando il database sarà collegato questo provider viene sostituito da
 * server actions Prisma: i componenti non cambiano.
 */

type State = {
  clients: Client[];
  leads: Lead[];
  projects: Project[];
  invoices: Invoice[];
  meetings: Meeting[];
  bandi: Bando[];
  content: ContentItem[];
  releases: Release[];
};

type Ctx = State & {
  addClient: (c: Omit<Client, "id">, opts: { createProject: boolean; projectName?: string; budget?: number }) => Client;
  moveLead: (id: string, stage: Stage) => void;
  convertLead: (id: string) => void;
  markPaid: (id: string) => void;
  toggleAction: (meetingId: string, index: number) => void;
  setBandoStatus: (id: string, status: Bando["status"]) => void;
  reset: () => void;
};

const KEY = "ocra.demo.v1";

const initial = (): State => ({
  clients: seedClients, leads: seedLeads, projects: seedProjects,
  invoices: seedInvoices, meetings: seedMeetings, bandi: seedBandi,
  content: seedContent, releases: seedReleases,
});

const StoreCtx = React.createContext<Ctx | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<State>(initial);
  const [hydrated, setHydrated] = React.useState(false);

  // Ripristino dopo il mount (evita disallineamenti tra server e client)
  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setState({ ...initial(), ...JSON.parse(raw) });
    } catch { /* storage non disponibile: si prosegue con i dati iniziali */ }
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    try { window.localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignorato */ }
  }, [state, hydrated]);

  const api = React.useMemo<Ctx>(() => ({
    ...state,

    addClient(data, opts) {
      const client: Client = {
        ...data,
        id: "c" + Math.random().toString(36).slice(2, 8),
        driveFolderId: "1" + Math.random().toString(36).slice(2, 10),
        trelloBoardId: "b" + Math.random().toString(36).slice(2, 8),
      };
      setState((s) => {
        const projects = [...s.projects];
        if (opts.createProject) {
          const year = new Date().getFullYear();
          const n = s.projects.length + 1;
          projects.unshift({
            id: "p" + Math.random().toString(36).slice(2, 8),
            clientId: client.id,
            name: opts.projectName || `${client.companyName} — Avvio`,
            poCode: `FL/ONBOAR/${String(n).padStart(2, "0")}-${year}/${client.companyName.replace(/\s+/g, "").toUpperCase()}/E`,
            status: "briefing",
            budgetPlanned: opts.budget ?? 0,
            budgetActual: 0,
            startDate: new Date().toISOString().slice(0, 10),
            endDate: new Date(Date.now() + 90 * 864e5).toISOString().slice(0, 10),
            lead: client.owner,
            progress: 5,
          });
        }
        return { ...s, clients: [client, ...s.clients], projects };
      });
      return client;
    },

    moveLead(id, stage) {
      setState((s) => ({
        ...s,
        leads: s.leads.map((l) => (l.id === id ? { ...l, stage } : l)),
      }));
    },

    convertLead(id) {
      setState((s) => {
        const lead = s.leads.find((l) => l.id === id);
        if (!lead) return s;
        const client: Client = {
          id: "c" + Math.random().toString(36).slice(2, 8),
          companyName: lead.company,
          vatNumber: "",
          contactName: lead.contactName,
          contactEmail: lead.contactEmail,
          contactPhone: "",
          sector: "",
          status: "onboarding",
          since: new Date().toISOString().slice(0, 10),
          owner: lead.owner,
          notes: `Convertito dalla pipeline. Valore trattativa: €${lead.value.toLocaleString("it-IT")}. ${lead.note}`,
        };
        return {
          ...s,
          clients: [client, ...s.clients],
          leads: s.leads.map((l) => (l.id === id ? { ...l, stage: "vinto" as Stage } : l)),
        };
      });
    },

    markPaid(id) {
      setState((s) => ({
        ...s,
        invoices: s.invoices.map((i) =>
          i.id === id
            ? { ...i, status: "paid" as const, paidDate: new Date().toISOString().slice(0, 10) }
            : i
        ),
      }));
    },

    toggleAction(meetingId, index) {
      setState((s) => ({
        ...s,
        meetings: s.meetings.map((m) =>
          m.id !== meetingId || !m.actions
            ? m
            : { ...m, actions: m.actions.map((a, i) => (i === index ? { ...a, done: !a.done } : a)) }
        ),
      }));
    },

    setBandoStatus(id, status) {
      setState((s) => ({ ...s, bandi: s.bandi.map((b) => (b.id === id ? { ...b, status } : b)) }));
    },

    reset() {
      try { window.localStorage.removeItem(KEY); } catch { /* ignorato */ }
      setState(initial());
    },
  }), [state]);

  return <StoreCtx.Provider value={api}>{children}</StoreCtx.Provider>;
}

export function useStore(): Ctx {
  const ctx = React.useContext(StoreCtx);
  if (!ctx) throw new Error("useStore va usato dentro <DemoProvider>");
  return ctx;
}
