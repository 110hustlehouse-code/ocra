"use client";

import * as React from "react";
import { type ComplianceCheck, calcRitenuta, eur } from "@/lib/demo/data";

function Check({ label, ok, required }: { label: string; ok: boolean; required?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 py-2 border-b last:border-0" style={{ borderColor: "var(--line-2)" }}>
      <span
        className="w-5 h-5 rounded-md flex items-center justify-center text-[11px] shrink-0"
        style={{
          background: ok ? "var(--ok-soft)" : "var(--danger-soft)",
          color: ok ? "var(--ok)" : "var(--danger)",
          fontWeight: 600,
        }}
      >
        {ok ? "\u2713" : "\u2715"}
      </span>
      <span className="text-[12.5px] flex-1">{label}</span>
      {required && !ok && (
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "var(--danger-soft)", color: "var(--danger)" }}>
          OBBLIGATORIO
        </span>
      )}
    </div>
  );
}

export function CompliancePanel({ check }: { check: ComplianceCheck }) {
  const total = [check.dpaFirmato, check.registroTrattamenti, check.cessioneDirittiAgenzia, check.cessioneDirittiCliente, check.contrattoFirmato, check.accontoRicevuto];
  const done = total.filter(Boolean).length;
  const pct = Math.round((done / total.length) * 100);
  const allOk = done === total.length;

  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid var(--line-2)" }}>
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold">Compliance legale</span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: allOk ? "var(--ok-soft)" : "var(--warn-soft)", color: allOk ? "var(--ok)" : "var(--warn)" }}>
            {pct}% completo
          </span>
        </div>
      </div>
      <div className="px-5 py-2">
        <div className="h-1.5 rounded-full mb-3 mt-1" style={{ background: "var(--line-2)" }}>
          <div className="h-full rounded-full transition-all" style={{ width: pct + "%", background: allOk ? "var(--ok)" : "var(--warn)" }} />
        </div>
        <div className="t-label mb-2">GDPR \u2014 Reg. UE 2016/679</div>
        <Check label="DPA firmato con il cliente" ok={check.dpaFirmato} required />
        <Check label="Registro trattamenti aggiornato" ok={check.registroTrattamenti} required />
        <Check label={"Sub-responsabili nominati" + (check.subResponsabili.length ? " (" + check.subResponsabili.join(", ") + ")" : "")} ok={check.subResponsabili.length > 0} />
        <div className="t-label mb-2 mt-4">DIRITTO D\u2019AUTORE \u2014 L. 633/1941</div>
        <Check label="Cessione diritti collaboratore \u2192 agenzia" ok={check.cessioneDirittiAgenzia} required />
        <Check label="Cessione diritti agenzia \u2192 cliente" ok={check.cessioneDirittiCliente} required />
        <div className="t-label mb-2 mt-4">CONTRATTUALISTICA</div>
        <Check label="Contratto firmato" ok={check.contrattoFirmato} required />
        <Check label="Acconto 50% ricevuto" ok={check.accontoRicevuto} required />
        {!allOk && (
          <div className="mt-4 p-3 rounded-lg text-[12px] leading-relaxed" style={{ background: "var(--danger-soft)", color: "var(--danger)" }}>
            <b>Attenzione:</b> questo cliente ha {total.length - done} obblighi non adempiuti. Nessun lavoro dovrebbe proseguire senza completare almeno contratto, DPA e cessione diritti.
          </div>
        )}
      </div>
    </div>
  );
}

export function RitenutaCalc() {
  const [compenso, setCompenso] = React.useState(1000);
  const [under35, setUnder35] = React.useState(false);
  const [tipo, setTipo] = React.useState<"occasionale" | "cessione_diritti">("occasionale");
  const result = calcRitenuta(compenso, under35, tipo);

  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-3" style={{ borderBottom: "1px solid var(--line-2)" }}>
        <span className="text-[13px] font-semibold">Calcolo ritenuta d&apos;acconto</span>
      </div>
      <div className="px-5 py-4 space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <div className="t-label mb-1">Compenso lordo</div>
            <input type="number" className="field" value={compenso} onChange={(e) => setCompenso(Number(e.target.value))} />
          </div>
          <div>
            <div className="t-label mb-1">Tipo contratto</div>
            <select className="field" value={tipo} onChange={(e) => setTipo(e.target.value as typeof tipo)}>
              <option value="occasionale">Prestazione occasionale</option>
              <option value="cessione_diritti">Cessione diritti d&apos;autore</option>
            </select>
          </div>
          <div>
            <div className="t-label mb-1">Et\u00E0 autore</div>
            <select className="field" value={under35 ? "under" : "over"} onChange={(e) => setUnder35(e.target.value === "under")}>
              <option value="over">\u2265 35 anni</option>
              <option value="under">&lt; 35 anni</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 pt-3" style={{ borderTop: "1px solid var(--line-2)" }}>
          <div>
            <div className="t-label">Base imponibile</div>
            <div className="text-[15px] font-semibold mt-1">{eur(result.baseImponibile)}</div>
            {tipo === "cessione_diritti" && <div className="t-meta">deduzione {under35 ? "40" : "25"}%</div>}
          </div>
          <div>
            <div className="t-label">Ritenuta 20%</div>
            <div className="text-[15px] font-semibold mt-1" style={{ color: "var(--danger)" }}>{eur(result.ritenuta)}</div>
          </div>
          <div>
            <div className="t-label">Netto da pagare</div>
            <div className="text-[15px] font-semibold mt-1" style={{ color: "var(--ok)" }}>{eur(result.netto)}</div>
          </div>
        </div>
        <div className="text-[11px] leading-relaxed mt-2" style={{ color: "var(--text-3)" }}>
          Rif. DPR 600/1973 art. 25 \u00B7 TUIR art. 54 comma 8 \u00B7 L. 633/1941
        </div>
      </div>
    </div>
  );
}
