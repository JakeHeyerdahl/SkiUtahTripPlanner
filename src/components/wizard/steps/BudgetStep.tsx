"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Wallet, Mountain, Star, ChevronLeft, ArrowRight } from "lucide-react";
import { useTripContext } from "@/context/TripContext";
import { formatCurrency } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const MIN = 1000;
const MAX = 25000;
const STEP = 500;

const BUDGET_TIERS: { label: string; range: [number, number]; desc: string; Icon: LucideIcon }[] = [
  { label: "Budget",   range: [1000, 4000],   desc: "Great slopes, smart choices",       Icon: Wallet   },
  { label: "Moderate", range: [4000, 10000],  desc: "Comfort + the full experience",      Icon: Mountain },
  { label: "Luxury",   range: [10000, 25000], desc: "Ski-in/ski-out, world-class dining", Icon: Star     },
];

function pct(val: number) {
  return ((val - MIN) / (MAX - MIN)) * 100;
}

export default function BudgetStep() {
  const { tripData, updateTrip, goNext, goBack } = useTripContext();
  const [isDragging, setIsDragging] = useState<"min" | "max" | null>(null);

  const budgetMin = tripData.budgetMin;
  const budgetMax = tripData.budgetMax;

  const setMin = useCallback(
    (v: number) => { updateTrip({ budgetMin: Math.min(v, budgetMax - STEP) }); },
    [budgetMax, updateTrip]
  );
  const setMax = useCallback(
    (v: number) => { updateTrip({ budgetMax: Math.max(v, budgetMin + STEP) }); },
    [budgetMin, updateTrip]
  );

  const activeTier = BUDGET_TIERS.find(
    (t) => budgetMin >= t.range[0] && budgetMax <= t.range[1]
  ) ?? null;

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] px-6 py-12"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-full max-w-xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <p className="text-[#1B6BB0] font-semibold text-sm tracking-widest uppercase mb-3">Step 2 of 5</p>
          <h1 className="text-4xl font-black text-[#0D2240] leading-tight mb-2">
            What&apos;s your<br />total trip budget?
          </h1>
          <p className="text-[#3D5066] text-base mb-10">
            Set a range for your whole group — flights, hotel, lift tickets, and activities.
          </p>
        </motion.div>

        {/* Budget display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-4 mb-10"
        >
          <div className="text-center">
            <p className="text-xs font-semibold text-[#3D5066] uppercase tracking-wider mb-1">Min</p>
            <p className="text-3xl font-black text-[#0D2240]">{formatCurrency(budgetMin)}</p>
          </div>
          <div className="text-[#3D5066] text-2xl font-light">—</div>
          <div className="text-center">
            <p className="text-xs font-semibold text-[#3D5066] uppercase tracking-wider mb-1">Max</p>
            <p className="text-3xl font-black text-[#1B6BB0]">{formatCurrency(budgetMax)}</p>
          </div>
        </motion.div>

        {/* Slider */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="relative mb-8 px-2"
        >
          <div className="relative h-2 bg-gray-100 rounded-full">
            <div
              className="absolute h-full rounded-full"
              style={{
                left: `${pct(budgetMin)}%`,
                right: `${100 - pct(budgetMax)}%`,
                background: "linear-gradient(90deg, #1B6BB0, #5BB8F5)",
              }}
            />
          </div>
          <input
            type="range" min={MIN} max={MAX} step={STEP} value={budgetMin}
            onChange={(e) => setMin(Number(e.target.value))}
            onMouseDown={() => setIsDragging("min")}
            onMouseUp={() => setIsDragging(null)}
            className="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer"
            style={{ zIndex: isDragging === "min" ? 5 : 3 }}
          />
          <input
            type="range" min={MIN} max={MAX} step={STEP} value={budgetMax}
            onChange={(e) => setMax(Number(e.target.value))}
            onMouseDown={() => setIsDragging("max")}
            onMouseUp={() => setIsDragging(null)}
            className="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer"
            style={{ zIndex: isDragging === "max" ? 5 : 3 }}
          />
          {[budgetMin, budgetMax].map((val, i) => (
            <div
              key={i}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none"
              style={{ left: `${pct(val)}%` }}
            >
              <div className="w-5 h-5 rounded-full bg-white border-2 border-[#1B6BB0] shadow-md shadow-blue-200" />
            </div>
          ))}
        </motion.div>

        {/* Tier quick-select */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          {BUDGET_TIERS.map((tier) => {
            const isActive = activeTier?.label === tier.label;
            return (
              <button
                key={tier.label}
                onClick={() => updateTrip({ budgetMin: tier.range[0], budgetMax: tier.range[1] })}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  isActive
                    ? "border-[#1B6BB0] bg-[#1B6BB0]/5"
                    : "border-gray-100 bg-[#F4F6F8] hover:border-gray-200"
                }`}
              >
                <tier.Icon
                  size={18}
                  strokeWidth={1.75}
                  className={`mb-2 ${isActive ? "text-[#1B6BB0]" : "text-[#3D5066]"}`}
                />
                <div className={`text-sm font-bold ${isActive ? "text-[#0D2240]" : "text-[#3D5066]"}`}>
                  {tier.label}
                </div>
                <div className="text-[10px] text-[#3D5066] mt-0.5">{tier.desc}</div>
              </button>
            );
          })}
        </motion.div>

        {/* Nav */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-3"
        >
          <button
            onClick={goBack}
            className="flex items-center gap-1.5 px-6 py-4 rounded-2xl font-semibold text-[#3D5066] bg-[#F4F6F8] hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft size={16} strokeWidth={2.5} />
            Back
          </button>
          <button
            onClick={goNext}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-lg bg-[#0D2240] text-white hover:bg-[#1B6BB0] shadow-lg active:scale-[0.98] transition-all"
          >
            Tell us about your group
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
