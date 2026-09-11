#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel 2>/dev/null || echo .)"

echo "=== Fix Guide: niente più blur sullo spotlight + transizioni fluide ==="
echo ""

if [ ! -f src/components/ui/guide.tsx ]; then
  echo "ERROR: src/components/ui/guide.tsx non trovato."
  exit 1
fi

mkdir -p .guide-backup
cp src/components/ui/guide.tsx ".guide-backup/guide.tsx.$(date +%s).bak"
echo "[1/1] Backup salvato, riscrivo guide.tsx..."

python3 << 'ENDPY'
path = "src/components/ui/guide.tsx"
with open(path) as f:
    c = f.read()

changes = 0

# ── FIX 1: rimuove il blur/scurimento sul catcher quando c'è uno spotlight attivo ──
old_backdrop = '''      <div
        onClick={close}
        style={{
          position: "fixed", inset: 0, zIndex: 9998,
          background: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(4px)",
        }}
      />'''
new_backdrop = '''      <div
        onClick={close}
        style={{
          position: "fixed", inset: 0, zIndex: 9998,
          background: rect ? "transparent" : "rgba(0,0,0,0.45)",
          backdropFilter: rect ? "none" : "blur(4px)",
          transition: "background .2s ease",
        }}
      />'''
if old_backdrop in c:
    c = c.replace(old_backdrop, new_backdrop, 1)
    changes += 1
    print("    + backdrop trasparente/nitido quando c'è uno spotlight")
else:
    print("    ⚠ Pattern backdrop non trovato — verifica manuale necessaria")

# ── FIX 2: non azzera rect ad ogni step, lascia che la transizione CSS interpoli ──
old_go = '''  const go = (dir: 1 | -1) => {
    const nextStep = step + dir;
    if (nextStep < 0) return;
    if (nextStep >= STEPS.length) { close(); return; }
    setRect(null);
    setStep(nextStep);
  };'''
new_go = '''  const go = (dir: 1 | -1) => {
    const nextStep = step + dir;
    if (nextStep < 0) return;
    if (nextStep >= STEPS.length) { close(); return; }
    setStep(nextStep);
  };'''
if old_go in c:
    c = c.replace(old_go, new_go, 1)
    changes += 1
    print("    + rimosso reset posizione: la transizione ora scorre fluida tra pannelli")
else:
    print("    ⚠ Pattern go() non trovato — verifica manuale necessaria")

# ── FIX 3: aggiunge transizione anche alla card/tooltip (non solo allo spotlight) ──
old_cardstyle = '''  if (rect) {
    const margin = 16;
    const cardHeight = 240;
    let top = rect.top + rect.height + margin;
    let left = rect.left;
    if (top + cardHeight > window.innerHeight) top = Math.max(margin, rect.top - cardHeight - margin);
    if (left + cardWidth > window.innerWidth - margin) left = window.innerWidth - cardWidth - margin;
    if (left < margin) left = margin;
    cardStyle = { position: "fixed", top, left, transform: "none" };
  }'''
new_cardstyle = '''  if (rect) {
    const margin = 16;
    const cardHeight = 240;
    let top = rect.top + rect.height + margin;
    let left = rect.left;
    if (top + cardHeight > window.innerHeight) top = Math.max(margin, rect.top - cardHeight - margin);
    if (left + cardWidth > window.innerWidth - margin) left = window.innerWidth - cardWidth - margin;
    if (left < margin) left = margin;
    cardStyle = {
      position: "fixed", top, left, transform: "none",
      transition: "top .35s cubic-bezier(.4,0,.2,1), left .35s cubic-bezier(.4,0,.2,1)",
    };
  }'''
if old_cardstyle in c:
    c = c.replace(old_cardstyle, new_cardstyle, 1)
    changes += 1
    print("    + tooltip ora scorre in modo fluido insieme allo spotlight")
else:
    print("    ⚠ Pattern cardStyle non trovato — verifica manuale necessaria")

with open(path, "w") as f:
    f.write(c)

print(f"\\n✓ guide.tsx aggiornato ({changes}/3 fix applicati)")
if changes < 3:
    print("⚠ ATTENZIONE: non tutti i fix sono stati applicati — il file potrebbe essere stato modificato manualmente. Verifica con git diff.")
ENDPY

echo ""
echo "=== Fatto ==="
echo "  npm run dev"
echo "  → hard refresh, testa il passaggio tra i pannelli della dashboard:"
echo "    ora dovrebbero essere nitidi (no blur) e scorrere fluidi (no scatti)"
