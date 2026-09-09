# Come si presenta OCRA

Venti minuti. L'ordine conta: si parte da un problema che loro sentono, non da un menu.

---

## Prima di iniziare

- `npm run dev`, browser a schermo intero, zoom 100%
- `.env.local` con `ANTHROPIC_API_KEY` valida (i testi si generano dal vivo)
- Ripartire da dati puliti: console → `localStorage.removeItem("ocra.demo.v1")` → ricarica
- Non aprire il codice. Mai.

---

## 1. Dashboard — 3 minuti

Aprire e stare zitti cinque secondi.

> "Questa è la prima schermata del lunedì mattina. Non è un elenco di cose:
> il sistema ha già incrociato fatture, trattative, progetti e verbali, e ti dice
> le sette cose che oggi richiedono una decisione. In cima quelle che costano denaro."

Cliccare una segnalazione rossa: porta esattamente dove si risolve.

Punto da far passare: **nessuno ha inserito queste segnalazioni a mano.**

---

## 2. Verbali — 5 minuti · il momento più forte

AI Studio › Verbali. Selezionare *St'Art Factory — Debrief festival*.

> "Questa riunione si è tenuta su Google Meet stamattina. Nessuno ha premuto registra,
> nessuno ha preso appunti. Fireflies è collegato al calendario ed entra da solo."

Mostrare la trascrizione grezza, poi premere **Genera verbale**. Lasciare scrivere.

> "Sintesi, decisioni, azioni con nome e scadenza, rischi, domande aperte per il cliente."

Poi aprire *Duit — Allineamento lancio v2*, spuntare un'azione.

> "Le azioni sono spuntabili e finiscono nelle segnalazioni della dashboard.
> Il verbale non è un file morto in una cartella: è la lista di cosa deve succedere."

---

## 3. Onboarding cliente — 3 minuti

Clienti › Nuovo cliente. Compilare con dati di un loro cliente vero.

Premere **Avvia onboarding** e commentare i sei passaggi mentre scorrono:
scheda, cartella Drive, board Trello, codice PO, email di benvenuto, kickoff con Fireflies.

> "Quaranta minuti di lavoro manuale, e la parte che si dimentica più spesso."

Aprire la scheda creata: progetto già aperto con il codice PO.

---

## 4. Pipeline — 2 minuti

Trascinare *Officina Meridiana* in **Vinto**, accettare la conversione in cliente.

> "Le trattative si spostano trascinandole. Il valore ponderato si aggiorna,
> i follow-up saltati diventano segnalazioni in dashboard."

---

## 5. Preventivi — 3 minuti

AI Studio › Preventivi. Scegliere il cliente appena creato, tre servizi, una nota tipo
*"budget stretto, hanno chiesto di partire dal brand"*. Sconto 10%. Generare.

> "Il preventivo esce con contesto, deliverable, tempi, condizioni. Da rileggere,
> non da riscrivere. Dieci minuti invece di due ore."

Selezionare un servizio solo: compare l'avviso sotto la soglia di 1.500 €.

> "Questa regola l'avete decisa in riunione il 7 settembre. Il sistema se la ricorda."

---

## 6. Operativo — 2 minuti

> "Scadenziario entrate e uscite con i codici PO, previsione di cassa a otto settimane,
> solleciti automatici a 7 e 21 giorni."

Segnare una fattura come incassata: cambia il grafico e sparisce dalle segnalazioni.

---

## 7. Chiusura — 2 minuti

> "Tre cose. La prima: non dovete cambiare nulla di come lavorate — Meet, Drive, Trello,
> email restano dove sono. La seconda: quello che vedete non è una presentazione,
> è il prodotto che gira. La terza: è multi-tenant, quindi la stessa base può servire
> anche i vostri clienti, con i loro colori e i loro moduli."

Poi la domanda giusta: **"Quale di queste cose vi fa perdere più tempo oggi?"**
Da lì si costruisce la fase 1.

---

## Se qualcosa non funziona

- Generazione AI ferma → chiave API o rete: passare al verbale già elaborato di Duit, il testo è lì
- Dati strani → `localStorage.removeItem("ocra.demo.v1")` e ricaricare
- Domande su Fireflies → costo 10-18 €/mese, entra come partecipante, si può disattivare per singola riunione
