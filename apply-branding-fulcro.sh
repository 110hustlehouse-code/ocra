#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel 2>/dev/null || echo .)"

echo "=== Branding Fulcro: colore viola elettrico + logo ==="
echo ""

mkdir -p .guide-backup
TS=$(date +%s)
for f in "src/app/globals.css" "src/components/layout/sidebar.tsx"; do
  if [ -f "$f" ]; then
    mkdir -p ".guide-backup/$(dirname "$f")"
    cp "$f" ".guide-backup/$f.$TS.bak"
  fi
done
echo "[0/3] Backup salvato"

# ══════════════════════════════════════════════════════════════
# 1 — Salva il logo Fulcro in public/
# ══════════════════════════════════════════════════════════════
echo "[1/3] Scrivo public/logo-fulcro.png..."
mkdir -p public
python3 -c "
import base64
data = '''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'''
with open('public/logo-fulcro.png', 'wb') as f:
    f.write(base64.b64decode(data))
"
echo "    + public/logo-fulcro.png scritto"

# ══════════════════════════════════════════════════════════════
# 2 — globals.css: sostituisce l'arancio (#e85d24) con il viola Fulcro (#8318F4)
# ══════════════════════════════════════════════════════════════
echo "[2/3] Aggiorno globals.css..."

python3 << 'ENDPY'
path = "src/app/globals.css"
with open(path) as f:
    c = f.read()

n = 0

old = '''  --brand: #e85d24;
  --brand-soft: rgba(232, 93, 36, 0.06);
  --brand-glow: rgba(232, 93, 36, 0.12);'''
new = '''  --brand: #8318f4;
  --brand-soft: rgba(131, 24, 244, 0.06);
  --brand-glow: rgba(131, 24, 244, 0.12);'''
if old in c:
    c = c.replace(old, new, 1); n += 1
    print("    + variabili --brand / --brand-soft / --brand-glow aggiornate")
else:
    print("    ⚠ blocco --brand non trovato")

old = '--shadow-glow: 0 0 0 1px var(--brand-glow), 0 4px 20px -8px rgba(232, 93, 36, 0.15);'
new = '--shadow-glow: 0 0 0 1px var(--brand-glow), 0 4px 20px -8px rgba(131, 24, 244, 0.15);'
if old in c:
    c = c.replace(old, new, 1); n += 1
    print("    + --shadow-glow aggiornato")
else:
    print("    ⚠ --shadow-glow non trovato")

old = '''  box-shadow:
    0 0 0 3px rgba(232, 93, 36, 0.35),
    0 0 24px 4px rgba(232, 93, 36, 0.10),
    0 0 0 9999px rgba(15, 16, 18, 0.72);'''
new = '''  box-shadow:
    0 0 0 3px rgba(131, 24, 244, 0.35),
    0 0 24px 4px rgba(131, 24, 244, 0.10),
    0 0 0 9999px rgba(15, 16, 18, 0.72);'''
if old in c:
    c = c.replace(old, new, 1); n += 1
    print("    + spotlight del tour aggiornato al viola")
else:
    print("    ⚠ box-shadow spotlight non trovato")

with open(path, "w") as f:
    f.write(c)
print(f"    ✓ globals.css ({n}/3 modifiche)")
ENDPY

# ══════════════════════════════════════════════════════════════
# 3 — sidebar.tsx: logo Fulcro reale al posto dell'icona generica
# ══════════════════════════════════════════════════════════════
echo "[3/3] Aggiorno sidebar.tsx..."

python3 << 'ENDPY'
path = "src/components/layout/sidebar.tsx"
with open(path) as f:
    c = f.read()

old = '''          <div
            className="w-7 h-7 rounded-[8px] flex items-center justify-center shrink-0"
            style={{ background: "var(--brand)" }}
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="#fff" strokeWidth="2" />
              <path d="M8 2a6 6 0 0 1 6 6" stroke="var(--brand)" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          </div>'''
new = '''          <div
            className="w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0 overflow-hidden"
            style={{ background: "#000" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-fulcro.png" alt="Fulcro Lucem" className="w-full h-full object-contain p-1" />
          </div>'''
if old in c:
    c = c.replace(old, new, 1)
    with open(path, "w") as f:
        f.write(c)
    print("    + icona sidebar sostituita col logo Fulcro reale")
else:
    print("    ⚠ ATTENZIONE: blocco icona sidebar non trovato — nessuna modifica applicata, verifica manuale necessaria")
ENDPY

echo ""
echo "=== Fatto ==="
echo "  npm run dev"
echo "  → Sidebar: logo Fulcro reale in alto, sfondo nero."
echo "  → In tutta l'app: bottoni primari, badge attivi, focus ring, spotlight"
echo "    della guida e glow sono ora viola elettrico (#8318F4) invece di arancio."
