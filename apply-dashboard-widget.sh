#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel 2>/dev/null || echo .)"

echo "=== Dashboard: widget compatto Marketing & Reporting ==="
echo ""

mkdir -p .guide-backup
TS=$(date +%s)
for f in "src/app/(dashboard)/dashboard/page.tsx" "src/components/ui/guide.tsx"; do
  if [ -f "$f" ]; then
    cp "$f" ".guide-backup/$(basename "$f").$TS.bak"
  fi
done
echo "[0/2] Backup salvato"

# ══════════════════════════════════════════════════════════════
# 1 — dashboard/page.tsx: aggiunge il widget nella colonna destra
# ══════════════════════════════════════════════════════════════
echo "[1/2] Aggiorno dashboard/page.tsx..."

python3 << 'ENDPY'
path = "src/app/(dashboard)/dashboard/page.tsx"
with open(path) as f:
    c = f.read()

if 'marketing-reporting-widget' in c:
    print("    ✓ widget già presente, nessuna modifica necessaria")
else:
    old = '''                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}'''
    new = '''                );
              })}
            </div>
          </div>

          <div className="card overflow-hidden" data-guide="marketing-reporting-widget">
            <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid var(--line-2)" }}>
              <span className="text-[13px] font-semibold">Marketing & Reporting</span>
              <Link href="/reporting" className="text-[11.5px] font-medium" style={{ color: "var(--brand)" }}>Dettaglio →</Link>
            </div>
            <div className="px-5 py-4 grid grid-cols-2 gap-3">
              <div>
                <div className="t-label">Reach 30gg</div>
                <div className="text-[16px] font-semibold tabular mt-1">333.000</div>
              </div>
              <div>
                <div className="t-label">Apertura email</div>
                <div className="text-[16px] font-semibold tabular mt-1" style={{ color: "var(--ok)" }}>42,6%</div>
              </div>
              <div>
                <div className="t-label">Campagne attive</div>
                <div className="text-[16px] font-semibold tabular mt-1">3</div>
              </div>
              <div>
                <div className="t-label">WhatsApp automatici</div>
                <div className="text-[16px] font-semibold tabular mt-1">48</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}'''
    if old in c:
        c = c.replace(old, new, 1)
        with open(path, "w") as f:
            f.write(c)
        print("    + widget 'Marketing & Reporting' aggiunto alla colonna destra")
    else:
        print("    ⚠ ATTENZIONE: struttura finale della pagina non trovata — nessuna modifica applicata. Verifica manuale necessaria.")
ENDPY

# ══════════════════════════════════════════════════════════════
# 2 — guide.tsx: aggiunge lo step per il widget
# ══════════════════════════════════════════════════════════════
echo "[2/2] Aggiorno guide.tsx..."

python3 << 'ENDPY'
path = "src/components/ui/guide.tsx"
with open(path) as f:
    c = f.read()

if 'marketing-reporting-widget' in c:
    print("    ✓ step già presente")
else:
    old = '''  { page: "/dashboard", target: "funnel-panel", section: "Dashboard", title: "Pipeline commerciale", body: "Il valore delle trattative in ogni fase del funnel, colpo d'occhio immediato su dove si concentra il fatturato potenziale." },'''
    new = old + '''
  { page: "/dashboard", target: "marketing-reporting-widget", section: "Dashboard", title: "Marketing & Reporting a colpo d'occhio", body: "Reach, apertura email e automazioni WhatsApp in sintesi. Il dettaglio completo vive nelle sezioni Reporting e Marketing." },'''
    if old in c:
        c = c.replace(old, new, 1)
        with open(path, "w") as f:
            f.write(c)
        print("    + step aggiunto dopo 'Pipeline commerciale'")
    else:
        print("    ⚠ ATTENZIONE: step 'funnel-panel' non trovato — nessuna modifica applicata. Verifica manuale necessaria.")
ENDPY

echo ""
echo "=== Fatto ==="
echo "  npm run dev"
echo "  → verifica il nuovo pannello 'Marketing & Reporting' sulla Dashboard,"
echo "    colonna destra, sotto Pipeline"
