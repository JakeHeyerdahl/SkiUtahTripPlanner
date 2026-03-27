"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTripContext, PassType } from "@/context/TripContext";
import { cn } from "@/lib/utils";

interface PassOption {
  value: PassType;
  name: string;
  tagline: string;
  catchphrase: string;
  utahResorts: string[];
  color: string;
  bgColor: string;
  borderColor: string;
  blackoutNote: string;
  logo: string;
}

const PASSES: PassOption[] = [
  {
    value: "ikon",
    name: "Ikon Pass",
    tagline: "Unlimited access, no blackouts",
    catchphrase: "More Mountain. More Adventure.",
    utahResorts: ["Alta", "Brighton", "Snowbird", "Solitude", "Deer Valley (7 days)", "Snowbasin", "Powder Mountain"],
    color: "#C4262E",
    bgColor: "bg-red-50",
    borderColor: "border-red-400",
    blackoutNote: "No blackouts at most Utah resorts",
    logo: "IKON",
  },
  {
    value: "ikon-base",
    name: "Ikon Base Pass",
    tagline: "Big savings with some holiday restrictions",
    catchphrase: "Your Season. Your Mountain.",
    utahResorts: ["Alta", "Brighton", "Snowbird", "Solitude", "Snowbasin", "Powder Mountain"],
    color: "#C4262E",
    bgColor: "bg-red-50",
    borderColor: "border-red-300",
    blackoutNote: "Blackouts: Dec 26–Jan 3, MLK & Presidents' weekends",
    logo: "IKON BASE",
  },
  {
    value: "epic",
    name: "Epic Pass",
    tagline: "Unlimited at Park City Mountain",
    catchphrase: "Go Epic.",
    utahResorts: ["Park City Mountain", "Woodward Park City"],
    color: "#0057A8",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-400",
    blackoutNote: "No blackouts",
    logo: "EPIC",
  },
  {
    value: "epic-local",
    name: "Epic Local Pass",
    tagline: "Park City with some peak restrictions",
    catchphrase: "Go Local.",
    utahResorts: ["Park City Mountain", "Woodward Park City"],
    color: "#0057A8",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-300",
    blackoutNote: "Blackouts: Dec 25–Jan 1, MLK & Presidents' weekends",
    logo: "EPIC LOCAL",
  },
  {
    value: "mountain-collective",
    name: "Mountain Collective",
    tagline: "2 days each at the best independent mountains",
    catchphrase: "Independent by Nature.",
    utahResorts: ["Alta (2 days)", "Snowbird (2 days)", "Snowbasin (2 days)"],
    color: "#1A5C3A",
    bgColor: "bg-green-50",
    borderColor: "border-green-400",
    blackoutNote: "Blackouts: Dec 26–Jan 1",
    logo: "MTN COLLECTIVE",
  },
  {
    value: "indy",
    name: "Indy Pass",
    tagline: "Support independent resorts",
    catchphrase: "Ski Independent.",
    utahResorts: ["Brighton (2 days)", "Sundance (2 days)", "Nordic Valley (2 days)", "Cherry Peak (2 days)"],
    color: "#6B2FA0",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-400",
    blackoutNote: "Blackouts: Dec 26–Jan 2",
    logo: "INDY",
  },
];

export default function PassStep() {
  const { tripData, updateTrip, goNext, goBack } = useTripContext();
  const selected = tripData.passType;

  const selectedPass = PASSES.find((p) => p.value === selected);

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
          <p className="text-[#1B6BB0] font-semibold text-sm tracking-widest uppercase mb-3">Step 4 of 5</p>
          <h1 className="text-4xl font-black text-[#0D2240] leading-tight mb-2">
            What pass are<br />you riding with?
          </h1>
          <p className="text-[#8A9BB0] text-base mb-8">
            Your pass determines which Utah resorts are in play — and we&apos;ll flag blackout dates automatically.
          </p>
        </motion.div>

        {/* Pass grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          {PASSES.map((pass, i) => {
            const isSelected = selected === pass.value;
            return (
              <motion.button
                key={pass.value}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                onClick={() => updateTrip({ passType: pass.value })}
                className={cn(
                  "p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden",
                  isSelected
                    ? `${pass.bgColor} ${pass.borderColor} shadow-md`
                    : "bg-[#F4F6F8] border-transparent hover:border-gray-200"
                )}
              >
                {/* Pass logo badge */}
                <div
                  className="inline-block px-2 py-0.5 rounded-md text-[10px] font-black text-white mb-2"
                  style={{ backgroundColor: pass.color }}
                >
                  {pass.logo}
                </div>
                <p className={cn("font-bold text-sm mb-0.5", isSelected ? "text-[#0D2240]" : "text-[#3D5066]")}>
                  {pass.name}
                </p>
                <p className="text-[10px] text-[#8A9BB0] leading-tight">{pass.tagline}</p>

                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: pass.color }}
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Selected pass detail */}
        <AnimatePresence>
          {selectedPass && (
            <motion.div
              key={selectedPass.value}
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl p-4 mb-6 border"
              style={{ borderColor: selectedPass.color + "40", backgroundColor: selectedPass.color + "08" }}
            >
              {/* Catchphrase */}
              <p className="font-black text-base mb-3" style={{ color: selectedPass.color }}>
                &ldquo;{selectedPass.catchphrase}&rdquo;
              </p>
              {/* Utah resorts */}
              <p className="text-xs font-semibold text-[#3D5066] uppercase tracking-wider mb-2">
                Utah Resorts Included
              </p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {selectedPass.utahResorts.map((r) => (
                  <span
                    key={r}
                    className="px-2.5 py-1 rounded-full text-[11px] font-semibold text-white"
                    style={{ backgroundColor: selectedPass.color }}
                  >
                    {r}
                  </span>
                ))}
              </div>
              {/* Blackout note */}
              <div className="flex items-start gap-2 bg-white/60 rounded-xl p-2.5">
                <span className="text-sm">📅</span>
                <p className="text-[11px] text-[#3D5066]">
                  <strong>Blackout dates:</strong> {selectedPass.blackoutNote}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nav */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-3"
        >
          <button onClick={goBack} className="px-6 py-4 rounded-2xl font-semibold text-[#3D5066] bg-[#F4F6F8] hover:bg-gray-200 transition-colors">
            ← Back
          </button>
          <button
            onClick={goNext}
            disabled={!selected}
            className={cn(
              "flex-1 py-4 rounded-2xl font-bold text-lg transition-all",
              selected
                ? "bg-[#0D2240] text-white hover:bg-[#1B6BB0] shadow-lg active:scale-[0.98]"
                : "bg-gray-100 text-gray-300 cursor-not-allowed"
            )}
          >
            Almost there →
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
