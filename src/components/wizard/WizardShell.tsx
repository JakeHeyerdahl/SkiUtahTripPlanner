"use client";

import { AnimatePresence } from "framer-motion";
import { useTripContext } from "@/context/TripContext";
import WizardProgressBar from "./WizardProgressBar";
import DateStep from "./steps/DateStep";
import BudgetStep from "./steps/BudgetStep";
import GroupStep from "./steps/GroupStep";
import PassStep from "./steps/PassStep";
import FoodStep from "./steps/FoodStep";

const STEPS = [DateStep, BudgetStep, GroupStep, PassStep, FoodStep];

export default function WizardShell() {
  const { currentStep } = useTripContext();
  const StepComponent = STEPS[currentStep - 1];

  return (
    <div className="relative min-h-screen bg-white">
      {/* Subtle mountain bg */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <svg
          viewBox="0 0 1440 900"
          className="absolute bottom-0 w-full opacity-[0.025]"
          preserveAspectRatio="xMidYMax slice"
        >
          <path
            d="M0,900 L0,400 L180,200 L360,350 L540,120 L720,300 L900,80 L1080,280 L1260,160 L1440,320 L1440,900 Z"
            fill="#0D2240"
          />
        </svg>
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <StepComponent key={currentStep} />
      </AnimatePresence>

      {/* Progress bar */}
      <WizardProgressBar />
    </div>
  );
}
