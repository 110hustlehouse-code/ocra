/**
 * Integrazione Fireflies.ai
 * ─────────────────────────
 * Fireflies si collega al Google Calendar del team ed entra da solo in ogni
 * riunione (Meet, Zoom, Teams) come partecipante silenzioso. Il team non cambia
 * nulla nel proprio modo di lavorare: continua a usare Google Meet.
 *
 * A riunione conclusa Fireflies chiama il webhook `/api/webhooks/fireflies`,
 * noi scarichiamo la trascrizione con la sua API GraphQL, la passiamo a Claude
 * e il verbale strutturato compare in AI Studio → Verbali.
 */

const FIREFLIES_API = "https://api.fireflies.ai/graphql";

export type FirefliesTranscript = {
  id: string;
  title: string;
  date: string;
  duration: number;
  participants: string[];
  text: string;
};

const QUERY = `
  query Transcript($id: String!) {
    transcript(id: $id) {
      id
      title
      date
      duration
      participants
      sentences { speaker_name text }
    }
  }
`;

export async function fetchTranscript(id: string): Promise<FirefliesTranscript> {
  const key = process.env.FIREFLIES_API_KEY;
  if (!key) throw new Error("FIREFLIES_API_KEY non configurata");

  const res = await fetch(FIREFLIES_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({ query: QUERY, variables: { id } }),
  });

  if (!res.ok) throw new Error(`Fireflies ha risposto ${res.status}`);

  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0].message);

  const t = json.data?.transcript;
  if (!t) throw new Error(`Trascrizione ${id} non trovata`);

  type Sentence = { speaker_name: string | null; text: string };
  const text: string = (t.sentences ?? [])
    .map((s: Sentence) => `${s.speaker_name ?? "Sconosciuto"}: ${s.text}`)
    .join("\n");

  return {
    id: t.id,
    title: t.title ?? "Riunione senza titolo",
    date: t.date,
    duration: Math.round((t.duration ?? 0) / 60),
    participants: t.participants ?? [],
    text,
  };
}

/** Estrae le sezioni del verbale generato per salvarle in campi separati. */
export function parseVerbale(md: string) {
  const grab = (start: string, ends: string[]) => {
    const i = md.indexOf(start);
    if (i === -1) return null;
    const rest = md.slice(i + start.length);
    const cut = ends
      .map((e) => rest.indexOf(e))
      .filter((n) => n > -1)
      .sort((a, b) => a - b)[0];
    return (cut === undefined ? rest : rest.slice(0, cut)).trim();
  };

  return {
    summary: grab("IN SINTESI", ["PUNTI DISCUSSI", "DECISIONI"]),
    decisions: grab("DECISIONI", ["AZIONI"]),
    actions: grab("AZIONI", ["RISCHI E PUNTI APERTI", "DA CHIARIRE"]),
    risks: grab("RISCHI E PUNTI APERTI", ["DA CHIARIRE"]),
  };
}
