"use client";

import * as React from "react";
import { createPortal } from "react-dom";

export function Modal({
  open, onClose, title, sub, children, width = 560,
}: {
  open: boolean; onClose: () => void; title: string; sub?: string;
  children: React.ReactNode; width?: number;
}) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!open || !mounted) return null;

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9990,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: 80,
        paddingBottom: 40,
        overflowY: "auto",
        background: "rgba(8,8,10,0.7)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: width,
          background: "#ffffff",
          borderRadius: 16,
          boxShadow: "0 32px 100px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.08)",
          animation: "rise 0.25s cubic-bezier(0.2, 0, 0, 1) both",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 24px",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 650, letterSpacing: "-0.01em", color: "#111" }}>{title}</h2>
            {sub && <p style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{sub}</p>}
          </div>
          <button
            onClick={onClose}
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              border: "1px solid rgba(0,0,0,0.08)",
              background: "transparent",
              cursor: "pointer",
              fontSize: 14,
              color: "#888",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            \u2715
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}
