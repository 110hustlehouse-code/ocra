#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel 2>/dev/null || echo .)"

echo "=== Aggiunge dettaglio riunione + rimuove le 2 schermate segnalate ==="
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
# 1 — verbali.tsx: aggiunge data-guide sul pannello di dettaglio riunione
# ══════════════════════════════════════════════════════════════
echo "[1/2] Aggiorno studio/verbali.tsx..."

python3 << 'ENDPY'
path = "src/components/studio/verbali.tsx"
with open(path) as f:
    c = f.read()

n = 0

if 'studio-riunione-dettaglio' in c:
    print("    ✓ già presente, nessuna modifica necessaria")
else:
    old = '''          <>
            <Panel
              title={m.title}'''
    new = '''          <>
            <div data-guide="studio-riunione-dettaglio">
            <Panel
              title={m.title}'''
    if old in c:
        c = c.replace(old, new, 1); n += 1
        print("    + studio-riunione-dettaglio (apertura wrapper)")
    else:
        print("    ⚠ apertura non trovata")

    old = '''            </Panel>

            {(loading || text) && (
              <Output text={text} loading={loading} error={error} empty="" filename={`verbale-${m.id}.txt`} />
            )}
          </>
        )}'''
    new = '''            </Panel>
            </div>

            {(loading || text) && (
              <Output text={text} loading={loading} error={error} empty="" filename={`verbale-${m.id}.txt`} />
            )}
          </>
        )}'''
    if old in c:
        c = c.replace(old, new, 1); n += 1
        print("    + studio-riunione-dettaglio (chiusura wrapper)")
    else:
        print("    ⚠ chiusura non trovata")

    with open(path, "w") as f:
        f.write(c)
    print(f"    ✓ verbali.tsx ({n}/2 modifiche)")
ENDPY

# ══════════════════════════════════════════════════════════════
# 2 — guide.tsx: aggiunge lo step mancante, rimuove le 2 schermate
# ══════════════════════════════════════════════════════════════
echo "[2/2] Aggiorno guide.tsx..."

python3 << 'ENDPY'
path = "src/components/ui/guide.tsx"
with open(path) as f:
    c = f.read()

n = 0

# ── A. Aggiunge lo step "Trascrizione e verbale" dopo "Come funziona" ──
if 'studio-riunione-dettaglio' in c:
    print("    ✓ step dettaglio riunione già presente")
else:
    old = '''  { page: "/studio", target: "studio-come-funziona", section: "AI Studio", title: "Come funziona", body: "Fireflies entra da solo in ogni riunione su Meet: nessuno deve avviare o fermare niente. A riunione finita, trascrizione e verbale sono già pronti qui." },'''
    new = old + '''
  { page: "/studio", target: "studio-riunione-dettaglio", section: "AI Studio", title: "Trascrizione e verbale", body: "Il dettaglio della riunione selezionata: trascrizione grezza pronta per generare il verbale, oppure — se già elaborato — sintesi, decisioni e azioni assegnate." },'''
    if old in c:
        c = c.replace(old, new, 1); n += 1
        print("    + step 'Trascrizione e verbale' inserito")
    else:
        print("    ⚠ ancora 'studio-come-funziona' non trovata — verifica manuale necessaria")

# ── B. Rimuove lo step "Servizi al cliente" ──
old = '''  {
    page: "/studio", section: "AI Studio",
    title: "Servizi al cliente",
    body: "Otto strumenti AI pronti da vendere come servizio ai clienti di Fulcro Lucem, St'Art Factory e Duit.",
    features: [
      "Business Audit, Business Plan, Naming, Audience Personas",
      "Piano Editoriale, Campaign Concept, Piano Lancio, Growth Analysis",
      "Un brief, un documento professionale pronto in pochi secondi",
      "Il controllo qualità resta sempre umano prima della consegna",
    ],
  },
'''
if old in c:
    c = c.replace(old, "", 1); n += 1
    print("    − step 'Servizi al cliente' rimosso")
else:
    print("    ✓ 'Servizi al cliente' già assente")

# ── C. Rimuove lo step overview "Contabilità che gira da sola" (Operativo) ──
old = '''  {
    page: "/operativo", section: "Operativo",
    title: "Contabilità che gira da sola",
    body: "Scadenziario, codici PO, previsione di cassa e solleciti automatici.",
    features: [
      "Scadenziario con filtri: entrate, uscite, scadute",
      "Generatore codici PO nel formato standard dell'agenzia",
      "Previsione di cassa a 8 settimane",
      "Solleciti automatici per fatture scadute",
      "Gestione collaboratori e documenti fiscali",
    ],
  },
'''
if old in c:
    c = c.replace(old, "", 1); n += 1
    print("    − step 'Contabilità che gira da sola' rimosso (Operativo parte ora dai suoi spotlight)")
else:
    print("    ✓ 'Contabilità che gira da sola' già assente")

with open(path, "w") as f:
    f.write(c)
print(f"\\n✓ guide.tsx aggiornato ({n}/3 modifiche applicate)")
ENDPY

echo ""
echo "=== Fatto ==="
echo "  npm run dev"
echo "  → hard refresh, verifica: dopo 'Come funziona' compare 'Trascrizione e verbale',"
echo "    poi si passa direttamente a Operativo (KPI) senza le due schermate rimosse"
