"use client";

import * as React from "react";

export function Accordion({
  title, meta, defaultOpen = false, dataGuide, children,
}: {
  title: string;
  meta?: React.ReactNode;
  defaultOpen?: boolean;
  dataGuide?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <div className="card overflow-hidden" data-guide={dataGuide}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-5 py-3.5 text-left transition-colors"
        style={{ borderBottom: open ? "1px solid var(--line-2)" : "1px solid transparent" }}
      >
        <span className="flex items-center gap-2.5 min-w-0">
          <span className="text-[13px] font-semibold">{title}</span>
        </span>
        <span className="flex items-center gap-3 shrink-0">
          {meta}
          <svg
            width="14" height="14" viewBox="0 0 16 16" fill="none"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ color: "var(--text-3)", transform: open ? "rotate(180deg)" : "none", transition: "transform .2s ease" }}
          >
            <path d="M4 6l4 4 4-4" />
          </svg>
        </span>
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}
