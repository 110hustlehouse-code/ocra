import { streamResponse } from "@/lib/ai";
import { PREVENTIVO } from "@/lib/prompts";

type Svc = { name: string; category: string; price: number; weeks?: number; deliverables?: string[] };

export const maxDuration = 60;

export async function POST(request: Request) {
  const { clientName, services, notes, discount } = (await request.json()) as {
    clientName: string; services: Svc[]; notes?: string; discount?: number;
  };

  if (!clientName || !services?.length) {
    return new Response("Cliente e almeno un servizio sono obbligatori.", { status: 400 });
  }

  const subtotal = services.reduce((s, x) => s + x.price, 0);
  const total = discount ? Math.round(subtotal * (1 - discount / 100)) : subtotal;

  const list = services
    .map((s) => {
      const d = s.deliverables?.length ? `\n  Deliverable: ${s.deliverables.join("; ")}` : "";
      const w = s.weeks ? `\n  Durata stimata: ${s.weeks} settimane` : "";
      return `- ${s.name} (${s.category}) — €${s.price.toLocaleString("it-IT")} + IVA${d}${w}`;
    })
    .join("\n");

  const user = `Agenzia: Fulcro Lucem
Cliente: ${clientName}
Data: ${new Date().toLocaleDateString("it-IT")}

Servizi selezionati:
${list}

Subtotale: €${subtotal.toLocaleString("it-IT")} + IVA
${discount ? `Sconto applicato: ${discount}% → Totale €${total.toLocaleString("it-IT")} + IVA` : `Totale: €${total.toLocaleString("it-IT")} + IVA`}

Note dal commerciale: ${notes?.trim() || "nessuna"}`;

  return streamResponse(PREVENTIVO, user, 4096);
}
