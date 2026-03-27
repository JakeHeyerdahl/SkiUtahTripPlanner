"use client";

import { motion } from "framer-motion";
import { useTripContext } from "@/context/TripContext";

// Skier rendered in its own natural coordinate space — never squished
function SkierSvg() {
  return (
    <svg
      width="24"
      height="30"
      viewBox="-8 -14 16 24"
      overflow="visible"
    >
      {/* Head */}
      <circle cx="0" cy="-7" r="2.8" fill="#0D2240" />
      {/* Helmet */}
      <path d="M-2.8,-9 Q0,-12 2.8,-9" stroke="#1B6BB0" strokeWidth="1.5" fill="none" />
      {/* Body */}
      <line x1="0" y1="-4" x2="-1" y2="4" stroke="#0D2240" strokeWidth="2" strokeLinecap="round" />
      {/* Arms */}
      <line x1="-1" y1="-1" x2="-5" y2="1" stroke="#0D2240" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="-1" y1="-1" x2="4" y2="-0.5" stroke="#0D2240" strokeWidth="1.5" strokeLinecap="round" />
      {/* Poles */}
      <line x1="-5" y1="1" x2="-7" y2="5" stroke="#0D2240" strokeWidth="1" strokeLinecap="round" />
      <line x1="4" y1="-0.5" x2="6" y2="4" stroke="#0D2240" strokeWidth="1" strokeLinecap="round" />
      {/* Legs */}
      <line x1="-1" y1="4" x2="-3" y2="9" stroke="#0D2240" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="-1" y1="4" x2="2" y2="9" stroke="#0D2240" strokeWidth="1.8" strokeLinecap="round" />
      {/* Skis */}
      <line x1="-6" y1="10" x2="0" y2="9.5" stroke="#1B6BB0" strokeWidth="2" strokeLinecap="round" />
      <line x1="-1" y1="10" x2="5.5" y2="9.5" stroke="#1B6BB0" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const STEP_LABELS = ["Dates", "Budget", "Group", "Pass", "Dining"];

export default function WizardProgressBar() {
  const { currentStep, totalSteps } = useTripContext();

  const t = (currentStep - 1) / (totalSteps - 1);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-lg">
      <div className="max-w-2xl mx-auto px-6 pt-4 pb-5">

        {/* Track + skier */}
        <div className="relative mb-3" style={{ height: 36 }}>
          {/* Background track */}
          <div className="absolute left-0 right-0 h-1.5 rounded-full bg-[#E8ECF0]" style={{ top: 28 }} />

          {/* Filled portion */}
          <motion.div
            className="absolute left-0 h-1.5 rounded-full bg-[#1B6BB0]"
            style={{ top: 28 }}
            animate={{ width: `${t * 100}%` }}
            transition={{ type: "spring", stiffness: 140, damping: 22 }}
          />

          {/* Step dots */}
          {STEP_LABELS.map((_, i) => {
            const pct = (i / (totalSteps - 1)) * 100;
            const done    = i < currentStep - 1;
            const current = i === currentStep - 1;
            return (
              <div
                key={i}
                className="absolute rounded-full -translate-x-1/2"
                style={{
                  left:   `${pct}%`,
                  top:    current ? 24 : 26,
                  width:  current ? 8 : 5,
                  height: current ? 8 : 5,
                  backgroundColor: done ? "#1B6BB0" : current ? "#0D2240" : "#DDDDDD",
                }}
              />
            );
          })}

          {/* Skier — slides along, skis sit on the track */}
          <motion.div
            className="absolute -translate-x-1/2"
            style={{ top: 0 }}
            animate={{ left: `${t * 100}%` }}
            initial={{ left: "0%" }}
            transition={{ type: "spring", stiffness: 140, damping: 22 }}
          >
            <SkierSvg />
          </motion.div>
        </div>

        {/* Step labels */}
        <div className="flex justify-between">
          {STEP_LABELS.map((label, i) => {
            const done    = i < currentStep - 1;
            const current = i === currentStep - 1;
            return (
              <span
                key={label}
                className={`text-[10px] font-semibold transition-colors ${
                  current ? "text-[#0D2240]" : done ? "text-[#1B6BB0]" : "text-gray-300"
                }`}
              >
                {label}
              </span>
            );
          })}
        </div>

      </div>
    </div>
  );
}
