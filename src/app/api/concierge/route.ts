import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── Tools ────────────────────────────────────────────────────────────────────
const PACKAGES_TOOLS: Anthropic.Tool[] = [
  {
    name: "recommend_hotel",
    description: "Recommend switching to a specific hotel option within a package. Use this when the user wants a different lodging experience.",
    input_schema: {
      type: "object",
      properties: {
        packageId: { type: "string", description: "The package ID to update (pkg-best, pkg-value, or pkg-adventure)" },
        hotelId: { type: "string", description: "The hotel ID to switch to" },
        reason: { type: "string", description: "Brief reason why this hotel is recommended (1–2 sentences)" },
      },
      required: ["packageId", "hotelId", "reason"],
    },
  },
  {
    name: "recommend_flight",
    description: "Recommend switching to a specific flight option within a package. Use when the user wants a different flight (nonstop, cheaper, different departure time).",
    input_schema: {
      type: "object",
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
    description: "Highlight a specific package as the best match for the user's stated preferences or resort wishes.",
    input_schema: {
      type: "object",
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
      type: "object",
      properties: {
        dayIndex: { type: "number", description: "0-based index of the day to update" },
        note: { type: "string", description: "The tip or recommendation to add for that day (1–2 sentences)" },
      },
      required: ["dayIndex", "note"],
    },
  },
  {
    name: "swap_day_resort",
    description: "Suggest swapping the resort on a specific ski day to a different eligible resort.",
    input_schema: {
      type: "object",
      properties: {
        dayIndex: { type: "number", description: "0-based index of the ski day to update" },
        resortId: { type: "string", description: "Resort ID to switch to" },
        resortName: { type: "string", description: "Human-readable resort name" },
        reason: { type: "string", description: "Why this resort is a good choice for that day" },
      },
      required: ["dayIndex", "resortId", "resortName", "reason"],
    },
  },
];

// ─── System prompts ───────────────────────────────────────────────────────────
function buildPackagesSystemPrompt(tripContext: string, packagesContext: string): string {
  return `You are a friendly, expert ski trip concierge for Ski Utah. You're helping a user refine their trip packages.

TRIP DETAILS:
${tripContext}

CURRENT PACKAGES:
${packagesContext}

Your role:
- Help the user understand their packages and the resorts
- When they ask about specific resorts, hotels, or flights — use your tools to make concrete recommendations
- Be warm, concise, and specific
- Focus on what's IN their packages — don't suggest resorts not on their pass
- When recommending hotels or flights, always call the appropriate tool so the UI can offer a one-click swap
- Keep responses under 3 sentences unless explaining something complex`;
}

function buildItinerarySystemPrompt(tripContext: string, itineraryContext: string): string {
  return `You are a friendly, expert ski trip concierge for Ski Utah. You're helping a user customize their daily itinerary.

TRIP DETAILS:
${tripContext}

CURRENT ITINERARY:
${itineraryContext}

Your role:
- Help the user understand their day-by-day plans
- Suggest improvements to specific days using your tools
- Recommend dining options, activities, and resort-specific tips
- When swapping resorts on a specific day, use the swap_day_resort tool
- Keep recommendations practical and specific to Utah's resorts
- Keep responses under 3 sentences unless explaining an itinerary change`;
}

// ─── POST handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const { messages, context, tripContext, packagesContext, itineraryContext } = await req.json();

  const systemPrompt = context === "itinerary"
    ? buildItinerarySystemPrompt(tripContext ?? "", itineraryContext ?? "")
    : buildPackagesSystemPrompt(tripContext ?? "", packagesContext ?? "");

  const tools = context === "itinerary" ? ITINERARY_TOOLS : PACKAGES_TOOLS;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      function send(obj: object) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));
      }

      try {
        // ── First call: get Claude's response with possible tool use
        const response = await client.messages.create({
          model: "claude-opus-4-6",
          max_tokens: 1024,
          thinking: { type: "adaptive" },
          system: systemPrompt,
          tools,
          tool_choice: { type: "auto" },
          messages: messages.map((m: { role: string; content: string }) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })),
        });

        // Stream text blocks
        for (const block of response.content) {
          if (block.type === "text") {
            // Stream word by word for a natural feel
            const words = block.text.split(/(?<=\s)/);
            for (const word of words) {
              send({ type: "text", delta: word });
              await new Promise((r) => setTimeout(r, 12));
            }
          }
        }

        // Emit tool use actions
        for (const block of response.content) {
          if (block.type === "tool_use") {
            send({
              type: "action",
              tool: block.name,
              input: block.input,
              id: block.id,
            });
          }
        }

        send({ type: "done" });
      } catch (err) {
        console.error("Concierge error:", err);
        send({ type: "error", message: "Something went wrong. Please try again." });
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
