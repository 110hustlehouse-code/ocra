#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel 2>/dev/null || echo .)"

echo "=== Operativo: aggiunge Ritenuta d'acconto (Accordion, colonna destra) ==="
echo ""

mkdir -p .guide-backup
TS=$(date +%s)
for f in "src/app/(dashboard)/operativo/page.tsx" "src/components/ui/guide.tsx"; do
  if [ -f "$f" ]; then
    mkdir -p ".guide-backup/$(dirname "$f")"
    cp "$f" ".guide-backup/$f.$TS.bak"
  fi
done
echo "[0/2] Backup salvato"

# ══════════════════════════════════════════════════════════════
# 1 — operativo/page.tsx: import Accordion + blocco RitenutaCalc
# ══════════════════════════════════════════════════════════════
echo "[1/2] Aggiorno operativo/page.tsx..."

python3 << 'ENDPY'
path = "src/app/(dashboard)/operativo/page.tsx"
with open(path) as f:
    c = f.read()

n = 0

# ── 1. import Accordion (accanto all'import RitenutaCalc già presente) ──
old = 'import { RitenutaCalc } from "@/components/compliance/compliance-panel";'
new = 'import { RitenutaCalc } from "@/components/compliance/compliance-panel";\nimport { Accordion } from "@/components/ui/accordion";'
if 'from "@/components/ui/accordion"' in c:
    print("    ✓ import Accordion già presente")
elif old in c:
    c = c.replace(old, new, 1); n += 1
    print("    + import Accordion aggiunto")
else:
    print("    ⚠ ATTENZIONE: import RitenutaCalc non trovato — verifica manuale necessaria")

# ── 2. Inserisce l'Accordion con RitenutaCalc dopo il blocco PO Generator ──
old = '''          <div data-guide="operativo-po">
          <PoGenerator />
          </div>
        </div>
      </div>
    </div>
  );
}'''
new = '''          <div data-guide="operativo-po">
          <PoGenerator />
          </div>
          <Accordion title="Ritenuta d'acconto" dataGuide="operativo-ritenuta">
            <RitenutaCalc />
          </Accordion>
        </div>
      </div>
    </div>
  );
}'''
if 'operativo-ritenuta' in c:
    print("    ✓ blocco Ritenuta d'acconto già presente")
elif old in c:
    c = c.replace(old, new, 1); n += 1
    print("    + Accordion 'Ritenuta d'acconto' con RitenutaCalc inserito sotto PO Generator")
else:
    print("    ⚠ ATTENZIONE: struttura colonna destra non trovata — nessuna modifica applicata, verifica manuale necessaria")

with open(path, "w") as f:
    f.write(c)
print(f"    ✓ operativo/page.tsx ({n}/2 modifiche)")
ENDPY

# ══════════════════════════════════════════════════════════════
# 2 — guide.tsx: nuovo step "operativo-ritenuta" dopo "operativo-po"
# ══════════════════════════════════════════════════════════════
echo "[2/2] Aggiorno guide.tsx..."

python3 << 'ENDPY'
path = "src/components/ui/guide.tsx"
with open(path) as f:
    c = f.read()

if 'target: "operativo-ritenuta"' in c:
    print("    ✓ step già presente")
else:
    marker = 'target: "operativo-po"'
    idx = c.find(marker)
    if idx == -1:
        print("    ⚠ ATTENZIONE: step 'operativo-po' non trovato in guide.tsx — nessuna modifica applicata, verifica manuale necessaria")
    else:
        line_end = c.find("\n", idx)
        if line_end == -1:
            print("    ⚠ ATTENZIONE: impossibile individuare la fine della riga dello step 'operativo-po'")
        else:
            new_step = '\n  { page: "/operativo", target: "operativo-ritenuta", section: "Operativo", title: "Ritenuta d\'acconto", body: "Calcolo automatico della ritenuta per i collaboratori: base imponibile, ritenuta al 20% e netto da pagare, con i riferimenti normativi. Basta aprire la tendina." },'
            c = c[:line_end] + new_step + c[line_end:]
            with open(path, "w") as f:
                f.write(c)
            print("    + step 'operativo-ritenuta' inserito subito dopo 'operativo-po'")
ENDPY

echo ""
echo "=== Fatto ==="
echo "  npm run dev"
echo "  → Operativo, colonna destra: sotto PO Generator compare la tendina"
echo "    'Ritenuta d'acconto' (chiusa di default) con il calcolatore."
echo "  → Riavvia la guida: dopo lo step PO compare il nuovo step Ritenuta d'acconto."
