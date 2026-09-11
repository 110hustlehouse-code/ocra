#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel 2>/dev/null || echo .)"

echo "=== Sidebar: Fulcro Lucem in evidenza, OCRA sotto in piccolo ==="
echo ""

mkdir -p .guide-backup
TS=$(date +%s)
f="src/components/layout/sidebar.tsx"
if [ -f "$f" ]; then
  cp "$f" ".guide-backup/$(basename "$f").$TS.bak"
fi
echo "[0/1] Backup salvato"

python3 << 'ENDPY'
path = "src/components/layout/sidebar.tsx"
with open(path) as f:
    c = f.read()

old = '''          <div className="leading-tight">
            <div className="text-[13px] font-semibold text-white tracking-tight">OCRA</div>
            <div className="text-[10.5px]" style={{ color: "var(--sidebar-text)" }}>
              {TENANT.name}
            </div>
          </div>'''
new = '''          <div className="leading-tight">
            <div className="text-[13px] font-semibold text-white tracking-tight">{TENANT.name}</div>
            <div className="text-[10.5px] font-medium" style={{ color: "var(--sidebar-text)" }}>
              OCRA
            </div>
          </div>'''
if 'text-[13px] font-semibold text-white tracking-tight">{TENANT.name}' in c:
    print("    ✓ già invertito, nessuna modifica necessaria")
elif old in c:
    c = c.replace(old, new, 1)
    with open(path, "w") as f:
        f.write(c)
    print("    + testo invertito: {TENANT.name} sopra (in evidenza), 'OCRA' sotto in piccolo")
else:
    print("    ⚠ ATTENZIONE: blocco testo sidebar non trovato nella forma attesa — nessuna modifica applicata, verifica manuale necessaria")
ENDPY

echo ""
echo "=== Fatto ==="
echo "  npm run dev"
echo "  → Sidebar, in alto: nome del tenant (Fulcro Lucem) in bianco e in grassetto,"
echo "    'OCRA' sotto in piccolo e più tenue."
