/**
 * Dataset dimostrativo di OCRA.
 *
 * Serve alla demo per essere completamente navigabile senza database.
 * I tipi rispecchiano 1:1 i modelli Prisma: quando il DB è collegato
 * basta sostituire le funzioni `seed*` con query `db.<model>.findMany()`.
 */

export type Stage = "lead" | "contatto" | "proposta" | "negoziazione" | "vinto" | "perso";
export type ProjectStatus = "briefing" | "produzione" | "revisione" | "consegnato";
export type InvoiceStatus = "pending" | "paid" | "overdue";

export type Service = {
  id: string;
  name: string;
  category: "Business Development" | "Creative Development" | "Marketing Development";
  price: number;
  deliverables: string[];
  weeks: number;
};

export type Client = {
  id: string;
  companyName: string;
  vatNumber: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  sector: string;
  status: "active" | "onboarding" | "archived";
  since: string;
  owner: string;
  notes: string;
  driveFolderId?: string;
  trelloBoardId?: string;
};

export type Project = {
  id: string;
  clientId: string;
  name: string;
  poCode: string;
  status: ProjectStatus;
  budgetPlanned: number;
  budgetActual: number;
  startDate: string;
  endDate: string;
  lead: string;
  progress: number;
};

export type Lead = {
  id: string;
  contactName: string;
  company: string;
  contactEmail: string;
  stage: Stage;
  value: number;
  source: string;
  owner: string;
  firstTouch?: string;
  lastTouch: string;
  nextFollowUp: string | null;
  note: string;
};

export type Invoice = {
  id: string;
  poCode: string;
  direction: "E" | "U"; // Entrata / Uscita
  counterpart: string;
  projectId?: string;
  amount: number;
  vatAmount: number;
  description: string;
  issueDate: string;
  dueDate: string;
  paidDate: string | null;
  status: InvoiceStatus;
};

export type Meeting = {
  id: string;
  title: string;
  date: string;
  duration: number;
  participants: string[];
  source: "fireflies" | "manuale" | "upload";
  status: "trascritto" | "elaborato" | "in_corso";
  summary?: string;
  decisions?: string[];
  actions?: { who: string; what: string; when: string; done: boolean }[];
  transcription?: string;
};

export type Bando = {
  id: string;
  name: string;
  entity: string;
  deadline: string;
  amount: string;
  relevance: "alta" | "media" | "bassa";
  status: "new" | "valutazione" | "in_scrittura" | "scartato";
  why: string;
  url: string;
};

export type ContentItem = {
  id: string;
  clientId: string;
  channel: "Instagram" | "LinkedIn" | "Newsletter" | "TikTok";
  title: string;
  date: string;
  status: "idea" | "bozza" | "approvazione" | "programmato" | "pubblicato";
  owner: string;
};

export type Release = {
  id: string;
  clientId: string;
  artistName: string;
  trackTitle: string;
  distributor: string;
  releaseDate: string;
  status: "planning" | "produzione" | "pitch" | "uscita";
  cover: boolean;
  master: boolean;
  pitch: boolean;
};

/* ─────────────────────────── SEED ─────────────────────────── */

export const TENANT = {
  name: "Fulcro Lucem",
  acronym: "FL",
  colorPrimary: "#131417",
  colorSecondary: "#e85d24",
  team: ["Daniele", "Erika", "Carlo", "Sara", "Marco"],
};

export const services: Service[] = [
  { id: "s1", name: "Business Audit", category: "Business Development", price: 2900, weeks: 3,
    deliverables: ["Analisi processi as-is", "Mappa opportunità", "Report + presentazione"] },
  { id: "s2", name: "Development Program", category: "Business Development", price: 9800, weeks: 12,
    deliverables: ["Piano di sviluppo 12 mesi", "KPI e cruscotto", "Affiancamento mensile"] },
  { id: "s3", name: "Creative Direction", category: "Creative Development", price: 1800, weeks: 2,
    deliverables: ["Direzione artistica", "Moodboard", "Linee guida esecutive"] },
  { id: "s4", name: "Brand Development", category: "Creative Development", price: 4800, weeks: 8,
    deliverables: ["Naming e positioning", "Identità visiva completa", "Brand book"] },
  { id: "s5", name: "Campaign Development", category: "Creative Development", price: 3900, weeks: 6,
    deliverables: ["Concept creativo", "Key visual", "Declinazioni per canale"] },
  { id: "s6", name: "Experience Development", category: "Creative Development", price: 4200, weeks: 7,
    deliverables: ["Concept esperienziale", "Progetto allestimento", "Regia evento"] },
  { id: "s7", name: "Marketing Strategy", category: "Marketing Development", price: 1800, weeks: 3,
    deliverables: ["Analisi target", "Piano canali", "Budget media"] },
  { id: "s8", name: "Communication Strategy", category: "Marketing Development", price: 2700, weeks: 4,
    deliverables: ["Messaging framework", "Tone of voice", "Piano editoriale trimestrale"] },
  { id: "s9", name: "Launch Strategy", category: "Marketing Development", price: 3900, weeks: 6,
    deliverables: ["Piano di lancio", "Calendario attivazioni", "Kit stampa"] },
  { id: "s10", name: "Growth Management", category: "Marketing Development", price: 1200, weeks: 4,
    deliverables: ["Gestione continuativa", "Report mensile", "Ottimizzazione campagne"] },
];

export const clients: Client[] = [
  { id: "c1", companyName: "St'Art Factory", vatNumber: "IT04412870658", contactName: "Giulia Ferrante",
    contactEmail: "giulia@startfactory.it", contactPhone: "+39 340 118 2244", sector: "Cultura & Eventi",
    status: "active", since: "2025-02-11", owner: "Daniele", driveFolderId: "1AbCstart", trelloBoardId: "bStArt01",
    notes: "Cliente storico. Rinnovo annuale a febbraio. Referente operativa: Giulia." },
  { id: "c2", companyName: "Duit", vatNumber: "IT03998120612", contactName: "Marco Iannone",
    contactEmail: "marco@duit.app", contactPhone: "+39 328 774 0091", sector: "Tech / App",
    status: "active", since: "2025-06-03", owner: "Erika", driveFolderId: "1AbCduit", trelloBoardId: "bDuit02",
    notes: "Lancio v2 dell'app previsto a novembre. Molto sensibili alle scadenze." },
  { id: "c3", companyName: "Cantine Verrini", vatNumber: "IT02887410630", contactName: "Anna Verrini",
    contactEmail: "anna@cantineverrini.it", contactPhone: "+39 335 660 8812", sector: "Food & Beverage",
    status: "active", since: "2024-10-18", owner: "Daniele", driveFolderId: "1AbCverrini", trelloBoardId: "bVerr03",
    notes: "Rebranding completato. Ora in gestione continuativa social." },
  { id: "c4", companyName: "Nova Fitness Club", vatNumber: "IT05120390659", contactName: "Luca Ranieri",
    contactEmail: "luca@novafitness.it", contactPhone: "+39 347 220 9911", sector: "Sport & Wellness",
    status: "onboarding", since: "2026-08-28", owner: "Erika",
    notes: "Onboarding in corso. Kickoff fissato, mancano materiali brand." },
  { id: "c5", companyName: "Officina Meridiana", vatNumber: "IT04701220657", contactName: "Serena Colella",
    contactEmail: "serena@officinameridiana.com", contactPhone: "+39 331 445 7788", sector: "Design & Arredo",
    status: "active", since: "2025-11-05", owner: "Carlo", driveFolderId: "1AbCmerid", trelloBoardId: "bMerid04",
    notes: "Progetto showroom. Budget ampio, decisioni lente." },
];

export const projects: Project[] = [
  { id: "p1", clientId: "c2", name: "Duit — Lancio v2", poCode: "FL/LAUNCH/03-2026/DUIT/E",
    status: "produzione", budgetPlanned: 12500, budgetActual: 8420, startDate: "2026-07-15",
    endDate: "2026-11-14", lead: "Erika", progress: 62 },
  { id: "p2", clientId: "c1", name: "St'Art — Festival autunnale", poCode: "FL/EXPERI/01-2026/STARTFACTORY/E",
    status: "revisione", budgetPlanned: 9800, budgetActual: 9110, startDate: "2026-05-04",
    endDate: "2026-09-28", lead: "Daniele", progress: 84 },
  { id: "p3", clientId: "c5", name: "Officina — Identità showroom", poCode: "FL/BRAND/04-2026/OFFICINAMERIDIANA/E",
    status: "briefing", budgetPlanned: 6400, budgetActual: 900, startDate: "2026-09-01",
    endDate: "2026-12-19", lead: "Carlo", progress: 12 },
  { id: "p4", clientId: "c3", name: "Verrini — Gestione social Q3/Q4", poCode: "FL/GROWTH/02-2026/CANTINEVERRINI/E",
    status: "produzione", budgetPlanned: 7200, budgetActual: 4800, startDate: "2026-07-01",
    endDate: "2026-12-31", lead: "Sara", progress: 50 },
  { id: "p5", clientId: "c1", name: "St'Art — Campagna abbonamenti", poCode: "FL/CAMPAI/05-2026/STARTFACTORY/E",
    status: "consegnato", budgetPlanned: 3900, budgetActual: 3900, startDate: "2026-03-10",
    endDate: "2026-06-20", lead: "Daniele", progress: 100 },
];

export const leads: Lead[] = [
  { id: "l1", contactName: "Federico Amato", company: "Terrazza Bianca", contactEmail: "f.amato@terrazzabianca.it",
    stage: "lead", value: 4800, source: "Instagram", owner: "Erika", lastTouch: "2026-09-05",
    nextFollowUp: "2026-09-10", note: "Ha scritto in DM dopo il festival. Vuole rifare l'identità." },
  { id: "l2", contactName: "Chiara Petrucci", company: "Studio Legale Petrucci", contactEmail: "chiara@petruccilex.it",
    stage: "lead", value: 2700, source: "Referral Daniele", owner: "Daniele", lastTouch: "2026-09-02",
    nextFollowUp: "2026-09-09", note: "Cerca posizionamento e presenza LinkedIn." },
  { id: "l3", contactName: "Alessandro Moro", company: "Moro Costruzioni", contactEmail: "a.moro@morocostruzioni.it",
    stage: "contatto", value: 9800, source: "Sito web", owner: "Daniele", lastTouch: "2026-08-30",
    nextFollowUp: "2026-09-11", note: "Primo call fatto. Interessato al Development Program." },
  { id: "l4", contactName: "Valeria Sanna", company: "Kōbo Ceramica", contactEmail: "valeria@kobo.studio",
    stage: "proposta", value: 6600, source: "Fiera Artigiano", owner: "Carlo", lastTouch: "2026-09-04",
    nextFollowUp: "2026-09-12", note: "Preventivo inviato il 4/9. Brand + Launch." },
  { id: "l5", contactName: "Nicola Bruni", company: "Bruni Automotive", contactEmail: "nicola@bruniauto.it",
    stage: "proposta", value: 4200, source: "LinkedIn", owner: "Erika", lastTouch: "2026-09-01",
    nextFollowUp: "2026-09-15", note: "Chiede una revisione sul perimetro dell'evento." },
  { id: "l6", contactName: "Serena Colella", company: "Officina Meridiana", contactEmail: "serena@officinameridiana.com",
    stage: "negoziazione", value: 6400, source: "Referral", owner: "Carlo", lastTouch: "2026-09-06",
    nextFollowUp: "2026-09-09", note: "Trattativa su tempi di pagamento. Chiude questa settimana." },
  { id: "l7", contactName: "Luca Ranieri", company: "Nova Fitness Club", contactEmail: "luca@novafitness.it",
    stage: "vinto", value: 5400, source: "Passaparola", owner: "Erika", lastTouch: "2026-08-28",
    nextFollowUp: null, note: "Firmato. Passato a onboarding." },
  { id: "l8", contactName: "Paolo Guerra", company: "Guerra Immobiliare", contactEmail: "paolo@guerraimmobiliare.it",
    stage: "perso", value: 3900, source: "Sito web", owner: "Daniele", lastTouch: "2026-08-12",
    nextFollowUp: null, note: "Persi sul prezzo. Rivalutare tra 6 mesi." },
];

export const invoices: Invoice[] = [
  { id: "i1", poCode: "FL/LAUNCH/03-2026/DUIT/E", direction: "E", counterpart: "Duit Srl", projectId: "p1",
    amount: 6250, vatAmount: 1375, description: "Acconto 50% — Lancio v2", issueDate: "2026-07-18",
    dueDate: "2026-08-17", paidDate: "2026-08-11", status: "paid" },
  { id: "i2", poCode: "FL/EXPERI/01-2026/STARTFACTORY/E", direction: "E", counterpart: "St'Art Factory APS", projectId: "p2",
    amount: 4900, vatAmount: 1078, description: "Saldo festival autunnale", issueDate: "2026-08-20",
    dueDate: "2026-09-19", paidDate: null, status: "pending" },
  { id: "i3", poCode: "FL/GROWTH/02-2026/CANTINEVERRINI/E", direction: "E", counterpart: "Cantine Verrini Srl", projectId: "p4",
    amount: 1200, vatAmount: 264, description: "Canone agosto — gestione social", issueDate: "2026-08-01",
    dueDate: "2026-08-31", paidDate: null, status: "overdue" },
  { id: "i4", poCode: "FL/BRAND/04-2026/OFFICINAMERIDIANA/E", direction: "E", counterpart: "Officina Meridiana Srl", projectId: "p3",
    amount: 3200, vatAmount: 704, description: "Acconto identità showroom", issueDate: "2026-09-02",
    dueDate: "2026-10-02", paidDate: null, status: "pending" },
  { id: "i5", poCode: "FL/CAMPAI/05-2026/STARTFACTORY/E", direction: "E", counterpart: "St'Art Factory APS", projectId: "p5",
    amount: 3900, vatAmount: 858, description: "Saldo campagna abbonamenti", issueDate: "2026-06-22",
    dueDate: "2026-07-22", paidDate: "2026-07-19", status: "paid" },
  { id: "i6", poCode: "FL/PROD/06-2026/STUDIOLUCE/U", direction: "U", counterpart: "Studio Luce (fotografo)", projectId: "p2",
    amount: 1400, vatAmount: 308, description: "Shooting festival — service esterno", issueDate: "2026-08-14",
    dueDate: "2026-09-13", paidDate: null, status: "pending" },
  { id: "i7", poCode: "FL/PROD/07-2026/TIPOGRAFIANORD/U", direction: "U", counterpart: "Tipografia Nord", projectId: "p2",
    amount: 860, vatAmount: 189, description: "Stampa materiali festival", issueDate: "2026-08-02",
    dueDate: "2026-09-01", paidDate: null, status: "overdue" },
  { id: "i8", poCode: "FL/TOOLS/08-2026/SAAS/U", direction: "U", counterpart: "Abbonamenti software",
    amount: 340, vatAmount: 75, description: "Licenze mensili (Adobe, Figma, Fireflies)", issueDate: "2026-09-01",
    dueDate: "2026-09-30", paidDate: null, status: "pending" },
];

export const meetings: Meeting[] = [
  {
    id: "m1", title: "Duit — Allineamento lancio v2", date: "2026-09-08T10:00:00", duration: 47,
    participants: ["Erika", "Marco Iannone", "Carlo"], source: "fireflies", status: "elaborato",
    summary:
      "Rivisto lo stato del lancio v2 di Duit. La beta chiusa parte il 25 settembre con 200 utenti selezionati. " +
      "Il key visual è approvato, restano da chiudere le declinazioni per lo store. Marco chiede di anticipare " +
      "la comunicazione stampa di una settimana per intercettare un evento di settore.",
    decisions: [
      "Beta chiusa confermata al 25 settembre con 200 utenti.",
      "Key visual approvato nella versione B (fondo scuro).",
      "Comunicato stampa anticipato al 4 novembre.",
    ],
    actions: [
      { who: "Carlo", what: "Declinazioni store (App Store + Play) in 6 formati", when: "2026-09-15", done: false },
      { who: "Erika", what: "Riscrivere il comunicato con la nuova data", when: "2026-09-12", done: true },
      { who: "Marco Iannone", what: "Fornire lista dei 200 beta tester", when: "2026-09-18", done: false },
    ],
  },
  {
    id: "m2", title: "Interno — Revisione pipeline settembre", date: "2026-09-07T09:30:00", duration: 32,
    participants: ["Daniele", "Erika", "Carlo"], source: "fireflies", status: "elaborato",
    summary:
      "Passata in rassegna la pipeline. Officina Meridiana è la trattativa più calda e si chiude entro venerdì. " +
      "Deciso di alzare il prezzo minimo del Brand Development a 4.800 e di non fare più preventivi sotto i 1.500 euro.",
    decisions: [
      "Nessun preventivo sotto i 1.500 € da settembre.",
      "Officina Meridiana: concedere 60 giorni di pagamento pur di chiudere.",
      "Guerra Immobiliare in stand-by, ricontattare a febbraio.",
    ],
    actions: [
      { who: "Carlo", what: "Chiudere Officina Meridiana", when: "2026-09-11", done: false },
      { who: "Daniele", what: "Aggiornare il listino sul sito", when: "2026-09-16", done: false },
    ],
  },
  {
    id: "m3", title: "St'Art Factory — Debrief festival", date: "2026-09-09T15:00:00", duration: 38,
    participants: ["Daniele", "Giulia Ferrante", "Sara"], source: "fireflies", status: "trascritto",
    transcription: `Daniele: Allora Giulia, partiamo dal festival. Numeri alla mano com'è andata?
Giulia Ferrante: Meglio del previsto. Avevamo stimato 1.800 presenze sui tre giorni, ne abbiamo fatte 2.340. Il sabato sera è stato il picco, quasi mille persone.
Sara: Sui social abbiamo fatto 480.000 impression, con il reel del sabato che da solo ha fatto 190.000.
Daniele: Bene. E i problemi?
Giulia Ferrante: Il venerdì l'ingresso è stato un disastro, quaranta minuti di coda. Avevamo due varchi e non bastavano. E il servizio bar è finito a corto di bicchieri alle undici.
Daniele: Il bar non è nostro però.
Giulia Ferrante: No, è del fornitore, ma la gente si è lamentata con noi. Comunque l'anno prossimo cambiamo fornitore, l'abbiamo già deciso internamente.
Sara: Una cosa che ha funzionato tantissimo è stata la mappa interattiva sul sito. Il 60% dei visitatori l'ha aperta dal telefono.
Daniele: Quindi la teniamo e la sviluppiamo. Giulia, sul budget come siamo messi?
Giulia Ferrante: Abbiamo sforato di circa quattromila euro, soprattutto sull'allestimento. Però abbiamo incassato di più sui biglietti, quindi in pareggio.
Daniele: Ok. Io direi che le priorità per l'edizione 2027 sono tre: risolvere gli ingressi, cambiare il fornitore bar, e potenziare la parte digitale partendo dalla mappa.
Giulia Ferrante: D'accordo. Quando ci rivediamo per iniziare a pianificare?
Daniele: Facciamo entro fine ottobre. Prima però mi servirebbe un report scritto con tutti i numeri, così lo portiamo al consiglio direttivo.
Giulia Ferrante: Te lo mando io. Mi servono un paio di settimane perché aspetto ancora i dati del bar.
Daniele: Va bene. Sara, tu intanto prepari il recap social con i migliori contenuti?
Sara: Sì, entro venerdì prossimo.
Daniele: Ultima cosa: il bando Cultura Futuro Urbano scade il 3 novembre. Se lo vogliamo fare dobbiamo decidere entro settembre perché serve tempo per il progetto.
Giulia Ferrante: Interessa molto al presidente. Ne parlo in consiglio e ti dico entro il 20 settembre.
Daniele: Perfetto, allora ci sentiamo.`,
  },
];

export const bandi: Bando[] = [
  { id: "b1", name: "Voucher Digitalizzazione PMI 2026 — II finestra", entity: "Camera di Commercio",
    deadline: "2026-10-15", amount: "fino a 10.000 €", relevance: "alta", status: "new",
    why: "Copre l'80% dei costi di software e consulenza digitale: applicabile direttamente a OCRA per i clienti PMI.",
    url: "https://example.gov.it/voucher-digitale" },
  { id: "b2", name: "Bando Cultura Futuro Urbano", entity: "Ministero della Cultura",
    deadline: "2026-11-03", amount: "20.000 – 80.000 €", relevance: "alta", status: "in_scrittura",
    why: "Perfetto per St'Art Factory: rigenerazione urbana tramite eventi culturali. Fulcro come partner tecnico.",
    url: "https://example.gov.it/cultura-futuro" },
  { id: "b3", name: "Nuova Sabatini — beni immateriali", entity: "MIMIT",
    deadline: "2026-12-31", amount: "variabile", relevance: "media", status: "valutazione",
    why: "Finanziabile l'acquisto di software gestionale. Da valutare per i clienti con partita IVA strutturata.",
    url: "https://example.gov.it/sabatini" },
  { id: "b4", name: "Contributi Internazionalizzazione SIMEST", entity: "SIMEST",
    deadline: "2026-09-30", amount: "fino a 300.000 €", relevance: "bassa", status: "scartato",
    why: "Richiede export consolidato: nessun cliente attuale ha i requisiti.",
    url: "https://example.gov.it/simest" },
];

export const contentPlan: ContentItem[] = [
  { id: "ct1", clientId: "c3", channel: "Instagram", title: "Reel vendemmia — giorno 1", date: "2026-09-09", status: "programmato", owner: "Sara" },
  { id: "ct2", clientId: "c3", channel: "Instagram", title: "Carosello: i 4 vitigni", date: "2026-09-11", status: "approvazione", owner: "Sara" },
  { id: "ct3", clientId: "c2", channel: "LinkedIn", title: "Teaser v2 — post fondatore", date: "2026-09-10", status: "bozza", owner: "Erika" },
  { id: "ct4", clientId: "c1", channel: "Newsletter", title: "Programma festival completo", date: "2026-09-12", status: "programmato", owner: "Daniele" },
  { id: "ct5", clientId: "c2", channel: "TikTok", title: "Behind the scenes team Duit", date: "2026-09-13", status: "idea", owner: "Carlo" },
  { id: "ct6", clientId: "c3", channel: "Instagram", title: "Story Q&A con Anna", date: "2026-09-08", status: "pubblicato", owner: "Sara" },
];

export const releases: Release[] = [
  { id: "r1", clientId: "c1", artistName: "Nàiade", trackTitle: "Vetro", distributor: "Believe", releaseDate: "2026-10-03",
    status: "pitch", cover: true, master: true, pitch: false },
  { id: "r2", clientId: "c1", artistName: "Kilo Nove", trackTitle: "Ultimo Piano", distributor: "DistroKid", releaseDate: "2026-11-14",
    status: "produzione", cover: false, master: true, pitch: false },
];

/* ─────────────────────── UTILITÀ ─────────────────────── */

export const STAGES: { key: Stage; label: string }[] = [
  { key: "lead", label: "Lead" },
  { key: "contatto", label: "Primo contatto" },
  { key: "proposta", label: "Proposta inviata" },
  { key: "negoziazione", label: "Negoziazione" },
  { key: "vinto", label: "Vinto" },
];

export const eur = (n: number) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

export const eur2 = (n: number) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(n);

export const dateIt = (d: string) =>
  new Intl.DateTimeFormat("it-IT", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(d));

export const dayMonth = (d: string) =>
  new Intl.DateTimeFormat("it-IT", { day: "2-digit", month: "short" }).format(new Date(d));

/** Giorni da oggi (negativo = passato). Data di riferimento della demo. */
export const TODAY = new Date("2026-09-09T09:00:00");

export const daysFromToday = (d: string) =>
  Math.round((new Date(d).getTime() - TODAY.getTime()) / 86400000);

export const clientName = (id: string) =>
  clients.find((c) => c.id === id)?.companyName ?? "—";

/** Codice PO secondo lo standard Fulcro: FL/SERVIZIO/NN-ANNO/CLIENTE/E|U */
export function generatePoCode(
  service: string, n: number, year: number, client: string, dir: "E" | "U", acronym = TENANT.acronym
) {
  const svc = service.replace(/\s+/g, "").substring(0, 6).toUpperCase();
  return `${acronym}/${svc}/${String(n).padStart(2, "0")}-${year}/${client.replace(/\s+/g, "").toUpperCase()}/${dir}`;
}
