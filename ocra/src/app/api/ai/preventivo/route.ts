import { streamText } from "@/lib/ai";

export async function POST(request: Request) {
  const { clientName, services, notes } = await request.json();

  const serviceList = services
    .map(
      (s: { name: string; price: number; category: string }) =>
        `- ${s.name} (${s.category}): a partire da €${s.price.toLocaleString("it-IT")} + IVA`
    )
    .join("\n");

  const total = services.reduce(
    (sum: number, s: { price: number }) => sum + s.price,
    0
  );

  const systemPrompt = `Sei l'assistente AI di un'agenzia creativa italiana. Generi preventivi professionali, chiari e personalizzati.

Il preventivo deve includere:
1. Intestazione con nome agenzia e cliente
2. Introduzione personalizzata (2-3 righe che dimostrano comprensione del progetto)
3. Per ogni servizio selezionato: descrizione dettagliata di cosa include, deliverable specifici, timeline stimata
4. Riepilogo economico con totale
5. Condizioni: acconto 50% alla firma, saldo a consegna, max 2 revisioni incluse, nessun lavoro senza contratto firmato
6. Validità preventivo: 30 giorni

Scrivi in italiano professionale ma non freddo. Il tono è quello di un partner che vuole costruire qualcosa insieme, non di un fornitore.
Non inventare servizi che non sono nella lista. Non aggiungere disclamer o note AI.`;

  const userPrompt = `Genera un preventivo per il cliente "${clientName}".

Servizi selezionati:
${serviceList}

Totale base: €${total.toLocaleString("it-IT")} + IVA

${notes ? `Note dal commerciale: ${notes}` : "Nessuna nota aggiuntiva."}`;

  const stream = streamText(systemPrompt, userPrompt);

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      const response = await stream.finalMessage();
      for (const block of response.content) {
        if (block.type === "text") {
          controller.enqueue(encoder.encode(block.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
