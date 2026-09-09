import Anthropic from "@anthropic-ai/sdk";

export const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-5-20250929";

/** Il client si crea alla prima richiesta: così la build non richiede la chiave. */
let client: Anthropic | null = null;
function anthropic(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY non configurata");
    client = new Anthropic({ apiKey });
  }
  return client;
}

export async function generateText(
  system: string,
  user: string,
  maxTokens = 4096
): Promise<string> {
  const message = await anthropic().messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    system,
    messages: [{ role: "user", content: user }],
  });
  return message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");
}

/** Streaming reale token-per-token verso il browser. */
export function streamResponse(system: string, user: string, maxTokens = 4096): Response {
  const encoder = new TextEncoder();

  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const stream = anthropic().messages.stream({
          model: MODEL,
          max_tokens: maxTokens,
          system,
          messages: [{ role: "user", content: user }],
        });

        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "errore sconosciuto";
        controller.enqueue(encoder.encode(`\n\n[Errore di generazione: ${msg}]`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
