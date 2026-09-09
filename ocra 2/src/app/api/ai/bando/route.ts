import { streamResponse } from "@/lib/ai";
import { BANDO } from "@/lib/prompts";

export const maxDuration = 60;

export async function POST(request: Request) {
  const { name, entity, description, clients } = (await request.json()) as {
    name: string; entity?: string; description?: string; clients?: string;
  };

  if (!name?.trim()) return new Response("Nome del bando mancante.", { status: 400 });

  const user = `Bando: ${name}
Ente: ${entity || "non specificato"}

Testo / informazioni disponibili:
${description || "nessun testo fornito"}

Portafoglio clienti dell'agenzia da tenere presente:
${clients || "non specificato"}`;

  return streamResponse(BANDO, user, 3072);
}
