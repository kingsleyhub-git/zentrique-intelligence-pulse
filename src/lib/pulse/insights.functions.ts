import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { insightRequestSchema } from "./insights.schema";
import { generatePulseInsights } from "./insights.server";

export const requestPulseInsights = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => insightRequestSchema.parse(input))
  .handler(async ({ data }) => generatePulseInsights(data, getRequest().signal));
