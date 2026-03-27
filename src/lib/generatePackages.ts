import { TripData } from "@/context/TripContext";
import { resorts } from "@/data/resorts";
import { lodgingOptions } from "@/data/lodging";
import { generateFlights, getSnowLikelihood, FlightOption } from "@/data/flights";
import { Resort, Lodging } from "@/types";

export interface TripPackage {
  id: string;
  label: string;
  tagline: string;
  marketingPoint: string;
  resort: Resort;
  eligibleResorts: Resort[];
  snowLikelihood: { score: number; typicalInches: number };
  hotelOptions: Lodging[];
  flightOptions: FlightOption[];
  liftTicketInfo: { type: "pass" | "day-pass"; passName?: string; pricePerPerson?: number };
  selectedHotelId: string;
  selectedFlightId: string;
  nights: number;
}

// Which resorts are accessible per pass (2025-26 season, verified)
// Ikon Full:  Alta/Snowbird (7 combined), Brighton (7 days), Deer Valley (7 days), Solitude (unlimited), Snowbasin (unlimited)
// Ikon Base:  Brighton (5 days), Snowbird (5 days), Solitude (unlimited w/ blackouts) — NO Alta, NO Deer Valley, NO Snowbasin
// Epic/Local: Park City Mountain only
// Mtn Collective: Alta (2 days), Snowbird (2 days), Snowbasin (2 days), Powder Mountain (2 days)
// Indy:       Beaver Mountain (2 days), Eagle Point (2 days) — Brighton & Sundance are NOT on Indy 25-26
const PASS_RESORTS: Record<string, string[]> = {
  "ikon":                ["alta", "brighton", "snowbird", "solitude", "deer-valley", "snowbasin"],
  "ikon-base":           ["brighton", "snowbird", "solitude"],
  "epic":                ["park-city", "woodward-park-city"],
  "epic-local":          ["park-city", "woodward-park-city"],
  "mountain-collective": ["alta", "snowbird", "snowbasin", "powder-mountain"],
  "indy":                ["beaver-mountain"],
};

// Region groupings for smart lodging
const COTTONWOOD_RESORTS = new Set(["alta", "brighton", "snowbird", "solitude"]);
const PARK_CITY_RESORTS = new Set(["deer-valley", "park-city", "woodward-park-city"]);
const OGDEN_RESORTS = new Set(["snowbasin", "powder-mountain", "nordic-valley"]);

function getLodgingRegionForResort(resortId: string): string {
  if (COTTONWOOD_RESORTS.has(resortId)) return "Salt Lake";
  if (PARK_CITY_RESORTS.has(resortId)) return "Park City";
  if (OGDEN_RESORTS.has(resortId)) return "Ogden Valley";
  return "Salt Lake";
}

function getEligibleResorts(passType: string): Resort[] {
  const slugs = PASS_RESORTS[passType] ?? [];
  return resorts.filter((r) => slugs.includes(r.id));
}

function getLodgingForResort(resortId: string, budget: number, nights: number): Lodging[] {
  const region = getLodgingRegionForResort(resortId);
  const nightlyBudget = budget / nights / 1.8; // rough share of budget for hotel
  return lodgingOptions
    .filter((l) => l.region === region && l.pricePerNight <= nightlyBudget * 1.3)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);
}

function isOnSnow(member: { activity?: string; needsRental: boolean }) {
  return member.activity === "skiing" || member.activity === "snowboarding";
}

export function generateTripPackages(trip: TripData): TripPackage[] {
  if (!trip.passType) return [];

  const eligible = getEligibleResorts(trip.passType);
  if (eligible.length === 0) return [];

  const nights = Math.max(trip.tripDays > 0 ? trip.tripDays - 1 : trip.dates.length > 0 ? trip.dates.length - 1 : 4, 2);
  const allFlights = generateFlights(trip.departureCity, trip.groupMembers.length);

  // Sort by snow likelihood to get "best" resort first
  const scoredResorts = eligible
    .map((r) => ({
      resort: r,
      snow: getSnowLikelihood(r.id, trip.dates),
    }))
    .sort((a, b) => b.snow.score - a.snow.score);

  const packages: TripPackage[] = [];

  // Package 1: Best Overall (top snow score, best lodging)
  const p1Resort = scoredResorts[0]?.resort ?? eligible[0];
  const p1Hotels = getLodgingForResort(p1Resort.id, trip.budgetMax, nights);
  if (p1Hotels.length < 1) p1Hotels.push(lodgingOptions[0]);

  packages.push({
    id: "pkg-best",
    label: "Best Overall",
    tagline: "Top-rated resort. Prime conditions.",
    marketingPoint: `Highest snow probability + ${p1Resort.annualSnowfall}" average annual snowfall`,
    resort: p1Resort,
    eligibleResorts: eligible,
    snowLikelihood: getSnowLikelihood(p1Resort.id, trip.dates),
    hotelOptions: p1Hotels.length >= 3 ? p1Hotels : [...p1Hotels, ...lodgingOptions.slice(0, 3 - p1Hotels.length)],
    flightOptions: allFlights.slice(0, 3),
    liftTicketInfo: { type: "pass", passName: trip.passType ?? undefined },
    selectedHotelId: p1Hotels[0]?.id ?? "",
    selectedFlightId: allFlights[0]?.id ?? "",
    nights,
  });

  // Package 2: Best Value (lower-cost resort/lodging, good snow)
  const p2Resort = scoredResorts[Math.min(1, scoredResorts.length - 1)]?.resort ?? eligible[0];
  const p2Hotels = getLodgingForResort(p2Resort.id, trip.budgetMin * 1.2, nights);
  if (p2Hotels.length < 1) p2Hotels.push(lodgingOptions[1] ?? lodgingOptions[0]);

  packages.push({
    id: "pkg-value",
    label: "Best Value",
    tagline: "Maximum fun, smart on budget.",
    marketingPoint: `Save up to ${Math.round(((trip.budgetMax - trip.budgetMin) / trip.budgetMax) * 100)}% vs. Best Overall while keeping epic terrain`,
    resort: p2Resort,
    eligibleResorts: eligible,
    snowLikelihood: getSnowLikelihood(p2Resort.id, trip.dates),
    hotelOptions: p2Hotels.length >= 3 ? p2Hotels : [...p2Hotels, ...lodgingOptions.slice(0, 3 - p2Hotels.length)],
    flightOptions: allFlights.slice(3, 6),
    liftTicketInfo: { type: "pass", passName: trip.passType ?? undefined },
    selectedHotelId: p2Hotels[0]?.id ?? "",
    selectedFlightId: allFlights[3]?.id ?? "",
    nights,
  });

  // Package 3: Most Adventurous / Expert / Hidden Gem
  const adventureResort = scoredResorts.find(
    (r) => r.resort.terrain.black >= 40 && r.resort.id !== p1Resort.id
  )?.resort ?? scoredResorts[scoredResorts.length - 1]?.resort ?? eligible[0];
  const p3Hotels = getLodgingForResort(adventureResort.id, trip.budgetMax, nights);
  if (p3Hotels.length < 1) p3Hotels.push(lodgingOptions[2] ?? lodgingOptions[0]);

  packages.push({
    id: "pkg-adventure",
    label: "Most Adventurous",
    tagline: "Steep. Deep. Unforgettable.",
    marketingPoint: `${adventureResort.terrain.black}% black diamond terrain — ${adventureResort.verticalDrop.toLocaleString()} ft of vertical`,
    resort: adventureResort,
    eligibleResorts: eligible,
    snowLikelihood: getSnowLikelihood(adventureResort.id, trip.dates),
    hotelOptions: p3Hotels.length >= 3 ? p3Hotels : [...p3Hotels, ...lodgingOptions.slice(0, 3 - p3Hotels.length)],
    flightOptions: allFlights.slice(6, 9),
    liftTicketInfo: { type: "pass", passName: trip.passType ?? undefined },
    selectedHotelId: p3Hotels[0]?.id ?? "",
    selectedFlightId: allFlights[6]?.id ?? "",
    nights,
  });

  return packages;
}

export function calcPackageTotal(
  pkg: TripPackage,
  groupSize: number,
  nights: number
): number {
  const selectedHotel = pkg.hotelOptions.find((h) => h.id === pkg.selectedHotelId) ?? pkg.hotelOptions[0];
  const selectedFlight = pkg.flightOptions.find((f) => f.id === pkg.selectedFlightId) ?? pkg.flightOptions[0];

  const hotelTotal = (selectedHotel?.pricePerNight ?? 300) * nights;
  const flightTotal = (selectedFlight?.pricePerPerson ?? 250) * groupSize * 2; // round trip
  const liftTotal = pkg.liftTicketInfo.type === "day-pass"
    ? (pkg.liftTicketInfo.pricePerPerson ?? 150) * groupSize * nights
    : 0;
  const rentalEstimate = 60 * nights; // rough gear rental line item

  return hotelTotal + flightTotal + liftTotal + rentalEstimate;
}
