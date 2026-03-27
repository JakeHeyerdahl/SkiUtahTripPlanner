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
  {
    name: "set_day_type",
    description: "Convert a ski day into a rest/free day, or convert a rest day into a ski day. Use this when the user wants to remove skiing from a day, take a break, or add a ski day.",
    input_schema: {
      type: "object" as const,
      properties: {
        dayIndex: { type: "integer", description: "0-based index of the day to change" },
        type: { type: "string", enum: ["rest", "ski"], description: "'rest' removes skiing from that day, 'ski' adds skiing" },
        resortId: { type: "string", description: "Resort ID to ski at — required when type is 'ski'" },
        resortName: { type: "string", description: "Human-readable resort name — required when type is 'ski'" },
        reason: { type: "string", description: "Brief reason for the change" },
      },
      required: ["dayIndex", "type", "reason"],
    },
  },
  {
    name: "update_meal",
    description: "Replace a meal recommendation on a specific day with a different restaurant or option.",
    input_schema: {
      type: "object" as const,
      properties: {
        dayIndex: { type: "integer", description: "0-based index of the day" },
        mealType: { type: "string", enum: ["breakfast", "lunch", "dinner"], description: "Which meal to update" },
        name: { type: "string", description: "Name of the restaurant or food option" },
        type: { type: "string", description: "Style or type of dining (e.g. 'Fine Dining', 'On-Mountain', 'Café')" },
        reason: { type: "string", description: "Why this meal is recommended" },
      },
      required: ["dayIndex", "mealType", "name", "type", "reason"],
    },
  },
  {
    name: "add_day_activity",
    description: "Add an extra activity or logistical note to a specific day's plan.",
    input_schema: {
      type: "object" as const,
      properties: {
        dayIndex: { type: "integer", description: "0-based index of the day" },
        activity: { type: "string", description: "The activity or note to add to that day" },
        reason: { type: "string", description: "Why this activity is recommended" },
      },
      required: ["dayIndex", "activity", "reason"],
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

You can make the following changes using tools:
- swap_day_resort: change which resort a ski day is at
- set_day_type: convert a ski day to a rest/free day (type="rest"), or add skiing to a rest day (type="ski" + resortId)
- update_day_note: add a personalized tip to any day
- update_meal: replace breakfast, lunch, or dinner on any day with a specific restaurant
- add_day_activity: add an extra activity or note to a day's plan

CRITICAL — ALWAYS call multiple tools in a single response when the request has multiple parts:
- If the user asks to remove skiing AND wants something to do instead, call BOTH set_day_type(rest) AND add_day_activity (or update_day_note) with a real suggestion in the same response.
- If the user asks to change a resort AND update a meal, call both tools.
- Never respond to a multi-part request with only one tool. Handle every part of the request with a tool call.
- When converting a day to rest and no alternative is specified, proactively add 2-3 activity suggestions using add_day_activity calls.

When the user asks to remove a ski day — use set_day_type(rest) AND add_day_activity with a compelling non-ski alternative (spa, snowshoe tour, village exploration, sleigh ride, etc.) based on the resort area.
When the user asks to add a ski day — use set_day_type(ski) with a resortId from the eligible resorts list.
Always call tools — never just describe what could be done in text.
Keep the text response to 1 sentence max — the action cards communicate the changes.`;
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
          max_tokens: 2048,
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
