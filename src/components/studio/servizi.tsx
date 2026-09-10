"use client";

import * as React from "react";
import { useStream, Output } from "./output";

type ServiceTool = {
  id: string;
  name: string;
  endpoint: string;
  description: string;
  placeholder: string;
  filename: string;
};

const SERVICES: ServiceTool[] = [
  { id: "business-audit", name: "Business Audit", endpoint: "/api/ai/business-audit", description: "Analisi mercato, competitor, BMC, SWOT e roadmap strategica", placeholder: "Descrivi l'azienda o il progetto: settore, dimensione, prodotto/servizio, mercato di riferimento, sfide attuali...", filename: "business-audit.txt" },
  { id: "business-plan", name: "Business Plan", endpoint: "/api/ai/business-plan", description: "Modello economico, proiezioni, break-even e pricing strategy", placeholder: "Descrivi il business: modello di ricavo, costi previsti, mercato target, prezzi della concorrenza, obiettivi a 3 anni...", filename: "business-plan.txt" },
  { id: "naming", name: "Naming", endpoint: "/api/ai/naming", description: "30+ opzioni di nome con rationale e disponibilità dominio", placeholder: "Descrivi il progetto/brand: settore, valori, target, tono desiderato, parole chiave, nomi da evitare...", filename: "naming.txt" },
  { id: "personas", name: "Audience Personas", endpoint: "/api/ai/personas", description: "3 personas dettagliate con comportamenti e messaggi chiave", placeholder: "Descrivi il prodotto/servizio e il mercato: cosa vendete, a chi, in quale contesto, cosa sapete già del vostro pubblico...", filename: "personas.txt" },
  { id: "editorial", name: "Piano Editoriale", endpoint: "/api/ai/editorial", description: "Piano contenuti mensile con formati, canali e copy hooks", placeholder: "Descrivi il brand, i canali attivi, il tono di voce, gli obiettivi del mese, eventuali lanci o eventi in programma...", filename: "piano-editoriale.txt" },
  { id: "campaign", name: "Campaign Concept", endpoint: "/api/ai/campaign", description: "5 big idea con declinazioni su digital, social e offline", placeholder: "Descrivi il brief: prodotto/servizio, obiettivo della campagna, target, budget indicativo, canali disponibili, vincoli...", filename: "campaign-concept.txt" },
  { id: "launch", name: "Piano Lancio", endpoint: "/api/ai/launch", description: "Go-to-market completo con timeline, attivazioni e KPI", placeholder: "Descrivi cosa lanciate: prodotto/brand/servizio, data prevista, mercato target, budget, canali disponibili, obiettivi...", filename: "piano-lancio.txt" },
  { id: "growth", name: "Growth Analysis", endpoint: "/api/ai/growth", description: "Analisi performance con azioni concrete di ottimizzazione", placeholder: "Incolla i dati: metriche social, analytics sito, vendite, conversion rate, qualsiasi numero utile. Più dati dai, meglio è...", filename: "growth-analysis.txt" },
];

export function ServiziTab() {
  const [active, setActive] = React.useState(SERVICES[0].id);
  const tool = SERVICES.find((s) => s.id === active)!;
  const [brief, setBrief] = React.useState("");
  const { text, loading, error, done, run } = useStream();

  const generate = () => {
    if (!brief.trim()) return;
    run(tool.endpoint, { brief });
  };

  return (
    <div>
      <div className="grid grid-cols-4 gap-2 mb-5">
        {SERVICES.map((s) => (
          <button
            key={s.id}
            onClick={() => { setActive(s.id); setBrief(""); }}
            className="card text-left transition-all"
            style={{
              padding: "10px 14px",
              borderColor: active === s.id ? "var(--brand)" : "var(--line)",
              boxShadow: active === s.id ? "var(--shadow-glow, 0 0 0 1px var(--brand))" : undefined,
            }}
          >
            <div className="text-[12.5px] font-semibold mb-0.5">{s.name}</div>
            <div className="text-[11px]" style={{ color: "var(--text-3)" }}>{s.description}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-[380px_1fr] gap-5 items-start">
        <div className="space-y-3">
          <div className="card card-pad">
            <div className="t-label mb-2">Brief per {tool.name}</div>
            <textarea
              className="field"
              rows={14}
              placeholder={tool.placeholder}
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
            />
            <button
              className="btn btn-brand w-full mt-3"
              disabled={!brief.trim() || loading}
              onClick={generate}
            >
              {loading ? "Generazione in corso..." : "Genera " + tool.name}
            </button>
          </div>
          <div className="card card-pad">
            <div className="t-label mb-1">Come funziona</div>
            <p className="text-[11.5px] leading-relaxed" style={{ color: "var(--text-2)" }}>
              Inserisci più dettagli possibile nel brief. L&apos;AI genera un documento professionale
              che il team valida e personalizza prima di consegnarlo al cliente.
              Il controllo qualità resta sempre umano.
            </p>
          </div>
        </div>
        <Output text={text} loading={loading} error={error} done={done} empty={"Inserisci il brief e genera il documento"} filename={tool.filename} />
      </div>
    </div>
  );
}
