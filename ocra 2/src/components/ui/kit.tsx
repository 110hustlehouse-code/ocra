import * as React from "react";

/* ── Badge ── */
type Tone = "neutral" | "ok" | "warn" | "danger" | "info" | "brand";

const TONES: Record<Tone, React.CSSProperties> = {
  neutral: { background: "var(--surface-2)", color: "var(--text-2)", border: "1px solid var(--line)" },
  ok: { background: "var(--ok-soft)", color: "var(--ok)" },
  warn: { background: "var(--warn-soft)", color: "var(--warn)" },
  danger: { background: "var(--danger-soft)", color: "var(--danger)" },
  info: { background: "var(--info-soft)", color: "var(--info)" },
  brand: { background: "var(--brand-soft)", color: "var(--brand)" },
};

export function Badge({
  children, tone = "neutral", dot = false,
}: { children: React.ReactNode; tone?: Tone; dot?: boolean }) {
  return (
    <span className="badge" style={TONES[tone]}>
      {dot && <span className="dot" />}
      {children}
    </span>
  );
}

/* ── Intestazione pagina ── */
export function PageHead({
  title, sub, actions,
}: { title: string; sub?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-6 mb-6">
      <div>
        <h1 className="t-page">{title}</h1>
        {sub && <p className="t-meta mt-1">{sub}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

/* ── Card con testata ── */
export function Panel({
  title, action, children, pad = false, className = "",
}: {
  title?: string; action?: React.ReactNode; children: React.ReactNode;
  pad?: boolean; className?: string;
}) {
  return (
    <section className={`card overflow-hidden ${className}`}>
      {title && (
        <div className="card-head">
          <h2 className="t-sec">{title}</h2>
          {action}
        </div>
      )}
      <div className={pad ? "card-pad" : ""}>{children}</div>
    </section>
  );
}

/* ── KPI ── */
export function Stat({
  label, value, sub, tone, trend,
}: {
  label: string; value: string; sub?: string; tone?: Tone; trend?: number;
}) {
  return (
    <div className="card card-pad">
      <div className="t-label">{label}</div>
      <div className="t-num mt-2" style={tone === "danger" ? { color: "var(--danger)" } : undefined}>
        {value}
      </div>
      <div className="flex items-center gap-2 mt-1.5">
        {typeof trend === "number" && (
          <span
            className="text-[11.5px] font-medium tabular"
            style={{ color: trend >= 0 ? "var(--ok)" : "var(--danger)" }}
          >
            {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}%
          </span>
        )}
        {sub && <span className="t-meta">{sub}</span>}
      </div>
    </div>
  );
}

/* ── Barra di avanzamento ── */
export function Progress({ value, tone = "var(--brand)" }: { value: number; tone?: string }) {
  return (
    <div className="h-1.5 rounded-full w-full" style={{ background: "var(--line-2)" }}>
      <div
        className="h-1.5 rounded-full transition-[width] duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: tone }}
      />
    </div>
  );
}

/* ── Stato vuoto ── */
export function Empty({ title, hint, action }: { title: string; hint?: string; action?: React.ReactNode }) {
  return (
    <div className="py-14 px-6 text-center">
      <div className="text-[13px] font-medium">{title}</div>
      {hint && <div className="t-meta mt-1.5 max-w-md mx-auto">{hint}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/* ── Avatar iniziali ── */
export function Avatar({ name, size = 24 }: { name: string; size?: number }) {
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  const hue = [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return (
    <span
      className="inline-flex items-center justify-center rounded-full font-semibold shrink-0"
      style={{
        width: size, height: size, fontSize: size * 0.4,
        background: `hsl(${hue} 42% 93%)`, color: `hsl(${hue} 45% 32%)`,
      }}
      title={name}
    >
      {initials}
    </span>
  );
}

/* ── Riga chiave/valore ── */
export function KV({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2 border-b last:border-0"
         style={{ borderColor: "var(--line-2)" }}>
      <span className="t-meta">{k}</span>
      <span className="text-[12.5px] text-right">{v}</span>
    </div>
  );
}
