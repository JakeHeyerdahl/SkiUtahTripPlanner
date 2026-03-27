// TODO: Lodging card
// Props: lodging: Lodging
// - Image, name, type badge, star rating, review count
// - Resort proximity pill (e.g. "Ski-in/Ski-out at Deer Valley")
// - Price per night, amenity icons
// - "View Details" CTA
import { Lodging } from "@/types";

export default function LodgingCard({ lodging }: { lodging: Lodging }) {
  return <div>{lodging.name}</div>;
}
