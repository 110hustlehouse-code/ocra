import { streamResponse } from "@/lib/ai";
import { BUSINESS_PLAN } from "@/lib/prompts";
export const maxDuration = 60;
export async function POST(req: Request) {
  const { brief } = await req.json();
  if (!brief?.trim()) return new Response("Brief mancante.", { status: 400 });
  return streamResponse(BUSINESS_PLAN, brief, 4096);
}
