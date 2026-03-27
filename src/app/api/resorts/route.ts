import { NextRequest, NextResponse } from "next/server";
import { resorts } from "@/data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const region = searchParams.get("region");
  const skillLevel = searchParams.get("skillLevel");

  let filtered = resorts;

  if (region) {
    filtered = filtered.filter((r) => r.region === region);
  }

  if (skillLevel) {
    filtered = filtered.filter((r) =>
      r.bestFor.includes(skillLevel as "beginner" | "intermediate" | "advanced" | "expert")
    );
  }

  return NextResponse.json(filtered);
}
