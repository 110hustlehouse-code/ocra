"use client";

import * as React from "react";
import { PageHead, Badge } from "@/components/ui/kit";
import { VerbaliTab } from "@/components/studio/verbali";
import { PreventiviTab } from "@/components/studio/preventivi";
import { BandiTab } from "@/components/studio/bandi";
import { ProgettiTab } from "@/components/studio/progetti";

const TABS = [
  { key: "verbali", label: "Verbali", hint: "Da riunione a decisioni" },
  { key: "preventivi", label: "Preventivi", hint: "Da servizi a documento" },
  { key: "bandi", label: "Bandi", hint: "Da avviso a valutazione" },
  { key: "progetti", label: "Progetti", hint: "Da brief a formulario" },
] as const;

type Key = (typeof TABS)[number]["key"];

export default function StudioPage() {
  const [tab, setTab] = React.useState<Key>("verbali");

  return (
    <div className="rise">
      <PageHead
        title="AI Studio"
        sub="Tutti i documenti che l'agenzia produce, scritti a partire dai dati che ha già"
        actions={<Badge tone="brand" dot>Claude Sonnet 4.5</Badge>}
      />

      <div className="grid grid-cols-4 gap-2.5 mb-6">
        {TABS.map((t) => {
          const on = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="card text-left px-4 py-3 transition-all"
              style={{
                borderColor: on ? "var(--brand)" : "var(--line)",
                background: on ? "var(--brand-soft)" : "var(--surface)",
              }}
            >
              <div className="text-[12.5px] font-semibold" style={{ color: on ? "var(--brand)" : "var(--text)" }}>
                {t.label}
              </div>
              <div className="t-meta mt-0.5">{t.hint}</div>
            </button>
          );
        })}
      </div>

      {tab === "verbali" && <VerbaliTab />}
      {tab === "preventivi" && <PreventiviTab />}
      {tab === "bandi" && <BandiTab />}
      {tab === "progetti" && <ProgettiTab />}
    </div>
  );
}
