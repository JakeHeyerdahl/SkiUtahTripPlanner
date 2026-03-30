"use client";

import { motion } from "framer-motion";
import { Calendar, DollarSign, Users, Ticket, Utensils } from "lucide-react";
import { useTripContext } from "@/context/TripContext";

const STEPS = [
  { label: "Dates",  Icon: Calendar    },
  { label: "Budget", Icon: DollarSign  },
  { label: "Group",  Icon: Users       },
  { label: "Pass",   Icon: Ticket      },
  { label: "Dining", Icon: Utensils    },
];

export default function WizardProgressBar() {
  const { currentStep, totalSteps } = useTripContext();

  const t = (currentStep - 1) / (totalSteps - 1);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-lg">
      <div className="max-w-2xl mx-auto px-6 pt-4 pb-4">

        {/* Track + icons + labels — all absolutely positioned together */}
        <div className="relative" style={{ height: 52 }}>
          {/* Background track — centered at y=14 (midpoint of 28px icon zone) */}
          <div
            className="absolute left-0 right-0 h-1.5 rounded-full bg-[#E8ECF0]"
            style={{ top: 13 }}
          />

          {/* Filled portion */}
          <motion.div
            className="absolute left-0 h-1.5 rounded-full bg-[#1B6BB0]"
            style={{ top: 13 }}
            animate={{ width: `${t * 100}%` }}
            transition={{ type: "spring", stiffness: 140, damping: 22 }}
          />

          {/* Step icons + labels stacked together */}
          {STEPS.map(({ Icon, label }, i) => {
            const pct     = (i / (totalSteps - 1)) * 100;
            const done    = i < currentStep - 1;
            const current = i === currentStep - 1;
            const active  = done || current;

            return (
              <div
                key={i}
                className="absolute flex flex-col items-center"
                style={{ left: `${pct}%`, top: 0, transform: "translateX(-50%)" }}
              >
                {/* Icon in a fixed 28×28 container so track center is always y=14 */}
                <div className="flex items-center justify-center bg-white" style={{ width: 28, height: 28 }}>
                  <motion.div
                    animate={{ scale: current ? 1.15 : 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  >
                    <Icon
                      size={current ? 20 : 16}
                      strokeWidth={current ? 2.5 : 2}
                      color={active ? "#1B6BB0" : "#CCCCCC"}
                    />
                  </motion.div>
                </div>

                {/* Label directly below, centered under the icon */}
                <span
                  className={`text-[10px] font-semibold leading-none mt-0.5 whitespace-nowrap transition-colors ${
                    current ? "text-[#0D2240]" : done ? "text-[#1B6BB0]" : "text-gray-300"
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
