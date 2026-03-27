"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Snowflake, Check, ChevronLeft, ArrowRight, X, PlaneTakeoff } from "lucide-react";
import { useTripContext } from "@/context/TripContext";
import { cn } from "@/lib/utils";

const US_AIRPORTS = [
  { code: "ATL", city: "Atlanta, GA",          name: "Hartsfield-Jackson"              },
  { code: "AUS", city: "Austin, TX",            name: "Austin-Bergstrom Intl"           },
  { code: "BNA", city: "Nashville, TN",         name: "Nashville Intl"                  },
  { code: "BOS", city: "Boston, MA",            name: "Logan Intl"                      },
  { code: "BWI", city: "Baltimore, MD",         name: "BWI Marshall"                    },
  { code: "CLT", city: "Charlotte, NC",         name: "Douglas Intl"                    },
  { code: "CLE", city: "Cleveland, OH",         name: "Hopkins Intl"                    },
  { code: "DAL", city: "Dallas, TX",            name: "Love Field"                      },
  { code: "DEN", city: "Denver, CO",            name: "Denver Intl"                     },
  { code: "DFW", city: "Dallas/Fort Worth, TX", name: "Dallas/Fort Worth Intl"          },
  { code: "DTW", city: "Detroit, MI",           name: "Detroit Metropolitan"            },
  { code: "EWR", city: "Newark, NJ",            name: "Newark Liberty Intl"             },
  { code: "HOU", city: "Houston, TX",           name: "William P. Hobby"                },
  { code: "IAH", city: "Houston, TX",           name: "George Bush Intercontinental"    },
  { code: "IND", city: "Indianapolis, IN",      name: "Indianapolis Intl"               },
  { code: "JFK", city: "New York, NY",          name: "John F. Kennedy Intl"            },
  { code: "LAS", city: "Las Vegas, NV",         name: "Harry Reid Intl"                 },
  { code: "LAX", city: "Los Angeles, CA",       name: "Los Angeles Intl"                },
  { code: "LGA", city: "New York, NY",          name: "LaGuardia"                       },
  { code: "MCI", city: "Kansas City, MO",       name: "Kansas City Intl"                },
  { code: "MCO", city: "Orlando, FL",           name: "Orlando Intl"                    },
  { code: "MDW", city: "Chicago, IL",           name: "Chicago Midway"                  },
  { code: "MIA", city: "Miami, FL",             name: "Miami Intl"                      },
  { code: "MSP", city: "Minneapolis, MN",       name: "Minneapolis–Saint Paul Intl"     },
  { code: "MSY", city: "New Orleans, LA",       name: "Louis Armstrong Intl"            },
  { code: "OAK", city: "Oakland, CA",           name: "Oakland Intl"                    },
  { code: "ORD", city: "Chicago, IL",           name: "O'Hare Intl"                     },
  { code: "PDX", city: "Portland, OR",          name: "Portland Intl"                   },
  { code: "PHL", city: "Philadelphia, PA",      name: "Philadelphia Intl"               },
  { code: "PHX", city: "Phoenix, AZ",           name: "Phoenix Sky Harbor"              },
  { code: "PIT", city: "Pittsburgh, PA",        name: "Pittsburgh Intl"                 },
  { code: "RDU", city: "Raleigh, NC",           name: "Raleigh-Durham Intl"             },
  { code: "SAN", city: "San Diego, CA",         name: "San Diego Intl"                  },
  { code: "SAT", city: "San Antonio, TX",       name: "San Antonio Intl"                },
  { code: "SEA", city: "Seattle, WA",           name: "Seattle-Tacoma Intl"             },
  { code: "SFO", city: "San Francisco, CA",     name: "San Francisco Intl"              },
  { code: "SJC", city: "San Jose, CA",          name: "Mineta San Jose Intl"            },
  { code: "SLC", city: "Salt Lake City, UT",    name: "Salt Lake City Intl"             },
  { code: "SMF", city: "Sacramento, CA",        name: "Sacramento Intl"                 },
  { code: "STL", city: "St. Louis, MO",         name: "Lambert-St. Louis Intl"          },
];

const MONTHS = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];
const MONTH_FULL = ["November", "December", "January", "February", "March", "April"];
const MONTH_DATA = [
  { month: 11, year: 2025, days: 30 },
  { month: 12, year: 2025, days: 31 },
  { month: 1,  year: 2026, days: 31 },
  { month: 2,  year: 2026, days: 28 },
  { month: 3,  year: 2026, days: 31 },
  { month: 4,  year: 2026, days: 15 },
];

function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDateShort(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function expandBlocks(starts: Date[], days: number): Date[] {
  const all: Date[] = [];
  for (const s of starts) {
    for (let i = 0; i < days; i++) all.push(addDays(s, i));
  }
  return all.sort((a, b) => a.getTime() - b.getTime());
}

export default function DateStep() {
  const router = useRouter();
  const { tripData, updateTrip, goNext } = useTripContext();
  const [airportQuery, setAirportQuery] = useState(tripData.departureCity);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const airportRef = useRef<HTMLDivElement>(null);

  const airportSuggestions = airportQuery.length >= 1
    ? US_AIRPORTS.filter((a) => {
        const q = airportQuery.toLowerCase();
        return (
          a.code.toLowerCase().startsWith(q) ||
          a.city.toLowerCase().includes(q) ||
          a.name.toLowerCase().includes(q)
        );
      }).slice(0, 6)
    : [];

  const [activeMonthIdx, setActiveMonthIdx] = useState(1); // Dec default
  const [tripDays, setTripDays] = useState(tripData.tripDays || 0);
  // blockStarts stores the first day of each selected window
  const [blockStarts, setBlockStarts] = useState<Date[]>(() =>
    // Reconstruct from stored dates if returning to this step
    tripData.tripDays > 0 && tripData.dates.length > 0
      ? tripData.dates.filter((_, i) => i % tripData.tripDays === 0)
      : []
  );

  const { month, year, days: daysInMonth } = MONTH_DATA[activeMonthIdx];
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
  const numWeekRows = Math.ceil((firstDayOfWeek + daysInMonth) / 7);

  function findBlockContaining(date: Date): Date | null {
    for (const start of blockStarts) {
      const end = addDays(start, tripDays - 1);
      if (date >= start && date <= end) return start;
    }
    return null;
  }

  function handleDayClick(day: number) {
    if (tripDays === 0) return;
    const clicked = new Date(year, month - 1, day);
    const containing = findBlockContaining(clicked);

    if (containing) {
      const newStarts = blockStarts.filter((s) => !isSameDay(s, containing));
      setBlockStarts(newStarts);
      updateTrip({ dates: expandBlocks(newStarts, tripDays), tripDays });
    } else {
      const newStarts = [...blockStarts, clicked];
      setBlockStarts(newStarts);
      updateTrip({ dates: expandBlocks(newStarts, tripDays), tripDays, isAnytime: false });
    }
  }

  function removeBlock(start: Date) {
    const newStarts = blockStarts.filter((s) => !isSameDay(s, start));
    setBlockStarts(newStarts);
    updateTrip({ dates: expandBlocks(newStarts, tripDays), tripDays });
  }

  function handleTripDaysChange(n: number) {
    const clamped = Math.max(1, Math.min(14, n));
    setTripDays(clamped);
    // Clear blocks since the window size changed
    setBlockStarts([]);
    updateTrip({ tripDays: clamped, dates: [] });
  }

  // Determine role of a day in the current month view
  type DayRole = "start" | "end" | "middle" | "none";
  function getDayRole(day: number): DayRole {
    const d = new Date(year, month - 1, day);
    for (const start of blockStarts) {
      const end = addDays(start, tripDays - 1);
      if (d >= start && d <= end) {
        if (isSameDay(d, start)) return "start";
        if (isSameDay(d, end)) return "end";
        return "middle";
      }
    }
    return "none";
  }

  const calendarActive = tripDays > 0 && !tripData.isAnytime;
  const canContinue = tripData.isAnytime || blockStarts.length > 0;

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] px-6 py-12"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-full max-w-xl">
        {/* Heading */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <p className="text-[#1B6BB0] font-semibold text-sm tracking-widest uppercase mb-3">Step 1 of 5</p>
          <h1 className="text-4xl font-black text-[#0D2240] leading-tight mb-2">
            When are you<br />hitting the slopes?
          </h1>
          <p className="text-[#8A9BB0] text-base mb-8">
            Pick a trip length, then tap any date to add that window. Add as many options as you want.
          </p>
        </motion.div>

        {/* Flying from — airport autocomplete */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-6 relative" ref={airportRef}>
          <label className="block text-sm font-semibold text-[#3D5066] mb-2">Flying from</label>
          <div className="relative">
            <PlaneTakeoff size={16} strokeWidth={2} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9BB0] pointer-events-none" />
            <input
              type="text"
              placeholder="City or airport code (e.g. LAX, Chicago...)"
              value={airportQuery}
              onChange={(e) => {
                setAirportQuery(e.target.value);
                updateTrip({ departureCity: e.target.value });
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-100 bg-[#F4F6F8] text-[#0D2240] font-medium placeholder-[#8A9BB0] focus:outline-none focus:border-[#1B6BB0] transition-colors text-base"
            />
          </div>
          <AnimatePresence>
            {showSuggestions && airportSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-[#E8ECF0] shadow-xl z-50 overflow-hidden"
              >
                {airportSuggestions.map((airport) => (
                  <button
                    key={airport.code}
                    onMouseDown={() => {
                      const val = `${airport.code} — ${airport.city}`;
                      setAirportQuery(val);
                      updateTrip({ departureCity: val });
                      setShowSuggestions(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F4F6F8] transition-colors text-left border-b border-[#F0F2F5] last:border-0"
                  >
                    <span className="text-sm font-black text-[#0D2240] w-10 flex-shrink-0">{airport.code}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#0D2240] truncate">{airport.city}</p>
                      <p className="text-xs text-[#8A9BB0] truncate">{airport.name}</p>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Anytime toggle */}
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          onClick={() => {
            updateTrip({ isAnytime: !tripData.isAnytime, dates: [], tripDays: 0 });
            setBlockStarts([]);
            setTripDays(0);
          }}
          className={cn(
            "w-full mb-6 py-3.5 px-5 rounded-xl border-2 font-semibold text-base transition-all flex items-center gap-3",
            tripData.isAnytime
              ? "border-[#1B6BB0] bg-[#1B6BB0]/5 text-[#0D2240]"
              : "border-gray-100 bg-[#F4F6F8] text-[#8A9BB0] hover:border-gray-200"
          )}
        >
          <Snowflake size={18} strokeWidth={2} className={tripData.isAnytime ? "text-[#1B6BB0]" : "text-[#8A9BB0]"} />
          <span>I&apos;m flexible — anytime this ski season</span>
          {tripData.isAnytime && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto">
              <Check size={16} strokeWidth={2.5} className="text-[#1B6BB0]" />
            </motion.div>
          )}
        </motion.button>

        {/* Trip length picker */}
        {!tripData.isAnytime && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-5"
          >
            <label className="block text-sm font-semibold text-[#3D5066] mb-3">
              How many days is your trip?
            </label>
            <div className="flex items-center gap-4 bg-[#F4F6F8] rounded-2xl p-4">
              <button
                onClick={() => handleTripDaysChange(tripDays - 1)}
                disabled={tripDays <= 1}
                className="w-10 h-10 rounded-full bg-white shadow-sm text-[#0D2240] font-bold text-xl flex items-center justify-center hover:shadow-md transition-shadow disabled:opacity-30 disabled:cursor-not-allowed"
              >
                −
              </button>
              <div className="flex-1 text-center">
                {tripDays === 0 ? (
                  <span className="text-[#8A9BB0] text-lg font-semibold">Choose days</span>
                ) : (
                  <span className="text-3xl font-black text-[#0D2240]">
                    {tripDays}
                    <span className="text-base font-semibold text-[#8A9BB0] ml-1">
                      day{tripDays !== 1 ? "s" : ""} / {tripDays - 1} night{tripDays - 1 !== 1 ? "s" : ""}
                    </span>
                  </span>
                )}
              </div>
              <button
                onClick={() => handleTripDaysChange(tripDays === 0 ? 1 : tripDays + 1)}
                disabled={tripDays >= 14}
                className="w-10 h-10 rounded-full bg-[#0D2240] text-white font-bold text-xl flex items-center justify-center hover:bg-[#1B6BB0] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>
          </motion.div>
        )}

        {/* Calendar */}
        {!tripData.isAnytime && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className={cn("rounded-2xl p-5 transition-opacity", calendarActive ? "bg-[#F4F6F8]" : "bg-[#F4F6F8] opacity-40 pointer-events-none")}
          >
            {!calendarActive && (
              <p className="text-center text-sm text-[#8A9BB0] font-medium mb-3">
                Select trip length above to unlock calendar
              </p>
            )}

            {/* Month tabs */}
            <div className="flex gap-1 mb-5 bg-white rounded-xl p-1">
              {MONTHS.map((m, i) => (
                <button
                  key={m}
                  onClick={() => setActiveMonthIdx(i)}
                  className={cn(
                    "flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all",
                    activeMonthIdx === i
                      ? "bg-[#0D2240] text-white shadow-sm"
                      : "text-[#8A9BB0] hover:text-[#3D5066]"
                  )}
                >
                  {m}
                </button>
              ))}
            </div>

            <p className="text-center text-sm font-bold text-[#0D2240] mb-3">
              {MONTH_FULL[activeMonthIdx]} {year}
            </p>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-1">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <div key={i} className="text-center text-[10px] font-semibold text-[#8A9BB0] py-1">{d}</div>
              ))}
            </div>

            {/* Day grid — rendered row by row for range styling */}
            {Array.from({ length: numWeekRows }).map((_, weekIdx) => (
              <div key={weekIdx} className="grid grid-cols-7">
                {Array.from({ length: 7 }).map((_, col) => {
                  const dayNum = weekIdx * 7 - firstDayOfWeek + col + 1;
                  if (dayNum < 1 || dayNum > daysInMonth) return <div key={col} />;

                  const role = getDayRole(dayNum);
                  const isNone = role === "none";
                  const isStart = role === "start";
                  const isEnd = role === "end";
                  const isMiddle = role === "middle";

                  return (
                    <button
                      key={col}
                      onClick={() => handleDayClick(dayNum)}
                      className={cn(
                        "relative h-9 text-xs font-medium transition-all",
                        // Range background strip (middle + end get left-flush bg)
                        (isMiddle || isEnd) && "bg-[#1B6BB0]/15",
                        // Rounded pill ends
                        (isStart || isNone) && "rounded-lg",
                        isStart && "rounded-r-none",
                        isEnd && "rounded-l-none rounded-r-lg",
                        // Colors
                        isStart && "bg-[#0D2240] text-white font-bold",
                        isEnd && "bg-[#1B6BB0] text-white font-bold",
                        isMiddle && "text-[#0D2240]",
                        isNone && "text-[#3D5066] hover:bg-white hover:rounded-lg hover:shadow-sm"
                      )}
                    >
                      {dayNum}
                    </button>
                  );
                })}
              </div>
            ))}

            {tripDays > 0 && blockStarts.length > 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 text-center text-xs text-[#1B6BB0] font-semibold"
              >
                {blockStarts.length} window{blockStarts.length !== 1 ? "s" : ""} selected · tap a highlighted block to remove it
              </motion.p>
            )}

            {tripDays > 0 && blockStarts.length === 0 && (
              <p className="mt-3 text-center text-xs text-[#8A9BB0]">
                Tap any date to add a {tripDays}-day window
              </p>
            )}
          </motion.div>
        )}

        {/* Selected blocks chips */}
        <AnimatePresence>
          {blockStarts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 flex flex-wrap gap-2"
            >
              {blockStarts
                .sort((a, b) => a.getTime() - b.getTime())
                .map((start) => {
                  const end = addDays(start, tripDays - 1);
                  return (
                    <motion.div
                      key={start.toISOString()}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0D2240]/8 border border-[#0D2240]/15 text-[#0D2240] text-xs font-semibold"
                    >
                      <span>{formatDateShort(start)} – {formatDateShort(end)}</span>
                      <button
                        onClick={() => removeBlock(start)}
                        className="text-[#8A9BB0] hover:text-[#0D2240] transition-colors"
                      >
                        <X size={12} strokeWidth={2.5} />
                      </button>
                    </motion.div>
                  );
                })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nav */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="flex gap-3 mt-6"
        >
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 px-6 py-4 rounded-2xl font-semibold text-[#3D5066] bg-[#F4F6F8] hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft size={16} strokeWidth={2.5} />
            Back
          </button>
          <button
            onClick={goNext}
            disabled={!canContinue}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-lg transition-all",
              canContinue
                ? "bg-[#0D2240] text-white hover:bg-[#1B6BB0] shadow-lg active:scale-[0.98]"
                : "bg-gray-100 text-gray-300 cursor-not-allowed"
            )}
          >
            Set my budget
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
