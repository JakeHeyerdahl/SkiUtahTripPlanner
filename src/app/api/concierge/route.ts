import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

// ─── Tools ────────────────────────────────────────────────────────────────────
const PACKAGES_TOOLS: Anthropic.Tool[] = [
  {
    name: "recommend_hotel",
    description: "Recommend switching to a specific hotel option within a package. Use this when the user wants a different lodging experience.",
    input_schema: {
      type: "object" as const,
      properties: {
        packageId: { type: "string", description: "The package ID (pkg-best, pkg-value, or pkg-adventure)" },
        hotelId: { type: "string", description: "The hotel ID to switch to" },
        reason: { type: "string", description: "Brief reason why this hotel is recommended" },
      },
      required: ["packageId", "hotelId", "reason"],
    },
  },
  {
    name: "recommend_flight",
    description: "Recommend switching to a specific flight option within a package.",
    input_schema: {
      type: "object" as const,
      properties: {
        packageId: { type: "string", description: "The package ID to update" },
        flightId: { type: "string", description: "The flight ID to switch to" },
        reason: { type: "string", description: "Brief reason why this flight is recommended" },
      },
      required: ["packageId", "flightId", "reason"],
    },
  },
  {
    name: "highlight_package",
    description: "Highlight a specific package as the best match for the user's stated preferences.",
    input_schema: {
      type: "object" as const,
      properties: {
        packageId: { type: "string", description: "The package ID to highlight" },
        reason: { type: "string", description: "Why this package matches the user's preferences" },
      },
      required: ["packageId", "reason"],
    },
  },
];

const ITINERARY_TOOLS: Anthropic.Tool[] = [
  {
    name: "update_day_note",
    description: "Add a personalized tip or recommendation to a specific day in the itinerary.",
    input_schema: {
      type: "object" as const,
      properties: {
        dayIndex: { type: "integer", description: "0-based index of the day to update" },
        note: { type: "string", description: "The tip or recommendation to add for that day" },
      },
      required: ["dayIndex", "note"],
    },
  },
  {
    name: "swap_day_resort",
    description: "Suggest swapping the resort on a specific ski day to a different eligible resort.",
    input_schema: {
      type: "object" as const,
      properties: {
        dayIndex: { type: "integer", description: "0-based index of the ski day to update" },
        resortId: { type: "string", description: "Resort ID to switch to" },
        resortName: { type: "string", description: "Human-readable resort name" },
        reason: { type: "string", description: "Why this resort is a good choice for that day" },
      },
      required: ["dayIndex", "resortId", "resortName", "reason"],
    },
  },
];

// ─── System prompts ───────────────────────────────────────────────────────────
function buildSystemPrompt(context: string, tripContext: string, extraContext: string): string {
  if (context === "itinerary") {
    return `You are a friendly, expert ski trip concierge for Ski Utah helping a user customize their daily itinerary.

TRIP DETAILS:
${tripContext}

CURRENT ITINERARY:
${extraContext}

Help the user understand and improve their day-by-day plans. Use tools to suggest specific changes. Keep responses concise (2-3 sentences max unless explaining a change).`;
  }
  return `You are a friendly, expert ski trip concierge for Ski Utah helping a user choose the right package.

TRIP DETAILS:
${tripContext}

CURRENT PACKAGES:
${extraContext}

Help the user pick hotels, flights, and understand the resorts. Use tools to make concrete swap recommendations. Keep responses concise (2-3 sentences max).`;
}

// ─── POST handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      function send(obj: object) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));
      }

      try {
        const body = await req.json();
        const { messages, context, tripContext, packagesContext, itineraryContext } = body;

        const extraContext = context === "itinerary" ? (itineraryContext ?? "") : (packagesContext ?? "");
        const systemPrompt = buildSystemPrompt(context ?? "packages", tripContext ?? "", extraContext);
        const tools = context === "itinerary" ? ITINERARY_TOOLS : PACKAGES_TOOLS;

        // Init client inside handler so env vars are guaranteed loaded
        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) {
          send({ type: "error", message: "API key not configured." });
          return;
        }

        const client = new Anthropic({ apiKey });

        const apiMessages: Anthropic.MessageParam[] = (messages ?? []).map(
          (m: { role: string; content: string }) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })
        );

        const response = await client.messages.create({
          model: "claude-sonnet-4-6",
          max_tokens: 1024,
          system: systemPrompt,
          tools,
          messages: apiMessages,
        });

        // Stream text word-by-word for a natural feel
        for (const block of response.content) {
          if (block.type === "text") {
            const words = block.text.split(/(?<=\s)/);
            for (const word of words) {
              send({ type: "text", delta: word });
              await new Promise((r) => setTimeout(r, 15));
            }
          }
        }

        // Emit any tool use as action events
        for (const block of response.content) {
          if (block.type === "tool_use") {
            send({ type: "action", tool: block.name, input: block.input, id: block.id });
          }
        }

        send({ type: "done" });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("Concierge error:", message);
        send({ type: "error", message: `Error: ${message}` });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
