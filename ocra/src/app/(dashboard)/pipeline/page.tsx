"use client";

const STAGES = [
  { id: "lead", name: "Lead", color: "#6B7280" },
  { id: "contatto", name: "Primo contatto", color: "#3B82F6" },
  { id: "qualificato", name: "Qualificato", color: "#8B5CF6" },
  { id: "proposta", name: "Proposta inviata", color: "#F59E0B" },
  { id: "negoziazione", name: "Negoziazione", color: "#E85D24" },
  { id: "chiuso", name: "Chiuso vinto", color: "#16A34A" },
];

const DEMO_LEADS = [
  { id: "1", name: "Studio XYZ", contact: "Marco Verdi", value: 4800, stage: "lead", service: "Brand Development" },
  { id: "2", name: "Agenzia Stella", contact: "Laura Bianchi", value: 2900, stage: "contatto", service: "Business Audit" },
  { id: "3", name: "Municipio Roma XV", contact: "Giuseppe Neri", value: 6500, stage: "qualificato", service: "Project Development" },
  { id: "4", name: "Festival d'Arte", contact: "Anna Rossi", value: 3900, stage: "proposta", service: "Campaign Development" },
  { id: "5", name: "Indie Records", contact: "Paolo Gialli", value: 1800, stage: "proposta", service: "Marketing Strategy" },
  { id: "6", name: "Startup Verdura", contact: "Chiara Neri", value: 9800, stage: "negoziazione", service: "Development Program" },
  { id: "7", name: "Teatro Moderno", contact: "Fabio Blu", value: 4200, stage: "chiuso", service: "Experience Development" },
];

function LeadCard({ lead }: { lead: (typeof DEMO_LEADS)[0] }) {
  return (
    <div className="bg-[var(--bg)] border border-[var(--border)] rounded-lg p-3 cursor-pointer hover:border-[var(--brand-secondary)] transition-colors">
      <div className="text-[13px] font-medium">{lead.name}</div>
      <div className="text-[11px] text-[var(--text-muted)] mt-1">
        {lead.contact}
      </div>
      <div className="flex justify-between items-center mt-2">
        <div className="text-[11px] text-[var(--text-muted)]">
          {lead.service}
        </div>
        <div className="text-[12px] font-medium">
          €{lead.value.toLocaleString("it-IT")}
        </div>
      </div>
    </div>
  );
}

export default function PipelinePage() {
  const totalPipeline = DEMO_LEADS.reduce((sum, l) => sum + l.value, 0);

  return (
    <div>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Pipeline</h1>
          <p className="text-[13px] text-[var(--text-muted)] mt-1">
            {DEMO_LEADS.length} lead attivi — valore totale €
            {totalPipeline.toLocaleString("it-IT")}
          </p>
        </div>
        <button
          className="px-4 py-2 rounded-lg text-white text-[13px] font-medium"
          style={{ background: "var(--brand-secondary)" }}
        >
          + Nuovo lead
        </button>
      </div>

      <div className="grid grid-cols-6 gap-3">
        {STAGES.map((stage) => {
          const stageLeads = DEMO_LEADS.filter((l) => l.stage === stage.id);
          const stageTotal = stageLeads.reduce((sum, l) => sum + l.value, 0);
          return (
            <div key={stage.id}>
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: stage.color }}
                  />
                  <div className="text-[12px] font-medium">{stage.name}</div>
                </div>
                <div className="text-[11px] text-[var(--text-muted)]">
                  {stageLeads.length}
                </div>
              </div>
              <div className="space-y-2 min-h-[200px]">
                {stageLeads.map((lead) => (
                  <LeadCard key={lead.id} lead={lead} />
                ))}
              </div>
              {stageTotal > 0 && (
                <div className="text-[11px] text-[var(--text-muted)] mt-2 px-1">
                  €{stageTotal.toLocaleString("it-IT")}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
