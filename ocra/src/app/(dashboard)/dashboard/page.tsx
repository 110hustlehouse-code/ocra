function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
      <div className="text-[12px] text-[var(--text-muted)] mb-1">{label}</div>
      <div className="text-2xl font-semibold tracking-tight">{value}</div>
      {sub && (
        <div className="text-[12px] text-[var(--text-muted)] mt-1">{sub}</div>
      )}
    </div>
  );
}

function ActivityItem({
  time,
  text,
}: {
  time: string;
  text: string;
}) {
  return (
    <div className="flex gap-3 py-3 border-b border-[var(--border)] last:border-0">
      <div className="text-[12px] text-[var(--text-muted)] w-14 shrink-0">
        {time}
      </div>
      <div className="text-[13px]">{text}</div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-[13px] text-[var(--text-muted)] mt-1">
          Panoramica attività
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Clienti attivi" value="12" sub="+2 questo mese" />
        <StatCard label="Progetti in corso" value="7" />
        <StatCard label="Pipeline" value="€34.200" sub="5 lead attivi" />
        <StatCard label="Scadenze prossime" value="3" sub="entro 7 giorni" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <h2 className="text-[13px] font-medium mb-3">Attività recenti</h2>
          <ActivityItem time="10:30" text="Nuovo lead: Studio XYZ — richiesta Brand Development" />
          <ActivityItem time="09:15" text="Preventivo #042 approvato — Marketing Strategy per ClienteABC" />
          <ActivityItem time="Ieri" text="Verbale riunione settimanale generato e distribuito" />
          <ActivityItem time="Ieri" text="Release 'Notte Blu' — pitch inviato a Artist First" />
          <ActivityItem time="2gg fa" text="Bando Regione Lazio Cultura 2026 — scadenza 15 ottobre" />
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <h2 className="text-[13px] font-medium mb-3">Scadenze</h2>
          <ActivityItem time="Dom" text="Fattura #089 — Studio Creativo Roma — €2.400" />
          <ActivityItem time="Lun" text="Piano editoriale ottobre da condividere con Duit" />
          <ActivityItem time="Mar" text="Invio documento fiscale collaboratori" />
          <ActivityItem time="Ven" text="Deadline pitch release 'Alba' a TuneCore" />
        </div>
      </div>
    </div>
  );
}
