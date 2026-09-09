import { streamResponse } from "@/lib/ai";
import { VERBALE } from "@/lib/prompts";

export const maxDuration = 60;

export async function POST(request: Request) {
  const { transcription, title, participants, date } = (await request.json()) as {
    transcription: string; title?: string; participants?: string[]; date?: string;
  };

  if (!transcription?.trim()) {
    return new Response("Trascrizione mancante.", { status: 400 });
  }

  const user = `Riunione: ${title || "non specificata"}
Data: ${date || "non specificata"}
Partecipanti dichiarati: ${participants?.join(", ") || "non specificati"}

TRASCRIZIONE
${transcription}`;

  return streamResponse(VERBALE, user, 4096);
}
