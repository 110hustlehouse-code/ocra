"use client";

import { useState } from "react";

const DEMO_SERVICES = [
  { id: "1", name: "Business Audit", category: "Business Development", price: 2900 },
  { id: "2", name: "Development Program", category: "Business Development", price: 9800 },
  { id: "3", name: "Creative Direction", category: "Creative Development", price: 1800 },
  { id: "4", name: "Brand Development", category: "Creative Development", price: 4800 },
  { id: "5", name: "Campaign Development", category: "Creative Development", price: 3900 },
  { id: "6", name: "Experience Development", category: "Creative Development", price: 4200 },
  { id: "7", name: "Marketing Strategy", category: "Marketing Development", price: 1800 },
  { id: "8", name: "Communication Strategy", category: "Marketing Development", price: 2700 },
  { id: "9", name: "Launch Strategy", category: "Marketing Development", price: 3900 },
  { id: "10", name: "Growth Management", category: "Marketing Development", price: 1200 },
];

export default function PreventiviPage() {
  const [clientName, setClientName] = useState("");
  const [notes, setNotes] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const total = DEMO_SERVICES.filter((s) => selected.includes(s.id)).reduce(
    (sum, s) => sum + s.price,
    0
  );

  const generate = async () => {
    if (!clientName || selected.length === 0) return;
    setLoading(true);
    setResult("");

    const services = DEMO_SERVICES.filter((s) => selected.includes(s.id));

    try {
      const res = await fetch("/api/ai/preventivo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientName, services, notes }),
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

  const categories = [...new Set(DEMO_SERVICES.map((s) => s.category))];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight">
          Generatore preventivi
        </h1>
        <p className="text-[13px] text-[var(--text-muted)] mt-1">
          Seleziona servizi e genera un preventivo personalizzato con AI
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-5">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
            <label className="text-[12px] text-[var(--text-muted)] block mb-2">
              Nome cliente
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="es. Studio Creativo Roma"
              className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-[13px] bg-transparent focus:outline-none focus:ring-1 focus:ring-[var(--brand-secondary)]"
            />
          </div>

          {categories.map((cat) => (
            <div
              key={cat}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5"
            >
              <div className="text-[12px] text-[var(--text-muted)] mb-3">
                {cat}
              </div>
              <div className="space-y-2">
                {DEMO_SERVICES.filter((s) => s.category === cat).map((svc) => (
                  <label
                    key={svc.id}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                      selected.includes(svc.id)
                        ? "border-[var(--brand-secondary)] bg-orange-50"
                        : "border-[var(--border)] hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(svc.id)}
                        onChange={() => toggle(svc.id)}
                        className="accent-[var(--brand-secondary)]"
                      />
                      <span className="text-[13px]">{svc.name}</span>
                    </div>
                    <span className="text-[12px] text-[var(--text-muted)]">
                      da €{svc.price.toLocaleString("it-IT")}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
            <label className="text-[12px] text-[var(--text-muted)] block mb-2">
              Note aggiuntive
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contesto, richieste specifiche, dettagli sul progetto..."
              rows={3}
              className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-[13px] bg-transparent focus:outline-none focus:ring-1 focus:ring-[var(--brand-secondary)] resize-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-[13px]">
              Totale:{" "}
              <span className="font-semibold">
                €{total.toLocaleString("it-IT")}
              </span>
              <span className="text-[var(--text-muted)]"> + IVA</span>
            </div>
            <button
              onClick={generate}
              disabled={loading || !clientName || selected.length === 0}
              className="px-5 py-2.5 rounded-lg text-white text-[13px] font-medium transition-opacity disabled:opacity-40"
              style={{ background: "var(--brand-secondary)" }}
            >
              {loading ? "Generazione in corso..." : "Genera preventivo"}
            </button>
          </div>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 sticky top-8 h-fit">
          <div className="text-[12px] text-[var(--text-muted)] mb-4">
            Anteprima preventivo
          </div>
          {result ? (
            <div className="prose prose-sm max-w-none text-[13px] leading-relaxed whitespace-pre-wrap">
              {result}
            </div>
          ) : (
            <div className="text-[13px] text-[var(--text-muted)] py-12 text-center">
              Seleziona i servizi e clicca "Genera preventivo"
              per vedere l'anteprima qui.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
