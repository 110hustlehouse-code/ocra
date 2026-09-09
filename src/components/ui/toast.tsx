"use client";

import * as React from "react";

type Toast = { id: string; message: string; tone?: "ok" | "brand" | "warn" };

const ToastCtx = React.createContext<(msg: string, tone?: Toast["tone"]) => void>(() => {});

export function useToast() { return React.useContext(ToastCtx); }

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const push = React.useCallback((message: string, tone: Toast["tone"] = "ok") => {
    const id = Math.random().toString(36).slice(2, 8);
    setToasts((t) => [...t, { id, message, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 items-end">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="toast-enter flex items-center gap-2.5 px-4 py-3 rounded-[11px] shadow-lg"
            style={{
              background: t.tone === "ok" ? "var(--ok)" : t.tone === "brand" ? "var(--brand)" : "var(--warn)",
              color: "#fff",
              fontSize: "12.5px",
              fontWeight: 500,
              maxWidth: 360,
            }}
          >
            <span style={{ fontSize: "15px" }}>{t.tone === "ok" ? "\u2713" : t.tone === "brand" ? "\u26A1" : "\u23F3"}</span>
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
