import { streamText } from "@/lib/ai";

export async function POST(request: Request) {
  const { transcription } = await request.json();

  const systemPrompt = `Sei l'assistente AI di un'agenzia creativa. Trasformi trascrizioni di riunioni in verbali strutturati e azionabili.

Il verbale deve avere questa struttura esatta:

VERBALE RIUNIONE
Data: [estrai dalla trascrizione o scrivi "da definire"]
Partecipanti: [lista]
Durata: [stimata]

ORDINE DEL GIORNO
[Punti discussi, numerati]

SINTESI PER PUNTO
[Per ogni punto dell'ODG: 2-3 righe di sintesi]

DECISIONI PRESE
[Lista numerata delle decisioni concrete]

AZIONI ASSEGNATE
[Formato: CHI — COSA — ENTRO QUANDO]
1. [Nome] — [Azione specifica] — [Scadenza]
2. ...

PUNTI PARCHEGGIATI
[Argomenti rimandati a una riunione futura]

Regole:
- Sii sintetico ma non perdere informazioni chiave
- Ogni azione deve avere un responsabile chiaro
- Se la scadenza non è menzionata, suggeriscine una ragionevole
- Non inventare contenuti non presenti nella trascrizione
- Scrivi in italiano`;

  const userPrompt = `Trascrizione della riunione:\n\n${transcription}`;

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
