"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTripContext } from "@/context/TripContext";
import { cn } from "@/lib/utils";

const MONTHS = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];
const MONTH_FULL = ["November", "December", "January", "February", "March", "April"];
// Days in each month (ski season 2025-26)
const MONTH_DATA = [
  { month: 11, year: 2025, days: 30 },
  { month: 12, year: 2025, days: 31 },
  { month: 1,  year: 2026, days: 31 },
  { month: 2,  year: 2026, days: 28 },
  { month: 3,  year: 2026, days: 31 },
  { month: 4,  year: 2026, days: 15 }, // season ends mid-April typically
];

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function isInRange(date: Date, start: Date, end: Date) {
  return date >= start && date <= end;
}

export default function DateStep() {
  const { tripData, updateTrip, goNext } = useTripContext();
  const [activeMonthIdx, setActiveMonthIdx] = useState(1); // Dec default
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const { month, year, days } = MONTH_DATA[activeMonthIdx];

  // First day of month (0=Sun)
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();

  function handleDayClick(day: number) {
    const clicked = new Date(year, month - 1, day);
    if (!rangeStart) {
      setRangeStart(clicked);
    } else {
      const start = clicked < rangeStart ? clicked : rangeStart;
      const end = clicked < rangeStart ? rangeStart : clicked;
      const selected: Date[] = [];
      const cur = new Date(start);
      while (cur <= end) {
        selected.push(new Date(cur));
        cur.setDate(cur.getDate() + 1);
      }
      updateTrip({ dates: selected, isAnytime: false });
      setRangeStart(null);
    }
  }

  function isSelected(day: number) {
    const d = new Date(year, month - 1, day);
    return tripData.dates.some((sd) => isSameDay(sd, d));
  }

  function isRangePreview(day: number) {
    if (!rangeStart || !hoverDate) return false;
    const d = new Date(year, month - 1, day);
    const start = hoverDate < rangeStart ? hoverDate : rangeStart;
    const end = hoverDate < rangeStart ? rangeStart : hoverDate;
    return isInRange(d, start, end);
  }

  const canContinue = tripData.dates.length > 0 || tripData.isAnytime;

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
            Select your trip dates or choose any time during ski season.
          </p>
        </motion.div>

        {/* Departure city */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-6">
          <label className="block text-sm font-semibold text-[#3D5066] mb-2">Flying from</label>
          <input
            type="text"
            placeholder="e.g. Los Angeles, New York, Chicago..."
            value={tripData.departureCity}
            onChange={(e) => updateTrip({ departureCity: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-[#F4F6F8] text-[#0D2240] font-medium placeholder-[#8A9BB0] focus:outline-none focus:border-[#1B6BB0] transition-colors text-base"
          />
        </motion.div>

        {/* Anytime toggle */}
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          onClick={() => updateTrip({ isAnytime: !tripData.isAnytime, dates: [] })}
          className={cn(
            "w-full mb-6 py-3.5 px-5 rounded-xl border-2 font-semibold text-base transition-all flex items-center gap-3",
            tripData.isAnytime
              ? "border-[#1B6BB0] bg-[#1B6BB0]/5 text-[#0D2240]"
              : "border-gray-100 bg-[#F4F6F8] text-[#8A9BB0] hover:border-gray-200"
          )}
        >
          <span className="text-xl">⛄</span>
          <span>I&apos;m flexible — anytime this ski season</span>
          {tripData.isAnytime && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto text-[#1B6BB0]">✓</motion.span>
          )}
        </motion.button>

        {/* Calendar */}
        {!tripData.isAnytime && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#F4F6F8] rounded-2xl p-5"
          >
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
            <div className="grid grid-cols-7 mb-2">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <div key={i} className="text-center text-[10px] font-semibold text-[#8A9BB0] py-1">{d}</div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-y-1">
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: days }).map((_, i) => {
                const day = i + 1;
                const selected = isSelected(day);
                const preview = isRangePreview(day);
                const isStart = rangeStart && isSameDay(new Date(year, month - 1, day), rangeStart);
                return (
                  <button
                    key={day}
                    onClick={() => handleDayClick(day)}
                    onMouseEnter={() => rangeStart && setHoverDate(new Date(year, month - 1, day))}
                    onMouseLeave={() => setHoverDate(null)}
                    className={cn(
                      "aspect-square rounded-lg text-xs font-medium transition-all mx-0.5",
                      selected
                        ? "bg-[#1B6BB0] text-white font-bold"
                        : isStart
                        ? "bg-[#0D2240] text-white"
                        : preview
                        ? "bg-[#1B6BB0]/20 text-[#0D2240]"
                        : "text-[#3D5066] hover:bg-white hover:shadow-sm"
                    )}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {tripData.dates.length > 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 text-center text-xs text-[#1B6BB0] font-semibold"
              >
                {tripData.dates.length} day{tripData.dates.length !== 1 ? "s" : ""} selected
              </motion.p>
            )}
          </motion.div>
        )}

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={goNext}
          disabled={!canContinue}
          className={cn(
            "w-full mt-6 py-4 rounded-2xl font-bold text-lg transition-all",
            canContinue
              ? "bg-[#0D2240] text-white hover:bg-[#1B6BB0] shadow-lg shadow-navy/20 active:scale-[0.98]"
              : "bg-gray-100 text-gray-300 cursor-not-allowed"
          )}
        >
          Set my budget →
        </motion.button>
      </div>
    </motion.div>
  );
}
