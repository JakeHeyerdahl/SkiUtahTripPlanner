// TODO: Visual terrain breakdown bar
// Props: terrain: { green: number, blue: number, black: number }
// - Horizontal segmented bar with green/blue/black sections
// - Percentage labels below each section
// - Circle icons (●) for difficulty indicators
import { Resort } from "@/types";

export default function TerrainBar({ terrain }: { terrain: Resort["terrain"] }) {
  return <div>{terrain.green}% / {terrain.blue}% / {terrain.black}%</div>;
}
