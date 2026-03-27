"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type PassType = "ikon" | "ikon-base" | "epic" | "epic-local" | "mountain-collective" | "indy";
export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";
export type DiningStyle = "fine-dining" | "casual" | "apres-ski" | "brewery" | "breakfast-focused" | "quick-eats";
export type CuisinePreference = "american" | "italian" | "mexican" | "asian" | "seafood" | "vegetarian" | "anything";

export interface GroupMember {
  id: string;
  skillLevel: SkillLevel;
  isSkiing: boolean;
  needsRental: boolean;
}

export interface SelectedPackage {
  packageId: string;
  hotelId: string;
  flightId: string;
}

export interface TripData {
  // Step 1
  dates: Date[];
  isAnytime: boolean;
  departureCity: string;
  // Step 2
  budgetMin: number;
  budgetMax: number;
  // Step 3
  groupMembers: GroupMember[];
  // Step 4
  passType: PassType | null;
  // Step 5
  diningStyles: DiningStyle[];
  cuisinePreferences: CuisinePreference[];
  // Selections
  selectedPackage: SelectedPackage | null;
}

interface TripContextValue {
  tripData: TripData;
  updateTrip: (updates: Partial<TripData>) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  totalSteps: number;
  goNext: () => void;
  goBack: () => void;
}

const defaultTripData: TripData = {
  dates: [],
  isAnytime: false,
  departureCity: "",
  budgetMin: 2000,
  budgetMax: 8000,
  groupMembers: [
    { id: "1", skillLevel: "intermediate", isSkiing: true, needsRental: false },
  ],
  passType: null,
  diningStyles: [],
  cuisinePreferences: [],
  selectedPackage: null,
};

const TripContext = createContext<TripContextValue | null>(null);

export function TripProvider({ children }: { children: ReactNode }) {
  const [tripData, setTripData] = useState<TripData>(defaultTripData);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  function updateTrip(updates: Partial<TripData>) {
    setTripData((prev) => ({ ...prev, ...updates }));
  }

  function goNext() {
    setCurrentStep((s) => Math.min(s + 1, totalSteps));
  }

  function goBack() {
    setCurrentStep((s) => Math.max(s - 1, 1));
  }

  return (
    <TripContext.Provider
      value={{ tripData, updateTrip, currentStep, setCurrentStep, totalSteps, goNext, goBack }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTripContext() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error("useTripContext must be used within TripProvider");
  return ctx;
}
