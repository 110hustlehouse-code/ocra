"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: "⬡" },
  { name: "Pipeline", href: "/pipeline", icon: "◈" },
  { name: "Clienti", href: "/clienti", icon: "◉" },
  { name: "Preventivi", href: "/preventivi", icon: "◇" },
  { name: "Contabilità", href: "/contabilita", icon: "▤" },
  { name: "Verbali", href: "/verbali", icon: "▧" },
  { name: "Bandi", href: "/bandi", icon: "◎" },
  { name: "Release", href: "/release", icon: "◈" },
];

export function Sidebar({ tenantName }: { tenantName?: string }) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-56 border-r border-[var(--border)] bg-[var(--bg-card)] flex flex-col">
      <div className="p-5 border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-semibold"
            style={{ background: "var(--brand-secondary)" }}
          >
            O
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight">OCRA</div>
            {tenantName && (
              <div className="text-[11px] text-[var(--text-muted)]">
                {tenantName}
              </div>
            )}
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {navigation.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors ${
                active
                  ? "bg-[var(--brand-primary)] text-white font-medium"
                  : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-gray-50"
              }`}
            >
              <span className="text-sm">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[var(--border)]">
        <div className="text-[11px] text-[var(--text-muted)]">
          OCRA v0.1.0
        </div>
      </div>
    </aside>
  );
}
