"use client";

import * as React from "react";
import { PageHead, Badge } from "@/components/ui/kit";
import { VerbaliTab } from "@/components/studio/verbali";
import { PreventiviTab } from "@/components/studio/preventivi";
import { BandiTab } from "@/components/studio/bandi";
import { ProgettiTab } from "@/components/studio/progetti";
import { ServiziTab } from "@/components/studio/servizi";

const INTERNAL_TABS = [
  { key: "verbali", label: "Verbali", hint: "Da riunione a decisioni" },
  { key: "preventivi", label: "Preventivi", hint: "Da servizi a documento" },
  { key: "bandi", label: "Bandi", hint: "Da avviso a valutazione" },
  { key: "progetti", label: "Progetti", hint: "Da brief a formulario" },
] as const;

type Key = (typeof INTERNAL_TABS)[number]["key"];

export default function StudioPage() {
  const [mode, setMode] = React.useState<"interno" | "servizi">("interno");
  const [tab, setTab] = React.useState<Key>("verbali");

  return (
    <div className="rise">
      <PageHead
        title="AI Studio"
        sub={mode === "interno"
          ? "Strumenti AI per il lavoro interno dell'agenzia"
          : "Strumenti AI integrati nei servizi che vendete ai clienti"
        }
        actions={<Badge tone="brand" dot>Claude Sonnet 4.5</Badge>}
      />

      {/* Toggle Interno / Servizi */}
      <div className="flex gap-1 p-1 rounded-[10px] mb-6 w-fit" style={{ background: "var(--surface-2, #f5f5f3)" }}>
        <button
          onClick={() => setMode("interno")}
          className="px-4 py-1.5 rounded-[8px] text-[12.5px] font-medium transition-all"
          style={{
            background: mode === "interno" ? "var(--surface, #fff)" : "transparent",
            color: mode === "interno" ? "var(--text)" : "var(--text-3)",
            boxShadow: mode === "interno" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
          }}
        >
          Uso interno
        </button>
        <button
          onClick={() => setMode("servizi")}
          className="px-4 py-1.5 rounded-[8px] text-[12.5px] font-medium transition-all"
          style={{
            background: mode === "servizi" ? "var(--surface, #fff)" : "transparent",
            color: mode === "servizi" ? "var(--text)" : "var(--text-3)",
            boxShadow: mode === "servizi" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
          }}
        >
          Servizi al cliente
        </button>
      </div>

      {mode === "interno" ? (
        <>
          <div className="grid grid-cols-4 gap-2.5 mb-6">
            {INTERNAL_TABS.map((t) => {
              const on = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className="card text-left transition-all"
                  style={{
                    padding: "12px 16px",
                    borderColor: on ? "var(--brand)" : "var(--line)",
                    boxShadow: on ? "var(--shadow-glow, 0 0 0 1px var(--brand))" : undefined,
                  }}
                >
                  <div className="text-[12.5px] font-semibold">{t.label}</div>
                  <div className="text-[11px] mt-0.5" style={{ color: "var(--text-3)" }}>{t.hint}</div>
                </button>
              );
            })}
          </div>
          {tab === "verbali" && <VerbaliTab />}
          {tab === "preventivi" && <PreventiviTab />}
          {tab === "bandi" && <BandiTab />}
          {tab === "progetti" && <ProgettiTab />}
        </>
      ) : (
        <ServiziTab />
      )}
    </div>
  );
}
