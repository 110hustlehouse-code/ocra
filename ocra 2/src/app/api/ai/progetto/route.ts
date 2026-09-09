import { streamResponse } from "@/lib/ai";
import { PROGETTO } from "@/lib/prompts";

export const maxDuration = 60;

export async function POST(request: Request) {
  const { section, projectName, bando, brief, length } = (await request.json()) as {
    section: string; projectName: string; bando?: string; brief?: string; length?: string;
  };

  if (!projectName?.trim() || !section) {
    return new Response("Nome progetto e sezione sono obbligatori.", { status: 400 });
  }

  const user = `Progetto: ${projectName}
Bando / contesto: ${bando || "non specificato"}
Sezione da scrivere: ${section}
Lunghezza richiesta: ${length || "600-900 caratteri"}

Brief e materiali forniti dal proponente:
${brief || "nessuno"}`;

  return streamResponse(PROGETTO, user, 3072);
}
