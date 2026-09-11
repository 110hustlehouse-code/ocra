#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel 2>/dev/null || echo .)"

echo "=== Approfondimento guida AI Studio: Riunioni, Come funziona, Servizi al cliente ==="
echo ""

mkdir -p .guide-backup
TS=$(date +%s)
for f in "src/components/ui/guide.tsx" "src/components/studio/verbali.tsx"; do
  if [ -f "$f" ]; then
    mkdir -p ".guide-backup/$(dirname "$f")"
    cp "$f" ".guide-backup/$f.$TS.bak"
  fi
done
echo "[0/2] Backup salvato"

# ══════════════════════════════════════════════════════════════
# 1 — verbali.tsx: aggiunge data-guide su Riunioni e Come funziona
# ══════════════════════════════════════════════════════════════
echo "[1/2] Aggiorno studio/verbali.tsx..."

python3 << 'ENDPY'
path = "src/components/studio/verbali.tsx"
with open(path) as f:
    c = f.read()

n = 0

old = '''      <div className="space-y-4">
        <Panel
          title="Riunioni"'''
new = '''      <div className="space-y-4">
        <div data-guide="studio-riunioni">
        <Panel
          title="Riunioni"'''
if old in c:
    c = c.replace(old, new, 1); n += 1
    print("    + studio-riunioni (apertura wrapper)")

old = '''        <button
          className="btn btn-ghost w-full"
          onClick={() => { setManual(true); }}
        >
          Incolla una trascrizione
        </button>

        <div className="card card-pad">
          <div className="t-label mb-2">Come funziona</div>'''
new = '''        </div>

        <button
          className="btn btn-ghost w-full"
          onClick={() => { setManual(true); }}
        >
          Incolla una trascrizione
        </button>

        <div className="card card-pad" data-guide="studio-come-funziona">
          <div className="t-label mb-2">Come funziona</div>'''
if old in c:
    c = c.replace(old, new, 1); n += 1
    print("    + studio-riunioni (chiusura wrapper) + studio-come-funziona")

with open(path, "w") as f:
    f.write(c)
print(f"    ✓ verbali.tsx ({n}/2 modifiche)")
ENDPY

# ══════════════════════════════════════════════════════════════
# 2 — guide.tsx: inserisce i 3 nuovi step nella sezione AI Studio
# ══════════════════════════════════════════════════════════════
echo "[2/2] Aggiorno guide.tsx (inserisco 3 step in AI Studio)..."

python3 << 'ENDPY'
path = "src/components/ui/guide.tsx"
with open(path) as f:
    c = f.read()

anchor = '''  { page: "/studio", target: "studio-tabs", section: "AI Studio", title: "Quattro strumenti interni", body: "Verbali automatici dalle riunioni, preventivi generati dai servizi, analisi di pertinenza sui bandi, e scrittura assistita delle proposte progettuali." },'''

if 'studio-riunioni' in c:
    print("    ✓ già presente, nessuna modifica necessaria")
elif anchor in c:
    insertion = anchor + '''
  { page: "/studio", target: "studio-riunioni", section: "AI Studio", title: "Riunioni collegate a Fireflies", body: "L'elenco delle riunioni con lo stato di ciascuna: pronte, da elaborare o ancora in corso. Selezionane una per vedere trascrizione e verbale." },
  { page: "/studio", target: "studio-come-funziona", section: "AI Studio", title: "Come funziona", body: "Fireflies entra da solo in ogni riunione su Meet: nessuno deve avviare o fermare niente. A riunione finita, trascrizione e verbale sono già pronti qui." },
  {
    page: "/studio", section: "AI Studio",
    title: "Servizi al cliente",
    body: "Otto strumenti AI pronti da vendere come servizio ai clienti di Fulcro Lucem, St'Art Factory e Duit.",
    features: [
      "Business Audit, Business Plan, Naming, Audience Personas",
      "Piano Editoriale, Campaign Concept, Piano Lancio, Growth Analysis",
      "Un brief, un documento professionale pronto in pochi secondi",
      "Il controllo qualità resta sempre umano prima della consegna",
    ],
  },'''
    c = c.replace(anchor, insertion, 1)
    with open(path, "w") as f:
        f.write(c)
    print("    + 3 nuovi step inseriti nella sezione AI Studio")
else:
    print("    ⚠ ATTENZIONE: ancora 'studio-tabs' non trovata — guide.tsx potrebbe essere stato modificato manualmente.")
    print("    Nessuna modifica applicata, verifica con git diff.")
ENDPY

echo ""
echo "=== Fatto ==="
echo "  npm run dev"
echo "  → hard refresh, poi verifica la sezione AI Studio nel tour:"
echo "    dopo le 4 tab dovrebbero apparire Riunioni, Come funziona, Servizi al cliente"
