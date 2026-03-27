// TODO: Resort card component
// Props: resort: Resort
// - Full-bleed image with gradient overlay
// - Resort name (bold, white)
// - Region badge
// - Key stats row: vertical drop, acres, annual snowfall
// - Terrain bar (green/blue/black percentages)
// - "View Resort" CTA
import { Resort } from "@/types";

export default function ResortCard({ resort }: { resort: Resort }) {
  return <div>{resort.name}</div>;
}
