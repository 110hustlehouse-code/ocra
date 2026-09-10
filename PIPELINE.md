# OCRA — Pipeline di Progetto
*Aggiornato: 10 settembre 2026*

---

## ✅ COMPLETATO

### Infrastruttura
- [x] Progetto Next.js + TypeScript + Tailwind
- [x] Prisma schema multi-tenant (13 tabelle)
- [x] Docker Compose (PostgreSQL + n8n)
- [x] Repo GitHub privata
- [x] Codespace funzionante
- [x] CSS design system

### Pagine
- [x] Dashboard — KPI, alert, progetti, verbali, pipeline, riunioni
- [x] Clienti — portafoglio, onboarding, dettaglio con tab
- [x] Pipeline — CRM drag & drop, nuova trattativa, conversione lead
- [x] Progetti — lista, filtri, dettaglio con budget e progress
- [x] Contenuti — pipeline editoriale kanban + vista lista
- [x] AI Studio interno — Preventivi, Verbali, Bandi, Scrittura Progetti
- [x] AI Studio servizi — Business Audit, Business Plan, Naming, Personas, Piano Editoriale, Campaign, Launch, Growth
- [x] Operativo — scadenziario, codici PO, previsione cassa, collaboratori

### Compliance legale
- [x] GDPR checklist (DPA, registro trattamenti, sub-responsabili)
- [x] Cessione diritti d'autore (collaboratore→agenzia, agenzia→cliente)
- [x] Gate contratto + acconto
- [x] Calcolatore ritenuta d'acconto (occasionale + cessione diritti)

### UX
- [x] Guida interattiva multi-pagina (7 sezioni)
- [x] Toast animate su azioni senza backend
- [x] Export PDF preventivi
- [x] Animazioni AI (pulse, done flash)

---

## 🔶 DA FARE — PRIMA DELL'APPUNTAMENTO CON DANIELE

### Demo prep
- [ ] Collegare API key Anthropic (ANTHROPIC_API_KEY in .env.local)
- [ ] Test completo: generare 1 preventivo, 1 verbale, 1 business audit
- [ ] Fix spaziature residue se presenti
- [ ] Preparare dati demo realistici (nomi clienti Fulcro reali)
- [ ] Script demo: ordine delle schermate, cosa dire, cosa cliccare

### Quick fix
- [ ] Verificare hydration error risolto definitivamente
- [ ] Testare su mobile (responsive)

---

## 🔴 DA FARE — DOPO L'APPUNTAMENTO

### Fase 1 — Produzione (settimane 1-3 post-firma)
- [ ] Deploy su Cloudflare (dominio ocra.studio)
- [ ] PostgreSQL produzione (Hetzner VPS)
- [ ] n8n produzione con SSL
- [ ] Auth Google OAuth reale (NextAuth)
- [ ] Collegamento database reale (sostituire demo store)

### Fase 2 — Automazioni n8n (settimane 3-6)
- [ ] Onboarding automatizzato: form → Drive + Trello + email
- [ ] CRM follow-up: sequenza email automatica 3/7/14gg
- [ ] Scadenziario: cron alert fatture in scadenza
- [ ] Solleciti: email automatica fatture scadute
- [ ] Contabilità: generazione PO automatica
- [ ] Reminder collaboratori: "invia documento entro il 5"

### Fase 3 — Integrazioni (settimane 6-8)
- [ ] Fireflies.ai → trascrizione automatica → verbale AI → Trello task
- [ ] Bandi scraping: RSS/cron settimanale → filtro AI → digest email
- [ ] Google Drive API: creazione cartelle strutturate
- [ ] Trello API: creazione board da template
- [ ] Gmail API: email automatiche branded

### Fase 4 — Polish produzione (settimane 8-10)
- [ ] Branding Fulcro applicato (logo, colori reali)
- [ ] Formazione team (3 sessioni da 2h)
- [ ] Documentazione utente
- [ ] Monitoring e health check n8n
- [ ] Backup automatico database

---

## 💰 COMMERCIALE

### Pricing Fulcro
- Implementazione: €5.000 + IVA (una tantum)
- Intervento giornaliero: €100 + IVA
- Nuova integrazione AI: €500 + IVA
- Mantenimento semestrale: €999 + IVA

### Costi operativi mensili
- VPS Hetzner: ~€5/mese
- Claude API: ~€20-40/mese
- Fireflies.ai: ~€10-18/mese
- Vercel/Cloudflare: €0
- Totale: ~€35-65/mese

### Target anno 1
- Fulcro: €5.000 + €1.998 mantenimento = €6.998
- 2-3 clienti dal network Daniele: €10.000-15.000
- Obiettivo: €20.000-25.000 anno 1

---

## 📋 PROSSIMO PASSO

**Appuntamento con Daniele — terza settimana settembre 2026**
- Email inviata a Erika per fissare data
- Demo OCRA pronta su Codespace
- Collegare API key e testare AI prima dell'incontro
