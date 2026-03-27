"use client";

import { motion } from "framer-motion";
import { useTripContext } from "@/context/TripContext";

// Skier SVG positioned along a slope line
// Slope goes from top-left (x=2%, y=25%) to bottom-right (x=98%, y=75%)
const SLOPE_X1 = 2;
const SLOPE_Y1 = 22;
const SLOPE_X2 = 98;
const SLOPE_Y2 = 78;

function SkierIcon({ x, y, angle }: { x: number; y: number; angle: number }) {
  return (
    <g transform={`translate(${x}, ${y}) rotate(${angle})`}>
      {/* Head */}
      <circle cx="0" cy="-7" r="2.8" fill="#0D2240" />
      {/* Helmet */}
      <path d="M-2.8,-9 Q0,-12 2.8,-9" stroke="#1B6BB0" strokeWidth="1.5" fill="none" />
      {/* Body */}
      <line x1="0" y1="-4" x2="-1" y2="4" stroke="#0D2240" strokeWidth="2" strokeLinecap="round" />
      {/* Arms — angled forward */}
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
    </g>
  );
}

const STEP_LABELS = ["Dates", "Budget", "Group", "Pass", "Dining"];

export default function WizardProgressBar() {
  const { currentStep, totalSteps } = useTripContext();

  // Progress 0–1
  const t = (currentStep - 1) / (totalSteps - 1);

  // Skier position along slope
  const skierX = SLOPE_X1 + (SLOPE_X2 - SLOPE_X1) * t;
  const skierY = SLOPE_Y1 + (SLOPE_Y2 - SLOPE_Y1) * t;

  // Slope angle in degrees
  const slopeAngle = Math.atan2(SLOPE_Y2 - SLOPE_Y1, SLOPE_X2 - SLOPE_X1) * (180 / Math.PI);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-lg">
      <div className="max-w-2xl mx-auto px-6 pt-3 pb-5">
        {/* SVG slope + skier */}
        <svg viewBox="0 0 100 100" className="w-full h-16" preserveAspectRatio="none">
          {/* Step markers on slope */}
          {STEP_LABELS.map((_, i) => {
            const mt = i / (totalSteps - 1);
            const mx = SLOPE_X1 + (SLOPE_X2 - SLOPE_X1) * mt;
            const my = SLOPE_Y1 + (SLOPE_Y2 - SLOPE_Y1) * mt;
            const done = i < currentStep - 1;
            const current = i === currentStep - 1;
            return (
              <circle
                key={i}
                cx={mx}
                cy={my}
                r={current ? 2.2 : 1.4}
                fill={done ? "#1B6BB0" : current ? "#0D2240" : "#DDDDDD"}
              />
            );
          })}

          {/* Slope background track */}
          <line
            x1={SLOPE_X1} y1={SLOPE_Y1}
            x2={SLOPE_X2} y2={SLOPE_Y2}
            stroke="#E8ECF0" strokeWidth="1.5" strokeLinecap="round"
          />

          {/* Filled portion */}
          <line
            x1={SLOPE_X1} y1={SLOPE_Y1}
            x2={skierX} y2={skierY}
            stroke="#1B6BB0" strokeWidth="1.5" strokeLinecap="round"
          />

          {/* Skier */}
          <motion.g
            animate={{ cx: skierX, cy: skierY }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          >
            <SkierIcon x={skierX} y={skierY} angle={slopeAngle} />
          </motion.g>
        </svg>

        {/* Step labels below */}
        <div className="flex justify-between mt-1">
          {STEP_LABELS.map((label, i) => {
            const done = i < currentStep - 1;
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
