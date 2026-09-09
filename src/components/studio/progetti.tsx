"use client";

import * as React from "react";
import { useStore } from "@/lib/demo/store";
import { Panel } from "@/components/ui/kit";
import { useStream, Output } from "./output";

const SEZIONI = [
  "Descrizione del progetto",
  "Obiettivi generali e specifici",
  "Analisi del contesto e del bisogno",
  "Attività e cronoprogramma",
  "Risultati attesi e indicatori",
  "Impatto sul territorio",
  "Sostenibilità e prosecuzione",
  "Partenariato e ruoli",
  "Innovatività della proposta",
];

const LUNGHEZZE = ["400-600 caratteri", "600-900 caratteri", "1500-2000 caratteri", "3000 caratteri"];

export function ProgettiTab() {
  const s = useStore();
  const [f, setF] = React.useState({
    projectName: "",
    bando: "",
    section: SEZIONI[0],
    length: LUNGHEZZE[1],
    brief: "",
  });
  const { text, loading, error, run } = useStream();

  const set = <K extends keyof typeof f>(k: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setF((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div className="grid grid-cols-[400px_1fr] gap-5 items-start">
      <div className="space-y-4">
        <Panel title="Progetto">
          <div className="card-pad space-y-3">
            <div>
              <label className="lbl">Titolo del progetto *</label>
              <input className="field" value={f.projectName} onChange={set("projectName")} placeholder="Es. Luoghi Comuni — rigenerazione urbana" />
            </div>
            <div>
              <label className="lbl">Bando di riferimento</label>
              <input className="field" list="bandi-noti" value={f.bando} onChange={set("bando")} placeholder="Seleziona o scrivi" />
              <datalist id="bandi-noti">
                {s.bandi.map((b) => <option key={b.id} value={`${b.name} — ${b.entity}`} />)}
              </datalist>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="lbl">Sezione</label>
                <select className="field" value={f.section} onChange={set("section")}>
                  {SEZIONI.map((x) => <option key={x}>{x}</option>)}
                </select>
              </div>
              <div>
                <label className="lbl">Lunghezza</label>
                <select className="field" value={f.length} onChange={set("length")}>
                  {LUNGHEZZE.map((x) => <option key={x}>{x}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="lbl">Brief e materiali</label>
              <textarea
                className="field"
                rows={8}
                value={f.brief}
                onChange={set("brief")}
                placeholder={"Incolla qui tutto ciò che hai: appunti, numeri del territorio, partner coinvolti, budget, attività previste.\n\nPiù materiale grezzo fornisci, meno il testo sarà generico."}
              />
            </div>
            <button
              className="btn btn-brand w-full"
              disabled={!f.projectName.trim() || loading}
              onClick={() => run("/api/ai/progetto", f)}
            >
              {loading ? "Scrittura…" : "Scrivi la sezione"}
            </button>
          </div>
        </Panel>

        <div className="card card-pad">
          <div className="t-label mb-2">Come si usa</div>
          <p className="text-[11.5px] leading-relaxed" style={{ color: "var(--text-2)" }}>
            Si scrive una sezione alla volta, riusando lo stesso brief. Ogni testo termina con
            l&apos;elenco dei dati da verificare prima dell&apos;invio: il controllo resta a chi firma la domanda.
          </p>
        </div>
      </div>

      <Output text={text} loading={loading} error={error} empty="Nessuna sezione scritta" filename={`${f.section.toLowerCase().replace(/\s+/g, "-")}.txt`} />
    </div>
  );
}
