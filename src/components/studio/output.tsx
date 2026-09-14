"use client";

import * as React from "react";
import { Empty } from "@/components/ui/kit";
import { useToast } from "@/components/ui/toast";

/** Hook di streaming: consuma la risposta della route AI token per token. */
export function useStream() {
  const [text, setText] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [done, setDone] = React.useState(false);

  const run = React.useCallback(async (endpoint: string, payload: unknown) => {
    setLoading(true);
    setError(null);
    setText("");
    setDone(false);
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
        const { value, done: d } = await reader.read();
        if (d) break;
        setText((t) => t + dec.decode(value, { stream: true }));
      }
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore di rete");
    } finally {
      setLoading(false);
    }
  }, []);

  return { text, loading, error, done, run, reset: () => { setText(""); setDone(false); } };
}

/** Metadati per il PDF brandizzato Fulcro Lucem — passati dal modulo che usa <Output>. */
export type PdfMeta = {
  docType: string;
  docNumber?: string;
  title: string;
  meta?: { label: string; value: string }[];
};

export function Output({
  text, loading, error, empty, filename, done, pdf,
}: {
  text: string; loading: boolean; error?: string | null; empty: string; filename: string; done?: boolean;
  pdf?: PdfMeta;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);
  const [showDone, setShowDone] = React.useState(false);
  const [generating, setGenerating] = React.useState(false);
  const toast = useToast();

  React.useEffect(() => {
    if (loading && ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [text, loading]);

  React.useEffect(() => {
    if (done && !loading && text) {
      setShowDone(true);
      const t = setTimeout(() => setShowDone(false), 2500);
      return () => clearTimeout(t);
    }
  }, [done, loading, text]);

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

  const generatePdf = async () => {
    if (!pdf || !text) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/export-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...pdf, markdown: text }),
      });
      if (!res.ok) throw new Error(await res.text());
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${pdf.docType.toLowerCase()}-${slug(pdf.title)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast("PDF generato con il branding Fulcro Lucem", "brand");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Errore nella generazione del PDF", "warn");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <section className="card overflow-hidden flex flex-col" style={{ minHeight: 520 }}>
      <div className="card-head">
        <h2 className="t-sec flex items-center gap-2">
          Documento
          {loading && (
            <span className="inline-flex items-center gap-2 ml-2">
              <span className="ai-pulse" />
              <span className="text-[11.5px] font-normal" style={{ color: "var(--brand)" }}>Claude sta scrivendo…</span>
            </span>
          )}
          {showDone && !loading && (
            <span className="text-[11.5px] font-medium done-flash" style={{ color: "var(--ok)" }}>
              ✓ Documento completato
            </span>
          )}
        </h2>
        {text && !loading && (
          <div className="flex gap-2">
            <button className="btn btn-ghost btn-sm" onClick={copy}>{copied ? "Copiato ✓" : "Copia"}</button>
            <button className="btn btn-ghost btn-sm" onClick={download}>Scarica .txt</button>
            {pdf && (
              <button className="btn btn-brand btn-sm" onClick={generatePdf} disabled={generating}>
                {generating ? "Genero PDF…" : "Genera PDF"}
              </button>
            )}
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

function slug(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "documento";
}

