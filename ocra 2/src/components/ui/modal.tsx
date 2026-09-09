"use client";

import * as React from "react";

export function Modal({
  open, onClose, title, sub, children, width = 560,
}: {
  open: boolean; onClose: () => void; title: string; sub?: string;
  children: React.ReactNode; width?: number;
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-10 px-4"
      style={{ background: "rgba(15,16,18,.42)", backdropFilter: "blur(2px)" }}
      onClick={onClose}
    >
      <div
        className="card rise w-full"
        style={{ maxWidth: width, boxShadow: "var(--shadow)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-head">
          <div>
            <h2 className="t-sec">{title}</h2>
            {sub && <p className="t-meta mt-0.5">{sub}</p>}
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm" aria-label="Chiudi">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
