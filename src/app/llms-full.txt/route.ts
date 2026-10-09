import { llmsTxt } from "@/lib/llmsTxt";

// Versión larga de /llms.txt: más las cifras de hoy y el texto de las guías.
export const revalidate = 86400;

export function GET() {
  return new Response(llmsTxt(true), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
