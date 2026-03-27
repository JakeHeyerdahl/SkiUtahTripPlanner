"use client";

import { motion } from "framer-motion";
import { useTripContext } from "@/context/TripContext";
import PlaneAnimation from "./animations/PlaneAnimation";
import SkierAnimation from "./animations/SkierAnimation";
import BusAnimation from "./animations/BusAnimation";
import PassRevealAnimation from "./animations/PassRevealAnimation";
import PizzaAnimation from "./animations/PizzaAnimation";

const STEPS = [
  { label: "Dates", icon: "✈️" },
  { label: "Budget", icon: "⛷️" },
  { label: "Group", icon: "🚌" },
  { label: "Pass", icon: "🎿" },
  { label: "Dining", icon: "🍕" },
];

export default function WizardProgressBar() {
  const { currentStep, totalSteps, tripData } = useTripContext();
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-lg">
      {/* Animation stage */}
      <div className="px-6 pt-3 pb-1 max-w-2xl mx-auto">
        {currentStep === 1 && <PlaneAnimation active={tripData.dates.length > 0 || tripData.isAnytime} />}
        {currentStep === 2 && <SkierAnimation active={tripData.budgetMax > 0} />}
        {currentStep === 3 && (
          <BusAnimation active={tripData.groupMembers.length > 0} memberCount={tripData.groupMembers.length} />
        )}
        {currentStep === 4 && <PassRevealAnimation active={!!tripData.passType} passType={tripData.passType} />}
        {currentStep === 5 && <PizzaAnimation active={tripData.diningStyles.length > 0 || tripData.cuisinePreferences.length > 0} />}
      </div>

      {/* Progress track */}
      <div className="px-6 pb-4 max-w-2xl mx-auto">
        <div className="relative">
          {/* Background track */}
          <div className="h-1.5 bg-gray-100 rounded-full" />

          {/* Filled track */}
          <motion.div
            className="absolute top-0 left-0 h-1.5 rounded-full"
            style={{ background: "linear-gradient(90deg, #0D2240, #1B6BB0, #5BB8F5)" }}
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />

          {/* Step dots */}
          <div className="absolute top-0 left-0 right-0 flex justify-between" style={{ marginTop: "-5px" }}>
            {STEPS.map((step, i) => {
              const stepNum = i + 1;
              const isCompleted = stepNum < currentStep;
              const isCurrent = stepNum === currentStep;
              return (
                <motion.div
                  key={step.label}
                  className="flex flex-col items-center"
                  animate={isCurrent ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center text-[8px] transition-all duration-300 ${
                      isCompleted
                        ? "bg-[#1B6BB0] border-[#1B6BB0]"
                        : isCurrent
                        ? "bg-white border-[#1B6BB0] shadow-md shadow-blue-100"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    {isCompleted && (
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M1.5 4L3.5 6L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    )}
                    {isCurrent && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#1B6BB0]" />
                    )}
                  </div>
                  <span
                    className={`mt-1 text-[10px] font-medium transition-colors ${
                      isCurrent ? "text-[#1B6BB0]" : isCompleted ? "text-[#0D2240]" : "text-gray-300"
                    }`}
                  >
                    {step.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
        <div className="mt-5" /> {/* Space for labels */}
      </div>
    </div>
  );
}
