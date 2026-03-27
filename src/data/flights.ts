export interface FlightOption {
  id: string;
  airline: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  stops: number;
  duration: string;
  pricePerPerson: number;
  logoColor: string;
}

// Base prices from common origin cities to SLC (round trip per person)
const CITY_BASE_PRICES: Record<string, number> = {
  "los angeles":    189,
  "la":             189,
  "lax":            189,
  "san francisco":  219,
  "sf":             219,
  "sfo":            219,
  "new york":       319,
  "nyc":            319,
  "jfk":            319,
  "chicago":        249,
  "ord":            249,
  "dallas":         269,
  "dfw":            269,
  "denver":         149,
  "den":            149,
  "seattle":        199,
  "sea":            199,
  "phoenix":        179,
  "phx":            179,
  "portland":       219,
  "pdx":            219,
  "houston":        279,
  "hou":            279,
  "miami":          329,
  "mia":            329,
  "atlanta":        299,
  "atl":            299,
  "boston":         329,
  "bos":            329,
  "washington":     309,
  "dc":             309,
  "minneapolis":    239,
  "msp":            239,
  "san diego":      199,
  "san jose":       229,
};

const AIRLINES = [
  { name: "Delta Air Lines",   logo: "#E01933", code: "DL" },
  { name: "United Airlines",   logo: "#002244", code: "UA" },
  { name: "Southwest",         logo: "#304CB2", code: "WN" },
  { name: "American Airlines", logo: "#0078D2", code: "AA" },
  { name: "Alaska Airlines",   logo: "#01426A", code: "AS" },
  { name: "JetBlue",           logo: "#003876", code: "B6" },
];

function getBasePrice(city: string): number {
  const normalized = city.toLowerCase().trim();
  for (const [key, price] of Object.entries(CITY_BASE_PRICES)) {
    if (normalized.includes(key)) return price;
  }
  return 279; // default
}

const DEPARTURE_TIMES = ["5:45 AM", "7:20 AM", "9:15 AM", "11:00 AM", "1:30 PM", "3:45 PM", "6:00 PM"];
const ARRIVAL_TIMES  = ["8:30 AM", "10:05 AM", "11:45 AM", "1:20 PM", "4:00 PM", "6:15 PM", "9:00 PM"];
const DURATIONS      = ["1h 55m", "2h 10m", "2h 25m", "1h 45m", "3h 10m", "2h 50m", "2h 05m"];

export function generateFlights(city: string, groupSize: number): FlightOption[] {
  const base = getBasePrice(city);
  const options: FlightOption[] = [];

  // 3 flights per package = 9 total across all packages; generate 9 unique ones
  const usedAirlines = new Set<string>();
  const allAirlines = [...AIRLINES].sort(() => Math.random() - 0.5);

  for (let i = 0; i < 9; i++) {
    const airline = allAirlines[i % allAirlines.length];
    const timeIdx = i % DEPARTURE_TIMES.length;
    const multiplier = i < 3 ? 1.0 : i < 6 ? 0.88 : 1.12;
    const price = Math.round((base * multiplier) / 10) * 10;

    options.push({
      id: `flight-${i}`,
      airline: airline.name,
      flightNumber: `${airline.code}${1200 + i * 47}`,
      departureTime: DEPARTURE_TIMES[timeIdx],
      arrivalTime: ARRIVAL_TIMES[timeIdx],
      stops: i % 4 === 0 ? 1 : 0,
      duration: i % 4 === 0 ? DURATIONS[timeIdx].replace(/(\d+)h/, (_, h) => `${+h + 1}h`) : DURATIONS[timeIdx],
      pricePerPerson: price,
      logoColor: airline.logo,
    });
  }

  return options;
}

// Snow likelihood by resort + month (0-100 score, based on historical averages)
export const SNOW_LIKELIHOOD: Record<string, Record<string, { score: number; typicalInches: number }>> = {
  "alta":           { nov: { score: 55, typicalInches: 14 }, dec: { score: 82, typicalInches: 54 }, jan: { score: 90, typicalInches: 68 }, feb: { score: 88, typicalInches: 62 }, mar: { score: 85, typicalInches: 58 }, apr: { score: 70, typicalInches: 38 } },
  "snowbird":       { nov: { score: 55, typicalInches: 12 }, dec: { score: 80, typicalInches: 50 }, jan: { score: 88, typicalInches: 64 }, feb: { score: 86, typicalInches: 58 }, mar: { score: 83, typicalInches: 54 }, apr: { score: 68, typicalInches: 35 } },
  "brighton":       { nov: { score: 52, typicalInches: 12 }, dec: { score: 78, typicalInches: 48 }, jan: { score: 85, typicalInches: 60 }, feb: { score: 83, typicalInches: 56 }, mar: { score: 80, typicalInches: 52 }, apr: { score: 65, typicalInches: 32 } },
  "solitude":       { nov: { score: 52, typicalInches: 11 }, dec: { score: 78, typicalInches: 46 }, jan: { score: 85, typicalInches: 58 }, feb: { score: 83, typicalInches: 54 }, mar: { score: 80, typicalInches: 50 }, apr: { score: 64, typicalInches: 30 } },
  "deer-valley":    { nov: { score: 45, typicalInches: 9 },  dec: { score: 68, typicalInches: 36 }, jan: { score: 78, typicalInches: 48 }, feb: { score: 76, typicalInches: 44 }, mar: { score: 72, typicalInches: 40 }, apr: { score: 58, typicalInches: 24 } },
  "park-city":      { nov: { score: 45, typicalInches: 9 },  dec: { score: 68, typicalInches: 34 }, jan: { score: 77, typicalInches: 46 }, feb: { score: 75, typicalInches: 42 }, mar: { score: 72, typicalInches: 38 }, apr: { score: 56, typicalInches: 22 } },
  "powder-mountain":{ nov: { score: 50, typicalInches: 11 }, dec: { score: 74, typicalInches: 42 }, jan: { score: 82, typicalInches: 54 }, feb: { score: 80, typicalInches: 50 }, mar: { score: 77, typicalInches: 46 }, apr: { score: 62, typicalInches: 28 } },
  "snowbasin":      { nov: { score: 48, typicalInches: 10 }, dec: { score: 72, typicalInches: 38 }, jan: { score: 80, typicalInches: 50 }, feb: { score: 78, typicalInches: 46 }, mar: { score: 74, typicalInches: 42 }, apr: { score: 60, typicalInches: 26 } },
};

export function getSnowLikelihood(resortSlug: string, dates: Date[]): { score: number; typicalInches: number } {
  const resort = SNOW_LIKELIHOOD[resortSlug];
  if (!resort || dates.length === 0) return { score: 72, typicalInches: 42 };

  const monthKey = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"][dates[0].getMonth()];
  return resort[monthKey] ?? { score: 72, typicalInches: 42 };
}
