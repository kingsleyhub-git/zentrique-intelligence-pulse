import { createOpenAI } from "@ai-sdk/openai";
import { APICallError, Output, streamText } from "ai";
import {
  insightsSchema,
  type InsightRequest,
  type InsightsResult,
  type PulseInsights,
} from "./insights.schema";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1";
const MODEL = "openai/gpt-6-astra";
const RUN_ID_HEADER = "X-Lovable-AIG-Run-ID";

const INSTRUCTIONS = `You are ZENTRIQUE PULSE, a senior business-intelligence analyst and strategy advisor.
You receive aggregated sales analytics computed from a client's own data (never raw rows).
Produce evidence-based, explainable intelligence for an executive audience.
Rules:
- Base every statement on the figures provided. Quote concrete numbers (with the currency code) and percentages.
- Never invent data that is not implied by the figures. If something cannot be known, say so briefly.
- headline: one sharp sentence (max 18 words). summary: 3-4 sentences executive summary.
- healthScore: 0-100 overall commercial health.
- findings: exactly 4, mixing positive and negative signals.
- risks: 2-3 items.
- scenarios: exactly 3 named Conservative, Base and Aggressive, each with total projected revenue for the next 6 months (a number in the given currency) and the key assumption. Anchor Base on the statistical forecast when provided.
- recommendations: exactly 4 concrete actions an operator can start this month, each with expected impact and 2-3 drivers (factor + weight 0-100 showing why the recommendation was made).
- answer: if the user asked a question, answer it directly in 2-5 sentences using the data; otherwise null.
- Plain business English, no markdown.`;

function buildPrompt(input: InsightRequest) {
  const { context, ...data } = input;
  return [
    context.industry ? `Business / industry: ${context.industry}` : "Business / industry: not specified",
    context.question ? `User question: ${context.question}` : "User question: none",
    "Analytics (fractions: 0.12 = 12%):",
    JSON.stringify(data),
  ].join("\n\n");
}

function clampInsights(o: PulseInsights): PulseInsights {
  return {
    ...o,
    healthScore: Math.max(0, Math.min(100, Math.round(o.healthScore))),
    findings: o.findings.slice(0, 6),
    risks: o.risks.slice(0, 4),
    scenarios: o.scenarios.slice(0, 3),
    recommendations: o.recommendations.slice(0, 5).map((r) => ({
      ...r,
      drivers: r.drivers.slice(0, 4).map((d) => ({ ...d, weight: Math.max(0, Math.min(100, Math.round(d.weight))) })),
    })),
  };
}

function friendlyError(error: unknown): string {
  const status = APICallError.isInstance(error) ? error.statusCode : undefined;
  if (status === 402)
    return "AI credits for this workspace have run out. Add credits to continue generating insights — your analytics above still work.";
  if (status === 429) return "PULSE AI is handling a lot of requests. Please wait a minute and try again.";
  if (status === 403) return "AI insights are currently unavailable for this account.";
  if (status === 401) return "AI insights are not configured correctly yet.";
  return "We couldn't generate insights right now. Please try again shortly.";
}

export async function generatePulseInsights(
  input: InsightRequest,
  signal?: AbortSignal,
): Promise<InsightsResult> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) return { ok: false, error: "AI insights are not configured yet." };

  let runId: string | undefined;
  const provider = createOpenAI({
    baseURL: GATEWAY_URL,
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: async (url, init) => {
      const headers = new Headers(init?.headers);
      if (runId && !headers.has(RUN_ID_HEADER)) headers.set(RUN_ID_HEADER, runId);
      const res = await fetch(url, { ...init, headers });
      runId ??= res.headers.get(RUN_ID_HEADER)?.trim() || undefined;
      return res;
    },
  });

  let streamError: unknown;
  try {
    const result = streamText({
      model: provider.responses(MODEL),
      instructions: INSTRUCTIONS,
      messages: [{ role: "user", content: buildPrompt(input) }],
      output: Output.object({ schema: insightsSchema }),
      abortSignal: signal,
      providerOptions: {
        openai: {
          forceReasoning: true,
          reasoningEffort: "medium",
          reasoningSummary: "auto",
          store: false,
          include: ["reasoning.encrypted_content"],
        },
      },
      onError: ({ error }) => {
        streamError = error;
      },
    });
    await result.consumeStream();
    if (streamError) throw streamError;
    const output = await result.output;
    return { ok: true, insights: clampInsights(output) };
  } catch (error) {
    const cause = streamError ?? error;
    console.error("PULSE insights failed", APICallError.isInstance(cause) ? cause.statusCode : "", cause instanceof Error ? cause.message : cause);
    return { ok: false, error: friendlyError(cause) };
  }
}
