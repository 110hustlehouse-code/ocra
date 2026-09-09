"use client";

import { useState } from "react";

export default function VerbaliPage() {
  const [transcription, setTranscription] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!transcription.trim()) return;
    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/ai/verbale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcription }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let text = "";

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value);
        setResult(text);
      }
    } catch {
      setResult("Errore nella generazione. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight">Verbali AI</h1>
        <p className="text-[13px] text-[var(--text-muted)] mt-1">
          Trascrizione → verbale strutturato con decisioni e task
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
            <label className="text-[12px] text-[var(--text-muted)] block mb-2">
              Incolla la trascrizione della riunione
            </label>
            <textarea
              value={transcription}
              onChange={(e) => setTranscription(e.target.value)}
              placeholder="Incolla qui la trascrizione da Fireflies.ai, Otter, o appunti manuali..."
              rows={18}
              className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-[13px] bg-transparent focus:outline-none focus:ring-1 focus:ring-[var(--brand-secondary)] resize-none"
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="text-[12px] text-[var(--text-muted)]">
              Supporta trascrizioni fino a ~50.000 caratteri
            </div>
            <button
              onClick={generate}
              disabled={loading || !transcription.trim()}
              className="px-5 py-2.5 rounded-lg text-white text-[13px] font-medium transition-opacity disabled:opacity-40"
              style={{ background: "var(--brand-secondary)" }}
            >
              {loading ? "Generazione in corso..." : "Genera verbale"}
            </button>
          </div>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 sticky top-8 h-fit max-h-[80vh] overflow-y-auto">
          <div className="text-[12px] text-[var(--text-muted)] mb-4">
            Verbale generato
          </div>
          {result ? (
            <div className="prose prose-sm max-w-none text-[13px] leading-relaxed whitespace-pre-wrap">
              {result}
            </div>
          ) : (
            <div className="text-[13px] text-[var(--text-muted)] py-12 text-center">
              Incolla una trascrizione e genera il verbale.
              <br />
              Includerà: sintesi, decisioni, azioni assegnate e scadenze.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
