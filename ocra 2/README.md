# OCRA

Sistema operativo AI per agenzie creative. Multi-tenant. Primo tenant: **Fulcro Lucem**.

---

## L'idea in una riga

L'agenzia continua a lavorare come ha sempre lavorato — Google Meet, Drive, Trello, email —
e OCRA raccoglie quello che succede, lo trasforma in documenti e dice ogni mattina cosa
richiede una decisione.

---

## Le cinque sezioni

| Sezione | Cosa fa |
|---|---|
| **Dashboard** | Incrocia contabilità, pipeline, progetti, verbali e bandi e mostra solo ciò che richiede attenzione oggi |
| **Clienti** | Anagrafica, progetti con budget e codice PO, piano editoriale, riunioni. Onboarding in sei passaggi automatici |
| **Pipeline** | Funnel commerciale drag-and-drop, valore ponderato, follow-up in ritardo, conversione lead → cliente |
| **AI Studio** | Verbali, preventivi, analisi bandi, scrittura progetti. Tutto in streaming |
| **Operativo** | Scadenziario entrate/uscite, previsione di cassa a 8 settimane, solleciti, generatore di codici PO |

Niente pagine "in arrivo": ogni voce del menu fa qualcosa.

---

## Trascrizione automatica delle riunioni

Non serve un'estensione del browser né cambiare strumento.

```
Riunione su Google Meet (il team non cambia nulla)
   └─ Fireflies.ai entra da solo come partecipante e trascrive
      └─ POST /api/webhooks/fireflies    (firma HMAC verificata)
         └─ scarica la trascrizione via API GraphQL
            └─ Claude la trasforma in verbale strutturato
               └─ salvata su PostgreSQL + inoltro a n8n
                  └─ appare in AI Studio › Verbali, pronta
```

Da n8n partono poi le automazioni: task su Trello, email di riepilogo ai partecipanti,
archiviazione su Drive.

**Configurazione**

1. Account Fireflies (piano Pro, circa 18 €/utente/mese) e collegamento al Google Calendar del team.
2. `FIREFLIES_API_KEY` da *Settings › Developer Settings*.
3. Registrare il webhook su `https://<dominio>/api/webhooks/fireflies` e copiare il secret in `FIREFLIES_WEBHOOK_SECRET`.
4. Impostare `DEFAULT_TENANT_ID` (o passare il tenant come `clientReferenceId`).

L'endpoint risponde anche in GET per la verifica iniziale di Fireflies.

---

## Setup locale

```bash
npm install
cp .env.example .env.local     # compila le chiavi
npx prisma generate
npx prisma db push
npm run dev
```

La demo è navigabile **senza database**: i dati vivono in `src/lib/demo/` e lo stato
applicativo in `src/lib/demo/store.tsx`. Ogni azione (creare un cliente, spostare una
trattativa, segnare una fattura incassata) è reale e persiste nel browser.
Per ripartire da zero: `localStorage.removeItem("ocra.demo.v1")`.

Le funzioni AI richiedono invece `ANTHROPIC_API_KEY`.

## Setup produzione (VPS)

```bash
docker compose up -d           # PostgreSQL + n8n
```

---

## Struttura

```
src/
  app/
    (dashboard)/       le cinque sezioni
    api/ai/            preventivo · verbale · bando · progetto  (streaming)
    api/webhooks/      fireflies
  components/
    layout/            sidebar
    studio/            i quattro strumenti AI + hook di streaming
    ui/                kit di componenti (badge, panel, stat, modal…)
  lib/
    ai.ts              client Anthropic + streaming reale
    prompts.ts         i system prompt, versionati a parte
    fireflies.ts       API GraphQL + parsing del verbale
    demo/              dataset, store applicativo, motore di alert
```

I system prompt stanno in un file dedicato perché sono il vero know-how del prodotto:
si affinano senza toccare il codice.

---

## Dal demo al database

Il dataset di `src/lib/demo/` rispecchia 1:1 i modelli Prisma. Per passare al DB reale
si sostituiscono le funzioni dello store con server action Prisma: i componenti non cambiano.

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind 4 · PostgreSQL + Prisma · Claude API · Fireflies · n8n · Vercel
