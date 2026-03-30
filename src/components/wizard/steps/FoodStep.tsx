"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Wine, Utensils, Flame, GlassWater, Coffee, Zap, Mountain,
  Leaf, Waves, Globe, Sun, UtensilsCrossed, Star, ChevronLeft,
  type LucideIcon,
} from "lucide-react";
import { useTripContext, DiningStyle, CuisinePreference } from "@/context/TripContext";
import { cn } from "@/lib/utils";

const DINING_STYLES: { value: DiningStyle; label: string; Icon: LucideIcon; desc: string }[] = [
  { value: "fine-dining",       label: "Fine Dining",      Icon: Wine,         desc: "White tablecloth après-ski" },
  { value: "casual",            label: "Casual",           Icon: Utensils,     desc: "Good food, no fuss" },
  { value: "apres-ski",         label: "Après-Ski Bars",   Icon: Flame,        desc: "Cold beer, warm fire" },
  { value: "brewery",           label: "Local Breweries",  Icon: GlassWater,   desc: "Utah craft beer scene" },
  { value: "breakfast-focused", label: "Breakfast Person", Icon: Coffee,       desc: "Fuel up before first chair" },
  { value: "quick-eats",        label: "On-Mountain Eats", Icon: Zap,          desc: "Quick fuel between runs" },
];

const CUISINES: { value: CuisinePreference; label: string; Icon: LucideIcon }[] = [
  { value: "american",   label: "American",   Icon: UtensilsCrossed },
  { value: "italian",    label: "Italian",    Icon: Wine             },
  { value: "mexican",    label: "Mexican",    Icon: Sun              },
  { value: "asian",      label: "Asian",      Icon: Globe            },
  { value: "seafood",    label: "Seafood",    Icon: Waves            },
  { value: "vegetarian", label: "Vegetarian", Icon: Leaf             },
  { value: "anything",   label: "Anything!",  Icon: Star             },
];

export default function FoodStep() {
  const { tripData, updateTrip, goBack } = useTripContext();
  const router = useRouter();

  const toggleDining = (v: DiningStyle) => {
    const curr = tripData.diningStyles;
    updateTrip({
      diningStyles: curr.includes(v) ? curr.filter((x) => x !== v) : [...curr, v],
    });
  };

  const toggleCuisine = (v: CuisinePreference) => {
    if (v === "anything") {
      updateTrip({ cuisinePreferences: ["anything"] });
      return;
    }
    const curr = tripData.cuisinePreferences.filter((x) => x !== "anything");
    updateTrip({
      cuisinePreferences: curr.includes(v) ? curr.filter((x) => x !== v) : [...curr, v],
    });
  };

  const canContinue =
    tripData.diningStyles.length > 0 || tripData.cuisinePreferences.length > 0;

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
          <p className="text-[#1B6BB0] font-semibold text-sm tracking-widest uppercase mb-3">Step 5 of 5</p>
          <h1 className="text-4xl font-black text-[#0D2240] leading-tight mb-2">
            How does your<br />group like to eat?
          </h1>
          <p className="text-[#3D5066] text-base mb-8">
            We&apos;ll match your itinerary with restaurants your whole crew will love.
          </p>
        </motion.div>

        {/* Dining style */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <p className="text-sm font-bold text-[#3D5066] uppercase tracking-wider mb-3">Dining Vibe</p>
          <div className="grid grid-cols-2 gap-2.5 mb-7">
            {DINING_STYLES.map((ds, i) => {
              const isSelected = tripData.diningStyles.includes(ds.value);
              return (
                <motion.button
                  key={ds.value}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                  onClick={() => toggleDining(ds.value)}
                  className={cn(
                    "flex items-center gap-3 p-3.5 rounded-2xl border-2 text-left transition-all",
                    isSelected
                      ? "border-[#1B6BB0] bg-[#1B6BB0]/5"
                      : "border-gray-100 bg-[#F4F6F8] hover:border-gray-200"
                  )}
                >
                  <ds.Icon
                    size={20}
                    strokeWidth={1.75}
                    className={isSelected ? "text-[#1B6BB0]" : "text-[#3D5066]"}
                  />
                  <div>
                    <p className={cn("text-sm font-bold", isSelected ? "text-[#0D2240]" : "text-[#3D5066]")}>
                      {ds.label}
                    </p>
                    <p className="text-[10px] text-[#3D5066]">{ds.desc}</p>
                  </div>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto w-5 h-5 rounded-full bg-[#1B6BB0] flex items-center justify-center flex-shrink-0"
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Cuisine */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <p className="text-sm font-bold text-[#3D5066] uppercase tracking-wider mb-3">Cuisine Preferences</p>
          <div className="flex flex-wrap gap-2 mb-8">
            {CUISINES.map((c, i) => {
              const isSelected = tripData.cuisinePreferences.includes(c.value);
              return (
                <motion.button
                  key={c.value}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 + i * 0.04 }}
                  onClick={() => toggleCuisine(c.value)}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2.5 rounded-full border-2 font-semibold text-sm transition-all",
                    isSelected
                      ? "border-[#1B6BB0] bg-[#1B6BB0] text-white shadow-md"
                      : "border-gray-100 bg-[#F4F6F8] text-[#3D5066] hover:border-gray-200"
                  )}
                >
                  <c.Icon size={13} strokeWidth={2} />
                  {c.label}
                </motion.button>
              );
            })}
          </div>
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
          <motion.button
            onClick={() => router.push("/plan/building")}
            disabled={!canContinue}
            whileHover={canContinue ? { scale: 1.02 } : {}}
            whileTap={canContinue ? { scale: 0.98 } : {}}
            className={cn(
              "flex-1 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3",
              canContinue
                ? "bg-[#0D2240] text-white hover:bg-[#1B6BB0] shadow-xl shadow-navy/20"
                : "bg-gray-100 text-gray-300 cursor-not-allowed"
            )}
          >
            <Mountain size={18} strokeWidth={2} />
            Build My Packages
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
