export default function ContabilitaPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight">Contabilità</h1>
        <p className="text-[13px] text-[var(--text-muted)] mt-1">
          Registro PO, scadenziario e fatture
        </p>
      </div>
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-12 text-center">
        <div className="text-[var(--text-muted)] text-[13px]">
          Modulo in fase di configurazione. Sarà attivo dopo il collegamento con il gestionale contabile.
        </div>
      </div>
    </div>
  );
}
