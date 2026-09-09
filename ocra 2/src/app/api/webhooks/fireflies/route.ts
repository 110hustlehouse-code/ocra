import crypto from "crypto";
import { generateText } from "@/lib/ai";
import { VERBALE } from "@/lib/prompts";
import { fetchTranscript, parseVerbale } from "@/lib/fireflies";
import { db } from "@/lib/db";

export const maxDuration = 300;

/** Verifica la firma HMAC inviata da Fireflies (header `x-hub-signature`). */
function verifySignature(raw: string, signature: string | null): boolean {
  const secret = process.env.FIREFLIES_WEBHOOK_SECRET;
  if (!secret) return true; // in sviluppo la verifica è disattivata
  if (!signature) return false;
  const digest =
    "sha256=" + crypto.createHmac("sha256", secret).update(raw, "utf8").digest("hex");
  const a = Buffer.from(digest);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const raw = await request.text();

  if (!verifySignature(raw, request.headers.get("x-hub-signature"))) {
    return Response.json({ error: "firma non valida" }, { status: 401 });
  }

  const payload = JSON.parse(raw) as {
    meetingId?: string;
    eventType?: string;
    clientReferenceId?: string;
  };

  if (payload.eventType && payload.eventType !== "Transcription completed") {
    return Response.json({ ok: true, skipped: payload.eventType });
  }
  if (!payload.meetingId) {
    return Response.json({ error: "meetingId mancante" }, { status: 400 });
  }

  // Il tenant arriva da clientReferenceId, impostato quando si registra il webhook.
  const tenantId = payload.clientReferenceId ?? process.env.DEFAULT_TENANT_ID;

  try {
    const t = await fetchTranscript(payload.meetingId);

    const verbale = await generateText(
      VERBALE,
      `Riunione: ${t.title}
Data: ${t.date}
Partecipanti: ${t.participants.join(", ")}
Durata: ${t.duration} minuti

TRASCRIZIONE
${t.text}`,
      4096
    );

    const parts = parseVerbale(verbale);

    if (tenantId) {
      await db.meeting.upsert({
        where: { externalId: t.id },
        create: {
          tenantId,
          externalId: t.id,
          source: "fireflies",
          title: t.title,
          date: new Date(t.date),
          duration: t.duration,
          participants: t.participants,
          transcription: t.text,
          summary: parts.summary ?? verbale,
          decisions: parts.decisions,
          actions: parts.actions,
          risks: parts.risks,
          status: "elaborato",
        },
        update: {
          transcription: t.text,
          summary: parts.summary ?? verbale,
          decisions: parts.decisions,
          actions: parts.actions,
          risks: parts.risks,
          status: "elaborato",
        },
      });
    }

    // Inoltro a n8n: da qui partono le automazioni (task su Trello,
    // email di riepilogo ai partecipanti, salvataggio su Drive).
    if (process.env.N8N_BASE_URL) {
      fetch(`${process.env.N8N_BASE_URL}/webhook/verbale-pronto`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-ocra-secret": process.env.N8N_WEBHOOK_SECRET ?? "",
        },
        body: JSON.stringify({ tenantId, meetingId: t.id, title: t.title, verbale }),
      }).catch(() => {});
    }

    return Response.json({ ok: true, meetingId: t.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "errore sconosciuto";
    console.error("[fireflies] elaborazione fallita:", message);
    return Response.json({ error: message }, { status: 500 });
  }
}

/** Fireflies verifica l'endpoint con una GET prima di attivarlo. */
export async function GET() {
  return Response.json({ ok: true, endpoint: "fireflies" });
}
