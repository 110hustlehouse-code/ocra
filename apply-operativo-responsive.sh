#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel 2>/dev/null || echo .)"

echo "=== Fix layout Operativo: adattivo, niente scroll laterale ==="
echo ""

path="src/app/(dashboard)/operativo/page.tsx"
if [ ! -f "$path" ]; then
  echo "ERROR: $path non trovato."
  exit 1
fi

mkdir -p .guide-backup
cp "$path" ".guide-backup/operativo-page.tsx.$(date +%s).bak"

python3 << 'ENDPY'
path = "src/app/(dashboard)/operativo/page.tsx"
with open(path) as f:
    c = f.read()

n = 0

# ── 1. KPI: 4 colonne fisse → responsive (2 su schermi stretti, 4 su schermi larghi) ──
old = '      <div className="grid grid-cols-4 gap-4 mb-5" data-guide="operativo-kpi">'
new = '      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-5" data-guide="operativo-kpi">'
if old in c:
    c = c.replace(old, new, 1); n += 1
    print("    + KPI: grid-cols-2 xl:grid-cols-4 (responsive)")

# ── 2. Colonna 360px fissa → si impila verticalmente sotto una certa larghezza ──
old = '      <div className="grid grid-cols-[1fr_360px] gap-5 items-start">'
new = '      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5 items-start">'
if old in c:
    c = c.replace(old, new, 1); n += 1
    print("    + Colonne: grid-cols-1 xl:grid-cols-[1fr_360px] (si impila su schermi stretti)")

# ── 3. Tabella scadenziario: riduce leggermente il padding/font così
#      entra più facilmente senza scroll orizzontale della tabella stessa ──
old = '''                <table className="tbl">
                  <thead>
                    <tr>
                      <th></th><th>Controparte</th><th>Descrizione</th><th>Codice PO</th>
                      <th>Scadenza</th><th className="text-right">Importo</th><th>Stato</th><th></th>
                    </tr>
                  </thead>'''
new = '''                <table className="tbl tbl-compact">
                  <thead>
                    <tr>
                      <th></th><th>Controparte</th><th className="hide-lg">Descrizione</th><th className="hide-lg">Codice PO</th>
                      <th>Scadenza</th><th className="text-right">Importo</th><th>Stato</th><th></th>
                    </tr>
                  </thead>'''
if old in c:
    c = c.replace(old, new, 1); n += 1
    print("    + Tabella: colonne secondarie (Descrizione, Codice PO) nascoste sotto XL")

old = '''                          <td className="font-medium">{i.counterpart}</td>
                          <td style={{ color: "var(--text-2)" }}>{i.description}</td>
                          <td className="t-meta tabular">{i.poCode}</td>'''
new = '''                          <td className="font-medium">{i.counterpart}</td>
                          <td className="hide-lg" style={{ color: "var(--text-2)" }}>{i.description}</td>
                          <td className="hide-lg t-meta tabular">{i.poCode}</td>'''
if old in c:
    c = c.replace(old, new, 1); n += 1
    print("    + Tabella: righe Descrizione/Codice PO coerenti con l'intestazione")

with open(path, "w") as f:
    f.write(c)
print(f"\\n✓ operativo/page.tsx aggiornato ({n}/4 modifiche)")
ENDPY

echo ""
echo "[2/2] Aggiungo classi CSS di supporto (hide-lg, tbl-compact) a globals.css..."

python3 << 'ENDPY'
path = "src/app/globals.css"
with open(path) as f:
    c = f.read()

if ".hide-lg" not in c:
    addition = '''
/* ── Responsive: nasconde colonne secondarie sotto la soglia XL (1280px) ── */
@media (max-width: 1279px) {
  .hide-lg { display: none; }
  .tbl-compact th, .tbl-compact td { padding-left: 10px; padding-right: 10px; }
}
'''
    c = c.rstrip() + "\n" + addition
    with open(path, "w") as f:
        f.write(c)
    print("    + regole .hide-lg / .tbl-compact aggiunte")
else:
    print("    ✓ regole già presenti")
ENDPY

echo ""
echo "=== Fatto ==="
echo "  npm run dev"
echo "  → prova a restringere la finestra del browser: Operativo ora si impila"
echo "    in verticale invece di richiedere scroll laterale, come le altre pagine"
