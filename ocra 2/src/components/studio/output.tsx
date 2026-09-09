"use client";

import * as React from "react";
import { Empty } from "@/components/ui/kit";

/** Hook di streaming: consuma la risposta della route AI token per token. */
export function useStream() {
  const [text, setText] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const run = React.useCallback(async (endpoint: string, payload: unknown) => {
    setLoading(true);
    setError(null);
    setText("");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      const reader = res.body?.getReader();
      if (!reader) throw new Error("Risposta vuota dal server");
      const dec = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        setText((t) => t + dec.decode(value, { stream: true }));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore di rete");
    } finally {
      setLoading(false);
    }
  }, []);

  return { text, loading, error, run, reset: () => setText("") };
}

export function Output({
  text, loading, error, empty, filename,
}: {
  text: string; loading: boolean; error?: string | null; empty: string; filename: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (loading && ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [text, loading]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch { /* clipboard non disponibile */ }
  };

  const download = () => {
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="card overflow-hidden flex flex-col" style={{ minHeight: 520 }}>
      <div className="card-head">
        <h2 className="t-sec">
          Documento
          {loading && <span className="ml-2 t-meta pulsing">generazione in corso…</span>}
        </h2>
        {text && !loading && (
          <div className="flex gap-2">
            <button className="btn btn-ghost btn-sm" onClick={copy}>{copied ? "Copiato ✓" : "Copia"}</button>
            <button className="btn btn-ghost btn-sm" onClick={download}>Scarica</button>
          </div>
        )}
      </div>

      <div ref={ref} className="flex-1 overflow-y-auto px-6 py-5">
        {error && (
          <div className="badge mb-4" style={{ background: "var(--danger-soft)", color: "var(--danger)", height: "auto", padding: "8px 10px" }}>
            {error}
          </div>
        )}
        {text ? (
          <div className={`prose-ai ${loading ? "caret" : ""}`}>{text}</div>
        ) : !loading && !error ? (
          <Empty title={empty} hint="Il documento verrà scritto qui, in tempo reale." />
        ) : (
          <div className="space-y-2.5 pt-2">
            {[92, 74, 86, 60, 80, 45].map((w, i) => (
              <div key={i} className="h-2.5 rounded pulsing" style={{ width: `${w}%`, background: "var(--line-2)" }} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
