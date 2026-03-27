"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface DayPlan {
  day: number;
  date: string;
  resort: string | null;
  isSkiDay: boolean;
  breakfast: { name: string; type: string };
  lunch: { name: string; type: string };
  dinner: { name: string; type: string };
  activities: string[];
}

// Demo itinerary — Park City / Cottonwood Canyon multi-resort week
const DEMO_ITINERARY: DayPlan[] = [
  {
    day: 1,
    date: "Mon, Jan 13",
    resort: null,
    isSkiDay: false,
    breakfast: { name: "Vessel Kitchen", type: "Farm-to-Table" },
    lunch: { name: "On the road — grab & go", type: "Quick" },
    dinner: { name: "Versante Hearth + Bar", type: "Italian-American" },
    activities: ["Arrive SLC · Check in · Gear pickup at Canyon Sports", "Explore Historic Main Street Park City", "Evening hot tub"],
  },
  {
    day: 2,
    date: "Tue, Jan 14",
    resort: "Park City Mountain",
    isSkiDay: true,
    breakfast: { name: "Good Coffee (Park City)", type: "Café" },
    lunch: { name: "Legends Bar & Grill (on-mountain)", type: "On-Mountain" },
    dinner: { name: "Flanagan & Son", type: "Après-Ski Irish Pub" },
    activities: ["First ski day — Park City Mountain (7,300 acres)", "Try the Canyons side via gondola", "Après-ski at Legacy Lodge"],
  },
  {
    day: 3,
    date: "Wed, Jan 15",
    resort: "Deer Valley",
    isSkiDay: true,
    breakfast: { name: "Goldener Hirsch Inn", type: "Fine Dining Breakfast" },
    lunch: { name: "Deer Valley Seafood Buffet", type: "Legendary Buffet" },
    dinner: { name: "Talisker on Main", type: "Fine Dining" },
    activities: ["Ski Deer Valley — groomed perfection", "Ski school session (beginners)", "Spa appointment at Montage"],
  },
  {
    day: 4,
    date: "Thu, Jan 16",
    resort: "Snowbird",
    isSkiDay: true,
    breakfast: { name: "The Aerie Restaurant", type: "Snowbird Breakfast" },
    lunch: { name: "Summit Restaurant (11,000 ft)", type: "On-Mountain" },
    dinner: { name: "Log Haven (Mill Creek Canyon)", type: "Fine Dining" },
    activities: ["Drive to Little Cottonwood Canyon", "Ride the iconic Snowbird tram", "Expert runs on Mineral Basin"],
  },
  {
    day: 5,
    date: "Fri, Jan 17",
    resort: "Alta",
    isSkiDay: true,
    breakfast: { name: "Alta Lodge Dining Room", type: "Classic Lodge Breakfast" },
    lunch: { name: "Alf's Restaurant (on-mountain)", type: "On-Mountain" },
    dinner: { name: "Red Rock Brewing", type: "Brewery" },
    activities: ["Ski Alta — legendary powder runs", "Explore Greeley Bowl and Supreme chair", "Sunset hot tub at Alta Lodge"],
  },
  {
    day: 6,
    date: "Sat, Jan 18",
    resort: null,
    isSkiDay: false,
    breakfast: { name: "Vessel Kitchen", type: "Café" },
    lunch: { name: "Riverhorse on Main", type: "Fine Dining Lunch" },
    dinner: { name: "Wasatch Brewery", type: "Brewery" },
    activities: ["Rest day / recovery", "Utah Olympic Park bobsled experience", "Sundance Film Festival screening (evening)"],
  },
  {
    day: 7,
    date: "Sun, Jan 19",
    resort: "Solitude",
    isSkiDay: true,
    breakfast: { name: "Sterling Lift Café", type: "On-Mountain" },
    lunch: { name: "Last Chance Mining Camp (on-mountain)", type: "On-Mountain" },
    dinner: { name: "Creekside at Solitude", type: "Village Dining" },
    activities: ["Ski Solitude — uncrowded glades", "Nordic ski trail (non-skiers)", "Farewell dinner at Solitude Village"],
  },
  {
    day: 8,
    date: "Mon, Jan 20",
    resort: null,
    isSkiDay: false,
    breakfast: { name: "Starbucks (quick departure)", type: "Quick" },
    lunch: { name: "SLC Airport", type: "Airport" },
    dinner: { name: "Home ❄️", type: "" },
    activities: ["Check out · head to SLC Airport", "Depart SLC"],
  },
];

const RESORT_COLORS: Record<string, string> = {
  "Park City Mountain": "#0057A8",
  "Deer Valley": "#1A5C3A",
  "Snowbird": "#C4262E",
  "Alta": "#6B2FA0",
  "Solitude": "#1B6BB0",
};

export default function ItineraryPage() {
  const router = useRouter();
  const [expandedDay, setExpandedDay] = useState<number | null>(2);

  return (
    <div className="min-h-screen bg-[#F4F6F8]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20 px-6 py-5">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-[#0D2240]">Your Utah Ski Itinerary</h1>
            <p className="text-[#8A9BB0] text-sm">Jan 13–20, 2026 · 5 ski days · Park City + Cottonwood Canyons</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/book")}
            className="bg-[#0D2240] text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-[#1B6BB0] shadow-lg transition-colors hidden sm:block"
          >
            Book This Trip →
          </motion.button>
        </div>
      </div>

      {/* Resort legend */}
      <div className="px-6 py-4 max-w-3xl mx-auto">
        <div className="flex flex-wrap gap-2">
          {Object.entries(RESORT_COLORS).map(([resort, color]) => (
            <span key={resort} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-xs font-semibold" style={{ backgroundColor: color }}>
              ⛷️ {resort}
            </span>
          ))}
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4F6F8] border border-gray-200 text-[#8A9BB0] text-xs font-semibold">
            🏙️ Rest Day
          </span>
        </div>
      </div>

      {/* Days */}
      <div className="px-6 pb-24 max-w-3xl mx-auto space-y-3">
        {DEMO_ITINERARY.map((day, i) => {
          const isExpanded = expandedDay === day.day;
          const resortColor = day.resort ? RESORT_COLORS[day.resort] : "#8A9BB0";

          return (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
            >
              {/* Day header */}
              <button
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50/50 transition-colors"
                onClick={() => setExpandedDay(isExpanded ? null : day.day)}
              >
                {/* Day number pill */}
                <div
                  className="w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0 text-white"
                  style={{ backgroundColor: resortColor }}
                >
                  <span className="text-[10px] font-semibold opacity-75">DAY</span>
                  <span className="text-lg font-black leading-none">{day.day}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-[#0D2240] text-sm">{day.date}</p>
                    {day.isSkiDay && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: resortColor }}>
                        SKI DAY
                      </span>
                    )}
                  </div>
                  <p className="text-[#8A9BB0] text-xs truncate">
                    {day.resort ?? "Travel / Rest Day"} · {day.breakfast.name} → {day.dinner.name}
                  </p>
                </div>

                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  className="text-[#8A9BB0] flex-shrink-0"
                >
                  ↓
                </motion.div>
              </button>

              {/* Expanded content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-4 border-t border-gray-50">
                      {/* Activities */}
                      {day.activities.length > 0 && (
                        <div className="pt-3">
                          <p className="text-[10px] font-bold text-[#8A9BB0] uppercase tracking-wider mb-2">Activities</p>
                          <ul className="space-y-1.5">
                            {day.activities.map((act, j) => (
                              <li key={j} className="flex items-start gap-2 text-sm text-[#3D5066]">
                                <span className="mt-0.5 text-[#1B6BB0]">→</span>
                                {act}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Meals */}
                      <div>
                        <p className="text-[10px] font-bold text-[#8A9BB0] uppercase tracking-wider mb-2">Meals</p>
                        <div className="space-y-2">
                          {[
                            { label: "☀️ Breakfast", meal: day.breakfast },
                            { label: "🥗 Lunch", meal: day.lunch },
                            { label: "🍷 Dinner", meal: day.dinner },
                          ].map(({ label, meal }) => (
                            <div key={label} className="flex items-center justify-between bg-[#F4F6F8] rounded-xl px-3 py-2.5">
                              <span className="text-xs font-semibold text-[#8A9BB0]">{label}</span>
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

      {/* Mobile book CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 sm:hidden">
        <button
          onClick={() => router.push("/book")}
          className="w-full bg-[#0D2240] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#1B6BB0] transition-colors"
        >
          Book This Trip →
        </button>
      </div>

      {/* Floating concierge */}
      <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50">
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8, type: "spring" }}
          className="flex items-center gap-2 bg-[#0D2240] text-white px-4 py-3 rounded-full shadow-xl font-semibold text-sm hover:bg-[#1B6BB0] transition-colors"
          onClick={() => window.location.href = "/concierge"}
        >
          <span className="text-lg">💬</span>
          Ask Concierge
        </motion.button>
      </div>
    </div>
  );
}

// Need AnimatePresence imported
import { AnimatePresence } from "framer-motion";
