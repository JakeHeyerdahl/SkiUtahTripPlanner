"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  MapPin, MountainSnow, ChevronDown, Plane, Bus, Car,
  Package, Sun, Coffee, Wine, CalendarDays,
  MessageCircle, CheckCircle,
} from "lucide-react";
import ConciergePanel, { ConciergeAction } from "@/components/concierge/ConciergePanel";
import { useTripContext } from "@/context/TripContext";
import { generateTripPackages, TripPackage } from "@/lib/generatePackages";
import { getResortImage } from "@/data/images";
import { Resort } from "@/types";
import { cn } from "@/lib/utils";

// ─── Per-resort dining & activities ──────────────────────────────────────────
const RESORT_DATA: Record<string, {
  meals: Array<{ breakfast: { name: string; type: string }; lunch: { name: string; type: string }; dinner: { name: string; type: string } }>;
  activities: string[];
}> = {
  "alta": {
    meals: [
      { breakfast: { name: "Alta Lodge Dining Room", type: "Classic Lodge" }, lunch: { name: "Alf's Restaurant", type: "On-Mountain" }, dinner: { name: "Shallow Shaft Restaurant", type: "Fine Dining" } },
      { breakfast: { name: "Rustler Lodge Restaurant", type: "Mountain Lodge" }, lunch: { name: "Watson Shelter Grill", type: "On-Mountain" }, dinner: { name: "Red Rock Brewing", type: "Brewery" } },
    ],
    activities: ["Powder runs in Greeley Bowl & Ballroom", "Supreme and High Traverse to Collins lift", "Evening soak at Alta Lodge hot tubs"],
  },
  "snowbird": {
    meals: [
      { breakfast: { name: "The Aerie Restaurant", type: "Resort Breakfast" }, lunch: { name: "Summit Restaurant (11,000 ft)", type: "On-Mountain" }, dinner: { name: "Log Haven", type: "Fine Dining" } },
      { breakfast: { name: "Rendezvous Café", type: "Café" }, lunch: { name: "Forklift", type: "On-Mountain" }, dinner: { name: "The Boneyard Pub", type: "Après-Ski" } },
    ],
    activities: ["Ride the Aerial Tram to Hidden Peak", "Explore Mineral Basin expert terrain", "Cliff Lodge rooftop pool & spa"],
  },
  "brighton": {
    meals: [
      { breakfast: { name: "Brighton Slopeside Café", type: "Café" }, lunch: { name: "Alpine Rose Restaurant", type: "On-Mountain" }, dinner: { name: "Porcupine Pub & Grille", type: "Brewery/Pub" } },
      { breakfast: { name: "Java Stop", type: "Quick Café" }, lunch: { name: "Millicent Lift House", type: "On-Mountain" }, dinner: { name: "Bluebird Café", type: "Après-Ski" } },
    ],
    activities: ["Family terrain on Majestic & Crest lifts", "Night skiing Thu–Sat until 9 PM", "Snake Creek backcountry gate access"],
  },
  "solitude": {
    meals: [
      { breakfast: { name: "Sterling Lift Café", type: "On-Mountain" }, lunch: { name: "Last Chance Mining Camp", type: "On-Mountain" }, dinner: { name: "Creekside at Solitude", type: "Village Dining" } },
      { breakfast: { name: "Moonbeam Café", type: "Lodge Café" }, lunch: { name: "Eagle Springs Backside Bar", type: "Backside Bar" }, dinner: { name: "Inn at Solitude Dining Room", type: "Fine Dining" } },
    ],
    activities: ["Uncrowded glades in Honeycomb Canyon", "Nordic skiing at Solitude Nordic Center", "Laid-back village with virtually no lift lines"],
  },
  "deer-valley": {
    meals: [
      { breakfast: { name: "Goldener Hirsch Inn", type: "Austrian Breakfast" }, lunch: { name: "Deer Valley Seafood Buffet", type: "Legendary Buffet" }, dinner: { name: "Talisker on Main", type: "Fine Dining" } },
      { breakfast: { name: "Empire Canyon Lodge", type: "Lodge Breakfast" }, lunch: { name: "Silver Lake Lodge Buffet", type: "Mountain Buffet" }, dinner: { name: "The Mariposa", type: "Fine Dining" } },
    ],
    activities: ["Immaculate groomed runs on Bald Eagle", "Ski-in/ski-out at Stein Eriksen Lodge", "Après-ski on Snow Park Lodge deck"],
  },
  "park-city": {
    meals: [
      { breakfast: { name: "Good Coffee", type: "Local Café" }, lunch: { name: "Legends Bar & Grill", type: "On-Mountain" }, dinner: { name: "Flanagan & Son", type: "Après-Ski Pub" } },
      { breakfast: { name: "Morning Ray Café", type: "Café" }, lunch: { name: "Umbrella Bar & Grill", type: "On-Mountain" }, dinner: { name: "Riverhorse on Main", type: "Fine Dining" } },
    ],
    activities: ["Explore Canyons & PCMR via Flatiron gondola", "Historic Main Street shopping & dining", "Utah Olympic Park bobsled experience (nearby)"],
  },
  "woodward-park-city": {
    meals: [
      { breakfast: { name: "Good Coffee", type: "Café" }, lunch: { name: "Woodward Park City Grille", type: "On-Site" }, dinner: { name: "Flanagan & Son", type: "Park City Pub" } },
    ],
    activities: ["Terrain park features for all levels", "Indoor foam pit & trampolines at Woodward facility", "Night skiing available"],
  },
  "snowbasin": {
    meals: [
      { breakfast: { name: "Earl's Lodge Restaurant", type: "Base Lodge" }, lunch: { name: "Needles Lodge", type: "Mountain Fine Dining" }, dinner: { name: "Needles Lodge Dinner", type: "Mountain Dining" } },
      { breakfast: { name: "Tram House Café", type: "Quick Café" }, lunch: { name: "John Paul Express Café", type: "On-Mountain" }, dinner: { name: "Bistro 82 (Ogden)", type: "Ogden Fine Dining" } },
    ],
    activities: ["2002 Olympic downhill venue — iconic runs", "Gondola to Needles Lodge with panoramic views", "3,000+ uncrowded skiable acres"],
  },
  "powder-mountain": {
    meals: [
      { breakfast: { name: "Powder Country Store", type: "Mountain Store" }, lunch: { name: "Hidden Lake Lodge", type: "On-Mountain" }, dinner: { name: "Wolf Creek Bar & Grill", type: "Après-Ski" } },
    ],
    activities: ["Largest ski area by acreage in the US", "Snowcat backcountry terrain access", "Limited daily ticket sales — remarkably uncrowded"],
  },
  "beaver-mountain": {
    meals: [
      { breakfast: { name: "T-Bar Inn", type: "Classic Lodge" }, lunch: { name: "T-Bar Inn", type: "On-Mountain" }, dinner: { name: "Copper Mill Restaurant", type: "Local Dining" } },
    ],
    activities: ["Family-owned mountain since 1939", "Quiet, uncrowded runs for all levels", "Cache Valley views from the summit"],
  },
};

function getResortData(id: string) {
  return RESORT_DATA[id] ?? {
    meals: [{ breakfast: { name: "On-Mountain Café", type: "Café" }, lunch: { name: "Mountain Grill", type: "On-Mountain" }, dinner: { name: "Resort Village Dining", type: "Village" } }],
    activities: ["Explore the mountain terrain", "Ride the main lifts", "Après-ski at the lodge"],
  };
}

// ─── Transport helpers ────────────────────────────────────────────────────────
const COTTONWOOD_IDS = new Set(["alta", "snowbird", "brighton", "solitude"]);
const PARK_CITY_IDS  = new Set(["deer-valley", "park-city", "woodward-park-city"]);

function getTransport(primaryResortId: string) {
  if (COTTONWOOD_IDS.has(primaryResortId)) {
    return {
      airportToHotel: [
        { Icon: Bus, label: "TRAX + UTA Ski Bus", detail: "Red Line to Central Pointe, then Route 953 (Little Cottonwood) or 994 (Big Cottonwood) — from ~$2.50/person" },
        { Icon: Car, label: "Rideshare / Uber", detail: "~45 min from SLC airport · typically $45–65 each way" },
      ],
      hotelToResort: { Icon: Bus, label: "UTA Ski Bus (free with UTA day pass)", detail: "Routes 953/994 run daily from SLC corridor — no car needed" },
      gearRental: "Breeze Ski Rentals (multiple Cottonwood locations), Ski Utah Ski Pool at Snowbird base, or on-mountain rental desks — reserve online to save up to 30%",
    };
  }
  if (PARK_CITY_IDS.has(primaryResortId)) {
    return {
      airportToHotel: [
        { Icon: Car, label: "Canyon Transportation shuttle", detail: "Shared shuttle ~$45–55/person from baggage claim · runs hourly" },
        { Icon: Car, label: "Rent a car", detail: "~45 min via I-80 E + UT-224 · recommended if day-tripping Cottonwood resorts" },
        { Icon: Car, label: "Rideshare / Uber", detail: "~45 min · typically $80–120 each way" },
      ],
      hotelToResort: { Icon: Bus, label: "Park City Transit (free)", detail: "Free city buses connect all Park City hotels to PCMR & Deer Valley — runs daily during ski season" },
      gearRental: "Cole Sport, Christy Sports, or Canyon Sports (all in Park City town) open early · Deer Valley and PCMR have on-mountain rentals — reserve online for best rates",
    };
  }
  // Ogden Valley
  return {
    airportToHotel: [
      { Icon: Car, label: "Rent a car (recommended)", detail: "~50 min via I-15 N to Ogden — public transit is limited in this region" },
      { Icon: Car, label: "Rideshare / Uber", detail: "~50 min · typically $70–100 each way from SLC airport" },
    ],
    hotelToResort: { Icon: Car, label: "Drive to resort", detail: "Snowbasin: 25 min from Ogden · Powder Mountain: 30 min — scenic canyon roads, all-weather tires recommended" },
    gearRental: "Powder Ridge Ski Shop or REI Ogden · on-mountain rental desks at Snowbasin — Powder Mountain has limited on-mountain rentals, pre-booking required",
  };
}

// ─── Itinerary generation ─────────────────────────────────────────────────────
interface DayPlan {
  day: number;
  dateStr: string;
  resort: Resort | null;
  isSkiDay: boolean;
  isArrival: boolean;
  isDeparture: boolean;
  breakfast: { name: string; type: string };
  lunch: { name: string; type: string };
  dinner: { name: string; type: string };
  activities: string[];
  transportNote?: string;
}

function buildItinerary(pkg: TripPackage, tripDays: number, dates: Date[], rentalCount: number, departureCity: string, returnFlightTime?: string): DayPlan[] {
  const totalDays = Math.max(tripDays > 0 ? tripDays : dates.length > 0 ? dates.length : 5, 3);
  const transport = getTransport(pkg.resort.id);
  const eligible = pkg.eligibleResorts;

  // Build resort rotation: primary first, then others, cycling back to primary
  const others = eligible.filter(r => r.id !== pkg.resort.id);
  const rotation: Resort[] = [];
  let otherIdx = 0;
  for (let i = 0; i < totalDays - 2; i++) {
    if (i % 2 === 0 || others.length === 0) {
      rotation.push(pkg.resort);
    } else {
      rotation.push(others[otherIdx % others.length]);
      otherIdx++;
    }
  }

  // Insert a rest day for longer trips
  const restDayIdx = totalDays >= 6 ? Math.floor((totalDays - 2) / 2) : -1;

  const days: DayPlan[] = [];

  for (let d = 1; d <= totalDays; d++) {
    const date = dates[d - 1] ?? (() => { const dt = new Date(2026, 0, 14 + d); return dt; })();
    const dateStr = date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

    if (d === 1) {
      // Arrival day
      const gearLine = rentalCount > 0
        ? `Gear rental pickup — ${transport.gearRental.split('—')[0].trim()}`
        : "Settle in and explore the area";
      days.push({
        day: d,
        dateStr,
        resort: null,
        isSkiDay: false,
        isArrival: true,
        isDeparture: false,
        breakfast: { name: "On the flight / airport café", type: "Travel" },
        lunch: { name: "Grab & go near hotel", type: "Quick" },
        dinner: { name: "Welcome dinner at resort village", type: "Local" },
        activities: [
          `Arrive SLC · ${transport.airportToHotel[0].label} to hotel (${transport.airportToHotel[0].detail})`,
          gearLine,
          "Check in, explore the village, rest up for skiing",
        ],
        transportNote: `Airport → Hotel: ${transport.airportToHotel.map(o => o.label).join(" or ")}`,
      });
    } else if (d === totalDays) {
      // Departure day
      days.push({
        day: d,
        dateStr,
        resort: null,
        isSkiDay: false,
        isArrival: false,
        isDeparture: true,
        breakfast: { name: "Hotel breakfast / quick café", type: "Quick" },
        lunch: { name: "SLC Airport or en route", type: "Airport" },
        dinner: { name: "Home — safe travels!", type: "" },
        activities: [
          "Check out of hotel",
          `${transport.hotelToResort.Icon === Bus ? "Bus" : "Drive"} back to SLC airport · ${returnFlightTime ? `Return flight departs ${returnFlightTime}` : "Allow 2+ hours for security"}`,
          "Depart SLC",
        ],
        transportNote: `Hotel → Airport: reverse your arrival route`,
      });
    } else {
      // Ski or rest day
      const skiIdx = d - 2;
      const isRest = skiIdx === restDayIdx;

      if (isRest) {
        days.push({
          day: d,
          dateStr,
          resort: null,
          isSkiDay: false,
          isArrival: false,
          isDeparture: false,
          breakfast: { name: "Slow morning — hotel dining", type: "Leisurely" },
          lunch: { name: "Town restaurant", type: "Local" },
          dinner: { name: "Fine dining night out", type: "Special" },
          activities: [
            "Rest day — legs, you deserve it",
            "Utah Olympic Park or historic Main Street (Park City area)",
            "Spa, hot tub, or shopping",
          ],
        });
      } else {
        const resort = rotation[skiIdx < restDayIdx || restDayIdx === -1 ? skiIdx : skiIdx - 1] ?? pkg.resort;
        const data = getResortData(resort.id);
        const mealSet = data.meals[skiIdx % data.meals.length];
        const isFirstSkiDay = !days.some(d => d.isSkiDay);

        days.push({
          day: d,
          dateStr,
          resort,
          isSkiDay: true,
          isArrival: false,
          isDeparture: false,
          breakfast: mealSet.breakfast,
          lunch: mealSet.lunch,
          dinner: mealSet.dinner,
          activities: [
            ...(isFirstSkiDay ? [`${transport.hotelToResort.label} to ${resort.name} · ${transport.hotelToResort.detail}`] : [`Head to ${resort.name}`]),
            ...data.activities,
          ],
        });
      }
    }
  }

  return days;
}

// ─── Resort color map ─────────────────────────────────────────────────────────
const RESORT_COLORS: Record<string, string> = {
  "alta":            "#6B2FA0",
  "snowbird":        "#C4262E",
  "brighton":        "#1B6BB0",
  "solitude":        "#0D4A8A",
  "deer-valley":     "#1A5C3A",
  "park-city":       "#0057A8",
  "woodward-park-city": "#0057A8",
  "snowbasin":       "#8B4513",
  "powder-mountain": "#4A5C3A",
  "beaver-mountain": "#5C3A1A",
};

function resortColor(id: string) {
  return RESORT_COLORS[id] ?? "#0D2240";
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ItineraryPage() {
  const router = useRouter();
  const { tripData } = useTripContext();
  const [expandedDay, setExpandedDay] = useState<number>(1);
  const [conciergeOpen, setConciergeOpen] = useState(false);
  const [appliedActions, setAppliedActions] = useState<Set<string>>(new Set());
  // Per-day concierge notes and resort overrides
  const [dayNotes, setDayNotes] = useState<Record<number, string>>({});
  const [dayResortOverrides, setDayResortOverrides] = useState<Record<number, { resortId: string; resortName: string }>>({});

  // Generate packages from wizard data (or fallback demo)
  const packages = generateTripPackages(tripData.passType ? tripData : {
    ...tripData,
    passType: "ikon",
    dates: [new Date(2026, 0, 15), new Date(2026, 0, 16), new Date(2026, 0, 17), new Date(2026, 0, 18), new Date(2026, 0, 19)],
    tripDays: 5,
    departureCity: "Los Angeles",
    budgetMin: 3000,
    budgetMax: 8000,
    groupMembers: [{ id: "1", skillLevel: "intermediate", activity: "skiing", needsRental: false }],
  });

  // Find selected package, or use first
  const selectedPkg = packages.find(p => p.id === tripData.selectedPackage?.packageId) ?? packages[0];

  if (!selectedPkg) {
    return (
      <div className="min-h-screen bg-[#F4F6F8] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#0D2240] font-bold text-xl mb-4">No package selected yet.</p>
          <button onClick={() => router.push("/plan")} className="bg-[#0D2240] text-white px-6 py-3 rounded-2xl font-bold">
            Back to Planner
          </button>
        </div>
      </div>
    );
  }

  // Find return flight time
  const selectedFlight = selectedPkg.flightOptions.find(f => f.id === (tripData.selectedPackage?.flightId ?? selectedPkg.selectedFlightId));
  const returnFlightTime = selectedFlight?.returnDepartureTime;

  const rentalCount = tripData.groupMembers.filter(m => m.needsRental && m.activity !== "chilling").length;
  const itinerary = buildItinerary(selectedPkg, tripData.tripDays, tripData.dates, rentalCount, tripData.departureCity, returnFlightTime);

  const skiDays = itinerary.filter(d => d.isSkiDay).length;
  const uniqueResorts = [...new Set(itinerary.filter(d => d.resort).map(d => d.resort!))];

  // Build concierge context
  const tripContext = [
    `Resort: ${selectedPkg.resort.name}`,
    `Pass: ${tripData.passType ?? selectedPkg.liftTicketInfo.passName ?? "unknown"}`,
    `Group: ${tripData.groupMembers.length} people`,
    `Skill levels: ${[...new Set(tripData.groupMembers.map(m => m.skillLevel))].join(", ")}`,
    `Departure city: ${tripData.departureCity || "not specified"}`,
    `Eligible resorts on pass: ${selectedPkg.eligibleResorts.map(r => `${r.name} (id: ${r.id})`).join(", ")}`,
  ].join("\n");

  const itineraryContext = itinerary.map((day) => {
    const note = dayNotes[day.day - 1];
    const override = dayResortOverrides[day.day - 1];
    return [
      `Day ${day.day} (${day.dateStr}): ${day.isArrival ? "Arrival" : day.isDeparture ? "Departure" : day.isSkiDay ? `Ski day at ${override?.resortName ?? day.resort?.name ?? "TBD"}` : "Rest day"}`,
      note ? `  Note: ${note}` : "",
    ].filter(Boolean).join("\n");
  }).join("\n");

  function handleConciergeAction(action: ConciergeAction) {
    setAppliedActions((prev) => new Set([...prev, action.id]));

    if (action.tool === "update_day_note") {
      const { dayIndex, note } = action.input as { dayIndex: number; note: string };
      setDayNotes((prev) => ({ ...prev, [dayIndex]: note }));
      setExpandedDay(dayIndex + 1); // expand the updated day
    } else if (action.tool === "swap_day_resort") {
      const { dayIndex, resortId, resortName } = action.input as { dayIndex: number; resortId: string; resortName: string };
      setDayResortOverrides((prev) => ({ ...prev, [dayIndex]: { resortId, resortName } }));
      setExpandedDay(dayIndex + 1);
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F6F8]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20 px-6 py-5">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-black text-[#0D2240] leading-tight">Your Utah Ski Itinerary</h1>
          <p className="text-[#8A9BB0] text-sm truncate">
            {itinerary.length} days · {skiDays} ski days · {uniqueResorts.map(r => r.name.replace(" Ski Area","").replace(" Mountain","").replace(" Resort","")).join(", ")}
          </p>
        </div>
      </div>

      {/* Resort legend */}
      <div className="px-6 py-4 max-w-3xl mx-auto">
        <div className="flex flex-wrap gap-2">
          {uniqueResorts.map(r => (
            <span
              key={r.id}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-xs font-semibold"
              style={{ backgroundColor: resortColor(r.id) }}
            >
              <MountainSnow size={11} strokeWidth={2} />
              {r.name.replace(" Ski Area","").replace(" Mountain","").replace(" Resort","")}
            </span>
          ))}
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4F6F8] border border-gray-200 text-[#8A9BB0] text-xs font-semibold">
            <CalendarDays size={11} strokeWidth={2} />
            Travel / Rest
          </span>
        </div>
      </div>

      {/* Days */}
      <div className="px-6 pb-24 max-w-3xl mx-auto space-y-3">
        {itinerary.map((day, i) => {
          const isExpanded = expandedDay === day.day;
          const dayNote = dayNotes[day.day - 1];
          const resortOverride = dayResortOverrides[day.day - 1];
          const effectiveResort = resortOverride
            ? (selectedPkg.eligibleResorts.find(r => r.id === resortOverride.resortId) ?? day.resort)
            : day.resort;
          const color = effectiveResort ? resortColor(effectiveResort.id) : "#8A9BB0";

          return (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
            >
              {/* Day header */}
              <button
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50/50 transition-colors"
                onClick={() => setExpandedDay(isExpanded ? -1 : day.day)}
              >
                <div
                  className="w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0 text-white"
                  style={{ backgroundColor: color }}
                >
                  <span className="text-[9px] font-semibold opacity-75 uppercase">Day</span>
                  <span className="text-lg font-black leading-none">{day.day}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-[#0D2240] text-sm">{day.dateStr}</p>
                    {day.isSkiDay && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: color }}>
                        SKI DAY
                      </span>
                    )}
                    {day.isArrival && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#1B6BB0] text-white">ARRIVE</span>
                    )}
                    {day.isDeparture && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#8A9BB0] text-white">DEPART</span>
                    )}
                  </div>
                  <p className="text-[#8A9BB0] text-xs truncate">
                    {effectiveResort
                      ? effectiveResort.name.replace(" Ski Area","").replace(" Mountain","").replace(" Resort","")
                      : day.isArrival ? "Arrival day" : day.isDeparture ? "Departure day" : "Rest day"
                    } · {day.breakfast.name} → {day.dinner.name}
                  </p>
                </div>

                {/* Resort thumbnail if ski day */}
                {effectiveResort && (
                  <div className="relative w-14 h-10 rounded-xl overflow-hidden flex-shrink-0 hidden sm:block">
                    <Image src={getResortImage(effectiveResort.id)} alt={effectiveResort.name} fill className="object-cover" sizes="56px" />
                  </div>
                )}

                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-[#8A9BB0] flex-shrink-0"
                >
                  <ChevronDown size={16} strokeWidth={2} />
                </motion.div>
              </button>

              {/* Expanded content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-5 space-y-4 border-t border-gray-50">
                      {/* Resort hero image for ski days */}
                      {effectiveResort && (
                        <div className="relative h-32 rounded-xl overflow-hidden mt-3">
                          <Image
                            src={getResortImage(effectiveResort.id)}
                            alt={effectiveResort.name}
                            fill
                            className="object-cover"
                            sizes="672px"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                            <div>
                              <p className="text-white font-black text-lg leading-tight">{effectiveResort.name}</p>
                              <p className="text-white/70 text-xs">{effectiveResort.location} · {effectiveResort.annualSnowfall}&quot; annual snow</p>
                            </div>
                            <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-lg px-2.5 py-1.5">
                              <MapPin size={10} className="text-white/80" />
                              <span className="text-white text-xs font-semibold">{effectiveResort.region}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Concierge tip */}
                      {dayNote && (
                        <div className="mt-3 flex items-start gap-2.5 bg-[#F4F6F8] border border-[#1B6BB0]/20 rounded-xl px-4 py-3">
                          <MessageCircle size={13} className="text-[#1B6BB0] flex-shrink-0 mt-0.5" strokeWidth={2} />
                          <div>
                            <p className="text-[10px] font-bold text-[#1B6BB0] uppercase tracking-wider mb-0.5">Concierge tip</p>
                            <p className="text-sm text-[#3D5066]">{dayNote}</p>
                          </div>
                        </div>
                      )}

                      {/* Transport info for arrival/departure */}
                      {(day.isArrival || day.isDeparture) && day.transportNote && (
                        <div className="mt-3 bg-[#EBF5FF] rounded-xl px-4 py-3 flex items-start gap-2.5">
                          <Plane size={14} className="text-[#1B6BB0] flex-shrink-0 mt-0.5" strokeWidth={2} />
                          <p className="text-sm text-[#1B6BB0] font-medium">{day.transportNote}</p>
                        </div>
                      )}

                      {/* Activities */}
                      {day.activities.length > 0 && (
                        <div className="pt-1">
                          <p className="text-[10px] font-bold text-[#8A9BB0] uppercase tracking-wider mb-2">Activities & Logistics</p>
                          <ul className="space-y-1.5">
                            {day.activities.map((act, j) => (
                              <li key={j} className="flex items-start gap-2 text-sm text-[#3D5066]">
                                <CheckCircle size={13} className="text-[#1B6BB0] flex-shrink-0 mt-0.5" strokeWidth={2} />
                                {act}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Gear rental callout on arrival */}
                      {day.isArrival && rentalCount > 0 && (
                        <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                          <Package size={14} className="text-amber-600 flex-shrink-0 mt-0.5" strokeWidth={2} />
                          <div>
                            <p className="text-sm font-semibold text-amber-800">Gear rental reminder</p>
                            <p className="text-xs text-amber-700 leading-snug mt-0.5">{getTransport(selectedPkg.resort.id).gearRental}</p>
                          </div>
                        </div>
                      )}

                      {/* Hotel → Resort transport note on first ski day */}
                      {day.isSkiDay && itinerary.filter(d => d.isSkiDay).indexOf(day) === 0 && (
                        <div className="flex items-start gap-2.5 bg-[#F0F4F8] rounded-xl px-4 py-3">
                          {(() => {
                            const t = getTransport(selectedPkg.resort.id);
                            const Icon = t.hotelToResort.Icon;
                            return <Icon size={14} className="text-[#1B6BB0] flex-shrink-0 mt-0.5" strokeWidth={2} />;
                          })()}
                          <div>
                            <p className="text-sm font-semibold text-[#0D2240]">{getTransport(selectedPkg.resort.id).hotelToResort.label}</p>
                            <p className="text-xs text-[#8A9BB0] leading-snug mt-0.5">{getTransport(selectedPkg.resort.id).hotelToResort.detail}</p>
                          </div>
                        </div>
                      )}

                      {/* Meals */}
                      <div>
                        <p className="text-[10px] font-bold text-[#8A9BB0] uppercase tracking-wider mb-2">Meals</p>
                        <div className="space-y-2">
                          {[
                            { label: "Breakfast", meal: day.breakfast, Icon: Sun },
                            { label: "Lunch",     meal: day.lunch,     Icon: Coffee },
                            { label: "Dinner",    meal: day.dinner,    Icon: Wine },
                          ].map(({ label, meal, Icon }) => (
                            <div key={label} className="flex items-center justify-between bg-[#F4F6F8] rounded-xl px-3 py-2.5">
                              <div className="flex items-center gap-2">
                                <Icon size={12} className="text-[#8A9BB0] flex-shrink-0" strokeWidth={2} />
                                <span className="text-xs font-semibold text-[#8A9BB0]">{label}</span>
                              </div>
                              <div className="text-right">
                                <p className="text-xs font-bold text-[#0D2240]">{meal.name}</p>
                                {meal.type && <p className="text-[10px] text-[#8A9BB0]">{meal.type}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom nav */}
      <div className="max-w-3xl mx-auto px-6 pb-10 pt-2">
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/plan/packages")}
            className="flex items-center gap-2 px-6 py-4 rounded-2xl font-semibold text-[#3D5066] bg-white border border-[#DDDDDD] hover:bg-gray-50 transition-colors"
          >
            <ChevronDown size={16} strokeWidth={2.5} className="rotate-90" />
            Back to packages
          </button>
          <button
            onClick={() => router.push("/book")}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-lg bg-[#0D2240] text-white hover:bg-[#1B6BB0] shadow-lg active:scale-[0.98] transition-all"
          >
            Book This Trip
            <ChevronDown size={16} strokeWidth={2.5} className="rotate-[-90deg]" />
          </button>
        </div>
      </div>

      {/* Floating concierge button */}
      <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40">
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8, type: "spring" }}
          className="flex items-center gap-2 bg-[#0D2240] text-white px-4 py-3 rounded-full shadow-xl font-semibold text-sm hover:bg-[#1B6BB0] transition-colors"
          onClick={() => setConciergeOpen(true)}
        >
          <MessageCircle size={15} strokeWidth={2} />
          Modify itinerary
        </motion.button>
      </div>

      {/* Concierge panel */}
      <ConciergePanel
        isOpen={conciergeOpen}
        onClose={() => setConciergeOpen(false)}
        context="itinerary"
        tripContext={tripContext}
        itineraryContext={itineraryContext}
        onAction={handleConciergeAction}
        appliedActionIds={appliedActions}
        suggestedPrompts={[
          "What's the best restaurant for a group dinner?",
          "Can we swap Day 2 to Snowbird instead?",
          "Add a tip for the rest day",
          "How do we get from our hotel to the slopes?",
        ]}
      />
    </div>
  );
}
