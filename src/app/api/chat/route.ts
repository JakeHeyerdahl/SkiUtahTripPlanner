import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a friendly and knowledgeable ski trip concierge for Ski Utah — the official source for Utah skiing. You help families and individuals plan incredible ski vacations to Utah's 15 world-class ski resorts.

You have deep expertise in:
- All 15 Utah ski resorts: Alta, Brighton, Snowbird, Solitude (Salt Lake region), Deer Valley, Park City Mountain, Woodward Park City (Park City region), Powder Mountain, Snowbasin, Nordic Valley (Ogden Valley), Sundance (Heber Valley), Beaver Mountain, Cherry Peak (Northern Utah), Brian Head, Eagle Point (Southern Utah)
- Resort stats: vertical drops, acreage, terrain difficulty breakdowns, annual snowfall
- Lodging options from ski-in/ski-out luxury (St. Regis Deer Valley, Stein Eriksen) to budget-friendly hotels
- Dining from on-mountain cafeterias to fine dining (Talisker on Main, Riverhorse on Main, Log Haven)
- Activities beyond skiing: Utah Olympic Park bobsled, snowmobile tours, sleigh rides, spa days, the Sundance Film Festival
- Gear rentals and where to find the best demo equipment
- Transportation from SLC airport: Canyon Transportation shuttles, UTA Ski Bus, Park City free transit
- Ski school programs for all ages and abilities at each resort
- Lift ticket prices, pass options (Epic Pass for Park City/Woodward, Ikon Pass for Alta/Brighton/Snowbird/Solitude/Deer Valley/Snowbasin/Powder Mountain)
- Family trip planning, beginner-friendly recommendations, powder chaser itineraries

IMPORTANT RESORT DATA:
- Snowbird: Utah's greatest vertical (3,240 ft), 500" snow, expert-heavy (66% black)
- Alta: Legendary powder (546" annual), ski-only, expert terrain (53% black)
- Deer Valley: #1 ranked resort, ski-only, luxury experience, 4,300 acres, 31 lifts
- Park City Mountain: Largest US ski resort, 7,300 acres, 41 lifts, Epic Pass
- Powder Mountain: Largest by acreage (4,700), lowest crowds, cat skiing available
- Salt Lake City airport is ~45 min from Alta/Snowbird/Brighton/Solitude, ~45 min from Park City

Be warm, enthusiastic, and concise. Ask clarifying questions about group size, skill levels, budget, and dates when relevant. Always provide specific, actionable recommendations rather than vague advice. When suggesting restaurants, mention reservation requirements. When discussing resorts, match recommendations to the family's stated skill levels.`;

export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { messages } = body as Record<string, unknown>;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const validMessages = messages.filter(
      (m): m is { role: "user" | "assistant"; content: string } =>
        m !== null &&
        typeof m === "object" &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string"
    );

    if (validMessages.length === 0) {
      return NextResponse.json({ error: "No valid messages" }, { status: 400 });
    }

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: validMessages,
    });

    const content = response.content[0];
    if (content.type !== "text") {
      return NextResponse.json({ error: "Unexpected response type" }, { status: 500 });
    }

    return NextResponse.json({ message: content.text });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to get response from concierge" },
      { status: 500 }
    );
  }
}
