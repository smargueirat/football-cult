import { llmsTxt } from "@/lib/llmsTxt";

// llmstxt.org: resumen del sitio para buscadores y asistentes de IA.
export const revalidate = 86400;

export function GET() {
  return new Response(llmsTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
